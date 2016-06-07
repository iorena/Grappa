/*
 * Temporarily hard-coded config file for emailing options
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

// module.exports.imap = {
//   user: "cs-tunnus",
//   password: "cs-salasana",
//   host: "mail.cs.helsinki.fi",
//   port: 993,
//   tls: true,
// }

module.exports.smtp = () => (
  {
    from: "Grappa Robotti <nimi.sukunimi@cs.helsinki.fi>",
    host: `smtp.${process.env.EMAIL_HOST}`,
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  }
);

// module.exports.smtp = {
//   from: "Grappa Robotti <nimi.sukunimi@cs.helsinki.fi>",
//   host: "mail.cs.helsinki.fi",
//   port: 465,
//   secure: true, // use SSL
//   auth: {
//     user: "cs-tunnus",
//     pass: "cs-salasana"
//   }
// };
