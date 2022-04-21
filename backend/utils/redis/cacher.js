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

async function cacheAllProposals() {
  const allProposals = await getAllProposalRecords();
  for (let proposal of allProposals) {
    delete proposal.fields["Grant Deliverables"];
    delete proposal.fields["Deliverable Checklist"];
    delete proposal.fields["Proposal Title"];
    await cacheProposal(proposal.id, proposal.fields);
  }
  console.log("Cached all proposal records");
}

async function cacheSpecificProposal(airtableId) {
  let proposal = await getProposalByRecordId(airtableId);
  delete proposal.fields["Grant Deliverables"];
  delete proposal.fields["Deliverable Checklist"];
  delete proposal.fields["Proposal Title"];
  await cacheProposal(airtableId, proposal.fields);
}

async function cacheCurrentRoundProposals() {
  const activeProposals = await getCurrentRoundProposals();
  for (let proposal of activeProposals) {
    delete proposal.fields["Grant Deliverables"];
    delete proposal.fields["Deliverable Checklist"];
    delete proposal.fields["Proposal Title"];
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
