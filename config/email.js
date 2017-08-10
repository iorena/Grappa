/**
 * Config file for emailing options
 */

module.exports.imap = () => (
  {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: `imap.${process.env.EMAIL_HOST}`,
    port: 993,
    tls: true,
  }
);


module.exports.smtp = () => ({
    from: `Grappa Robot <noreply@${process.env.EMAIL_HOST}>`,
    host: `smtp.${process.env.EMAIL_HOST}`,
    port: 587, 
    secure: false, // false -> TLS, true -> SSL
  });
/*
module.exports.smtp = () => (
  {
    from: `Grappa Robot <'address'>`,
    host: `smtp.office365.com`,
    port: 587,
    secure: false, // false -> TLS, true -> SSL
    auth: {
      user: "'address'",
      pass: process.env.EMAIL_PASSWORD,
    },
  }
);
*/
