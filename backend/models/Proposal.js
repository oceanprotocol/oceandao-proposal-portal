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
  valueAddCriteria: {
    type: String,
  },
  proposalTitle: {
    type: String,
    required: true,
    unique: true,
  },
  signer: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },

  // Proposal Schema
  proposalEarmark: {
    type: String,
    required: true,
    enum: ["newproject", "newprojectoutreach", "coretech", "general"],
  },
  proposalEarmarkRequest: String,
  oneLiner: {
    type: String,
    required: true,
  },
  proposalDescription: {
    type: String,
  },
  grantDeliverables: {
    type: String,
    required: true,
  },

  withdrawn: {
    type: Boolean,
    default: false,
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
    date: Date,
    adminDescription: String,
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
      // 0: not delivered, 1: delivered, 2: delivered and accepted, 3: delivered and rejected
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
