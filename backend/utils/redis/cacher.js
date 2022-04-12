const croner = require("croner");
const {
  getAllProposalRecords,
  getCurrentRoundProposals,
} = require("../airtable/utils");
const redis = require("./index");

async function cacheProposal(recordId, fields) {
  redis.json.set(recordId, ".", fields);
}

async function cacheAllProposals() {
  const allProposals = await getAllProposalRecords();
  for (let proposal of allProposals) {
    cacheProposal(proposal.id, proposal.fields);
  }
  console.log("Cached all proposal records");
}

async function cacheCurrentRoundProposals() {
  const activeProposals = await getCurrentRoundProposals();
  for (let proposal of activeProposals) {
    cacheProposal(proposal.id, proposal.fields);
  }
  console.log("Cached current round proposal records");
}

croner.Cron("0 */10 * * * *", async () => {
  cacheCurrentRoundProposals();
});

module.exports = {
  cacheAllProposals,
};
