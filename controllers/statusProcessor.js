// require("./email");
const ThesisProgress = require("../models/thesisprogress");

module.exports = {
  processThesisStatus: (thesis) => {
    console.log(thesis);
    // check mailbox for boomerangs
    // check if ethesis link has been added, in which case fetch abstract
    // send reminder emails if needed
    /*
     * Last step: ethesis link and abstract are in place and graders have been evaluated
     */

    if (thesis.gradersStatus && thesis.ethesis !== null && !thesis.documentsSent) {
      ThesisProgress.update({ documentsSent: true }, { id: thesis.id });
      // save documentsSent as true in thesisProgress
      // send documents to printer
    }
  },
};
