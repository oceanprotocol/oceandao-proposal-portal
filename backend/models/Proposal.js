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
  signer: {
    type: String,
    required: true,
  },
  oneLiner: {
    type: String,
    required: true,
  },
  grantDeliverables: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  projectCategory: {
    type: String,
    required: true,
    enum: ["build", "outreach", "unleash", "buildcore", "improvedao"],
  },
  projectEarmark: {
    type: String,
    required: true,
    enum: ["newproject", "newprojectoutreach", "coretech", "general"],
  },
  finalProduct: {
    type: String,
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
  discourseLink: {},
  teamWebsite: {
    type: String,
  },
  twitterLink: {
    type: String,
  },
  discordLink: {
    type: String,
  },

  projectLeadFullName: {
    type: String,
    required: true,
  },
  projectLeadEmail: {
    type: String,
    required: true,
  },
  countryOfResidence: {
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

  // PART THREE
  appUrl: {
    type: String,
  },
  isOpenSource: {
    type: String,
  },
  isOpenSourceWhy: {
    type: String,
  },
  isOpenSourceLink: {
    type: String,
  },
  prComponents: {
    type: String,
  },
  commitToWorkingWithCore: {
    type: String,
  },
  commitToWorkingWithDAO: {
    type: String,
  },
  commitToMakingPublic: {
    type: String,
  },
  howManyBlogPosts: {
    type: String,
  },
  whereBlogPosts: {
    type: String,
  },
  wherePodcasts: {
    type: String,
  },
  whereVideos: {
    type: String,
  },

  proposalDetails: {
    type: String,
  },
  priorWork: {
    type: String,
  },
  projectRoadmap: {
    type: String,
  },
  futurePlans: {
    type: String,
  },
  mockups: {
    type: String,
  },
  technologyStack: {
    type: String,
  },
  socialChannels: {
    type: String,
  },

  dataAssetdids: {
    type: String,
  },

  additionalInformation: {
    type: String,
  },
});

const Proposal = mongoose.model("Project", projectSchema);
export default Proposal;
