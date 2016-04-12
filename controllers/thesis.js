"use strict";

const Thesis = require("../models/thesis");
const Thesisprogress = require("../controllers/thesisprogress");
//const { CouncilMeeting } = require("../models/tables");
const tables = require("../models/tables.js");
const CouncilMeeting = require("../models/councilmeeting");


module.exports.findAll = (req, res) => {
  Thesis
  .findAll()
  .then(theses => {
    res.status(200).send(theses);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesis findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  let originalDate = new Date(req.body.deadline);
  let thesisValues;
  if (req.body.deadline != null){
    thesisValues = addCorrectDeadline(req.body);
  }
  Thesis
  .saveOne(thesisValues)
  .then(thesis => {
   Thesisprogress.saveThesisProgressFromNewThesis(thesis);
   addMeetingdateidAndThesisIdToCouncilMeetingTheses(thesis, originalDate);
   res.status(200).send(thesis);
 })
  .catch(err => {
    res.status(500).send({
      message: "Thesis saveOne produced an error",
      error: err,
    });
  });
};

function addCorrectDeadline(thesisValues){
  var date = new Date(thesisValues.deadline); 
  date.setDate(date.getDate()-10);
  thesisValues.deadline = date.toISOString();
  return thesisValues;
};

function addMeetingdateidAndThesisIdToCouncilMeetingTheses(thesis, date){
  CouncilMeeting
  .getModel()
  .findOne({ where: {date: new Date(date)} })
  .then(function(cm){
    cm
    .addTheses(thesis)
    .then(function(){
      console.log("Thesis linked to councilmeeting")
    });
  });
}
