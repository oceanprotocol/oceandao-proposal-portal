const Project = require("../../models/Project");
const Proposal = require("../../models/Proposal");
const Signer = require("../../models/Signer");
const { getProposalByRecordId } = require("../../utils/airtable/utils");
const { getSigner } = require("../../utils/ethers/signature");
const { verifyRecaptcha } = require("../../utils/recaptcha/recaptcha");

function requirePriv(priv) {
  return function (req, res, next) {
    if (res.locals.signer.privilege < priv) {
      return res.status(400).send("You do not have the required privilege");
    }
    next();
  };
}

function checkSigner(req, res, next) {
  // middleware to check if the user is the signer

  const signer = req.body.signer;
  const message = req.body.message; // message is a valid JSON object
  const signedMessage = req.body.signedMessage;

  const jsonMessage = JSON.parse(message);

  const realSigner = getSigner(signedMessage, message);

  if (realSigner != signer) {
    return res.status(401).send("Unauthorized Signer");
  }

  Signer.findOne({ address: signer }, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    const nonce = data ? data.nonce : 0;
    if (parseInt(nonce) !== parseInt(jsonMessage.nonce)) {
      return res.status(400).send("Invalid nonce");
    }

    // increase signer nonce
    Signer.findOneAndUpdate(
      { address: signer },
      { $inc: { nonce: 1 } },
      { upsert: true },
      (err) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.locals.signer = signer;
        next();
      }
    );
  });
}

function recaptchaCheck(scoreMin = 0.5) {
  return async function (req, res, next) {
    const recaptchaToken = req.body.recaptchaToken;
    const resp = await verifyRecaptcha(recaptchaToken);
    if (resp.score && resp.score >= scoreMin) {
      next();
    } else {
      res.status(400).send("Recaptcha failed");
    }
  };
}

function checkProject(req, res, next) {
  // middleware to check if the user is the signer
  let s = {};
  const projectId = JSON.parse(req.body.message).projectId;
  s._id = projectId;
  Project.findOne(s, (err, project) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!project) {
      return res.status(400).send("Project does not exist");
    }
    if (project.admin !== res.locals.signer) {
      return res.status(401).send("Unauthorized Project");
    }
    res.locals.project = project;
    next();
  });
}

function checkBadState(req, res, next) {
  const projectId = JSON.parse(req.body.message).projectId;

  // get the latest record
  Proposal.find({ projectId })
    .sort({ round: -1 })
    .limit(1)
    .exec(async (err, data) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!data[0]) {
        next();
      }
      if (data[0].delivered.status !== 2) {
        const proposalInfo = await getProposalByRecordId(
          data[0].airtableRecordId
        );
        console.log(proposalInfo.fields);
        if (
          (proposalInfo.fields["Proposal State"] == "Funded" ||
            proposalInfo.fields["Proposal State"] == "Granted") && // # maybe check only for funded and NOT granted
          proposalInfo.fields["Proposal Standing"] != "Completed"
        ) {
          return res.status(400).send("Project has an undelivered proposal");
        }
        return next();
      } else next();
    });
}

module.exports = {
  requirePriv,
  checkSigner,
  recaptchaCheck,
  checkProject,
  checkBadState,
};
