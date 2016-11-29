"use strict";

const BaseModel = require("./BaseModel");

class CouncilMeeting extends BaseModel {
  constructor() {
    super("CouncilMeeting");
  }

  findAll() {
    return this.Models[this.modelname]
      .findAll({
        attributes: ["id", "date", "instructorDeadline", "studentDeadline"],
      });
  }

  findMeetingAndSequence(id) {
    let meeting;
    return this.Models.CouncilMeeting.findOne({ id, })
      .then(found => {
        meeting = found;
        // will fail here if no meeting found... which is fine I guess
        const start = new Date(meeting.date.getFullYear(), 0, 1);
        return this.Models.CouncilMeeting.findAll({
            where: {
              date: {
                $between: [start, meeting.date],
              }
            }
          })
      })
      .then(meetings => {
        meeting.seq = meetings.length;
        return meeting;
      })
  }

  checkIfExists(meeting) {
    const start = new Date(meeting.date);
    const end = new Date(meeting.date);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 1);
    return this.getModel().findOne({
        where: {
          date: {
            $between: [start, end],
          },
        },
      })
      .then(found => {
        return found !== null;
      });
  }

  linkThesis(meeting, thesis) {
    return this.getModel()
      .findOne({ where: { id: meeting.id } })
      .then((CM) => CM.addTheses(thesis));
  }

  // unused
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
      });
  }

  saveOne(values) {
    return this.Models[this.modelname].create(values)
      .then(saved => {
        return {
          id: saved.id,
          date: saved.date,
          studentDeadline: saved.studentDeadline,
          instructorDeadline: saved.instructorDeadline,
        }
      })
  }
}

module.exports = new CouncilMeeting();
