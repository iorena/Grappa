"use strict";

const Sender = require("./EmailSender");
const User = require("../models/user");
const Thesis = require("../models/thesis");

class EmailReminder {
  constructor() {}

  composeEmail(type, to, thesis, grappaLink) {
    let email = {
      to,
      body: "",
      subject: "",
    }
    switch(type) {
      case "toStudent":
        email.subject = "REMINDER: Submit your thesis to eThesis";
        email.body += "Hi\n\nThis is a automatic Email reminder from Grappa, a web application to help in managing the bureaucratic side of the processes related to the final stages of a students Masters degree.\n\nPlease go to submit your thesis into E-THESIS (https://ethesis.helsinki.fi/). After adding your thesis into the system, please copy the e-thesis link and enter it into the supplied field in the following link.\n\n";
        email.body += grappaLink + "\n";
        break;
      case "toPrinter":
        email.subject = "NOTE: Upcoming councilmeeting";
        email.body += "Hi\n\nThis is a automatic Email reminder from Grappa, a web application to help in managing the bureaucratic side of the processes related to the final stages of a students Masters degree.\n\nPlease print the documents that are attached to this e-mail for the council meeting on (thesis.deadline + 10).\n\n";
        //Dynamically added content?
        break;
      case "toProfessor":
        email.subject = "REMINDER: Submit your evaluation";
        email.body += "Hi\n\nThis is a automatic Email reminder from Grappa, a web application to help in managing the bureaucratic side of the processes related to the final stages of a students Masters degree.\n\nDue to rules of the process, an evaluation is needed for the reviewers for the process to continue. Please submit your evaluation into the provided link.\n\n";
        email.body += grappaLink + "\n";
    }
    return email;
  }

  sendStudentReminder(thesis) {
    const email= this.composeEmail("toStudent", thesis.email, thesis, "http://grappa-app.herokuapp.com/thesis/" + thesis.id);
    Sender.sendEmail(email.to, email.subject, email.body);
  }

  sendPrinterReminder(thesis){
    User.findOne({ title: "print-person" })
    .then(printPerson => {
      const email= this.composeEmail("toPrinter", printPerson.email, thesis, "");
      Sender.sendEmail(email.to, email.subject, email.body);
    })
  }

  sendProfessorReminder(thesis){
    // etsi proffa ja sen email
    // testi kovakoodaus >>
    const professorEmail = "ohtugrappa@gmail.com";
    const email= this.composeEmail("toProfessor", professorEmail, thesis, "http://grappa-app.herokuapp.com/thesis/" + thesis.id);
    Sender.sendEmail(email.to, email.subject, email.body);
  }
}

module.exports.class = EmailReminder;
module.exports = new EmailReminder();
