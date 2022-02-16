var express = require("express");
var router = express.Router();
const { getSigner } = require("../utils/ethers/signature");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const {
  createDiscoursePost,
  updateDiscoursePost,
} = require("../utils/discourse/utils");
const {
  getProjectUsdLimit,
  createAirtableEntry,
  getCurrentRoundNumber,
  updateAirtableEntry,
} = require("../utils/airtable/utils");

router.post("/createProject", checkSigner, async (req, res) => {
  // create a project
  let admin = res.locals.signer;
  let prj = req.body;
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

router.post("/myProjects", checkSigner, async (req, res) => {
  // returns all projects that the user is admin of
  const signer = res.locals.signer;
  const projects = await Project.find({ admin: signer });
  res.send(projects);
});

router.post(
  "/createProposal",
  checkSigner,
  checkProject,
  async function (req, res) {
    // create a new proposal
    const proposalFundingRequested = parseFloat(
      req.body.proposal.proposalFundingRequested
    );
    const project = res.locals.project;
    const projectName = project.projectName;

    let proposal = req.body.proposal;
    proposal.signer = res.locals.signer; // signer
    proposal.projectId = project._id; // add projectId to proposal

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

    const currentRound = await getCurrentRoundNumber();

    Proposal.findOne(
      {
        projectId: project._id,
        round: currentRound,
      },
      async (err, exists) => {
        if (err) {
          return res.status(400).send(err);
        }
        if (exists) {
          return res.status(400).send("Proposal already exists for this round");
        }

        const discoursePostLink = await createDiscoursePost(
          proposal,
          currentRound,
          project,
          projectName
        ); // create a new post in the discourse forum
        const postId = discoursePostLink.id;
        if (postId === undefined) {
          return res.status(400).json({
            error: "Could not create a new post in the discourse forum",
          });
        }
        const slug = discoursePostLink.topic_slug;
        const URL = `${process.env.DISCOURSE_BASE_URI}/t/${slug}/${postId}`;

        proposal.discourseLink = URL;

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
        }); // create airtable entry

        proposal.airtableRecordId = airtableRecordId; // TODO MAKE SURE RECORD ID IS CORRECT
        proposal.message = req.body.message;
        proposal.signature = req.body.signedMessage;
        proposal.round = currentRound;

        const proposalObject = new Proposal(proposal); // ? maybe change this
        error = proposalObject.validateSync();
        if (error) {
          return res.status(400).json({ error: error.toString() });
        }

        proposalObject.save((err, proposal) => {
          console.log("proposal created");
          if (err) {
            console.log(err);
            return res.status(400).send(err); // ? send validation error to client
          } else return res.send({ success: true, proposal });
        }); // save the proposal to the database
      }
    );
  }
);

router.post("/updateProposal", checkSigner, checkProject, function (req, res) {
  // return if voting period started
  const proposalId = req.body.proposalId;

  Proposal.findById(proposalId, async (err, proposalData) => {
    const proposal = req.body;
    const project = res.locals.project;

    const update = {};

    if (proposal.proposalFundingRequested) {
      const projectUsdLimit = await getProjectUsdLimit(project.projectName);
      if (proposal.proposalFundingRequested > projectUsdLimit) {
        return res.status(400).json({
          error: "Your funding request exceeds the project USD limit",
        });
      }
      update.proposalFundingRequested = proposal.proposalFundingRequested;
    }

    if (proposal.proposalWalletAddress)
      update.proposalWalletAddress = proposal.proposalWalletAddress;

    if (proposal.proposalDescription)
      update.proposalDescription = proposal.proposalDescription;

    if (proposal.grantDeliverables)
      update.grantDeliverables = proposal.grantDeliverables;

    if (proposal.oneLiner) update.oneLiner = proposal.oneLiner;

    const proposalUrl = proposalData.proposalUrl;
    const proposalDiscourseId = proposalUrl.split("/")[5];
    const airtableId = proposalData.airtableRecordId;

    Proposal.findByIdAndUpdate(
      proposalId,
      { $set: update },
      { runValidators: true },
      (err, data) => {
        if (err) return res.status(400).send(err);
        await updateAirtableEntry(airtableId, update); // update airtable entry
        await updateDiscoursePost(proposalDiscourseId, data, project); // update the post in the discourse forum
        return res.send({ success: true });
      }
    );
  });
});

router.post("/getProposals", checkSigner, checkProject, function (req, res) {
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

router.get("/proposalInfo/:proposalId", async (req, res) => {
  const proposalId = req.params.proposalId;
  console.log(proposalId);
  Proposal.findById(proposalId, (err, proposal) => {
    if (err) {
      res.status(400).send(err);
    }
    res.status(200).send(proposal);
  });
});

router.get("/getProjectInfo/:projectId", async (req, res) => {
  const projectId = req.params.projectId;
  Proposal.find(
    { projectId: projectId },
    "proposalFundingRequested proposalDescription proposalTitle",
    (err, proposals) => {
      Project.findById(projectId, (err, project) => {
        if (err) {
          res.status(400).send(err);
        }
        res.status(200).send({
          project,
          proposals,
        });
      });
    }
  );
});

function checkSigner(req, res, next) {
  // middleware to check if the user is the signer
  const signer = req.body.signer;
  const message = req.body.message;
  const signedMessage = req.body.signedMessage;

  const realSigner = getSigner(signedMessage, message);

  if (realSigner != signer) {
    return res.status(401).send("Unauthorized Signer");
  }
  res.locals.signer = signer;
  next();
}

function checkProject(req, res, next) {
  // middleware to check if the user is the signer
  let s = {};
  const projectName = req.body.projectName;
  const projectId = req.body.projectId;
  if (projectName) s.projectName = projectName;
  else if (projectId) s.projectId = projectId;
  Project.findOne(s, (err, project) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!project) {
      return res.status(400).send("Project does not exist");
    }
    if (project.admin !== res.locals.signer) {
      console.error(
        "Unauthorized",
        project.admin,
        res.locals.signer,
        project,
        projectId,
        projectName
      );
      return res.status(401).send("Unauthorized Project");
    }
    res.locals.project = project;
    next();
  });
}

module.exports = router;
