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
  getWalletProposals,
  createAirtableEntry,
  getCurrentRoundNumber,
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
    const { proposalFundingRequested } = req.body;
    const project = res.locals.project;
    const projectName = project.projectName;

    let proposal = req.body;
    proposal.signer = res.locals.signer; // signer
    proposal.projectId = project._id; // add projectId to proposal

    const newProposal = new Proposal(proposal); // ? maybe change this
    const error = newProposal.validateSync();
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

    const discoursePostLink = await createDiscoursePost(
      proposal,
      currentRound,
      project,
      projectName
    ); // create a new post in the discourse forum
    proposal.proposalUrl = discoursePostLink; /// TODO MAKE SURE LINK IS CORRECT

    const airtableRecordId = await createAirtableEntry(...proposal); // create airtable entry
    proposal.airtableRecordId = airtableRecordId; // TODO MAKE SURE RECORD ID IS CORRECT

    proposal.message = req.body.message;
    proposal.signature = req.body.signedMessage;

    await newProposal.save((err, proposal) => {}); // save the proposal to the database
  }
);

router.post("/updateProposal", checkSigner, checkProject, function (req, res) {
  // return if voting period started
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

router.get("/getProjectInfo/:projectId", async (req, res) => {
  const projectId = req.params.projectId;
  Proposal.find(
    { projectId: projectId },
    "fundingRequested proposalDetails title",
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
    return res.status(401).send("Unauthorized");
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
      res.status(400).send(err);
    }
    if (!project) {
      res.status(400).send("Project does not exist");
    }
    if (project.admin !== res.locals.signer) {
      res.status(401).send("Unauthorized");
    }
    res.locals.project = project;
    next();
  });
}

module.exports = router;
