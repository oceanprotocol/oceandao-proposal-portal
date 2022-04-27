require("dotenv").config();
const NodeHtmlMarkdown = require("node-html-markdown");
const airtable = require("airtable");
const earmarkJson = require("../types/earmark.json");
const categoryJson = require("../types/grant_category.json");
airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = airtable.base(process.env.AIRTABLE_BASE_ID);

const _getFundingRoundsSelectQuery = async (selectQuery) => {
  try {
    return await base("Funding Rounds")
      .select({
        view: "Rounds",
        filterByFormula: selectQuery,
        sort: [{ field: "Start Date", direction: "desc" }],
      })
      .firstPage();
  } catch (err) {
    console.error(err);
  }
};

const getProposalByRecordId = async (recordId) => {
  const proposal = await base("Proposals").find(recordId);
  return proposal;
};

const _getProposalsSelectQuery = async (selectQuery) => {
  try {
    return await base("Proposals")
      .select({
        view: "All Proposals",
        filterByFormula: selectQuery,
      })
      .firstPage();
  } catch (err) {
    console.error(err);
  }
};

const _getProjectSummarySelectQuery = async (selectQuery) => {
  try {
    return await base("Project Summary")
      .select({
        view: "Grid view",
        filterByFormula: selectQuery,
      })
      .firstPage();
  } catch (err) {
    console.error(err);
  }
};

async function getAllProposalRecords() {
  return base("Proposals")
    .select({
      view: "All Proposals",
    })
    .all();
}

async function getCurrentRoundProposals() {
  const currentRound = await getCurrentRound();
  const currentRoundNumber = currentRound.fields["Round"];
  const currentRoundProposals = await base("Proposals")
    .select({
      view: "All Proposals",
      filterByFormula: `OR({Round} = ${currentRoundNumber},{Round} = ${
        currentRoundNumber + 1
      },{Round} = ${currentRoundNumber - 1})`,
    })
    .all();
  return currentRoundProposals;
}

/**
 * @param {String} projectName
 * @return {Number} projectUsdLimit
 */
async function getProjectUsdLimit(projectName) {
  const project = await _getProjectSummarySelectQuery(
    `{Project Name} = "${projectName}"`
  );
  if (!project) return 3000;
  return project[0] ? project[0].fields["Max Funding"] : 3000;
}

/**
 * Returns the active round number
 * @return {Number} current round number
 */
async function getCurrentRoundNumber() {
  const roundParameters = await getCurrentRound();
  return roundParameters ? roundParameters.fields["Round"] : -1;
}

/**
 * Returns the current round
 * @return {object} current round
 */
async function getCurrentRound() {
  const nowDateString = new Date().toISOString();
  const roundParameters = await _getFundingRoundsSelectQuery(
    `AND({Start Date} < "${nowDateString}", "true")`
  );
  return roundParameters ? roundParameters[0] : null;
}

async function getCurrentDiscourseCategoryId() {
  // NOT USED
  const roundParameters = await getCurrentRound();
  return roundParameters ? roundParameters.fields["Discourse Category"] : -1;
}

/**
 * Updates an entry in the proposals table
 */
async function updateAirtableEntry(recordId, proposal, grantCompleted = false) {
  let update = {};
  if (proposal.proposalFundingRequested)
    update["USD Requested"] = proposal.proposalFundingRequested;

  if (proposal.proposalWalletAddress)
    update["Wallet Address"] = proposal.proposalWalletAddress;

  if (proposal.proposalStanding) {
    update["Proposal Standing"] = proposal.proposalStanding;
  }

  if (proposal.proposalEarmark) {
    update["Earmarks"] = earmarkJson[proposal.proposalEarmark];
  }

  if (proposal.deliverableChecklist)
    update["Deliverable Checklist"] =
      `[x] Completed! ` +
      NodeHtmlMarkdown.NodeHtmlMarkdown.translate(
        proposal.deliverableChecklist
      );
  // uncomment me if you want to make proposal title updateable
  //if (proposal.proposalTitle) update["Proposal Title"] = proposal.proposalTitle;
  if (proposal.grantDeliverables)
    update["Grant Deliverables"] =
      `${grantCompleted ? "[x]" : "[ ]"} ` +
      NodeHtmlMarkdown.NodeHtmlMarkdown.translate(proposal.grantDeliverables);
  if (proposal.withdrawn) update["Proposal State"] = "Withdrawn";
  if (proposal.earmark) update["Earmarks"] = earmarkJson[proposal.earmark];

  if (proposal.minUsdRequested)
    update["Minimum USD Requested"] = proposal.minUsdRequested;

  if (proposal.oneLiner) update["One Liner"] = proposal.oneLiner;
  try {
    await base("Proposals").update(recordId, update);
  } catch (err) {
    console.error(err);
    throw new Error("An error occurred while updating the Airtable entry");
  }
  return true;
}

async function getFormerFundedProposals(projectName) {
  const formerProposals = await _getProposalsSelectQuery(
    `AND({Project Name} = "${projectName}",{Proposal State} = "Funded")`
  );
  return formerProposals;
}

/**
 * Creates an entry in the proposals table
 */
async function createAirtableEntry({
  projectName,
  oneLiner,

  projectCategory,
  proposalEarmark,
  grantDeliverables,

  proposalFundingRequested,
  proposalWalletAddress,

  projectLeadFullName,
  projectLeadEmail,
  countryOfResidence,

  proposalUrl,
  proposalTitle,
  minUsdRequested,

  roundNumber,
}) {
  const proposal = {
    "Project Name": projectName,
    "One Liner": oneLiner,
    Round: roundNumber,
    "Grant Category": categoryJson[projectCategory],
    Earmarks: earmarkJson[proposalEarmark],
    "USD Requested": proposalFundingRequested,
    "Wallet Address": proposalWalletAddress,
    "Project Lead Full Name": projectLeadFullName,
    "Project Email Address": projectLeadEmail,
    "Country of Recipient": countryOfResidence,
    "Proposal URL": proposalUrl,
    "Proposal Title": proposalTitle,
    "Minimum USD Requested": minUsdRequested,
    "Grant Deliverables":
      "[ ] " + NodeHtmlMarkdown.NodeHtmlMarkdown.translate(grantDeliverables),
  };

  let id;
  try {
    id = await base("Proposals").create(proposal);
  } catch (err) {
    console.error(err);
    throw new Error("An error occurred while creating the Airtable entry");
  }

  return id.id;
}

module.exports = {
  getProjectUsdLimit,
  getCurrentRoundNumber,
  createAirtableEntry,
  updateAirtableEntry,
  getFormerFundedProposals,
  getCurrentDiscourseCategoryId,
  getCurrentRound,
  getProposalByRecordId,
  getAllProposalRecords,
  getCurrentRoundProposals,
};
