const NodeHtmlMarkdown = require("node-html-markdown");
require("dotenv").config();
const userApiKey = process.env.DISCOURSE_API_KEY;
const apiUsername = process.env.DISCOURSE_USERNAME;
const baseUrl = process.env.DISCOURSE_BASE_URI;
const fetch = require("node-fetch");
const earmarkJson = require("../types/earmark.json");
const categoryJson = require("../types/grant_category.json");

function getProjectMd(project) {
  // TODO include value add criteria
  const projectMd = [];
  projectMd.push({
    title: "Project Name",
    body: project.projectName,
  });
  // projectMd.push({ //TODO UNDEFINED
  //   title: "One Liner",
  //   body: project.oneLiner,
  // });
  projectMd.push({
    title: "Project Description",
    body: project.projectDescription,
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
      body: project.coreTeam,
      type: "md",
    });

  if (project.advisors)
    projectMd.push({
      title: "Advisors",
      body: project.advisors,
      type: "md",
    });

  return projectMd;
}

function getProposalMd(proposal) {
  const proposalMd = [];
  proposalMd.push({
    title: "Proposal Title",
    body: proposal.proposalTitle,
  });
  proposalMd.push({
    title: "Proposal One Liner",
    body: proposal.oneLiner,
  });
  proposalMd.push({
    title: "Proposal Description",
    body: proposal.proposalDescription,
    type: "md",
  });
  proposalMd.push({
    title: "Grant Deliverables",
    body: proposal.grantDeliverables,
    type: "md",
  });
  proposalMd.push({
    title: "Funding Requested",
    body: proposal.proposalFundingRequested,
  });
  proposalMd.push({
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
    post += `\n\n${obj.body}\n`;
  }
  return post;
}

async function createDiscoursePost(proposal, roundCategory, project) {
  const projectMd = getProjectMd(project);
  const proposalMd = getProposalMd(proposal);
  const post = getMarkdownProposal([...projectMd, ...proposalMd]);

  const res = await fetch(`${baseUrl}/posts.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": userApiKey,
      "Api-Username": apiUsername,
    },
    body: JSON.stringify({
      raw: post,
      title: `${proposal.proposalTitle} | Round ${roundCategory}`,
      category: 15, // roundCategory,
      //topic_id: 15,
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
