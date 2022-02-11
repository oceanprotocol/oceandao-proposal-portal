const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const isValidErc20Address = (address) => {
  return /^(0x)?[0-9a-f]{40}$/i.test(address);
};

const proposalSchema = new Schema({
  signer: {
    type: String,
    required: true,
  },
  grantDeliverables: {
    type: String,
    required: true,
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  fundingRequested: {
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

  discourseLink: String,
  airtableRecordId: String,

  projectEarmark: {
    type: String,
    required: true,
    enum: ["newproject", "newprojectoutreach", "coretech", "general"],
  },

  // PART THREE
  proposalDetails: {
    type: String,
  },
});

const Proposal = mongoose.model("Project", proposalSchema);
export default Proposal;
