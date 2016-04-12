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
    this.thing = "";
  }

  checkIfErrorMessage(textbody) {

  }
  /*
   * Method for reading single message stream
   */
  readMessage(msg, seqno) {
    const prefix = "(#" + seqno + ") ";
    // reads two streams from msg body, content and header
    let chunks = [], messagebody = "";
    msg.on("body", (stream, info) => {
      if (info.which === "TEXT") {
        console.log(prefix + "Body [%s] found, %d total bytes", inspect(info.which), info.size);
      }
      let buffer = "", count = 0;
      stream.on("data", (chunk) => {
        buffer += chunk.toString("utf8");
        messagebody += buffer;
        chunks.push(chunk.toString("utf8"));
        console.log("chunks " + chunks.length);
        // console.log("buffer: " + buffer);
      });
      console.log("buffer: " + buffer);
      stream.once("end", () => {
        if (info.which !== "TEXT") {
          // const header = inspect(Imap.parseHeader(buffer));
          // console.log(prefix + "Parsed header: " + header);
          console.log("buffer: " + buffer);
          console.log("buffer size " + buffer.length);
          console.log("chunks " + chunks.length);
          console.log("body -----");
          console.log(messagebody);
          console.log("-----------");

          // if (buffer.indexOf("<") !== -1) {
          //   var user = buffer.substring(buffer.indexOf("<"), buffer.indexOf(">"));
          //   console.log("user " + user);
          // }
        } else {
          console.log(prefix + "Body [%s] Finished", inspect(info.which));
        }
      });
    });
    msg.once("attributes", function(attrs) {
      console.log(prefix + "Attributes: %s", inspect(attrs, false, 8));
    });
    msg.once("end", function() {
      console.log(prefix + "Finished");
    });
  }

  /*
   * Fetches the messages from inbox and reads them as streams
   */
  readInbox(box) {
    let result = { yo: "asdf" };
    const imap = this.imap;
    console.log("Messages total: " + box.messages.total);
    const f = imap.seq.fetch(box.messages.total-1 + ":*", { bodies: ["HEADER.FIELDS (FROM)","TEXT"] });

    return new Promise((resolve, reject) => {
      f.on("message", (msg, seqno) => {
        const msgresult = this.readMessage(msg, seqno);
      })
      f.once("error", (err) => {
        console.log("Fetch error: " + err);
        imap.end();
        reject(err);
      });
      f.once("end", () => {
        console.log("Done fetching all messages!");
        imap.end();
        resolve(result);
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

  checkEmail() {
    return this.openImap()
      .then(() => {
        return this.openInbox();
      })
      .then(box => {
        return this.readInbox(box);
      })
  }
}

module.exports.class = EmailReader;
module.exports = new EmailReader(config);
