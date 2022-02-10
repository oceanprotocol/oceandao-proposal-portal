const ethers = require("ethers");

function getSigner(hash, message) {
  let msg = ethers.utils.verifyMessage(message, hash);
  return msg;
}

module.exports = {
  getSigner,
};
