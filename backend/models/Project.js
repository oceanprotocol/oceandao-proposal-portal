const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const isValidErc20Address = (address) => {
  return /^(0x)?[0-9a-f]{40}$/i.test(address);
};

const projectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
    unique: true,
  },
  admin: {
    // admin wallet address
    type: String,
    required: true,
  },

  projectLeadFullName: {
    type: String,
    required: true,
  },
  countryOfResidence: {
    type: String,
    required: true,
  },
  projectLeadEmail: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validator.default.isEmail, "Please fill a valid email address"],
  },
  teamWebsite: {
    type: String,
  },
  twitterLink: {
    type: String,
  },
  discordLink: {
    type: String,
  },

  projectDescription: {
    type: String,
    required: true,
  },

  valueAddCriteria: {
    type: String,
    required: true,
  },

  projectCategory: {
    type: String,
    required: true,
    enum: ["build", "outreach", "unleash", "buildcore", "improvedao"],
  },

  finalProduct: {
    type: String,
    required: true,
  },

  // PART TWO
  coreTeam: {
    type: String,
  },
  advisors: {
    type: String,
  },

  signer: String,
  signedMessage: String,
  message: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
