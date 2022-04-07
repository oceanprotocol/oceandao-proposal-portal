const { getCurrentRound } = require("../airtable/utils");
const redis = require("./index");

async function getCurrentRoundNumber() {
  let roundNumber = await redis.get("currentRoundNumber");
  if (!roundNumber) {
    const currentRound = await getCurrentRound();
    if (!currentRound) throw new Error("No current round found");
    roundNumber = currentRound.fields["Round"];
    const currentRoundSubmissionDeadline =
      currentRound.fields["Proposals Due By"];
    if (Date.now() > new Date(currentRoundSubmissionDeadline).getTime()) {
      roundNumber += 1; // will submit proposal for next round
    }

    redis.set("currentRoundNumber", roundNumber);

    // expire at midnight
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    redis.expireAt("currentRoundNumber", parseInt(todayEnd / 1000));
  }
  return roundNumber;
}

module.exports = {
  getCurrentRoundNumber,
};
