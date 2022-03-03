const express = require("express");
const router = express.Router();
const Proposal = require("../models/Proposal");
const { checkSigner, requirePriv } = require("./middlewares");
const {
  replyToDiscoursePost,
  updateDiscoursePost,
} = require("../utils/discourse/utils");
const { updateAirtableEntry } = require("../utils/airtable/utils");

router.post("/getCompletedProposals", (req, res) => {
  Proposal.find(
    {
      "delivered.status": 1,
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

router.post("/getProposalEarmarkRequest", (req, res) => {
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

router.post("/getCompletedProposals", (req, res) => {
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

/// -------------------------------------------------

router.post(
  "/completeProposal",
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
        if (status === 2) {
          await updateAirtableEntry(data.airtableId, {
            grantDeliverables: "[x]" + data.grantDeliverables,
          });
        }
        return res.send({ success: true });
      }
    );
  }
);

router.post(
  "/setProposalEarmark",
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

router.post(
  "/updateAllPosts",
  checkSigner,
  requirePriv(5),
  async (req, res) => {
    Proposal.find({})
      .populate("projectId")
      .exec(async (err, proposals) => {
        if (err) return res.status(400).send(err);
        for (let proposal of proposals) {
          await updateAirtableEntry(proposal.airtableRecordId, proposal); // update airtable entry
          await updateDiscoursePost(
            proposal.discourseId, // post id
            proposal, // proposal object
            proposal.projectId // project object
          );
        }
        return res.send({ success: true });
      });
  }
);

const getTopicId = (url) => url.split("/").pop();

module.exports = router;
