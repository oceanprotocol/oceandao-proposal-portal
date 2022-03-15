const ethers = require("ethers");

function getSigner(hash, message) {
  if (!hash.startsWith("0x")) hash = "0x" + hash;
  let msg = ethers.utils.verifyMessage(message, hash);
  return msg;
}

module.exports = {
  getSigner,
};
