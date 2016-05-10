/*
 * Temporarily hard-coded config file for emailing options
 */

module.exports.imap = {
  user: process.env.EMAIL_USER || "ohtugrappa",
  password: process.env.EMAIL_PASSWORD || "grappa123",
  host: `imap.${process.env.EMAIL_HOST}` || "imap.gmail.com",
  port: 993,
  tls: true,
};

// module.exports.imap = {
//   user: "cs-tunnus",
//   password: "cs-salasana",
//   host: "mail.cs.helsinki.fi",
//   port: 993,
//   tls: true,
// }

module.exports.smtp = {
  from: "Grappa Robotti <nimi.sukunimi@cs.helsinki.fi>",
  host: `smpt.${process.env.EMAIL_HOST}` || "smpt.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER || "ohtugrappa",
    pass: process.env.EMAIL_PASSWORD || "grappa123",
  },
};

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
