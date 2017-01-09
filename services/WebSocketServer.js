"use strict";

const ws = require("ws")

const TokenGenerator = require("./TokenGenerator");

class WebSocketServer {

  constructor() {
    this.server = undefined;
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

    this.server = new ws.Server({
      port: 8008,
      verifyClient: (info, cb) => {
        const hasQueryParams = info.req.url.substring(0, 10) === "/ws?token=";
        // if (!hasQueryParams) cb(false, 401, "Unauthorized")
        const token = info.req.url.substring(10, info.req.url.length);
        // if (TokenGenerator.verify(token)) {

        // }
        console.log(token) 
        if (token) {
          console.log("jee token");
          cb(true)
        } else {
          console.log("wää no token");
          cb(false);
        }
      }
    });

    this.server.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });

      ws.send('something');
    });
  }

  stop() {
    this.server.close(() => {
      console.log("websocket server closed")
    });
  }

  /**
   * Method for broadcasting all clients about new changes
   * Should probably only sync in intervals of couple minutes
   * And instead of getting everything per route could use temporary cache
   * BUT I think performance isn't such super important issue here
   * routes = { thesis: [3], grader: [3, 4] }
   * list of ids for types???
   * { thesis: { save: [2], update: [3, 4]}} vai polut jotta admin näkee notifikaatioita
   */
  broadcast(routes) {
    this.server.clients.forEach(function each(client) {
      client.send("homo");
    });
  }
}

module.exports = new WebSocketServer();
module.exports.class = WebSocketServer;
