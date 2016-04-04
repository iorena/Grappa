"use strict";

const models = require("../models/shared");

module.exports.findAll = (req, res) => {
  models.list(req.query, "Thesis", (theses) => {
    res.json({
      message: "This is where I list all the theses",
      result: theses,
    })
  })
}

module.exports.saveOne = (req, res) => {
  models.add(req.query, "Thesis", (thesis) => {
    res.json({
      message: "This is where you add a thesis",
      result: thesis,
    })
  })
}
