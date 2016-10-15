"use strict";

const config = require("../config/email");
const nodemailer = require("nodemailer");

class EmailSender {
  constructor(options) {
    this.mailOptions = {
      from: options.from,
    };
    this.transporter = nodemailer.createTransport(options);
  }

  sendEmail(to, subject, body, attachments) {
    const options = Object.assign({
      to,
      subject,
      text: body,
      attachments: attachments ? attachments : [],
    }, this.mailOptions);

    return new Promise((resolve, reject) => {
      this.transporter
      .sendMail(options, (err, info) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(info);
        }
      });
    })
    .catch(err => {
      console.error("EmailSender sendEmail ERRORED:");
      console.error(err);
    });
  }
}

module.exports = new EmailSender(config.smtp());
