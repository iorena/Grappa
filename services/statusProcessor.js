const ThesisProgress = require("../models/thesisprogress");
const Thesis = require("../models/thesis");
const EmailReader = require("./EmailReader");
const request = require("request");

module.exports.fetchAbstract = (ethesisUrl) => new Promise((resolve, reject) => {
  request.get({ url: ethesisUrl }, (error, response, body) => {
    if (error) reject(error);
    const startI = body.indexOf("abstract-field");
    const endI = body.indexOf("</", startI);
    resolve(body.substring(startI + 16, endI));
  });
});

module.exports.processThesisStatus = (thesis) => {
  /*
   * check mailbox for boomerangs
   *
  // EmailReader.checkEmail();

  /*
   * Check if ethesis link has been added, in which case fetch abstract
   */
  if (thesis.ethesis !== null && thesis.abstract === null) {
    module.exports.fetchAbstract(thesis.ethesis).then((value) => {
      Thesis.update({ abstract: value }, { id: thesis.id });
    });
  }

  /*
   * Last step: ethesis link and abstract are in place and graders have been evaluated
   */

  if (thesis.gradersStatus && thesis.ethesis !== null && !thesis.documentsSent) {
    ThesisProgress.update({ documentsSent: true }, { id: thesis.id });
    // send notification to print person
  }
};
