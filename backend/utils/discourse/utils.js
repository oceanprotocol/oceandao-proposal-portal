const NodeHtmlMarkdown = require("node-html-markdown");

const userApiKey = process.env.DISCOURSE_API_KEY;
const apiUsername = process.env.DISCOURSE_USERNAME;
const baseUrl = process.env.DISCOURSE_BASE_URI;

function getProjectMd(project) {
  const projectMd = [];
  projectMd.push({
    title: "Project Name",
    body: project.projectName,
  });
  projectMd.push({
    title: "One Liner",
    body: project.oneLiner,
  });
  projectMd.push({
    title: "Project Description",
    body: project.projectDescription,
    type: "md",
  });
  projectMd.push({
    title: "Value Add Criteria",
    body: project.valueAddCriteria,
    type: "md",
  });
  projectMd.push({
    title: "Final Product",
    body: project.finalProduct,
    type: "md",
  });
  if (project.coreTeam)
    projectMd.push({
      title: "Core Team",
      body: project.finalProduct,
      type: "md",
    });

  if (project.advisors)
    projectMd.push({
      title: "Final Product",
      body: project.finalProduct,
      type: "md",
    });

  return projectMd;
}

function getProposalMd(proposal) {
  const proposalMd = [];
  projectMd.push({
    title: "Proposal Title",
    body: proposal.proposalTitle,
  });
  projectMd.push({
    title: "Proposal One Liner",
    body: proposal.oneLiner,
  });
  projectMd.push({
    title: "Proposal Description",
    body: proposal.proposalTitle,
    type: "md",
  });
  projectMd.push({
    title: "Grant Deliverables",
    body: proposal.grantDeliverables,
    type: "md",
  });
  projectMd.push({
    title: "Funding Requested",
    body: proposal.proposalFundingRequested,
  });
  projectMd.push({
    title: "Wallet Address",
    body: proposal.proposalWalletAddress,
  });

  return proposalMd;
}

function getMarkdownProposal(md) {
  // md = {title:"question", body:"answer",type:"md"}
  let post = "";

  for (let obj of md) {
    if (obj.type === "md") {
      obj.body = NodeHtmlMarkdown.NodeHtmlMarkdown.translate(obj.body);
    }
    post += `## ${obj.title}`;
    post += `\n\n${obj.body}`;
  }
  return post;
}

async function createDiscoursePost(proposal, roundCategory, project, title) {
  const post = getMarkdownProposal([
    ...getProjectMd(project),
    ...getProposalMd(proposal),
  ]);

  const res = await fetch(`${baseUrl}/posts.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": userApiKey,
      "Api-Username": apiUsername,
    },
    body: JSON.stringify({
      raw: post,
      title: `${title} | Round ${roundCategory}`,
      category: roundCategory,
      archetype: "regular",
    }),
  });
  return await res.json();
}
async function updateDiscoursePost(id, proposal) {
  // TODO do something here
  const post = getMarkdownProposal(md);
}

module.exports = {
  createDiscoursePost,
  updateDiscoursePost,
};
