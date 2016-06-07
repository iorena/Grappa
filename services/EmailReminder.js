"use strict";

const fs = require("fs");
const Sender = require("./EmailSender");
const User = require("../models/user");
const Thesis = require("../models/thesis");
const ThesisProgress = require("../models/thesisprogress");
const EmailStatus = require("../models/email_status");

class EmailReminder {
  constructor() {
    this.drafts = {
      toStudent: "",
      toProfessor: "",
      toPrintPerson: "",
    };
    this.readDrafts(this.drafts)
    .then(drafts => {
      // console.log(drafts)
      this.drafts = drafts;
    });
  }
  /*
   * Reads the drafts defined as keys inside @keys-object
   *
   * @param {Object} drafts - Object consisting of draft-names as keys
   * @return {Promise<Object>} New drafts-object with values read from the files
   */
  readDrafts(drafts) {
    const newDrafts = Object.assign({}, drafts);
    return Promise.all(Object.keys(drafts)
        .map(key =>
          this.readDraft(key)
          .then(draft => {
            newDrafts[key] = draft;
          })
        )
      )
      .then(() => newDrafts);
  }
  /*
   * Reads a single draft from email_drafts folder and returns its content
   *
   * @param {String} name - Name of the file
   * @return {Promise<String>} data - Read content from the file
   */
  readDraft(name) {
    return new Promise((resolve, reject) => {
      fs.readFile(`./email_drafts/${name}`, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  /**
   * Method for composing an automatic email-response
   *
   * @param {String} type - Name of the reminder
   * @param {String} to - Receiver email-address
   * @param {Object} thesis - lolwut?
   * @param {String} grappaLink - Link to the Grappa-app
   * @return {Object} email - New email object to be sent
   */
  composeEmail(type, to, thesis, grappaLink) {
    const email = {
      to,
      body: "",
      subject: "",
    };
    switch (type) {
      case "toStudent":
        email.subject = "REMINDER: Submit your thesis to eThesis";
        email.body += this.drafts[type];
        email.body += grappaLink;
        break;
      case "toPrintPerson":
        email.subject = "NOTE: Upcoming councilmeeting";
        email.body += this.drafts[type];
        email.body.replace("THESIS_AUTHOR", thesis.author);
        break;
      case "toProfessor":
        email.subject = "REMINDER: Submit your evaluation";
        email.body += this.drafts[type];
        email.body += grappaLink;
    }
    return email;
  }

  /**
   * Sends an email reminder to student about submitting their thesis to eThesis.com
   */
  sendStudentReminder(studentEmail, token, thesisId) {
    let foundThesis;
    let email;

    return Thesis
      .findOne({ id: thesisId })
      .then((thesis) => {
        foundThesis = thesis;
        email = this.composeEmail(
          "toStudent",
          studentEmail,
          null,
          `${process.env.APP_URL}/ethesis/${token}`
        );
        return Sender.sendEmail(email.to, email.subject, email.body);
      })
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "StudentReminder",
        to: email.to,
        deadline: foundThesis.deadline,
      }))
      .then(() => ThesisProgress.update({
        ethesisReminder: Date.now(),
      }, {
        thesisId: thesisId,
      }));
  }

  /**
   * Sends an email to print-person about thesis being ready to print for the councilmeeting
   */
  sendPrintPersonReminder(thesis) {
    let email;
    return User.findOne({ role: "print-person" })
      .then(printPerson => {
        email = this.composeEmail("toPrintPerson", printPerson.email, thesis, "");
        return Sender.sendEmail(email.to, email.subject, email.body);
      })
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "PrinterReminder",
        to: email.to,
        deadline: thesis.deadline,
      }));
  }

  /**
   * Sends an email reminder to the professor of thesises studyfield for reviewing
   */
  sendProfessorReminder(thesis) {
    let email;
    return User.findOne({ role: "professor", StudyFieldId: thesis.StudyFieldId })
      .then(professor => {
        if (professor !== null) {
          email = this.composeEmail(
            "toProfessor",
            professor.email,
            thesis,
            `${process.env.APP_URL}/thesis/${thesis.id}`
          );
          return Sender.sendEmail(email.to, email.subject, email.body);
        } else {
          console.log("no professor :(");
          throw new Error("No professor found!");
        }
      })
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "ProfessorReminder",
        to: email.to,
        deadline: thesis.deadline,
      }))
      .then(() => ThesisProgress.update({
        professorReminder: Date.now(),
      }, {
        thesisId: thesis.id,
      }))
      .catch(err => {
        // something useful here..
        console.log("ERROR ", err);
      });
  }
}

module.exports.class = EmailReminder;
module.exports = new EmailReminder();
