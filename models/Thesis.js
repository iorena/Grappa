"use strict";

const BaseModel = require("./BaseModel");

class Thesis extends BaseModel {
  constructor() {
    super("Thesis");
  }

  checkIfExists(thesis) {
    return this.getModel().findOne({
      where: {
        title: thesis.title,
        authorFirstname: thesis.authorFirstname,
        authorLastname: thesis.authorLastname,
        authorEmail: thesis.authorEmail,
      },
    })
      .then(thesis => {
        return thesis !== null;
      });
  }

  findConnections(thesis) {
    return Promise.all([
      this.Models.CouncilMeeting.findOne({
        where: {
          id: thesis.CouncilMeetingId,
        },
      }),
      this.Models.StudyField.findOne({
        where: {
          id: thesis.StudyFieldId,
        },
      }),
      Promise.all(thesis.Graders.map(grader => this.Models.Grader.findOne({
        where: {
          id: grader.id,
        },
      }))),
      this.Models.User.findOne({
        where: {
          role: "professor",
          StudyFieldId: thesis.StudyFieldId,
        },
      }),
    ]);
  }

  setDateDaysBefore(date, days) {
    const newdate = new Date(date);
    newdate.setDate(newdate.getDate() - days);
    return newdate.toISOString();
  }

  linkStudyField(thesis, studyfield_id) {
    return this.Models.StudyField
      .findOne({
        where: {
          id: studyfield_id,
        },
      })
      .then((studyfield) => thesis.setStudyField(studyfield));
  }

  linkUser(thesis, user_id) {
    return this.Models.User
      .findOne({
        where: {
          id: user_id,
        },
      })
      .then((user) => thesis.setUser(user));
  }

  saveOne(params, councilmeeting) {
    console.log(councilmeeting);
    const values = Object.assign({}, params);
    if (councilmeeting !== null) {
      values.deadline = this.setDateDaysBefore(councilmeeting.date, 10);
    }
    return this.getModel().create(values)
      .then(thesis =>
        this.findOne({ id: thesis.id })
      );
  }

  saveOneAndProgress(params, councilmeeting) {
    let savedThesis;
    const values = Object.assign({}, params);
    if (councilmeeting !== null) {
      values.deadline = this.setDateDaysBefore(councilmeeting.date, 10);
    }
    return this.getModel().create(values)
      .then(thesis => {
        savedThesis = thesis;
        return this.Models.ThesisProgress.create({});
      })
      .then(progress => progress.setThesis(savedThesis))
      .then(() => savedThesis);
  }

  findOne(params) {
    return this.getModel().findOne({
      where: params === undefined ? {} : params,
      include: [{
        model: this.Models.Grader,
      }, {
        model: this.Models.ThesisProgress,
        include: [{
          model: this.Models.EmailStatus,
          as: "EthesisEmail",
        }, {
          model: this.Models.EmailStatus,
          as: "GraderEvalEmail",
        }, {
          model: this.Models.EmailStatus,
          as: "PrintEmail",
        }, ],
      }, {
        model: this.Models.StudyField,
      }, {
        model: this.Models.User,
        attributes: ["id", "email", "firstname", "lastname", "role", "StudyFieldId"],
      }, {
        model: this.Models.CouncilMeeting,
      }],
    });
  }

  findAll(params) {
    return this.getModel().findAll({
      attributes: ["id", "authorFirstname", "authorLastname", "authorEmail", "title", "urkund", "ethesis", "grade",
        "deadline", "graderEval", "CouncilMeetingId", "StudyFieldId", "UserId"],
      where: params,
      include: [{
        model: this.Models.Grader,
        attributes: ["id", "name", "title"],
      }, {
        model: this.Models.ThesisProgress,
        include: [{
          model: this.Models.EmailStatus,
          as: "EthesisEmail",
        }, {
          model: this.Models.EmailStatus,
          as: "GraderEvalEmail",
        }, {
          model: this.Models.EmailStatus,
          as: "PrintEmail",
        }, ],
      }, {
        model: this.Models.StudyField,
      }, {
        model: this.Models.User,
        attributes: ["id", "email", "firstname", "lastname", "role", "StudyFieldId"],
      }, {
        model: this.Models.CouncilMeeting,
      }],
    });
  }

  findAllByUserRole(user) {
    if (user === undefined) {
      return Promise.resolve([]);
    } else if (user.role === "admin" || user.role === "print-person") {
      return this.findAll();
    } else if (user.role === "professor") {
      return this.findAll({
        StudyFieldId: user.StudyFieldId,
      });
    } else if (user.role === "instructor") {
      return this.findAll({
        UserId: user.id,
      });
    }
  }

  findAllByCouncilMeeting(cm_id) {
    return this.findAll({
      CouncilMeetingId: cm_id,
    });
  }

  findOneDocuments(thesisID) {
    return this.getModel().findOne({
      attributes: ["id", "title", "ethesis", "graderEval", "StudyFieldId"],
      where: { id: thesisID },
      include: [{
        model: this.Models.ThesisReview,
      }, {
        model: this.Models.Grader,
      }],
    });
  }

  findAllDocuments(thesisIDs) {
    return Promise.all(thesisIDs.map(thesisID => this.findOneDocuments(thesisID)));
  }
}


module.exports = new Thesis();
