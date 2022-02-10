// import mongoose from "mongoose";
// const { Schema } = mongoose;
// const validator = require("validator");

// const isValidErc20Address = (address) => {
//   return /^(0x)?[0-9a-f]{40}$/i.test(address);
// };

// const projectSchema = new Schema({
//   name: String,
//   walletAddress: {
//     type: String,
//     required: true,
//     validate: [isValidErc20Address, "Please fill a valid wallet address"],
//   },
//   projectLeadFullName: {
//     type: String,
//     required: true,
//   },
//   countryOfResidence: {
//     type: String,
//     required: true,
//   },
//   projectLeadEmail: {
//     type: String,
//     trim: true,
//     lowercase: true,
//     unique: true,
//     required: "Email address is required",
//     validate: [validator.default.isEmail, "Please fill a valid email address"],
//   },
//   teamWebsite: {
//     type: String,
//   },
//   twitterLink: {
//     type: String,
//   },
//   discordLink: {
//     type: String,
//   },

//   projectDescription: {
//     type: String,
//     required: true,
//   },
//   finalProduct: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Project = mongoose.model("Project", projectSchema);

// export default Project;
