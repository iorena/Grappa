"use strict";

const BaseModel = require("./base_model");
const tables = require("./tables.js");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }

  changeGraderStatus(thesisId){
    tables["ThesisProgress"].update({gradersStatus: true}, {where: {thesisId: thesisId}});
  }
}


module.exports.class = ThesisProgress;
module.exports = new ThesisProgress();
