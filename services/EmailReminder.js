"use strict";

const fs = require("fs");
const Sender = require("./EmailSender");

const User = require("../models/User");
const Thesis = require("../models/Thesis");
const ThesisProgress = require("../models/ThesisProgress");
const EmailStatus = require("../models/EmailStatus");
const EmailDraft = require("../models/EmailDraft");

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
    let foundDraft;
    let foundThesis;
    let sentReminder;
    let email;

    return EmailDraft
      .findOne({ type: "EthesisReminder" })
      .then(reminder => {
        if (reminder) {
          foundDraft = reminder;
          return Thesis.findOne({ id: thesisId });
        } else {
          throw new TypeError("No EthesisReminder found");
        }
      })
      .then((thesis) => {
        if (thesis) {
          foundThesis = thesis;
          email = this.composeEmail(
            "toStudent",
            studentEmail,
            null,
            `${process.env.APP_URL}/ethesis/${token}`
          );
          return Sender.sendEmail(foundDraft.to, foundDraft.subject, foundDraft.body);
        } else {
          throw new TypeError("No Thesis found");
        }
      })
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "StudentReminder",
        to: email.to,
        deadline: foundThesis.deadline,
      }))
      .then(reminder => ThesisProgress.linkEthesisEmail(thesisId, reminder.id));
      // .then((reminder) => {
      //   sentReminder = reminder;
      //   return ThesisProgress.getModel().findOne({ where: { ThesisId: thesisId } });
      // })
      // .then((TProgress) => {
      //   return TProgress.setEthesisEmail(sentReminder);
      // });
  }

  /**
   * Sends an email to print-person about thesis being ready to print for the councilmeeting
   */
  sendPrintPersonReminder(thesis) {
    let email;
    let sentReminder;
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
      }))
      .then((reminder) => {
        sentReminder = reminder;
        return ThesisProgress.getModel().findOne({ where: { ThesisId: thesis.id } });
      })
      .then((TProgress) => {
        return TProgress.setPrintEmail(sentReminder);
      });
  }

  /**
   * Sends an email reminder to the professor of thesises studyfield for reviewing
   */
  sendProfessorReminder(thesis) {
    let email;
    let sentReminder;
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
      .then((reminder) => {
        sentReminder = reminder;
        return ThesisProgress.getModel().findOne({ where: { ThesisId: thesis.id } });
      })
      .then((TProgress) => {
        return TProgress.setGraderEvalEmail(sentReminder);
      })
      .catch(err => {
        // something useful here..
        console.log("ERROR ", err);
      });
  }
}

module.exports = new EmailReminder();
