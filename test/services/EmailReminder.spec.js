"use strict";

const request = require("request");
const expect = require("chai").expect;
const Sinon = require("sinon");

const thesis = require("../mock/database").thesis;

const Reminder = require("../../services/EmailReminder");
const Sender = require("../../services/EmailSender");

const Thesis = require("../../models/Thesis");
const User = require("../../models/User");
const EmailStatus = require("../../models/EmailStatus");
const ThesisProgress = require("../../models/ThesisProgress");

let calledParams = {};

xdescribe("EmailReminder", () => {
  before(() => {
    Sinon.stub(Sender, "sendEmail", (to, subject, body) => {
      calledParams = {
        to,
        subject,
        body,
      };
      return Promise.resolve(calledParams);
    });
    Sinon.stub(EmailStatus, "saveOne", function (params) {
      return Promise.resolve(params);
    });

    Sinon.stub(Thesis, "findOne", () => {
      return Promise.resolve(thesis);
    });

    Sinon.stub(ThesisProgress, "update", () => {
      return Promise.resolve();
    });
  });

  after(() => {
    Sender.sendEmail.restore();
    EmailStatus.saveOne.restore();
    Thesis.findOne.restore();
    ThesisProgress.update.restore();
  });

  describe("sendStudentReminder(thesis)", () => {
    it("should call sendEmail with correct values", (done) => {
      const email = "pertti@perttinen.fi";
      Reminder.sendStudentReminder(email, "ASDF123", 0)
      .then(status => {
        expect(calledParams.to).to.equal(email);
        expect(calledParams.subject).to.equal("REMINDER: Submit your thesis to eThesis");
        done();
      });
    });
  });

  describe("sendPrintPersonReminder(thesis)", () => {
    it("should call sendEmail with correct values", (done) => {
      Sinon.stub(User, "findOne", (params) => {
        if (typeof params.role !== "undefined" && params.role === "print-person") {
          return Promise.resolve({
            id: 2,
            name: "B Virtanen",
            title: "print-person",
            email: "printperson@gmail.com",
            admin: true,
          });
        } else {
          return Promise.resolve(null);
        }
      });
      Reminder.sendPrintPersonReminder(thesis)
      .then(status => {
        expect(calledParams.to).to.equal("printperson@gmail.com");
        expect(calledParams.subject).to.equal("NOTE: Upcoming councilmeeting");
        User.findOne.restore();
        done();
      });
    });
  });

  describe("sendProfessorReminder(thesis)", () => {
    it("should call sendEmail with correct values", (done) => {
      Sinon.stub(User, "findOne", (params) => {
        if (typeof params.role !== "undefined" && params.role === "professor") {
          return Promise.resolve({
            id: 2,
            name: "B Virtanen",
            title: "professor",
            email: "professor@gmail.com",
            admin: true,
          });
        } else {
          return Promise.resolve(null);
        }
      });
      Reminder.sendProfessorReminder(thesis)
      .then(status => {
        expect(calledParams.to).to.equal("professor@gmail.com");
        expect(calledParams.subject).to.equal("REMINDER: Submit your evaluation");
        done();
      });
    });
  });
});
