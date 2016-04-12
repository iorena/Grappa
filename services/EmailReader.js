"use strict";

const config = require("../config/email");
const Imap = require("imap");
const inspect = require("util").inspect;

class EmailReader {
  constructor(options) {
    this.imap = new Imap({
      user: options.user,
      password: options.password,
      host: options.imap,
      port: 993,
      tls: true,
    });
    // Parses only error messages received from this address
    this.daemonName = "mailer-daemon@googlemail.com";
  }

  checkIfErrorMessage(textbody) {

  }
  /*
   * Method for reading single message stream
   */
  readMessage(msg) {
    // reads two streams from msg body, content and header
    let chunks = [];
    return new Promise((resolve, reject) => {
      msg.on("body", (stream, info) => {
        if (info.which === "TEXT") {
          console.log("Body [%s] found, %d total bytes", inspect(info.which), info.size);
        }
        stream.on("data", (chunk) => {
          chunks.push(chunk.toString("utf8"));
        });
      });
      msg.once("attributes", function(attrs) {
        console.log("Attributes: %s", inspect(attrs, false, 8));
      });
      msg.once("end", function() {
        resolve(chunks.join("\n"));
      });
    })
  }

  /*
   * Fetches the messages from inbox and reads them as streams
   */
  readInbox(box) {
    let messages = [];
    const imap = this.imap;
    console.log("Messages total: " + box.messages.total);
    const f = imap.seq.fetch("2:3", {
      bodies: ["TEXT", "HEADER.FIELDS (ANSWERED)"],
    });

    return new Promise((resolve, reject) => {
      f.on("message", (msg, seqno) => {
        this.readMessage(msg).then(msg => {
          messages.push(msg);
          console.log("täällä viesti! " + msg.length);
          // console.log(msg);
          // console.log("\n\n\n");
        })
      })
      f.once("error", (err) => {
        console.log("Fetch error: " + err);
        imap.end();
        reject(err);
      });
      f.once("end", () => {
        console.log("Done fetching all messages!");
        imap.end();
        console.log("messages: " + messages.length);
        resolve(messages);
      });
    })
  }

  /*
   * Opens the connection to IMAP-server
   */
  openImap() {
    console.log("opening imap");

    return new Promise((resolve, reject) => {
      this.imap.once("end", function() {
        console.log("Connection ended");
      });
      this.imap.connect();
      this.imap.once("ready", () => {
        console.log("imap on ready!");
        resolve();
      })
      this.imap.once("error", (err) => {
        reject(err);
      });
    })
  }

  /*
   * Once connected to server opens the inbox
   */
  openInbox() {
    return new Promise((resolve, reject) => {
      this.imap.openBox("INBOX", true, (err, box) => {
        console.log("inbox on avattu " + box);
        if (err) {
          reject(err);
        } else {
          resolve(box);
        }
      })
    })
  }

  checkMessagesForErrors(messages) {
    messages.map(msg => {
      console.log("message");
      // console.log(msg);
      // if (msg.indexOf())
    })
  }

  checkEmail() {
    return this.openImap()
      .then(() => {
        return this.openInbox();
      })
      .then(box => {
        return this.readInbox(box);
      })
      .then(messages => {
        console.log("messages yo " + messages.length);
        this.checkMessagesForErrors(messages);
      })
  }
}

module.exports.class = EmailReader;
module.exports = new EmailReader(config);
