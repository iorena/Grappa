"use strict";

const Grader = require("../models/grader");
const Thesis = require("../models/thesis");

module.exports.findAll = (req, res) => {
  Grader
  .findAll()
  .then(graders => {
    res.status(200).send(graders);
  })
  .catch(err => {
    res.status(500).send({
      message: "Grader findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  Grader
  .saveOne(req.body)
  .then(grader => {
    res.status(200).send(grader);
  })
  .catch(err => {
    res.status(500).send({
      message: "Grader saveOne produced an error",
      error: err,
    });
  });
};

module.exports.saveIfDoesntExist = (req, res) => {
  Grader
  .saveIfDoesntExist(req.body)
  .then(grader => {
    res.status(200).send(grader);
  })
  .catch(err => {
    res.status(500).send({
      message: "Grader saveOne produced an error",
      error: err,
    });
  });
};

// module.exports.findOrCreate = (req, res) => {
//   Grader
//   .findAll({where: {name: req.body.grader}})
//   .then((graders) => {
//       if(graders === null || graders === undefined){
//           Grader.saveOne({name: req.body.grader, title: req.body.gradertitle});
//       } else {
//         res.status(200).send(graders[])
//       }
//       }
//   })
// }

module.exports.saveGraderFromNewThesis = (thesis) => {
  console.log("New Grader saved!")
  Grader.saveOne({name: thesis.grader, title: thesis.gradertitle});
  Grader.saveOne({name: thesis.grader2, title: thesis.grader2title});
};
