const moment = require("moment");

const Sender = require("./EmailSender");
const TokenGen = require("../services/TokenGenerator");

const User = require("../models/User");
const Thesis = require("../models/Thesis");
const ThesisProgress = require("../models/ThesisProgress");
const ThesisReview = require("../models/ThesisReview");
const EmailStatus = require("../models/EmailStatus");
const EmailDraft = require("../models/EmailDraft");

const errors = require("../config/errors");

/**
 * Service used for composing emails from predefined drafts with some hard-coded properties.
 *
 * Every sent email is somewhat unique and this service has a method for them all after which
 * it uses either sendMail or sendReminder to actually send the email. Saves all emails to
 * EmailStatus table for admins to admire.
 * Reminder is a bad name for it since it does also emails for lost passwords
 * and sends all email.
 */
class EmailReminder {

  /**
   * Sends an email using EmailSender service and stores it to EmailStatus-table.
   * @param {String} toEmail - Recipient's email address.
   * @param {Object} emailDraft - EmailDraft object fetched from the DB.
   * @param {Object} customBody - Contains the title, body and xx of the email.
   * @param {Array<Stuff>} attachments - List of stufff. TODO
   * @return {Promise<Object>} Promise of the saved EmailStatus.
   */
  sendMail(toEmail, emailDraft, customBody, attachments) {
    let savedEmail;
    return Sender.sendEmail(toEmail, emailDraft.title, customBody, attachments)
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: emailDraft.type,
        to: toEmail,
        EmailDraftId: emailDraft.id,
        ThesisId: null
      }))
  }

  /**
   * Sends an email using EmailSender service and updates it to ThesisProgress.
   * @param {String} toEmail - Recipient's email address.
   * @param {Object} emailDraft - EmailDraft object fetched from DB.
   * @param {Object} thesis - Thesis object fetched from DB. ???
   * @param {Object} customBody - TODO
   * @param {Array<Object>} attachments - TODO
   * @return {Promise<Object>} Promise of the saved EmailStatus.
   */
  sendReminder(toEmail, emailDraft, thesis, customBody, attachments) {
    let savedEmail;
    return Sender.sendEmail(toEmail, emailDraft.title, customBody, attachments)
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: emailDraft.type,
        to: toEmail,
        EmailDraftId: emailDraft.id,
        ThesisId: thesis.id
      }))
      .then(email => {
        savedEmail = email;
        const update = {};
        update[`${emailDraft.type}Id`] = email.id;
        return ThesisProgress.update(update, { ThesisId: thesis.id });
      })
      .then(rows => savedEmail);
  }

  /**
   * Sends an email reminder to student about submitting their thesis to https://helda.helsinki.fi
   */
  sendEthesisReminder(thesis, councilmeeting) {
    let attachments;
    const token = TokenGen.generateEthesisToken(thesis);

    return ThesisReview.findOne({ ThesisId: thesis.id})
      .then(review => {
        attachments = [{
          filename: "thesis-review.pdf",
          content: new Buffer(review.pdf, "base64"),
          contentType: "application/pdf",
        }];
        return EmailDraft.findOne({ type: "EthesisReminder" });
      })
      .then(draft => {
        if (draft) {
          let body = draft.body.replace("$LINK$", `${process.env.APP_URL}/ethesis/${token}`);
          body = body.replace("$DATE$", moment(councilmeeting.date).format("DD/MM/YYYY"));
          body = body.replace("$STUDENTDEADLINE$", moment(councilmeeting.studentDeadline).format("HH:mm DD/MM/YYYY"));
          return this.sendReminder(thesis.authorEmail, draft, thesis, body, attachments);
        } else {
          throw new errors.PremiseError("EthesisReminder not found from EmailDrafts");
        }
      })
  }

  /**
   * Sends an email to print-person about thesis being ready to print for the councilmeeting
   */
  sendPrintPersonReminder(thesis) {
    let foundPrintPersons;

    return User.findAll({ role: "print-person", isActive: true, isRetired: false })
      .then(printPersons => {
        if (printPersons.length > 0) {
          foundPrintPersons = printPersons;
          return EmailDraft.findOne({ type: "PrintReminder" });
        } else {
          throw new errors.PremiseError("No print-persons found.");
        }
      })
      .then(draft => {
        if (draft) {
          return Promise.all(foundPrintPersons.map(printPerson =>
            this.sendReminder(printPerson.email, draft, thesis, draft.body, undefined)
          ))
        } else {
          throw new errors.PremiseError("PrintReminder not found from EmailDrafts");
        }
      })
  }

  /**
   * Sends an email reminder to the professor about thesis studyfield for reviewing
   */
  sendProfessorReminder(thesis) {
    let foundProfessor;

    return User.findOne({ role: "professor", StudyFieldId: thesis.StudyFieldId, isActive: true, isRetired: false })
      .then(professor => {
        if (professor) {
          foundProfessor = professor;
          return EmailDraft.findOne({ type: "GraderEvalReminder" });
        } else {
          throw new errors.PremiseError("StudyField had no professor to whom send grader evaluation reminder.");
        }
      })
      .then(draft => {
        if (draft) {
          const body = draft.body.replace("$LINK$", `${process.env.APP_URL}/thesis/${thesis.id}`);
          return this.sendReminder(foundProfessor.email, draft, thesis, body, undefined);
        } else {
          throw new errors.PremiseError("GraderEvalReminder not found from EmailDrafts");
        }
      })
  }

  sendStudentNotification(thesis) {
    console.log("in emailReminder");
    throw new errors.PremiseError("Not yet implemented");
  }

  sendResetPasswordMail(user) {
    const token = TokenGen.generateResetPasswordToken(user);

    return EmailDraft.findOne({ type: "ResetPassword" })
      .then(draft => {
        if (draft) {
          const body = draft.body.replace("$LINK$", `${process.env.APP_URL}/reset-password/${token}`);
          return this.sendMail(user.email, draft, body, undefined);
        } else {
          throw new errors.PremiseError("ResetPassword not found from EmailDrafts");
        }
      })
  }

  sendNewPasswordMail(user, password) {
    return EmailDraft.findOne({ type: "NewPassword" })
      .then(draft => {
        if (draft) {
          const body = draft.body.replace("$NEWPASSWORD$", `${password}`);
          return this.sendMail(user.email, draft, body, undefined);
        } else {
          throw new errors.PremiseError("NewPassword not found from EmailDrafts");
        }
      })
  }
}

module.exports = new EmailReminder();
