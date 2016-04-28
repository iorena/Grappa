/*
 * Temporarily hard-coded config file for emailing options
 */

module.exports.imap = {
  user: "ohtugrappa",
  password: "grappa123",
  host: "imap.gmail.com",
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
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "ohtugrappa@gmail.com",
    pass: "grappa123"
  }
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
