// app.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get((req, res) => {
  res.sendStatus(200);
});

module.exports = app;
