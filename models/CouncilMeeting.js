"use strict";

const BaseModel = require("./BaseModel");

class CouncilMeeting extends BaseModel {
  constructor() {
    super("CouncilMeeting");
  }
  linkThesis(meeting, thesis) {
    return this.getModel()
      .findOne({ where: { id: meeting.id } })
      .then((CM) => CM.addTheses(thesis));
  }

  getNextMeetingWithTheses() {
    return this.getModel()
      .findOne({ 
        where: {
          createdAt: {
            $lt: new Date(),
          },
        },
        include: [{
          model: this.Models.Thesis,
          include: [{
              model: this.Models.Grader,
            }, {
              model: this.Models.ThesisProgress,
            }, {
              model: this.Models.StudyField,
            }, {
              model: this.Models.User,
            }],
          }],
      })
  }
}

module.exports = new CouncilMeeting();
