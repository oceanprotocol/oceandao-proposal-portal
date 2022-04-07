const express = require("express");
const { getCurrentRoundNumber } = require("../utils/airtable/utils");
const router = express.Router();
const redis = require("../utils/redis");

router.get("/number", async (req, res) => {
  redis.get("currentRoundNumber", async (err, roundNumber) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!roundNumber) {
      roundNumber = await getCurrentRoundNumber();
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
});
