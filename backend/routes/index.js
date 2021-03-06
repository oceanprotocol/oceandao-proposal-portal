const express = require("express");
const router = express.Router();

const webRoute = require("./web");
const adminRoute = require("./admin");
const signerRoute = require("./signer");
const projectRoute = require("./project");
const proposalRoute = require("./proposal");
const roundRoute = require("./round");

router.use("/app/admin", adminRoute);
router.use("/app/project", projectRoute);
router.use("/app/proposal", proposalRoute);
router.use("/app/round", roundRoute);
router.use("/app/", signerRoute);
router.use("/", webRoute);

module.exports = router;
