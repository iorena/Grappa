"use strict";

const BaseModel = require("./base_model");
const StudyField = require("./studyfield");
const Grader = require("./grader");
const User = require("./user");
const tokenGen = require("../services/TokenGenerator");


class Thesis extends BaseModel {
  constructor() {
    super("Thesis");
  }
  /*
   * Or remove, I don't really know what it does..
   */
   add10DaysToDeadline(deadline) {
     const date = new Date(deadline);
     date.setDate(date.getDate() - 10);
     return date.toISOString();
   }
   linkStudyField(thesis, field) {
    return StudyField.getModel()
    .findOne({ where: { name: field } })
    .then((studyfield) => thesis.setStudyField(studyfield))
    .then(() => {
      console.log("Thesis linked to StudyField");
    });
  }
  addUser(thesis, req) {
    let user = tokenGen.decodeToken(req.headers["x-access-token"]).user;

    return User.getModel()
    .findOne({ where: { id: user.id } })
    .then((user) => thesis.setUser(user))
    .then(() => {
      console.log("Thesis linked to user");
    });
  }
  saveOne(params) {
    // console.log("params are: " + JSON.stringify(params));
    const values = Object.assign({}, params);
    // the crazy validation loop. wee!
    Object.keys(params).map(key => {
      if (values[key] !== null && !this.Validator.validate(values[key], key)) {
        throw new Error(key + " isn't the wanted type!");
      }
    });
    if (values.deadline !== null) {
      values.deadline = this.add10DaysToDeadline(params.deadline);
    }
    return this.getModel().create(values);
  }
  findAllByUserRole(user) {
    if (user.role === "admin" || user.role === "print-person") {
      return this.findAll();
    } else if (user.role === "professor") {
      return this.findAll({ StudyFieldId: user.StudyFieldId });
    } else if (user.role === "instructor") {
      return this.findOne({ UserId: user.id });
    }
  }

  findAll(params) {
    var thesesList;
    if (typeof params !== "undefined") {
      return this.getModel().findAll({
        where: params,
        include :
        [{
          model: this.Models.Grader,
        }, {
          model: this.Models.ThesisProgress,
        }, {
          model: this.Models.StudyField
        }, {
          model: this.Models.User
        }, {
         model: this.Models.CouncilMeeting
       }]
     });
    }
    return this.Models[this.modelname]
    .findAll({
      include :
      [{
        model: this.Models.Grader,
      }, {
       model: this.Models.ThesisProgress,
     }, {
       model: this.Models.StudyField,
     }, {
       model: this.Models.User
     }, {
       model: this.Models.CouncilMeeting
     }]
   });
  }
  findOne(params) {
    return this.Models[this.modelname]
    .findOne({ 
      where: params,
      include :
      [{
        model: this.Models.Grader,
      }, {
       model: this.Models.ThesisProgress,
     }, {
       model: this.Models.StudyField,
     }, {
       model: this.Models.User
     }, {
       model: this.Models.CouncilMeeting
     }]
   });
  }
}

module.exports.class = Thesis;
module.exports = new Thesis();
