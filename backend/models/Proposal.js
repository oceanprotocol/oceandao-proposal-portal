const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const isValidErc20Address = (address) => {
  return /^(0x)?[0-9a-f]{40}$/i.test(address);
};

const proposalSchema = new Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  signer: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },

  // Proposal Schema
  proposalTitle: {
    type: String,
    required: true,
    unique: true,
  },
  proposalEarmark: {
    type: String,
    required: true,
    enum: ["newproject", "newprojectoutreach", "coretech", "general"],
  },
  oneLiner: {
    type: String,
    required: true,
  },
  proposalDescription: {
    type: String,
  },
  valueAddCriteria: {
    type: String,
  },
  grantDeliverables: {
    type: String,
    required: true,
  },

  round: Number,

  proposalFundingRequested: {
    type: Number,
    required: true,
  },
  proposalWalletAddress: {
    type: String,
    required: true,
    validate: [
      isValidErc20Address,
      "Please fill a valid proposal wallet address",
    ],
  },

  updates: [String],
  delivered: {
    description: String,
    confirmed: {
      type: Boolean,
      default: false,
    },
  },

  events: [
    {
      signer: String,
      signedMessage: String,
      message: String,
      date: {
        type: Date,
        default: Date.now,
      },
      eventType: String,
    },
  ],

  // Exterior refs
  discourseLink: String,
  airtableRecordId: String,
  discourseId: String,

  message: {
    type: String,
  },
  signature: {
    type: String,
  },
});

const Proposal = mongoose.model("Proposal", proposalSchema);
module.exports = Proposal;
