const scheduler = require("node-schedule");
const Thesis = require("../models/thesis");

module.exports = {
  start: function() {
    const job = scheduler.scheduleJob("20 * * * * 1-7", () => {
      console.log("scheduler event ran");
      Thesis
      .findAll()
      .then(theses => {
        theses.forEach( thesis => {
          console.log(thesis.dataValues);
          // handle thesis
        });
      })
      .catch(err => {
        console.log(err);
      });
    });
  }
};
