/*
/project/x
*/
const express = require("express");
const router = express.Router();
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const {
  checkSigner,
  recaptchaCheck,
  checkProject,
  checkBadState,
} = require("./middlewares");
const { createDiscoursePost } = require("../utils/discourse/utils");
const {
  getProjectUsdLimit,
  createAirtableEntry,
  getFormerProposals,
  getCurrentRound,
} = require("../utils/airtable/utils");

router.post("/create", recaptchaCheck(0.5), checkSigner, async (req, res) => {
  // create a project
  let admin = res.locals.signer;
  let prj = JSON.parse(req.body.message);
  prj.events = [
    {
      eventType: "projectCreated",
      signer: admin,
      signedMessage: req.body.signedMessage,
      message: req.body.message,
    },
  ];
  prj.admin = admin;
  let project = new Project(prj);
  project.save((err, project) => {
    if (err) {
      console.log(err);
      res.status(400).send(err); // ? send validation error to client
    }
    res.send(project);
  });
});

router.post("/list", async (req, res) => {
  // returns all projects that the user is admin of
  const address = req.body.address;
  const projects = await Project.find({ admin: address });
  res.send(projects);
});

const processing = [];
router.post(
  "/createProposal",
  recaptchaCheck(0.5),
  checkSigner,
  checkProject,
  checkBadState,
  async function (req, res) {
    const proposal = JSON.parse(req.body.message);
    // create a new proposal
    const proposalFundingRequested = parseFloat(
      proposal.proposalFundingRequested
    );
    const project = res.locals.project;
    const projectName = project.projectName;

    proposal.signer = res.locals.signer; // signer
    proposal.projectId = project._id; // add projectId to proposal
    proposal.events = [
      {
        eventType: "proposalCreated",
        signer: req.body.signer,
        signedMessage: req.body.signedMessage,
        message: req.body.message,
      },
    ];

    // TODO - Please fix. New projects can apply for coretech.
    const formerProposals = await getFormerProposals(projectName);
    if (formerProposals.length == 0) {
      // ? triple === no?
      if (project.projectCategory === "outreach") {
        proposal.proposalEarmark = "newprojectoutreach";
      } else {
        proposal.proposalEarmark = "newproject";
      }
    } else if (proposal.proposalEarmark === "coretech") {
      proposal.proposalEarmarkRequest = "coretech";
      proposal.proposalEarmark = "general";
    }

    const newProposal = new Proposal(proposal); // ? maybe change this
    let error = newProposal.validateSync();
    if (error) {
      return res.status(400).json({ error: error.toString() });
    }

    const projectUsdLimit = await getProjectUsdLimit(projectName);
    if (proposalFundingRequested > projectUsdLimit) {
      return res.status(400).json({
        error: "Your funding request exceeds the project USD limit",
      });
    }

    const minUsdRequested = parseFloat(proposal.minUsdRequested);
    if (!minUsdRequested) {
      return res.status(400).json({
        error: "Please enter a minimum USD amount",
      });
    }
    if (minUsdRequested > proposalFundingRequested) {
      return res.status(400).json({
        error: "Your minimum funding request exceeds your funding request",
      });
    }

    const currentRound = await getCurrentRound();
    let currentRoundNumber = currentRound.fields["Round"];
    const currentRoundSubmissionDeadline =
      currentRound.fields["Proposals Due By"];

    // if submission deadline has passed, return error
    if (Date.now() > new Date(currentRoundSubmissionDeadline).getTime()) {
      currentRoundNumber += 1; // submit proposal for next round
    }

    Proposal.findOne(
      {
        projectId: project._id,
        round: currentRoundNumber,
      },
      async (err, exists) => {
        if (err) {
          return res.status(400).send(err);
        }
        if (exists) {
          return res.status(400).send("Proposal already exists for this round");
        }

        if (processing.includes(proposal.signer)) {
          res.status(400).send("Please try again later");
          return;
        }
        processing.push(proposal.signer);

        try {
          const categoryId =
            process.env.DEVELOPMENT_CATEGORY_ID ??
            currentRound.fields["Discourse Category"];
          if (categoryId == null || categoryId == undefined) {
            processing.splice(processing.indexOf(proposal.signer), 1);
            return res.status(400).send("No category id found");
          }

          const discoursePostLink = await createDiscoursePost(
            proposal,
            currentRoundNumber,
            project,
            categoryId
          ); // create a new post in the discourse forum
          const postId = discoursePostLink.id;
          if (postId === undefined) {
            console.error(discoursePostLink);
            if (
              discoursePostLink.errors &&
              discoursePostLink.errors.length > 0
            ) {
              throw new Error(discoursePostLink.errors[0]);
            }
            throw new Error(
              "Could not create a new post in the discourse forum"
            );
          }
          const slug = discoursePostLink.topic_slug;
          const URL = `${process.env.DISCOURSE_BASE_URI}/t/${slug}/${discoursePostLink.topic_id}`;

          proposal.discourseLink = URL;
          proposal.discourseId = postId;

          const airtableRecordId = await createAirtableEntry({
            projectName: projectName,
            projectCategory: project.projectCategory,
            proposalEarmark: proposal.proposalEarmark,
            grantDeliverables: proposal.grantDeliverables,
            proposalFundingRequested: proposalFundingRequested,
            proposalWalletAddress: proposal.proposalWalletAddress,
            projectLeadFullName: project.projectLeadFullName,
            projectLeadEmail: project.projectLeadEmail,
            countryOfResidence: project.countryOfResidence,
            proposalUrl: proposal.discourseLink,
            oneLiner: proposal.oneLiner,
            proposalTitle: proposal.proposalTitle,
            minUsdRequested: minUsdRequested,
          }); // create airtable entry

          proposal.airtableRecordId = airtableRecordId; // TODO MAKE SURE RECORD ID IS CORRECT
          proposal.message = req.body.message;
          proposal.signature = req.body.signedMessage;
          proposal.round = currentRoundNumber;

          // update saved proposal

          new Proposal(proposal).save((err, proposal) => {
            if (err) {
              console.error(err);
              processing.splice(processing.indexOf(res.locals.signer), 1);
              return res.status(400).send(err);
            }
            res.send({ success: true, proposal });
            processing.splice(processing.indexOf(res.locals.signer), 1);
          });
        } catch (err) {
          console.error(err);
          processing.splice(processing.indexOf(res.locals.signer), 1);
          return res.status(400).send(err.message);
        }
      }
    );
  }
);

router.post(
  "/update",
  recaptchaCheck(0.5),
  checkSigner,
  checkProject,
  function (req, res) {
    const data = JSON.parse(req.body.message);
    const project = res.locals.project;
    const updateObject = {};
    if (data.projectDescription)
      updateObject.projectDescription = data.projectDescription;
    if (data.projectCategory)
      updateObject.projectCategory = data.projectCategory;
    if (data.projectLeadFullName)
      updateObject.projectLeadFullName = data.projectLeadFullName;
    if (data.projectLeadEmail)
      updateObject.projectLeadEmail = data.projectLeadEmail;
    if (data.countryOfResidence)
      updateObject.countryOfResidence = data.countryOfResidence;
    if (data.finalProduct) updateObject.finalProduct = data.finalProduct;

    if (data.teamWebsite) updateObject.teamWebsite = data.teamWebsite;
    if (data.twitterLink) updateObject.twitterLink = data.twitterLink;
    if (data.discordLink) updateObject.discordLink = data.discordLink;

    if (data.coreTeam) updateObject.coreTeam = data.coreTeam;
    if (data.advisors) updateObject.advisors = data.advisors;

    updateObject.events = project.events;
    updateObject.events.push({
      eventType: "update",
      signer: res.locals.signer,
      signedMessage: req.body.signedMessage,
      message: req.body.message,
    });

    Project.findByIdAndUpdate(
      project._id,
      { $set: updateObject },
      { runValidators: true },
      (err, project) => {
        if (err) {
          console.log(err);
          return res.status(400).send(err);
        }
        res.send({ data: project, success: true });
      }
    );
  }
);

router.post("/proposal/list", function (req, res) {
  Proposal.find(
    { projectId: res.locals.project._id },
    "proposalFundingRequested proposalDescription title",
    (err, proposals) => {
      if (err) {
        res.status(400).send(err);
      }
      res.status(200).send(proposals);
    }
  );
});

router.get("/info/:projectId", async (req, res) => {
  const projectId = req.params.projectId;
  Proposal.find(
    { projectId: projectId },
    "proposalFundingRequested proposalTitle round proposalEarmark"
  )
    .sort({ round: -1 })
    .exec((err, proposals) => {
      Project.findById(projectId, (err, project) => {
        const lastProposal = proposals[proposals.length - 1];
        const canCreateProposals = lastProposal.delivered.status == 2;
        if (err) {
          res.status(400).send(err);
        }
        res.status(200).send({
          project,
          proposals,
          canCreateProposals,
        });
      });
    });
});

module.exports = router;
