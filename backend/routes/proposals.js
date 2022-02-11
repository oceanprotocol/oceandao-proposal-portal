var express = require("express");
var router = express.Router();
const { getSinger } = require("../utils/ethers/signature");
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

router.post(
  "/createProposal",
  checkSigner,
  checkProject,
  async function (req, res) {
    const { fundingRequested } = req.body;
    const project = res.locals.project;
    const projectName = project.projectName;

    proposal.projectId = project._id;
    const signer = res.locals.signer;

    let md = req.body.md; // markdown part

    delete req.body.md;

    let proposal = req.body;
    proposal.signer = signer;

    const newProposal = new Proposal(proposal); // ? maybe change this
    const error = newProposal.validateSync();
    if (error) {
      return res.status(400).json({ error: error.toString() });
    }

    const projectUsdLimit = await getProjectUsdLimit(projectName);
    if (fundingRequested > projectUsdLimit) {
      return res.status(400).json({
        error: "Your funding request exceeds the project USD limit",
      });
    }

    const currentRound = await getCurrentRoundNumber();

    const discoursePostLink = await createDiscoursePost(
      md,
      currentRound,
      project
    ); // create a new post in the discourse forum
    proposal.proposalUrl = discoursePostLink; /// TODO MAKE SURE LINK IS CORRECT

    const airtableRecordId = await createAirtableEntry(...proposal); // create airtable entry
    proposal.airtableRecordId = airtableRecordId; // TODO MAKE SURE RECORD ID IS CORRECT

    await newProposal.save((err, proposal) => {}); // save the proposal to the database
  }
);

router.post("/updateProposal", checkSigner, function (req, res) {});

router.post("/getProposals", checkSigner, function (req, res) {
  Proposal.find(
    { signer: res.locals.signer },
    "projectName oneLiner projectCategory projectEarmark",
    (err, proposals) => {
      if (err) {
        res.status(400).send(err);
      }
      res.status(200).send(proposals);
    }
  );
});

function checkSigner(req, res, next) {
  // middleware to check if the user is the signer
  const signer = req.body.signer;
  const message = req.body.message;
  const signedMessage = req.body.signedMessage;

  const realSigner = getSinger(signedMessage, message);

  if (realSigner != signer) {
    res.status(401).send("Unauthorized");
  }
  res.locals.signer = signer;
  next();
}

function checkProject(req, res, next) {
  // middleware to check if the user is the signer
  const projectName = req.body.projectName;
  Project.findOne({ projectName }, (err, project) => {
    if (err) {
      res.status(400).send(err);
    }
    if (!project) {
      res.status(400).send("Project does not exist");
    }
    res.locals.project = project;
    next();
  });
}

module.exports = router;
