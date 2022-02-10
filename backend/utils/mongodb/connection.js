require("dotenv").config();
const mongoose = require("mongoose");
let db = mongoose.connection;

// connect to localhost
mongoose.connect(
  `mongodb://${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
);

// on
db.on("connected", () => {
  console.log("Mongoose connected");
});

// on error
db.on("error", (err) => {
  console.log("Mongoose connection error: " + err);
});

// on disconnected
db.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
