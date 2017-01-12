"use strict"
const fs = require('fs')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require("body-parser");
const sessions = require('client-sessions');


const User = require('./my_modules/user.js');
const Game = require('./my_modules/game.js');

const CONFIG = require('./config.json');

//  Public folders  ////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, '/public')));

// Session Config. /////////////////////////////////////////////////////////////
const secret = CONFIG.session.secret;
const duration = CONFIG.session.durationHours;
const activeDuration = CONFIG.session.activeDurationHours;
app.use(sessions({
  cookieName: 'session',
  secret: secret,
  duration: duration * 60 * 60 * 1000,
  activeDuration: activeDuration * 60 * 60 * 1000,
  cookie:
  {
    ephemeral: false,
    httpOnly: false,
    secure: false
  }
}));

// Middleware //////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: false }));

// HttpGET /////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
});

// Socket.IO ///////////////////////////////////////////////////////////////////
const games = {};

io.on('connection', function (socket) {

  socket.on('createGame', function (data) {
    if (!games.hasOwnProperty(data.gameId)) {
      games[data.gameId] = Object.create(Game);
      games[data.gameId].id = data.gameId;
      games[data.gameId].sockets.push(socket);
    }
    else {
      socket.emit('ERROR', `There is already a game called ${data.gameId}`);
    }
  })

  socket.on('disconnect', function () {
    // console.log('user disconnected');
  });

});

// 404 /////////////////////////////////////////////////////////////////////////

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/404.html'));
});

http.listen(2300, function () {
  console.log(
    '···········································\n' +
    '·                                         ·\n' +
    '·   Server listening on: localhost:2300   ·\n' +
    '·       Press Ctrl-C to terminate         ·\n' +
    '·                                         ·\n' +
    '···········································'
  );
});
