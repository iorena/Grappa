"use strict";

const fs = require("fs");
const Sender = require("./EmailSender");
const User = require("../models/user");
// const Thesis = require("../models/thesis");
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
      this.drafts = drafts;
    })
  }
  /*
   * Reads the drafts defined as keys inside @keys-object
   *
   * @param {Object} drafts - Object consisting of draft-names as keys
   * @return {Promise<Object>} New drafts-object with values read from the files
   */
  readDrafts(drafts) {
    let newDrafts = Object.assign({}, drafts);
    return Promise.all(Object.keys(drafts).map(key => {
      return this.readDraft(key)
        .then(draft => {
          newDrafts[key] = draft;
        })
    }))
    .then(() => {
      return newDrafts;
    })
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
    })
  }
  /*
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
        // Dynamically added content?
        break;
      case "toProfessor":
        email.subject = "REMINDER: Submit your evaluation";
        email.body += this.drafts[type];
        email.body += grappaLink;
    }
    return email;
  }

  /*
   *Method for handling the process of composing and sending an email to the student
   */
  sendStudentReminder(thesis) {
    const email = this.composeEmail("toStudent", thesis.email, thesis, `http://grappa-app.herokuapp.com/thesis/${thesis.id}`);
    return Sender.sendEmail(email.to, email.subject, email.body)
      .then(() => {
        console.log("saving status");
        return EmailStatus.saveOne({
          lastSent: Date.now(),
          type: "StudentReminder",
          to: email.to,
          whoAddedEmail: "ohtugrappa@gmail.com", // vai User
          deadline: new Date("1 1 2017"),
        });
      });
  }

  /*
   *Method for handling the process of composing and sending an email to the print-person
   */
  sendPrintPersonReminder(thesis) {
    let email;
    return User.findOne({ title: "print-person" })
      .then(printPerson => {
        email = this.composeEmail("toPrintPerson", printPerson.email, thesis, "");
        return Sender.sendEmail(email.to, email.subject, email.body);
      })
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "PrinterReminder",
        to: email.to,
        whoAddedEmail: "ohtugrappa@gmail.com", // vai User
        deadline: new Date("1 1 2017"),
      }));
  }

  /*
   *Method for handling the process of composing and sending an email to the professor
   */
  sendProfessorReminder(thesis) {
    // etsi proffa ja sen email
    // testi kovakoodaus >>
    const professorEmail = "ohtugrappa@gmail.com";
    const email = this.composeEmail("toProfessor", professorEmail, thesis, `http://grappa-app.herokuapp.com/thesis/${thesis.id}`);
    return Sender.sendEmail(email.to, email.subject, email.body)
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "ProfessorReminder",
        to: professorEmail,
        whoAddedEmail: "ohtugrappa@gmail.com", // vai User
        deadline: new Date("1 1 2017"),
      }));
  }
}

module.exports.class = EmailReminder;
module.exports = new EmailReminder();
