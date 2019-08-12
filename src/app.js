"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var app = express();
app.set("port", process.env.PORT || 3000);
var http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
var io = require("socket.io")(http);
app.get("/", function (req, res) {
    res.sendFile(path.resolve("./client/index.html"));
});
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket) {
    console.log("a user connected");
    socket.on("message", function (message) {
        console.log(message);
    });
});
var server = http.listen(3000, function () {
    console.log("listening on port:" + app.get("port"));
});
