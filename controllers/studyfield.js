"use strict";

const StudyField = require("../models/studyfield");

module.exports.findAll = (req, res) => {
  StudyField
  .findAll()
  .then(studyfields => {
    res.status(200).send(studyfields);
  })
  .catch(err => {
    res.status(500).send({
      message: "StudyField findAll produced an error",
      error: err,
    });
  });
};
module.exports.saveOne = (req, res) => {
  StudyField
  .saveOne(req.body)
  .then(studyfield => {
    res.status(200).send(studyfield);
  })
  .catch(err => {
    res.status(500).send({
      message: "StudyField saveOne produced an error",
      error: err,
    });
  });
};
module.exports.updateOne = (req, res) => {
  StudyField
  .update(req.body, req.params)
  .then(studyfield => {
    res.status(200).send(studyfield);
  })
  .catch(err => {
    res.status(500).send({
      message: "StudyField updateOne produced an error",
      error: err,
    });
  });
};

module.exports.deleteOne = (req, res) => {
  StudyField
  .delete({id: req.params.id})
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.status(200).send({message: "StudyField with id: " + req.params.id+ " successfully deleted"});
    }
    else {
      res.status(404).send({message: "StudyField to delete with id: " + req.params.id +  " was not found"})
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "StudyField deleteOne produced an error",
      error: err,
    });
  });
};
