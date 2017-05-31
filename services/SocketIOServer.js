"use strict";

const express = require("express");

const io = require("socket.io");
const ioJwt = require("socketio-jwt");

const TokenGenerator = require("./TokenGenerator");

const User = require("../models/User")
const Notification = require("../models/Notification")

/**
 * Silly service used for spinning SocketIO server (which uses WebSocket).
 * 
 * It's just so adorable. Look at it! That ridiculous broadcast shit and those silly rooms.
 * It creates notifications to all admins for request (except if it was admin's own) so they
 * can view them in real-time! Wee! And it's not ugly, it's just... Like a kid with down-syndrome.
 * Special, yes that's it! It's very special.
 */
class WebSocketServer {

  constructor() {
    this.server = undefined;
  }

  start() {
    const app = express();
    const port = process.env.WEBSOCKET_PORT || 8008;
    const server = app.listen(port);
    this.server = io(server);
    console.log("SocketIO server started at " + port)

    this.server.sockets
      .on("connection", ioJwt.authorize({
        secret: process.env.TOKEN_SECRET,
        audience: "login",
        timeout: 15000 // 15 seconds to send the authentication message
      }))
      .on("authenticated", function(socket) {
        //this socket is authenticated, we are good to handle more events from it.
        console.log("hello! " + socket.decoded_token.user.fullname);
        // console.log(socket)
        const user = socket.decoded_token.user;
        if (user.role === "admin" || user.role === "print-person") {
          socket.join(user.role)
        } else if (user.role === "professor" && user.StudyFieldId) {
          socket.join(`professor/${user.StudyFieldId}`);
        } else {
          socket.join(`instructor/${user.id}`);
        }
        socket.join("all");
      });

    this.server.on("connection", function(socket){
      console.log("Connection to client established");

      socket.on("disconnect", function() {
        console.log("Client has disconnected");
      });
    });
  }

  stop() {
    this.server.close(() => {
      console.log("SocketIO server closed")
    });
  }

  /**
   * Mindfuck double reduce loop
   * @param {Array} actions - List of actions and notifications
   * @param {Object} user - Object of user
   * @return {Promise} - List of saved notifications as Promises
   */
  createNotifications(actions, user) {
    return User.findAll({
        role: "admin",
        isActive: true,
        isRetired: false,
      })
      .then(admins => {
        return Promise.all(actions.reduce((accumulated, action) => {
          let forEachAdmin = admins.reduce((acc, admin) => {
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
      })
  }

  /**
   * Broadcasts actions to all users involved in the namespaces.
   * 
   * Namespaces can be one of the following: ["all", "admin", "print-person", "professor/<StudyFieldId>", 
   * "instructor/<id>"]
   * Actions consist of regular action-type and payload alongside of the notification for admins:
   * [{
   *   type: "COUNCILMEETING_DELETE_ONE_SUCCESS",
   *   payload: { id: parseInt(req.params.id) },
   *   notification: `User ${req.user.fullname} deleted a CouncilMeeting`,
   * }]
   * Loops through all the clients connected to a namespace and uses the client's Socket.io-id
   * to directly broadcast the action and the possible notification.
   * @param {Array} namespaces - List of namespaces to be notified of changes
   * @param {Array} actions - List of actions to be sent for clients' Redux stores and notifications
   * @param {Object} user - Either fetched from DB or decoded user's token
   */
  broadcast(notifiedRooms, actions, user) {
    return this.createNotifications(actions, user)
      .then(notifications => {
        
        const prunedActions = actions.map(action => {
          return {
            type: action.type,
            payload: action.payload,
          }
        })
        notifiedRooms.map(room => {
          if (this.server.sockets.adapter.rooms[room]) {
            // const client = this.server.sockets.adapter.rooms[room].sockets
            // console.log(this.server.sockets)
            // console.log(this.server.sockets.adapter.rooms[room])
            // console.log(this.server.connected)
            console.log("emitting to ", room)
            Object.keys(this.server.sockets.adapter.rooms[room].sockets).map(clientId => {
              // console.log(clientId)
              const socket = this.server.sockets.connected[clientId];
              // console.log(socket.decoded_token)
              // create notifications only for those admins that are marked as recipients
              const notificationActions = notifications.reduce((accumulated, notification) => {
                if (socket.decoded_token.user.id === notification.RecipientId) {
                  accumulated.push({
                    type: "NOTIFICATION_ADD_ONE",
                    payload: notification,
                  })
                }
                return accumulated;
              }, [])
              this.server.in(clientId).emit("server:push", [...prunedActions, ...notificationActions]);
            })
          }
        })
      })
  }
}

module.exports = new WebSocketServer();
module.exports.class = WebSocketServer;
