const Project = require("../../models/Project");
const Proposal = require("../../models/Proposal");
const { updateDiscoursePost } = require("../../utils/discourse/utils");

function getAvailableEarmarks({ grantsCompleted, projectCategory }) {
  const availableEarmaks = [];
  if (grantsCompleted === 0) {
    if (projectCategory === "outreach") {
      availableEarmaks.push("newprojectoutreach");
    } else {
      availableEarmaks.push("newprojectoutreach");
      availableEarmaks.push("newproject");
    }
  } else {
    availableEarmaks.push("general");
    availableEarmaks.push("outreach");
  }

  if (grantsCompleted === 1 || grantsCompleted === 2) {
    availableEarmaks.push("2nd3rd");
  }

  availableEarmaks.push("coretech");

  return availableEarmaks;
}

async function updateDiscourse({ proposalDiscourseId, proposal, project }) {
  if (!proposal) {
    proposal = await Proposal.findOne({ discourseId: proposalDiscourseId });
  }

  if (!proposal) {
    project = await Project.findById(proposal.projectId);
  }

  updateDiscoursePost(proposalDiscourseId, proposal, project);
}

module.exports = {
  getAvailableEarmarks,
  updateDiscourse,
};
