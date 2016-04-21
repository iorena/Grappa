"use strict";
const ThesisProgress = require("../models/thesisprogress");
const Thesis = require("../models/thesis");
// const EmailReader = require("./EmailReader");
const EmailReminder = require("./EmailReminder");
const request = require("request");

class StatusProcessor {
  fetchAbstract(ethesisUrl) {
    return new Promise((resolve, reject) => {
      request.get({ url: ethesisUrl }, (error, response, body) => {
        if (error) reject(error);
        const startI = body.indexOf("abstract-field");
        const endI = body.indexOf("</", startI);
        resolve(body.substring(startI + 16, endI));
      });
    });
  }

  processThesisStatus(thesis) {
    /*
     * check mailbox for boomerangs
     */
    // EmailReader.checkEmail();

    this.checkForEthesis(thesis);
    this.sendToPrintPerson(thesis);
  }
  /*
   * Check if ethesis link has been added, in which case fetch abstract
   */
  checkForEthesis(thesis) {
    if (thesis.ethesis !== null && thesis.abstract === null) {
      module.exports.fetchAbstract(thesis.ethesis).then((value) => {
        Thesis.update({ abstract: value }, { id: thesis.id });
      });
    }
  }

  /*
   * Last step: ethesis link and abstract are in place and graders have been evaluated
   */
  sendToPrintPerson(thesis) {
    if (thesis.gradersStatus && thesis.abstract !== null && thesis.documentsSent === null) {
      EmailReminder.sendPrintPersonReminder(thesis);
      ThesisProgress.update({ documentsSent: Date.now() }, { id: thesis.id });
    }
  }
}

module.exports.class = StatusProcessor;
module.exports = new StatusProcessor();
