"use strict";

const config = require("../config/email");
const Imap = require("imap");
const inspect = require("util").inspect;

const EmailStatus = require("../models/EmailStatus");

/**
 * Unused service that was planned to be used for checking emails for errors.
 * Due to other, more important priorities, was obsoleted and abandoned.
 * Why is it still here? Well I spent a couple whole days coding it so...
 * I have still some sentimentality left for it ;D.
 * And it could still be useful in the far future.
 */

class EmailReader {
  constructor(options) {
    this.imap = new Imap(options);
    // Parses only error messages received from this address
    this.daemonName = "mailer-daemon@googlemail.com";
  }

  /**
   * Method for reading single message stream
   */
  readMessage(msg) {
    // reads two streams from msg body, content and header
    const chunks = [];
    return new Promise((resolve, reject) => {
      msg.on("body", (stream, info) => {
        if (info.which === "TEXT") {
          console.log("Body [%s] found, %d total bytes", inspect(info.which), info.size);
        }
        stream.on("data", (chunk) => {
          chunks.push(chunk.toString("utf8"));
        });
      });
      msg.once("attributes", (attrs) => {
        console.log("Attributes: %s", inspect(attrs, false, 8));
      });
      msg.once("end", () => {
        resolve(chunks.join("\n"));
      });
    });
  }

  /**
   * Fetches the messages from inbox and reads them as streams
   */
  readInbox(box) {
    const messages = [];
    const imap = this.imap;
    console.log("Messages total: " + box.messages.total);
    const f = imap.seq.fetch("2:3", {
      bodies: ["TEXT", "HEADER.FIELDS (FROM)"],
    });

    return new Promise((resolve, reject) => {
      f.on("message", (msg, seqno) => {
        this.readMessage(msg).then(msg => {
          messages.push(msg);
          console.log("täällä viesti! " + msg.length);
          // console.log(msg);
          // console.log("\n\n\n");
        });
      });
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
    });
  }

  /**
   * Opens the connection to IMAP-server
   */
  openImap() {
    console.log("opening imap");

    return new Promise((resolve, reject) => {
      this.imap.once("end", () => {
        console.log("Connection ended");
      });
      this.imap.connect();
      this.imap.once("ready", () => {
        console.log("imap on ready!");
        resolve();
      });
      this.imap.once("error", (err) => {
        reject(err);
      });
    });
  }

  /**
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
      });
    });
  }

  /*
   * Method for checking emails for erronous content
   *
   * Checks if email's content contains any strings
   * that incline that it is error message caused by non-existent
   * receiver email-address. Parses then the receiver email
   * and returns them as a list.
   */
  checkMessagesForErrors(messages) {
    return messages.map(msg => {
      console.log(msg);
      if (msg.indexOf("Delivery to the following recipient failed permanently") !== -1
          && msg.indexOf(this.daemonName) !== -1) {
        console.log("> failed permanently");
        console.log("> contains daemon name");
        let index = msg.indexOf("To: ") + 4;
        let counter = 0;
        let address = "";
        let next = msg.charAt(index);
        while (next !== "\n" && counter !== 300) {
          address += next;
          index++;
          next = msg.charAt(index);
          counter++;
        }
        console.log("address on:" + address);
        return address;
      }
    });
  }

  checkEmail() {
    let addresses = [];
    return this.openImap()
      .then(() => {
        return this.openInbox();
      })
      .then(box => {
        return this.readInbox(box);
      })
      .then(messages => {
        console.log("messages yo " + messages.length);
        addresses = this.checkMessagesForErrors(messages);
        console.log(addresses);
        return Promise.all(addresses.map(address => {
          EmailStatus.update({ wasError: true }, { to: address });
        }));
      })
      .then(updatedEmails => {
        console.log("lol " + updatedEmails);
      })
      .catch(err => {
        console.log("EmailReader checkEmail() errored!");
        console.log(err);
      });
  }
}

module.exports = new EmailReader(config.imap());
