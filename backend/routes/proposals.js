var express = require("express");
var router = express.Router();
const { getSigner } = require("../utils/ethers/signature");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const Signer = require("../models/Signer");
const {
  createDiscoursePost,
  updateDiscoursePost,
  replyToDiscoursePost,
} = require("../utils/discourse/utils");
const {
  getProjectUsdLimit,
  createAirtableEntry,
  getCurrentRoundNumber,
  updateAirtableEntry,
  getFormerProposals,
} = require("../utils/airtable/utils");

router.post("/createProject", checkSigner, async (req, res) => {
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

router.post("/myProjects", async (req, res) => {
  // returns all projects that the user is admin of
  const address = req.body.address;
  const projects = await Project.find({ admin: address });
  res.send(projects);
});

router.get("/nonce/:address", async (req, res) => {
  const address = req.params.address;
  Signer.findOne({ address }, (err, signer) => {
    if (err) return res.status(400).send(err);
    res.send({ nonce: signer ? signer.nonce : 0 });
  });
});

router.post(
  "/createProposal",
  checkSigner,
  checkProject,
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

    const formerProposals = await getFormerProposals(projectName);
    if (formerProposals.length == 0) {
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

router.post("/updateProject", checkSigner, checkProject, function (req, res) {
  const data = JSON.parse(req.body.message);
  const project = res.locals.project;
  const updateObject = {};
  if (data.valueAddCriteria)
    updateObject.valueAddCriteria = data.valueAddCriteria;
  if (data.projectDescription)
    updateObject.projectDescription = data.projectDescription;
  if (data.projectCategory) updateObject.projectCategory = data.projectCategory;
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
});

router.post("/proposal/withdraw", checkSigner, (req, res) => {
  const data = JSON.parse(req.body.message);
  const proposalId = data.proposalId;
  if (data.withdraw != true)
    return res.status(400).json({ error: "withdraw must be true" });
  Proposal.findById(proposalId)
    .populate("projectId")
    .exec(async (err, data) => {
      if (data.projectId.admin !== res.locals.signer) {
        return res
          .status(400)
          .json({ error: "You are not the admin of this project" });
      }
      const event = {
        eventType: "withdraw",
        signer: res.locals.signer,
        signedMessage: req.body.signedMessage,
        message: req.body.message,
      };

      Proposal.findByIdAndUpdate(
        proposalId,
        { $push: { events: event }, $set: { withdrawn: true } },
        { runValidators: true },
        async (err, proposal) => {
          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }
          await updateAirtableEntry(data.airtableRecordId, { withdrawn: true });
          await replyToDiscoursePost(
            "**This proposal has been withdrawn**",
            false,
            getTopicId(data.discourseLink)
          );
          res.send({ data: proposal, success: true });
        }
      );
    });
});

router.post("/updateProposal", checkSigner, function (req, res) {
  const proposal = JSON.parse(req.body.message);
  const proposalId = proposal.proposalId;

  Proposal.findById(proposalId)
    .populate("projectId")
    .exec(async (err, data) => {
      const project = data.projectId;

      if (data.withdrawn)
        return res.status(400).json({ error: "Proposal has been withdrawn" });

      if (project.admin !== res.locals.signer) {
        return res
          .status(400)
          .json({ error: "You are not the admin of this project" });
      }
      if (proposal.proposalFundingRequested)
        proposal.proposalFundingRequested = parseFloat(
          proposal.proposalFundingRequested
        );

      const currentRound = await getCurrentRoundNumber();
      if (data.round !== currentRound) {
        // return if voting period started
        return res.status(400).send("Voting period has already started");
      }

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

      const proposalDiscourseId = data.discourseId;
      const airtableId = data.airtableRecordId;

      update.events = data.events;
      update.events.push({
        eventType: "update",
        signer: res.locals.signer,
        signedMessage: req.body.signedMessage,
        message: req.body.message,
      });

      Proposal.findByIdAndUpdate(
        proposalId,
        { $set: update },
        { runValidators: true },
        async (err, data) => {
          if (err) return res.status(400).send(err);
          await updateAirtableEntry(airtableId, update); // update airtable entry
          await updateDiscoursePost(
            proposalDiscourseId,
            { ...data, ...update },
            project
          ); // update the post in the discourse forum
          return res.send({ success: true });
        }
      );
    });
});

router.post("/getProposals", function (req, res) {
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

router.post("/proposal/deliver", checkSigner, async (req, res) => {
  const data = JSON.parse(req.body.message);
  const proposalId = data.proposalId;
  const description = data.description;

  Proposal.findById(proposalId)
    .populate("projectId", "admin")
    .exec(async (err, data) => {
      if (data.projectId.admin !== res.locals.signer) {
        return res
          .status(400)
          .json({ error: "You are not the admin of this project" });
      }

      if (data.delivered.status === 1 || data.delivered.status === 2)
        return res
          .status(400)
          .json({ error: "Proposal has already been delivered" });

      const event = {
        eventType: "deliver",
        signer: res.locals.signer,
        signedMessage: req.body.signedMessage,
        message: req.body.message,
      };

      //TODO return if there is pending delivery??

      Proposal.updateOne(
        { _id: proposalId },
        {
          $set: {
            "delivered.description": description,
            "delivered.status": 1,
          },
          $push: { events: event },
        },
        async (err, proposal) => {
          if (err) return res.json({ err });
          const md = "### Project submitted deliverables:\n" + description;

          await replyToDiscoursePost(md, true, getTopicId(data.discourseLink));
          return res.json({ success: true });
        }
      );
    });
});

router.get("/proposalInfo/:proposalId", async (req, res) => {
  const proposalId = req.params.proposalId;
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
    "proposalFundingRequested proposalTitle round proposalEarmark",
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

router.post("/admin/getCompletedProposals", (req, res) => {
  Proposal.find(
    {
      $or: [
        {
          "delivered.status": 1,
        },
        {
          "delivered.status": 3,
        },
      ],
    },
    (err, proposals) => {
      if (err) {
        res.status(400).send(err);
      }
      res.status(200).json({
        proposals,
        success: true,
      });
    }
  );
});

router.post("/admin/getProposalEarmarkRequest", (req, res) => {
  // find proposals with proposalEarmarkRequest not null
  Proposal.find(
    {
      proposalEarmarkRequest: {
        $or: [{ $exists: true }, { $ne: null }, { $ne: "" }],
      },
    },
    "proposalEarmarkRequest",
    (err, proposals) => {
      if (err) {
        res.status(400).send(err);
      }
      res.status(200).json({
        proposals,
        success: true,
      });
    }
  );
});

router.post(
  "/admin/completeProposal",
  checkSigner,
  requirePriv(5),

  async (req, res) => {
    const data = JSON.parse(req.body.message);
    let proposalId = data.proposalId;
    let description = data.description;
    let status = data.status;
    const obj = {
      adminDescription: description,
      status: status,
      date: new Date(),
    };

    const event = {
      signer: res.locals.signer,
      signedMessage: req.body.signedMessage,
      message: req.body.message,
      eventType: `setProposalStatus_${status}`,
    };

    Proposal.findByIdAndUpdate(
      proposalId,
      { $set: { delivered: obj }, $push: { events: event } },
      { runValidators: true },
      async (err, data) => {
        if (err) return res.status(400).send(err);
        const md = "### Admin:\n" + description;
        await replyToDiscoursePost(md, true, getTopicId(data.discourseLink));
        return res.send({ success: true });
      }
    );
  }
);

router.post(
  "/admin/setProposalEarmark",
  checkSigner,
  requirePriv(5),
  async (req, res) => {
    const data = JSON.parse(req.body.message);
    let proposalId = data.proposalId;
    let earmark = data.earmark;

    const event = {
      signer: res.locals.signer,
      signedMessage: req.body.signedMessage,
      message: req.body.message,
      eventType: `setProposalEarmark`,
    };

    Proposal.findByIdAndUpdate(
      proposalId,
      {
        $set: { proposalEarmark: earmark, proposalEarmarkRequest: "" },
        $push: { events: event },
      },
      { runValidators: true },
      async (err, proposal) => {
        if (err) return res.status(400).send(err);
        await updateAirtableEntry(proposal.airtableRecordId, { earmark });
        return res.send({ success: true });
      }
    );
  }
);

function requirePriv(priv) {
  return function (req, res, next) {
    if (res.locals.signer.privilege < priv) {
      return res.status(400).send("You do not have the required privilege");
    }
    next();
  };
}

function checkSigner(req, res, next) {
  // middleware to check if the user is the signer

  const signer = req.body.signer;
  const message = req.body.message; // message is a valid JSON object
  const signedMessage = req.body.signedMessage;

  const jsonMessage = JSON.parse(message);

  const realSigner = getSigner(signedMessage, message);

  if (realSigner != signer) {
    return res.status(401).send("Unauthorized Signer");
  }

  Signer.findOne({ address: signer }, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    const nonce = data ? data.nonce : 0;
    if (parseInt(nonce) !== parseInt(jsonMessage.nonce)) {
      return res.status(400).send("Invalid nonce");
    }

    // increase signer nonce
    Signer.findOneAndUpdate(
      { address: signer },
      { $inc: { nonce: 1 } },
      { upsert: true },
      (err) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.locals.signer = signer;
        next();
      }
    );
  });
}

const getTopicId = (url) => url.split("/").pop();

function checkProject(req, res, next) {
  // middleware to check if the user is the signer
  let s = {};
  const projectId = JSON.parse(req.body.message).projectId;
  s._id = projectId;
  Project.findOne(s, (err, project) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!project) {
      return res.status(400).send("Project does not exist");
    }
    if (project.admin !== res.locals.signer) {
      return res.status(401).send("Unauthorized Project");
    }
    res.locals.project = project;
    next();
  });
}

module.exports = router;
