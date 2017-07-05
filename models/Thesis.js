const BaseModel = require("./BaseModel");

class Thesis extends BaseModel {
  constructor() {
    super("Thesis");
  }

  checkIfExists(thesis) {
    return this.Models.Thesis.findOne({
        where: {
          title: thesis.title,
          authorFirstname: thesis.authorFirstname,
          authorLastname: thesis.authorLastname,
          authorEmail: thesis.authorEmail,
        },
      })
      .then(thesis => thesis !== null && thesis !== undefined);
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

  // moveThesisToCouncilmeeting(ThesisId, CouncilMeetingId) {
  //   this.Models.Thesis.update({
  //
  //   })
  //    this.Models[this.modelname].update(values, { where: params });
  // }

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

  saveOneAndProgress(values, councilmeeting) {
    let savedThesis;
    return this.Models.Thesis.create(values)
      .then(thesis => {
        savedThesis = thesis;

        return this.Models.ThesisProgress.create({});
      })
      .then(progress => progress.setThesis(savedThesis))
      .then(() => savedThesis);
  }

  findOne(params) {
    return this.Models.Thesis.findOne({
      attributes: ["id", "authorFirstname", "authorLastname", "authorEmail", "title", "urkund", "grade",
        "graderEval", "CouncilMeetingId", "StudyFieldId", "UserId", "regreq"],
      where: params === undefined ? {} : params,
      include: [{
        model: this.Models.Grader,
      }, {
        model: this.Models.ThesisProgress,
        include: [{
          model: this.Models.EmailStatus,
          as: "EthesisReminder",
        }, {
          model: this.Models.EmailStatus,
          as: "GraderEvalReminder",
        }, {
          model: this.Models.EmailStatus,
          as: "PrintReminder",
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
    return this.Models.Thesis.findAll({
      attributes: ["id", "authorFirstname", "authorLastname", "authorEmail", "title", "urkund", "grade",
        "graderEval", "CouncilMeetingId", "StudyFieldId", "UserId", "regreq"],
      where: params,
      include: [{
        model: this.Models.Grader,
        attributes: ["id", "name", "title"],
      }, {
        model: this.Models.ThesisProgress,
        include: [{
          model: this.Models.EmailStatus,
          as: "EthesisReminder",
        }, {
          model: this.Models.EmailStatus,
          as: "GraderEvalReminder",
        }, {
          model: this.Models.EmailStatus,
          as: "PrintReminder",
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
    } else if (user.role === "professor" && user.StudyFieldId) {
      return this.findAll({
        StudyFieldId: user.StudyFieldId,
      });
    } else {
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

  findAllGrades() {
    return this.Models.Thesis.findAll({
      attributes: ["grade"],
      include: [{
        model: this.Models.StudyField,
        attributes: ["name"],
      }, {
        model: this.Models.CouncilMeeting,
        attributes: ["date"],
      }],
    });
  }

  findOneDocuments(thesisID) {
    return this.Models.Thesis.findOne({
      attributes: ["id", "title", "authorFirstname", "authorLastname",
        "grade", "graderEval", "StudyFieldId", "regreq"],
      where: { id: thesisID },
      include: [{
        model: this.Models.ThesisReview,
      }, {
        model: this.Models.ThesisAbstract,
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
