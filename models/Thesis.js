"use strict";

const BaseModel = require("./BaseModel");

class Thesis extends BaseModel {
  constructor() {
    super("Thesis");
  }

  findConnections(thesis) {
    return Promise.all([
      this.Models.CouncilMeeting.findOne({
        id: thesis.CouncilMeetingId,
      }),
      this.Models.StudyField.findOne({
        id: thesis.StudyFieldId,
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
        model: this.Models.CouncilMeeting,
      }],
    });
  }

  findAll(params) {
    return this.getModel().findAll({
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
      return this.findOne({
        UserId: user.id,
      });
    }
  }

  /**
   * Finds all pdfs related to thesis and puts them inside tmp-folder
   *
   * @return {Array<Array<Promise<File>>>} - List of lists of PDF documents as file streams
   */
  findAllDocuments(theses) {
    return Promise.all(theses.map(thesis => {
      let pdfs = [];
      if (thesis.ethesis) {
        pdfs.push(FileUploader.downloadPdf(thesis.ethesis));
      }
      if (thesis.pathToFileReview) {
        pdfs.push(FileUploader.copyReview(thesis.pathToFileReview));
      }
      if (thesis.graderEval) {
        pdfs.push(FileUploader.generateGraderEvalPdf(thesis.graderEval));
      }
      return Promise.all(pdfs);
    }));
  }
}

module.exports = new Thesis();
