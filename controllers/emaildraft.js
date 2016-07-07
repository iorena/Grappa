"use strict";

const EmailDraft = require("../models/EmailDraft");

module.exports.findAll = (req, res) => {
  EmailDraft
  .findAll()
  .then(graders => {
    res.status(200).send(graders);
  })
  .catch(err => {
    res.status(500).send({
      message: "EmailDraft findAll produced an error",
      error: err,
    });
  });
};

// module.exports.saveOne = (req, res) => {
//   EmailDraft
//   .saveOne(req.body)
//   .then(grader => {
//     res.status(200).send(grader);
//   })
//   .catch(err => {
//     res.status(500).send({
//       message: "EmailDraft saveOne produced an error",
//       error: err,
//     });
//   });
// };
