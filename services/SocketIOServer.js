"use strict";

const express = require("express");
const app = express();
const server = app.listen(8008);

const ws = require("ws")
const io = require("socket.io");

const ioJwt = require("socketio-jwt");

const TokenGenerator = require("./TokenGenerator");

class WebSocketServer {

  constructor() {
    this.server = undefined;
    this.rooms = [];
  }

  start() {
//     var ws = new WebSocketServer({
//     verifyClient: function (info, cb) {
//         var token = info.req.headers.token
//         if (!token)
//             cb(false, 401, 'Unauthorized')
//         else {
//             jwt.verify(token, 'secret-key', function (err, decoded) {
//                 if (err) {
//                     cb(false, 401, 'Unauthorized')
//                 } else {
//                     info.req.user = decoded //[1]
//                     cb(true)
//                 }
//             })

//         }
//     }
// })


  this.server = io(server);
  const self = this;
  this.server.sockets
    .on('connection', ioJwt.authorize({
      // check if correct audience?? 
      secret: process.env.TOKEN_SECRET,
      timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', function(socket) {
      //this socket is authenticated, we are good to handle more events from it.
      console.log('hello! ' + socket.decoded_token.name);
      const role = socket.decoded_token.user.role;
      if (role === "admin" || role === "print-person") {
        socket.join(role)
        self.rooms.push(role);
      } else if (role === "professor") {
        socket.join(`professor/studyfield`);
        // this.rooms.push();
      } else if (role === "instructor") {
        socket.join(`instructor/${socket.decoded_token.user.id}`);
        // this.rooms.push();
      }
    });

  this.server.on('connection', function(socket){ 
    const self = this;
    setTimeout(() => {
      console.log("timeout fired!")
      self.server.emit('an event', { some: 'data' });
    }, 2000)
    console.log('Connection to client established');

    // Success!  Now listen to messages to be received
    socket.on('message',function(event){ 
        console.log('Received message from client!',event);
    });

    socket.on('disconnect',function(){
        console.log('Client has disconnected');
    });
  });

    // this.server = new ws.Server({
    //   port: 8008,
    //   verifyClient: (info, cb) => {
    //     const hasQueryParams = info.req.url.substring(0, 10) === "/ws?token=";
    //     // if (!hasQueryParams) cb(false, 401, "Unauthorized")
    //     const token = info.req.url.substring(10, info.req.url.length);
    //     // if (TokenGenerator.verify(token)) {

    //     // }
    //     console.log(token) 
    //     if (token) {
    //       console.log("jee token");
    //       cb(true)
    //     } else {
    //       console.log("wää no token");
    //       cb(false);
    //     }
    //   }
    // });

    // this.server.on('connection', function connection(ws) {
    //   ws.on('message', function incoming(message) {
    //     console.log('received: %s', message);
    //   });

    //   ws.send('something');
    // });
  }

  stop() {
    this.server.close(() => {
      console.log("websocket server closed")
    });
  }

  /**
   * Broadcasts recent changes to all users involved in the namespaces
   * namespaces can be one of the following: ["all", "admin", "print-person", "professor", "user"]
   * update is structured as such:
   * {
   *   add: {
   *    Thesis: [ array of thesis objects ]
   *    ThesisProgress: [ array of thesisProgress objects ]
   *   },
   *   update: {
   *     CouncilMeeting: [ array of CouncilMeeting objects ]
   *   }
   * }
   * @param {Array} namespaces - list of namespaces to be notified of changes
   * @param {Object} updates - object of types of updates with the required data
   */
  broadcast(notifiedRooms, updates) {
    console.log("yo broadcasting")
    if (notifiedRooms.indexOf("all") !== -1) {
      this.server.emit(updates);
    } else {
      notifiedRooms.map(room => {
        if (this.state.rooms.indexOf(room) !== -1) {
          this.server.in(room).emit(updates);
        }
      })
    }
  }
}

module.exports = new WebSocketServer();
module.exports.class = WebSocketServer;
