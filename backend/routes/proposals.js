var express = require("express");
var router = express.Router();
const { getSinger } = require("../utils/ethers/signature");
const Proposal = require("../models/Proposal");
const {
  createDiscoursePost,
  updateDiscoursePost,
} = require("../utils/discourse/utils");
const {
  getProjectUsdLimit,
  getWalletProposals,
  createAirtableEntry,
} = require("../utils/airtable/utils");
router.post("/createProposal", checkSigner, async function (req, res) {
  const { projectName, fundingRequested } = req.body;
  const signer = res.locals.signer;
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

  const discoursePostLink = await createDiscoursePost(proposal); // create a new post in the discourse forum
  proposal.proposalUrl = discoursePostLink;

  await createAirtableEntry(...proposal); // create airtable entry

  await newProposal.save((err, proposal) => {}); // save the proposal to the database
});

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

module.exports = router;
