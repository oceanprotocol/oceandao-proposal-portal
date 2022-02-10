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
 * Creates an entry in the proposals table
 */
async function createProposal({
  projectName,
  oneLiner,

  projectCategory,
  projectEarmark,
  grantDeliverables,

  fundingRequested,
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
    Earmarks: projectEarmark,
    "USD Requested": fundingRequested,
    "Wallet Address": proposalWalletAddress,
    "Twitter Link": twitterLink,
    "Discord Link": discordLink,
    "Project Lead Full Name": projectLeadFullName,
    "Project Email Address": projectLeadEmail,
    "Country of Recipient": countryOfResidence,
    "Proposal URL": proposalUrl,
  };

  // TODO add the proposal to the airtable
}

module.exports = {
  getWalletProposals,
  getProjectUsdLimit,
  getCurrentRoundNumber,
  createProposal,
};
