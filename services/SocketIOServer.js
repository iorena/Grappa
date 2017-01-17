"use strict";

const express = require("express");
const app = express();
const server = app.listen(8008);

const io = require("socket.io");
const ioJwt = require("socketio-jwt");

const TokenGenerator = require("./TokenGenerator");

const User = require("../models/User")
const StudyField = require("../models/StudyField")
const Notification = require("../models/Notification")

class WebSocketServer {

  constructor() {
    this.server = undefined;
    this.rooms = [];
    this.admins = [];
    this.studyfields = [];
  }

  fetchDataFromDB() {
    User.findAll({
      role: "admin",
      isActive: true,
      isRetired: false,
    })
    .then(admins => {
      this.admins = admins;
    })
  }

  start() {
    this.fetchDataFromDB();
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
        // if (user.role === "admin" || user.role === "print-person") {
        //   console.log("hei admin")
        //   socket.join(user.role)
        //   self.rooms.push(user.role);
        // } else if (user.role === "professor" && user.StudyFieldId) {
        //   socket.join(`professor/${user.StudyFieldId}`);
        //   this.rooms.push(`professor/${user.StudyFieldId}`);
        // } else {
        //   socket.join(`instructor/${user.id}`);
        //   this.rooms.push(`instructor/${user.id}`);
        // }
      });

    this.server.on('connection', function(socket){
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
   * Mindfuck double reduce loop
   */
  createNotifications(actions, user) {
    return Promise.all(actions.reduce((accumulated, action) => {
      let forEachAdmin = this.admins.reduce((acc, admin) => {
        if (admin.id !== user.id) {
          return [...acc, Notification.saveOne({
            type: action.type,
            content: action.notification,
            RecipientId: admin.id,
            CreatedById: user.id,
          })]
        }
        return acc;
      }, []);
      return [...accumulated, ...forEachAdmin];
    }, []))
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
  broadcast(notifiedRooms, actions, user) {
    console.log("yo broadcasting")
    // console.log(this.server.sockets.adapter.rooms)
    // 
    return this.createNotifications(actions, user)
      .then(notifications => {
        // console.log(notifications)
        // actions without notifications
        const prunedActions = actions.map(action => {
          return {
            type: action.type,
            payload: action.payload,
          }
        })

        const notificationActions = notifications.map(notification => {
          return {
            type: "NOTIFICATION_ADD_ONE",
            payload: notification,
          }
        })

        this.server.emit("server-update", [...prunedActions, ...notificationActions]);
      })

    // if (notifiedRooms.indexOf("all") !== -1) {
    //   this.server.emit("event", actions);
    // } else {
    //   notifiedRooms.map(room => {
    //     if (this.server.sockets.adapter.rooms[room]) {
    //       console.log("emitting updates!")
    //       this.server.in(room).emit(actions);
    //     }
    //     // if (this.state.rooms.indexOf(room) !== -1) {
    //     // }
    //   })
    // }

    // return Promise.resolve();
    // should emit actions in a then after saving notifications for emitting the notification actions
    // in the message
  }
}

module.exports = new WebSocketServer();
module.exports.class = WebSocketServer;
