"use strict";

const express = require("express");
const app = express();
const server = app.listen(8008);

const io = require("socket.io");
const ioJwt = require("socketio-jwt");

const TokenGenerator = require("./TokenGenerator");

class WebSocketServer {

  constructor() {
    this.server = undefined;
    this.rooms = [];
  }

  start() {
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
        const user = socket.decoded_token.user;
        if (user.role === "admin" || user.role === "print-person") {
          console.log("hei admin")
          socket.join(user.role)
          self.rooms.push(user.role);
        } else if (user.role === "professor" && user.StudyFieldId) {
          socket.join(`professor/${user.StudyFieldId}`);
          this.rooms.push(`professor/${user.StudyFieldId}`);
        } else {
          socket.join(`instructor/${user.id}`);
          this.rooms.push(`instructor/${user.id}`);
        }
      });

    this.server.on('connection', function(socket){
      const self = this;
      setTimeout(() => {
        console.log("timeout fired!")
        console.log(self.rooms)
        self.server.emit('an event', { some: 'data' });
      }, 5000)
      console.log('Connection to client established');

      // Success!  Now listen to messages to be received
      socket.on('message',function(event){ 
        console.log('Received message from client!',event);
      });

      socket.on('disconnect',function(){
        console.log('Client has disconnected');
      });
    });
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
   * @param {Array} actions - list of actions for the redux-store
   */
  broadcast(notifiedRooms, actions) {
    console.log("yo broadcasting")
    console.log(this.server.sockets.adapter.rooms)
    this.server.emit("server-update", actions);
    if (notifiedRooms.indexOf("all") !== -1) {
      this.server.emit("event", actions);
    } else {
      notifiedRooms.map(room => {
        if (this.server.sockets.adapter.rooms[room]) {
          console.log("emitting updates!")
          this.server.in(room).emit(actions);
        }
        // if (this.state.rooms.indexOf(room) !== -1) {
        // }
      })
    }
  }
}

module.exports = new WebSocketServer();
module.exports.class = WebSocketServer;
