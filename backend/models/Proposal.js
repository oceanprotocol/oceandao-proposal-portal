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
    required: true,
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
  valueAddCriteria: {
    type: String,
    required: true,
  },
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

  // Exterior refs
  discourseLink: String,
  airtableRecordId: String,

  message: {
    type: String,
  },
  signature: {
    type: String,
  },
});

const Proposal = mongoose.model("Proposal", proposalSchema);
module.exports = Proposal;
