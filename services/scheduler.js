"use strict";
const scheduler = require("node-schedule");
const Thesis = require("../models/thesis");
const ThesisProgress = require("../models/thesisprogress");
const processor = require("./statusProcessor");

class Scheduler {
  /*
   * At speficied time every day, queries all theses and thesisprogresses
   */
  start() {
    // "00 00 00 * * 1-7" for daily checks at 00:00
    scheduler.scheduleJob("55 13 * * * 1-7", () => {
      console.log("scheduler event ran");
      Thesis
      .findAll()
      .then(theses => {
        theses.map(thesis => {
          ThesisProgress
          .findOne({ id: thesis.dataValues.id })
          .then(progress => {
            const values = this.combineProps(thesis.dataValues, progress.dataValues);
            processor.processThesisStatus(values);
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
    });
  }

  combineProps(thesis, progress) {
    let thesisProgress = progress;
    /* ThesisProgress should be pre-created, but just in case... */
    if (progress === null) {
      thesisProgress = ThesisProgress.saveOne({ thesisId: thesis.id,
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
