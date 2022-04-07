const express = require("express");
const router = express.Router();
const getCurrentRoundNumber = require("../utils/redis/round");

router.get("/number", async (req, res) => {
  const roundNumber = await getCurrentRoundNumber();
  return res.status(200).json({
    roundNumber,
    success: true,
  });
});

module.exports = router;
