const express = require("express");
const { getCurrentRound } = require("../utils/airtable/utils");
const router = express.Router();
const redis = require("../utils/redis");

router.get("/number", async (req, res) => {
  let roundNumber = await redis.get("currentRoundNumber");
  if (!roundNumber) {
    const currentRound = await getCurrentRound();
    roundNumber = currentRound.fields["Round"];
    const currentRoundSubmissionDeadline =
      currentRound.fields["Proposals Due By"];
    if (Date.now() > new Date(currentRoundSubmissionDeadline).getTime()) {
      roundNumber += 1; // will submit proposal for next round
    }

    if (roundNumber == -1) {
      return res.status(400).send("No round number found");
    }
    redis.set("currentRoundNumber", roundNumber);

    // expire at midnight
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    redis.expireAt("currentRoundNumber", parseInt(todayEnd / 1000));
  }

  return res.status(200).json({
    roundNumber,
    success: true,
  });
});

module.exports = router;
