var express = require("express");
var router = express.Router();
const { getSinger } = require("../utils/ethers/signature");
const Proposal = require("../models/Proposal");
const {
  getProjectUsdLimit,
  getWalletProposals,
  createProposal,
} = require("../utils/airtable/utils");
router.post("/createProposal", checkSigner, async function (req, res) {
  const {
    projectName,
    oneLiner,
    projectDescription,
    grantDeliverables,
    projectCategory,
    projectEarmark,
    finalProduct,
    fundingRequested,
    proposalWalletAddress,
    teamWebsite,
    twitterLink,
    discordLink,
    projectLeadFullName,
    projectLeadEmail,
    countryOfResidence,
  } = req.body;
  const signer = res.locals.signer;
  const proposal = { ...req.body, signer };

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

  await newProposal.save((err, proposal) => {});
});

router.post("/updateProposal", checkSigner, function (req, res) {});

router.post("/getProposals", checkSigner, function (req, res) {});

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
