require("dotenv").config();
const airtable = require("airtable");
const mongoose = require("mongoose");
const Project = require("../../models/Project");

const randomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});
const grantCategoryJson = require("../../utils/types/grant_category.json");
let db = mongoose.connection;
const base = airtable.base(process.env.AIRTABLE_BASE_ID);

// connect to localhost
mongoose.connect(
  `mongodb://${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
);

db.on("connected", () => {
  console.log("Mongoose connected");
  dumpData();
});

// on error
db.on("error", (err) => {
  console.log("Mongoose connection error: " + err);
});

// on disconnected
db.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

async function dumpData() {
  const data = await base("Proposals")
    .select({
      view: "All Proposals",
    })
    .firstPage();
  if (data.length == 0) return console.error("Run this script again");
  data.reverse();

  const grantCategoryJsonReverse = {};
  Object.keys(grantCategoryJson).forEach((key) => {
    grantCategoryJsonReverse[grantCategoryJson[key]] = key;
  });

  const done = [];

  for (let project of data.map((x) => x.fields)) {
    const admin = project["Wallet Address"];
    const projectName = project["Project Name"];

    if (done.includes(projectName)) continue;

    const projectCategory = grantCategoryJsonReverse[project["Grant Category"]];
    const countryOfResidence = project["Country of Recipient"] ?? "not set";
    const projectLeadEmail =
      project["Project Email Address"] ??
      `notset_${randomString(20)}@gmail.com`;
    const projectLeadFullName = project["Project Lead Full Name"] ?? "not set";
    const finalProduct = "not set";
    const projectDescription = project["One Liner"] ?? "not set";
    new Project({
      admin,
      projectName,
      projectCategory,
      countryOfResidence,
      projectLeadEmail,
      projectLeadFullName,
      finalProduct,
      projectDescription,
    })
      .save()
      .catch((err) => console.error(err));
    done.push(projectName);
  }

  console.log("Done");
}
