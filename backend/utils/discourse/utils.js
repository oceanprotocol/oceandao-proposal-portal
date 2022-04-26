const NodeHtmlMarkdown = require("node-html-markdown");
require("dotenv").config();
const userApiKey = process.env.DISCOURSE_API_KEY;
const apiUsername = process.env.DISCOURSE_USERNAME;
const baseUrl = process.env.DISCOURSE_BASE_URI;
const fetch = require("node-fetch");
const earmarkJson = require("../types/earmark.json");
const categoryJson = require("../types/grant_category.json");
function getMarkdown(project, proposal) {
  const md = [];

  md.push({
    title: "# Project Name",
    body: project.projectName,
  });
  md.push({
    title: "# Project Category",
    body: categoryJson[project.projectCategory],
  });
  md.push({
    title: "# Proposal Earmark",
    body: earmarkJson[proposal.proposalEarmark],
  });
  if (proposal.proposalDescription)
    md.push({
      title: "# Proposal Description",
      body: proposal.proposalDescription,
      type: "md",
    });
  md.push({
    title: "# Grant Deliverables",
    body: proposal.grantDeliverables,
    type: "md",
  });
  md.push({
    title: "# Project Description",
    body: project.projectDescription,
    type: "md",
  });
  md.push({
    title: "# Final Product",
    body: project.finalProduct,
    type: "md",
  });

  md.push({
    title: "# Value Add Criteria",
    body: proposal.valueAddCriteria,
  });

  if (project.coreTeam)
    md.push({
      title: "# Core Team",
      body: project.coreTeam,
      type: "md",
    });

  if (project.advisors)
    md.push({
      title: "# Advisors",
      body: project.advisors,
      type: "md",
    });

  md.push({
    title: "**Funding Requested**",
    body: proposal.proposalFundingRequested,
  });
  md.push({
    title: "**Minimum Funding Requested**",
    body: proposal.minUsdRequested,
  });
  md.push({
    title: "**Wallet Address**",
    body: proposal.proposalWalletAddress,
  });

  return md;
}

function getMarkdownProposal(md) {
  // md = {title:"question", body:"answer",type:"md"}
  let post = "";

  for (let obj of md) {
    if (obj.type === "md") {
      obj.body = NodeHtmlMarkdown.NodeHtmlMarkdown.translate(obj.body);
    }
    post += `${obj.title}`;
    if (obj.body) {
      post += `\n${obj.body}\n\n`;
    } else post += `\n`;
  }
  return post;
}

async function replyToDiscoursePost(reply, isMarkDown, topicId) {
  const post = isMarkDown
    ? NodeHtmlMarkdown.NodeHtmlMarkdown.translate(reply)
    : reply;

  const res = await fetch(`${baseUrl}/posts.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": userApiKey,
      "Api-Username": apiUsername,
    },
    body: JSON.stringify({
      raw: post.replace(/\\/g, ""),
      topic_id: topicId,
    }),
  });
  return await res.json();
}

async function createDiscoursePost(
  proposal,
  roundCategory,
  project,
  categoryId
) {
  const md = getMarkdown(project, proposal);
  const post = getMarkdownProposal(md);

  const res = await fetch(`${baseUrl}/posts.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": userApiKey,
      "Api-Username": apiUsername,
    },
    body: JSON.stringify({
      raw: post,
      title: `${project.projectName} | ${proposal.proposalTitle} | Round ${roundCategory}`,
      category: categoryId,
    }),
  });
  return await res.json();
}
async function updateDiscoursePost(id, proposal, project) {
  const markDown = getMarkdown(project, proposal);
  const post = getMarkdownProposal(markDown);
  const res = await fetch(`${baseUrl}/posts/${id}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": userApiKey,
      "Api-Username": apiUsername,
    },
    body: JSON.stringify({
      raw: post,
    }),
  });
  return await res.json();
}

module.exports = {
  createDiscoursePost,
  updateDiscoursePost,
  replyToDiscoursePost,
};
