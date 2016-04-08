const nodemailer = require("nodemailer");

module.exports.sendEmail = (req, res) => {
  const transporter = nodemailer
  .createTransport('smtps://ohtugrappa%40gmail.com:grappa123@smtp.gmail.com');

  // const smtpConfigGmail = {
  //   host: "smtp.gmail.com",
  // }

  const mailOptions = {
    from: '"Grappa Robotti" <nimi.sukunimi@cs.helsinki.fi>', // sender address
    // to: 'teemuxasdf.koivisto@helsinki.fi', // list of receivers
    to: 'teemu.koivisto@csasdf.helsinkiasdf.fi', // list of receivers
    subject: 'Koulusta', // Subject line
    text: 'asdfasdfasdfasdftext', // plaintext body
    html: 'Testi viesti.' // html body
  }

  transporter
  .sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent! ");
      console.log(info.response);
      res.json(info);
    }
  })
}
