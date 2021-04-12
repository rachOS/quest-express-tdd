// app.js
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const connection = require("./connection");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.get("/bookmarks/:id", (req, res, next) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM bookmark WHERE id = ?",
    id,
    (err, results) => {
      const errMessage = { error: "Bookmark not found" };
      err
        ? next(err)
        : !results.length
        ? res.status(404).send(errMessage)
        : res.status(200).json(results.find((bm) => bm.id === Number(id)));
    }
  );
});

app.post("/bookmarks", (req, res, next) => {
  const { title, url } = req.body;
  !title || !url
    ? res.status(422).json({ error: "required field(s) missing" })
    : connection.query(
        "INSERT INTO bookmark SET ?",
        req.body,
        (err, result) => {
          err
            ? res.status(500).json({ error: err.message, sql: err.sql })
            : connection.query(
                "SELECT * FROM bookmark WHERE id = ?",
                result.insertId,
                (err, rec) => {
                  err
                    ? res.status(500).json({ error: err.message, sql: err.sql })
                    : res
                        .status(201)
                        .json(rec.find((bm) => bm.id === result.insertId));
                }
              );
        }
      );
});
module.exports = app;
