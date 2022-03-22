const mongoose = require("mongoose");
const { Schema } = mongoose;
const ethers = require("ethers");

const isValidErc20Address = (address) => {
  return /^(0x)?[0-9a-f]{40}$/i.test(address);
};
const signerSchema = new Schema({
  address: {
    type: String,
    unique: true,
    required: true,
    set: (v) => ethers.utils.getAddress(v),
    validate: [
      isValidErc20Address,
      "Please fill a valid proposal wallet address",
    ],
  },
  nonce: {
    type: Number,
    default: 0,
  },
  privilege: {
    type: Number,
    default: 2, // 5 = admin, 4 = moderator, 3 = contributor, 2 = member, 1 = guest
  },
});

const Signer = mongoose.model("Signer", signerSchema);

module.exports = Signer;
