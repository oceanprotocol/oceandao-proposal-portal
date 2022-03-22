require("dotenv").config();
const airtable = require("airtable");
const mongoose = require("mongoose");
const Project = require("../../models/Project");
const Proposal = require("../../models/Proposal");
const fetch = require("node-fetch");
const ethers = require("ethers");
const showdown = require("showdown");

airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});
const grantCategoryJson = require("../../utils/types/grant_category.json");
const earmarkJson = require("../../utils/types/earmark.json");
let db = mongoose.connection;
const base = airtable.base(process.env.AIRTABLE_BASE_ID);

// connect to localhost
mongoose.connect(
  `mongodb://${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
);

db.on("connected", () => {
  console.log("Mongoose connected");
  dumpData();
});

// on error
db.on("error", (err) => {
  console.log("Mongoose connection error: " + err);
});

// on disconnected
db.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

async function dumpData() {
  const data = await base("Proposals")
    .select({
      view: "All Proposals",
    })
    .all();
  if (data.length == 0) return console.error("Run this script again");

  const grantCategoryJsonReverse = {};
  Object.keys(grantCategoryJson).forEach((key) => {
    grantCategoryJsonReverse[grantCategoryJson[key]] = key;
  });

  const earmarkJsonReverse = {};
  Object.keys(earmarkJson).forEach((key) => {
    earmarkJsonReverse[earmarkJson[key]] = key;
  });

  const allProjects = await Project.find({});
  const allProposals = await Proposal.find({});

  const names = allProposals.map((proposal) => proposal.proposalTitle);

  for (let proposal of data.map((x) => x.fields)) {
    const projectName = proposal["Project Name"];

    let newProposal = {};

    // proposal attributes
    newProposal.projectId = allProjects.find(
      (x) => x.projectName === projectName
    );

    if (!newProposal.projectId) {
      console.log(
        `Project ${projectName} not found. Skipping proposal ${proposal["Proposal Title"]}`
      );
      continue;
    }

    newProposal.signer = proposal["Wallet Address"];

    newProposal.proposalTitle = `${projectName} - ${proposal["Round"]}`;

    if (names.includes(newProposal.proposalTitle)) {
      newProposal.proposalTitle = `${newProposal.proposalTitle} | 2`; //TODO fix duplicate proposal problem
    }
    names.push(newProposal.proposalTitle);

    newProposal.proposalEarmark = earmarkJsonReverse[proposal["Earmarks"]];
    newProposal.oneLiner = proposal["One Liner"] || "Not found";
    newProposal.grantDeliverables = proposal["Grant Deliverables"]
      ? new showdown.Converter().makeHtml(proposal["Grant Deliverables"])
      : "Not found";

    newProposal.round = proposal["Round"];
    newProposal.proposalFundingRequested = proposal["USD Requested"] ?? 0;
    newProposal.proposalWalletAddress = ethers.utils.getAddress(
      proposal["Wallet Address"]
    );
    newProposal.delivered = {
      description: proposal["Deliverable Checklist"]
        ? new showdown.Converter().makeHtml(proposal["Deliverable Checklist"])
        : null,
      date: new Date(),
      adminDescription: proposal["Deliverable Checklist"]
        ? "Migrated from Airtable"
        : null,
      status: proposal["Proposal Standing"] === "Completed" ? 2 : 0,
    };
    newProposal.airtableRecordId = proposal["RecordId"];
    newProposal.discourseLink = proposal["Proposal URL"];
    const slugId = newProposal.discourseLink
      .split("/")
      .find((x) => !isNaN(parseInt(x)));
    const discourseIdRequest = await fetch(
      `https://port.oceanprotocol.com/t/${slugId}.json`
    );
    const res = await discourseIdRequest.json();
    newProposal.withdrawn = proposal["Proposal State"] === "Withdrawn";
    // newProposal.proposalState = proposal["Proposal State"];
    // newProposal.proposalStanding = proposal["Proposal Standing"];
    newProposal.discourseId = res.post_stream.posts[0].id;

    await new Proposal(newProposal).save();
    console.log("Proposal saved:", newProposal.proposalTitle);
  }

  console.log("Done");
}
