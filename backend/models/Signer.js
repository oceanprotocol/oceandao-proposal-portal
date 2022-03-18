const mongoose = require("mongoose");
const { Schema } = mongoose;

const signerSchema = new Schema({
  address: String,
  nonce: {
    type: Number,
    default: 0,
  },
  privilege: {
    type: Number,
    default: 2, // 5 = admin, 4 = moderator, 3 = contributor, 2 = member, 1 = guest
  },
  email: String,
  fullName: String,
  countryOfResidence: String,
});

const Signer = mongoose.model("Signer", signerSchema);

module.exports = Signer;
