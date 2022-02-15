require("dotenv").config();
const airtable = require("airtable");
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

function getWalletProposals() {}

/**
 * @param {String} projectName
 * @return {Number} projectUsdLimit
 */
async function getProjectUsdLimit(projectName) {
  // TODO get the project usd limit from the airtable - Project Summary table
}

/**
 * Returns the active round number
 * @return {Number} current round number
 */
async function getCurrentRoundNumber() {
  // TODO get the current round number from the airtable
}

/**
 * Updates an entry in the proposals table
 */
async function updateAirtableEntry({
  recordId,
  projectName,
  oneLiner,

  projectCategory,
  proposalEarmark,
  grantDeliverables,

  proposalFundingRequested,
  proposalWalletAddress,

  twitterLink,
  discordLink,

  projectLeadFullName,
  projectLeadEmail,
  countryOfResidence,

  proposalUrl,
}) {}

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

  twitterLink,
  discordLink,

  projectLeadFullName,
  projectLeadEmail,
  countryOfResidence,

  proposalUrl,
}) {
  const roundNumber = await getCurrentRoundNumber();
  const proposal = {
    "Project Name": projectName,
    "One Liner": oneLiner,
    "Grant Category": projectCategory,
    Earmarks: proposalEarmark,
    "USD Requested": proposalFundingRequested,
    "Wallet Address": proposalWalletAddress,
    "Twitter Link": twitterLink,
    "Discord Link": discordLink,
    "Project Lead Full Name": projectLeadFullName,
    "Project Email Address": projectLeadEmail,
    "Country of Recipient": countryOfResidence,
    "Proposal URL": proposalUrl,
  };

  const id = base.create({
    fields: proposal,
    tableName: "Proposals",
  });
  return id;
}

module.exports = {
  getWalletProposals,
  getProjectUsdLimit,
  getCurrentRoundNumber,
  createAirtableEntry,
  updateAirtableEntry,
};
