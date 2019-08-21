const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

io.on("connection", function(socket) {
  socket.on('simple-message', function(message, reciverID) {
    socket.broadcast.to(reciverID).emit('simple-reply', message); 
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

