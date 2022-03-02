const express = require("express");
const router = express.Router();
const Signer = require("../models/Signer");

router.get("/nonce/:address", async (req, res) => {
  const address = req.params.address;
  Signer.findOne({ address }, (err, signer) => {
    if (err) return res.status(400).send(err);
    res.send({ nonce: signer ? signer.nonce : 0 });
  });
});

module.exports = router;
