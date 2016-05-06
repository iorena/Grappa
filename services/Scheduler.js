"use strict";

const scheduler = require("node-schedule");
const EmailReader = require("./EmailReader");
const Thesis = require("../models/thesis");
const ThesisProgress = require("../models/thesisprogress");
const Processor = require("./StatusProcessor");

class Scheduler {
  /**
   * Starts the scheduler to be run once in hour
   *
   * "55 13 * * * 1-7" = means that every 55th second of every 13th minute
   * every hour every xxx every xxx and every day of week this scheduler
   * will run its task. TODO this JSdoc.
   */
  startAndRunOnceInHour() {
    scheduler.scheduleJob("55 13 * * * 1-7", () => {
      console.log("scheduler event ran");
      this.checkThesisProgresses();
      EmailReader.checkEmail();
    });
  }

  checkThesisProgresses() {
    Thesis
    .findAll()
    .then(theses => {
      theses.map(thesis => {
        if (thesis.ThesisProgress === null) {
          console.log(`id:${thesis.id} No ThesisProgress found on Thesis(!)`);
          // Thesis has no ThesisProgress(!)
          // Currently this means that either test data is bad or ThesisProgress
          // has been for some reason been removed from Thesis.
          // Maybe it's because Thesis has been completed but for now
          // these cases are just skipped and no new ThesisProgresses are made.
        } else {
          console.log(`id:${thesis.id} Processing Thesis status to see whether eThesis link has been added.`);
          Processor.processThesisStatus(thesis);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  combineProps(thesis, progress) {
    let thesisProgress = progress;
    /* ThesisProgress should be pre-created, but just in case... */
    if (progress === null) {
      thesisProgress = ThesisProgress.saveOne({
        thesisId: thesis.id,
        ethesisReminder: Date.now(),
        professorReminder: Date.now(),
        gradersStatus: false,
        documentsSent: Date.now(),
        isDone: false,
      });
    }
    const values = thesis;
    for (const attr in thesisProgress) {
      if ({}.hasOwnProperty.call(thesisProgress, attr)) {
        values[attr] = thesisProgress[attr];
      }
    }
    return values;
  }
}

module.exports.class = Scheduler;
module.exports = new Scheduler();
