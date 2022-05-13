const { getCurrentRound } = require("../airtable/utils");
const redis = require("./index");

async function getCurrentRoundNumber() {
  let roundObject = await redis.json.get("currentRoundObj", ".");
  let roundNumber;

  if (!roundObject) {
    const currentRound = await getCurrentRound();
    if (!currentRound) throw new Error("No current round found");
    roundNumber = parseInt(currentRound.fields["Round"]);
    const currentRoundSubmissionDeadline =
      currentRound.fields["Proposals Due By"];
    if (Date.now() > new Date(currentRoundSubmissionDeadline).getTime()) {
      roundNumber += 1; // will submit proposal for next round
    }

    redis.json.set("currentRoundObj", ".", currentRound.fields);

    // expire at midnight
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    redis.expireAt("currentRoundObj", parseInt(todayEnd / 1000));
  } else {
    roundNumber = parseInt(roundObject["Round"]);
    const currentRoundSubmissionDeadline = roundObject["Proposals Due By"];
    if (Date.now() > new Date(currentRoundSubmissionDeadline).getTime()) {
      roundNumber += 1; // will submit proposal for next round
    }
  }
  return roundNumber;
}

module.exports = {
  getCurrentRoundNumber,
};
