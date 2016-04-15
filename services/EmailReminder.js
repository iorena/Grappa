"use strict";

const Sender = require("./EmailSender");
const User = require("../models/user");
// const Thesis = require("../models/thesis");
const EmailStatus = require("../models/email_status");

class EmailReminder {
  /*
   *Method for compose the specific email
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
        email.body += "Hi\n\nThis is a automatic Email reminder from Grappa, a web application to help in managing the bureaucratic side of the processes related to the final stages of a students Masters degree.\n\nPlease go to submit your thesis into E-THESIS (https://ethesis.helsinki.fi/). After adding your thesis into the system, please copy the e-thesis link and enter it into the supplied field in the following link.\n\n";
        email.body += "${grappaLink}\n";
        break;
      case "toPrinter":
        email.subject = "NOTE: Upcoming councilmeeting";
        email.body += "Hi\n\nThis is a automatic Email reminder from Grappa, a web application to help in managing the bureaucratic side of the processes related to the final stages of a students Masters degree.\n\nPlease print the documents that are attached to this e-mail for the council meeting on (thesis.deadline + 10).\n\n";
        // Dynamically added content?
        break;
      case "toProfessor":
        email.subject = "REMINDER: Submit your evaluation";
        email.body += "Hi\n\nThis is a automatic Email reminder from Grappa, a web application to help in managing the bureaucratic side of the processes related to the final stages of a students Masters degree.\n\nDue to rules of the process, an evaluation is needed for the reviewers for the process to continue. Please submit your evaluation into the provided link.\n\n";
        email.body += "${grappaLink}\n";
    }
    return email;
  }

  /*
   *Method for handling the process of composing and sending an email to the student
   */
  sendStudentReminder(thesis) {
    const email = this.composeEmail("toStudent", thesis.email, thesis, "http://grappa-app.herokuapp.com/thesis/${thesis.id}");
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
  sendPrinterReminder(thesis) {
    let email;
    return User.findOne({ title: "print-person" })
      .then(printPerson => {
        email = this.composeEmail("toPrinter", printPerson.email, thesis, "");
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
    const email = this.composeEmail("toProfessor", professorEmail, thesis, "http://grappa-app.herokuapp.com/thesis/${thesis.id}");
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
