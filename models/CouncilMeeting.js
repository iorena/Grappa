"use strict";

const BaseModel = require("./BaseModel");

class CouncilMeeting extends BaseModel {
  constructor() {
    super("CouncilMeeting");
  }

  findOne(params) {
    return this.Models[this.modelname]
      .findOne({
        attributes: ["id", "date", "instructorDeadline", "studentDeadline"],
        where: params,
      });
  }

  findAll() {
    return this.Models[this.modelname]
      .findAll({
        attributes: ["id", "date", "instructorDeadline", "studentDeadline"],
      });
  }

  findMeetingAndSequence(id) {
    let meeting;
    return this.Models.CouncilMeeting.findOne({ where: { id, }})
      .then(found => {
        meeting = found;
        // if no councilmeeting found / provided will just not print the cover
        if (!found) return undefined;
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
        if (meeting) {
          meeting.seq = meetings.length;
        }
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
