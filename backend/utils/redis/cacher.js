const croner = require("croner");
const {
  getAllProposalRecords,
  getCurrentRoundProposals,
  getProposalByRecordId,
} = require("../airtable/utils");
const redis = require("./index");

async function cacheProposal(recordId, fields) {
  await redis.json.set(recordId, ".", fields);
}

function _deleteReduntantFields(proposal) {
  // remove fields that are not needed
  delete proposal.fields["Grant Deliverables"];
  delete proposal.fields["Deliverable Checklist"];
  delete proposal.fields["Proposal Title"];
  delete proposal.fields["Wallet Address"];
  delete proposal.fields["One Liner"];
}

async function cacheAllProposals() {
  const allProposals = await getAllProposalRecords();
  for (let proposal of allProposals) {
    _deleteReduntantFields(proposal);
    await cacheProposal(proposal.id, proposal.fields);
  }
  console.log("Cached all proposal records");
}

async function cacheSpecificProposal(airtableId) {
  let proposal = await getProposalByRecordId(airtableId);
  _deleteReduntantFields(proposal);
  await cacheProposal(airtableId, proposal.fields);
}

async function cacheCurrentRoundProposals() {
  const activeProposals = await getCurrentRoundProposals();
  for (let proposal of activeProposals) {
    _deleteReduntantFields(proposal);
    cacheProposal(proposal.id, proposal.fields);
  }
  console.log("Cached current round proposal records");
}

croner.Cron("0 */7 * * * *", async () => {
  cacheCurrentRoundProposals();
});

module.exports = {
  cacheAllProposals,
  cacheSpecificProposal,
};
