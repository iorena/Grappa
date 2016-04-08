"use strict";

var Imap = require('imap'),
    inspect = require('util').inspect;

class EmailReader {
  constructor() {
    this.imap = new Imap({
      user: 'ohtugrappa@gmail.com',
      password: 'grappa123',
      host: 'imap.gmail.com',
      port: 993,
      tls: true
    });
  }

  readInbox(box) {
    var imap = this.imap;
    var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS (FROM)','TEXT'] });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        if (info.which === 'TEXT')
          console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
        var buffer = '', count = 0;
        stream.on('data', function(chunk) {
          count += chunk.length;
          buffer += chunk.toString('utf8');
          if (info.which === 'TEXT')
            console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
            // console.log("indexOf failed permanently" + buffer.indexOf("failed permanently"));
            // console.log("indexOf @ " + buffer.indexOf("@"));
            if (buffer.indexOf("<") !== -1) {
              // console.log("typeof " + JSON.stringify(buffer));
              var user = buffer.substring(buffer.indexOf("<"), buffer.indexOf(">"));
              console.log("user " + user);
            }
        });
        stream.once('end', function() {
          if (info.which !== 'TEXT')
            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
          else
            console.log(prefix + 'Body [%s] Finished', inspect(info.which));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    })
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  }

  openImap() {
    console.log("opening imap");

    this.imap.once('error', function(err) {
      console.log(err);
    });

    this.imap.once('end', function() {
      console.log('Connection ended');
    });

    this.imap.connect();

    return new Promise((resolve, reject) => {
      this.imap.once("ready", () => {
        console.log("imap on ready!");
        resolve();
      })
      this.imap.once('error', (err) => {
        reject(err);
      });
    })
  }

  openInbox() {
    var imap = this.imap;
    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', true, (err, box) => {
        console.log("inbox on avattu " + box);
        if (err) {
          reject(err);
        } else {
          resolve(box);
        }
      })
    })
  }
}

module.exports.class = EmailReader;
module.exports = new EmailReader();
