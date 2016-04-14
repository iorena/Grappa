"use strict";
const scheduler = require("node-schedule");
const Thesis = require("../models/thesis");
const ThesisProgress = require("../models/thesisprogress");
const processor = require("./statusProcessor");

module.exports = {

  /*
   * At speficied time every day, queries all theses and thesisprogresses
   */
  start: () => {
    // "00 00 00 * * 1-7" for daily checks at 00:00
    scheduler.scheduleJob("40 * * * * 1-7", () => {
      console.log("scheduler event ran");
      Thesis
      .findAll()
      .then(theses => {
        theses.forEach(thesis => {
          ThesisProgress.findAll({ where: { id: thesis.dataValues.id } })
          .then(progress => {
            const values = thesis.dataValues;
            for (const attr in progress[0].dataValues) {
              if ({}.hasOwnProperty.call(progress[0].dataValues, attr)) {
                values[attr] = progress[0].dataValues[attr];
              }
            }
              processor.processThesisStatus(values);
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
    });
  },
};
