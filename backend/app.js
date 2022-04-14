require("dotenv").config;
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes");
const cors = require("cors");
const app = express();

app.use(cors());
require("./utils/mongodb/connection");

app.use(logger("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false, limit: "100mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.error(err.message);

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on ${process.env.PORT}`)
);
