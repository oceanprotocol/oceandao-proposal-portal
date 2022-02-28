const feth = require("node-fetch");
require("dotenv").config();

function verifyRecaptcha(token) {
  var url = "https://www.google.com/recaptcha/api/siteverify";
  var data = {
    secret: process.env.RECAPTCHA_SECRET,
    response: token,
  };

  return feth(url, {
    method: "POST",
    body: `secret=${data.secret}&response=${data.response}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((res) => res.json());
}

module.exports = {
  verifyRecaptcha,
};
