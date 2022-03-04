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
      })
      .firstPage();
  } catch (err) {
    console.error(err);
  }
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
  const nowDateString = new Date().toISOString();
  const roundParameters = await _getFundingRoundsSelectQuery(
    `AND({Voting Starts} > "${nowDateString}", "true")`
  );
  return roundParameters ? roundParameters[0].fields["Round"] : -1;
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

  // uncomment me if you want to make proposal title updateable
  //if (proposal.proposalTitle) update["Proposal Title"] = proposal.proposalTitle;
  if (proposal.grantDeliverables)
    update["Grant Deliverables"] =
      `${grantCompleted ? "[x]" : "[ ]"} ` +
      NodeHtmlMarkdown.NodeHtmlMarkdown.translate(proposal.grantDeliverables);
  if (proposal.withdrawn) update["Proposal State"] = "Withdrawn";
  if (proposal.earmark) update["Earmarks"] = earmarkJson[proposal.earmark];

  if (proposal.oneLiner) update["One Liner"] = proposal.oneLiner;
  await base("Proposals").update(recordId, update);
  return true;
}

async function getFormerProposals(projectName) {
  const formerProposals = await _getProposalsSelectQuery(
    `{Project Name} = "${projectName}"`
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
}) {
  const roundNumber = await getCurrentRoundNumber();
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
    "Grant Deliverables":
      "[ ] " + NodeHtmlMarkdown.NodeHtmlMarkdown.translate(grantDeliverables),
  };

  const id = await base("Proposals").create(proposal);
  return id.id;
}

module.exports = {
  getProjectUsdLimit,
  getCurrentRoundNumber,
  createAirtableEntry,
  updateAirtableEntry,
  getFormerProposals,
};
