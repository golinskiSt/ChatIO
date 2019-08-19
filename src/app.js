"use strict";
exports.__esModule = true;
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("./database/connection");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");
const winston = require('winston');
const error = require('./middleware/error.middleware');
//routes
const users = require("./routes/users.routes");
const auth = require("./routes/auth.route");
//.env
dotenv.config();
if (!process.env.JWT_KEY) {
  console.log("FATAL ERROR: JTWkey is not defined.");
  process.exit(1);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' })
  ],
  exitOnError: false;
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

process.on('uncaughtException', (ex) => {
  console.log('Uncaught Node Exception');
  logger.error(ex.message, ex);
  //process.exit(1);
});

process.on('unhandledRejection', (ex) => {
  console.log('Uncaught Promise Rejection');
  logger.error(ex.message, ex);
  //process.exit(1);
})
/*cors
var whitelist = ['http://localhost:8100', 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions)); */
//app settings
app.disable("x-powered-by");
app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

app.get("/", function(req, res) {
  res.sendFile(path.resolve("./client/index.html"));
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("message", function(message) {
    socket.se;
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});
var server = http.listen(3000, function() {
  console.log("listening on port:" + app.get("port"));
});
