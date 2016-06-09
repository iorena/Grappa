"use strict";

const BaseModel = require("./BaseModel");

class CouncilMeeting extends BaseModel {
  constructor() {
    super("CouncilMeeting");
  }
  linkThesis(meeting, thesis) {
    return this.getModel()
      .findOne({ where: { id: meeting.id } })
      .then((CM) => {
        return CM.addTheses(thesis);
      })
  }
}

module.exports.class = CouncilMeeting;
module.exports = new CouncilMeeting();
