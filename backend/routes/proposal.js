/*
/proposal/x
*/
const express = require("express");
const router = express.Router();
const Proposal = require("../models/Proposal");
const { checkSigner, recaptchaCheck } = require("./middlewares");
const {
  updateDiscoursePost,
  replyToDiscoursePost,
} = require("../utils/discourse/utils");
const {
  getProjectUsdLimit,
  getCurrentRoundNumber,
  updateAirtableEntry,
} = require("../utils/airtable/utils");

router.post("/withdraw", checkSigner, (req, res) => {
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
      if (data.withdrawn) {
        return res.status(400).json({ error: "Proposal has been withdrawn" });
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

router.post("/update", recaptchaCheck(0.5), checkSigner, function (req, res) {
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

      if (proposal.minUsdRequested)
        proposal.minUsdRequested = parseFloat(proposal.minUsdRequested);

      const currentRound = await getCurrentRoundNumber();
      if (data.round != currentRound) {
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
      } else {
        proposal.proposalFundingRequested = data.proposalFundingRequested;
      }

      if (proposal.minUsdRequested) {
        if (proposal.minUsdRequested > proposal.proposalFundingRequested) {
          return res.status(400).json({
            error: "Your minimum funding request exceeds your funding request",
          });
        }
        update.minUsdRequested = proposal.minUsdRequested;
      }

      if (proposal.valueAddCriteria)
        update.valueAddCriteria = proposal.valueAddCriteria;

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

router.post("/deliver", checkSigner, async (req, res) => {
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

      if (data.withdrawn) {
        return res.status(400).json({ error: "Proposal has been withdrawn" });
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
        async (err) => {
          if (err) return res.json({ err });
          const md = "### Project submitted deliverables:\n" + description;

          await replyToDiscoursePost(md, true, getTopicId(data.discourseLink));
          return res.json({ success: true });
        }
      );
    });
});

router.get("/info/:proposalId", async (req, res) => {
  const proposalId = req.params.proposalId;
  Proposal.findById(proposalId, (err, proposal) => {
    if (err) {
      res.status(400).send(err);
    }
    res.status(200).send(proposal);
  });
});

const getTopicId = (url) => url.split("/").pop();

module.exports = router;
