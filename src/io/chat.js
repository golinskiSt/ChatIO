const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

class User {
  constructor (id) {
    this._id  = id
    // this._name = name
}
set id  (id)  { this._id = id}
get id  ()       { return this._id}
// set name (name) { this._name = name}
// get name ()       { return this._name}
}

let connections = [];

io.on("connection", function(socket) {
  connections.push(new User(socket.id));
  socket.on('simple-message', function(message, reciverID) {
    socket.broadcast.to(reciverID).emit('simple-reply', message); 
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

