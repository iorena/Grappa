"use strict";

const models = require("../models/shared");

module.exports.findAll = (req, res) => {
  models.list(req.query, "Councilmeeting", (cmetings) => {
    res.json({
      message: "This is where I list all the theses",
      result: cmetings,
    })
  })
}

module.exports.saveOne = (req, res) => {
  models.add(req.query, "Councilmeeting", (cmeeting) => {
    res.json({
      message: "This is where you add a thesis",
      result: cmeeting,
    })
  })
}
