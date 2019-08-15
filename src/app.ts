import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
app.set("port", process.env.PORT || 3000);
dotenv.config();


let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
  console.log("a user connected");
  socket.on("message", (message: any) => {
      socket.se
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

const server = http.listen(3000, () => {
  console.log(`listening on port:${app.get("port")}`);
});