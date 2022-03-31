const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const projectSchema = new Schema({
  admin: {
    // admin wallet address
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
    unique: true,
    set: (value) => value.trim(),
  },
  projectCategory: {
    type: String,
    required: true,
    enum: ["build", "outreach", "unleash", "buildcore", "improvedao"],
  },
  projectDescription: {
    type: String,
    required: true,
  },
  finalProduct: {
    type: String,
    required: true,
  },
  projectLeadFullName: {
    type: String,
    required: true,
  },
  projectLeadEmail: {
    type: String,
    trim: true,
    lowercase: true,
    required: "Email address is required",
    validate: [validator.default.isEmail, "Please fill a valid email address"],
  },
  countryOfResidence: {
    type: String,
    required: true,
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

  // PART TWO
  coreTeam: {
    type: String,
  },
  advisors: {
    type: String,
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
