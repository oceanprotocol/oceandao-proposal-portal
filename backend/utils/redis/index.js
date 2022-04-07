require("dotenv").config();
const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URL ?? "redis://redis:6379",
});

client.on("error", function (err) {
  console.log("Error " + err);
});

client.on("connect", function () {
  console.log("Redis connected");
});

client.connect();

module.exports = client;
