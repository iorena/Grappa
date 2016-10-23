"use strict";

const Sender = require("./EmailSender");
const TokenGen = require("../services/TokenGenerator");

const User = require("../models/User");
const Thesis = require("../models/Thesis");
const ThesisProgress = require("../models/ThesisProgress");
const ThesisReview = require("../models/ThesisReview");
const EmailStatus = require("../models/EmailStatus");
const EmailDraft = require("../models/EmailDraft");

const errors = require("../config/errors");

class EmailReminder {

  /**
   * Sends an email reminder to student about submitting their thesis to https://helda.helsinki.fi
   */
  sendEthesisReminder(thesis) {
    let foundDraft;
    let attachments;
    let savedReminder;

    const token = TokenGen.generateEthesisToken(thesis.author, thesis.id);

    return ThesisReview.findOne({ ThesisId: thesis.id})
      .then(review => {
        attachments = [{
          filename: "thesis-review.pdf",
          content: new Buffer(review.pdf, "base64"),
          contentType: "application/pdf",
        }];
        return EmailDraft.findOne({ type: "EthesisReminder" });
      })
      .then(reminder => {
        if (reminder) {
          foundDraft = reminder;
          const body = reminder.body.replace("$LINK$", `${process.env.APP_URL}/ethesis/${token}`);
          return Sender.sendEmail(thesis.authorEmail, reminder.title, body, attachments);
        } else {
          throw new errors.PremiseError("EthesisReminder not found from EmailDrafts");
        }
      })
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "EthesisReminder",
        to: thesis.authorEmail,
        deadline: thesis.deadline,
        EmailDraftId: foundDraft.id,
      }))
      .then(reminder => {
        savedReminder = reminder;
        return ThesisProgress.update({ EthesisEmailId: reminder.id }, { ThesisId: thesis.id });
      })
      .then(rows => {
        return savedReminder;
      });
  }

  /**
   * Sends an email to print-person about thesis being ready to print for the councilmeeting
   */
  sendPrintPersonReminder(thesis) {
    let email;
    let sentReminder;
    return User.findOne({ role: "print-person", isActive: true, isRetired: false })
      .then(printPerson => {
        if (printPerson) {
          email = this.composeEmail("toPrintPerson", printPerson.email, thesis, "");
          return Sender.sendEmail(email.to, email.subject, email.body);
        } else {
          throw new errors.PremiseError("No print-person found.");
        }
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
    let savedReminder;

    return User.findOne({ role: "professor", StudyFieldId: thesis.StudyFieldId, isActive: true, isRetired: false })
      .then(professor => {
        if (professor) {
          foundProfessor = professor;
          return EmailDraft.findOne({ type: "GraderEvalReminder" });
        } else {
          throw new errors.PremiseError("StudyField had no professor to whom send grader evaluation reminder.");
        }
      })
      .then(reminder => {
        if (reminder) {
          foundDraft = reminder;
          const body = reminder.body.replace("$LINK$", `${process.env.APP_URL}/thesis/${thesis.id}`);
          return Sender.sendEmail(foundProfessor.email, reminder.title, body);
        } else {
          throw new errors.PremiseError("GraderEvalReminder not found from EmailDrafts");
        }
      })
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: "GraderEvalReminder",
        to: foundProfessor.email,
        deadline: thesis.deadline,
        EmailDraftId: foundDraft.id,
      }))
      .then(reminder => {
        savedReminder = reminder;
        return ThesisProgress.update({ GraderEvalEmailId: reminder.id }, { ThesisId: thesis.id });
      })
      .then(rows => {
        return savedReminder;
      });
  }

  sendResetPasswordMail(user) {
    const token = TokenGen.generateResetPasswordToken(user);

    return EmailDraft.findOne({ type: "ResetPassword" })
      .then(reminder => {
        if (reminder) {
          const body = reminder.body.replace("$LINK$", `${process.env.APP_URL}/reset-password/${token}`);
          return Sender.sendEmail(user.email, reminder.title, body);
        } else {
          throw new errors.PremiseError("ResetPassword not found from EmailDrafts");
        }
      })
  }

  sendNewPasswordMail(user, password) {
    return EmailDraft.findOne({ type: "NewPassword" })
      .then(reminder => {
        if (reminder) {
          const body = reminder.body.replace("$LINK$", `${process.env.APP_URL}/reset-password/${token}`);
          return Sender.sendEmail(user.email, reminder.title, body);
        } else {
          throw new errors.PremiseError("NewPassword not found from EmailDrafts");
        }
      })
  }
}

module.exports = new EmailReminder();
