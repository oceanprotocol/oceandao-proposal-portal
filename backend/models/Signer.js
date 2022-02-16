const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const signerSchema = new Schema({
  address: String,
  nonce: {
    type: Number,
    default: 0,
  },
});

const Signer = mongoose.model("Project", signerSchema);

module.exports = Signer;
