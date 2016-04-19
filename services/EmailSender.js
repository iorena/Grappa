"use strict";

const config = require("../config/email");
const nodemailer = require("nodemailer");

// const EmailStatus = require("../models/email_status");

class EmailSender {
  constructor(options) {
    this.mailOptions = {
      from: options.from,
    };
    this.transporter = nodemailer.createTransport(options.smpt);
  }

  sendEmail(to, subject, body) {
    const options = Object.assign({
      to,
      subject,
      text: body,
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
    });
  }
}

module.exports.class = EmailSender;
module.exports = new EmailSender(config);
