const config = require("../config/email");
const nodemailer = require("nodemailer");

/**
 * Service for sending email with nodemailer using gmail.
 *
 * Really only a wrapper around the nodemailer but important nonetheless for insulating
 * the actual call (since things could change and nodemailer might be switched etc).
 */
class EmailSender {
  constructor(options) {
    this.mailOptions = {
      from: options.from,
    };
    this.transporter = nodemailer.createTransport(options);
  }

  /**
   * Sends an email using node-mailer.
   *
   * Errors caused by node-mailer are also handled here which might cause trouble were node-mailer
   * or gmail somehow to fail. Still handling possible errors inside EmailReminder would be terribly
   * ugly so this is the current solution.
   * @param {String} to - Recipient's email address.
   * @param {String} subject - Title of the email.
   * @param {String} body - Body of the email.
   * @param {Array<Object>} attachments - List of attachments.
   * @return {Promise<Object>} Promise of the succesful delivery -object created by node-mailer.
   */
  sendEmail(to, subject, body, attachments) {
    // if you don't want to spam people/yourself use this
    if (process.env.NODE_ENV !== "production") {
      console.log("----------------");
      console.log(this.mailOptions);
      console.log(to);
      console.log(subject);
      console.log(body);
      console.log(attachments);
      console.log("----------------");
      return Promise.resolve();
    }

    const options = Object.assign({
      to,
      subject,
      text: body,
      attachments: attachments || [],
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
