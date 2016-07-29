"use strict";

const Sender = require("./EmailSender");

const User = require("../models/User");
const Thesis = require("../models/Thesis");
const ThesisProgress = require("../models/ThesisProgress");
const EmailStatus = require("../models/EmailStatus");
const EmailDraft = require("../models/EmailDraft");

const PremiseError = require("../config/errors").PremiseError;

class EmailReminder {

  /**
   * Sends an email reminder to student about submitting their thesis to https://helda.helsinki.fi
   */
  sendEthesisReminder(thesis, token) {
    let foundDraft;

    return EmailDraft
      .findOne({ type: "EthesisReminder" })
      .then(reminder => {
        if (reminder) {
          foundDraft = reminder;
          const body = reminder.body.replace("$LINK$", `${process.env.APP_URL}/ethesis/${token}`);
          return Sender.sendEmail(thesis.authorEmail, reminder.title, body);
        } else {
          throw new PremiseError("EthesisReminder not found from EmailDrafts");
        }
      })
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "EthesisReminder",
        to: thesis.authorEmail,
        deadline: thesis.deadline,
        EmailDraftId: foundDraft.id,
      }))
      .then(reminder => ThesisProgress.update({ EthesisEmailId: reminder.id }, { ThesisId: thesis.id }));
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
    let foundDraft;
    let foundProfessor;

    return User.findOne({ role: "professor", StudyFieldId: thesis.StudyFieldId })
      .then(professor => {
        if (professor) {
          foundProfessor = professor;
          return EmailDraft.findOne({ type: "GraderEvalReminder" });
        } else {
          throw new PremiseError("StudyField had no professor to whom send grader evaluation");
        }
      })
      .then(reminder => {
        if (reminder) {
          foundDraft = reminder;
          const body = reminder.body.replace("$LINK$", `${process.env.APP_URL}/thesis/${thesis.id}`);
          return Sender.sendEmail(foundProfessor.email, reminder.title, body);
        } else {
          throw new PremiseError("GraderEvalReminder not found from EmailDrafts");
        }
      })
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "GraderEvalReminder",
        to: foundProfessor.email,
        deadline: thesis.deadline,
        EmailDraftId: foundDraft.id,
      }))
      .then(reminder => ThesisProgress.update({ GraderEvalEmailId: reminder.id }, { ThesisId: thesis.id }));
  }
}

module.exports = new EmailReminder();
