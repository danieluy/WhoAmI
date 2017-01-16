"use strict"
const fs = require('fs')
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require("body-parser");


const Player = require('./my_modules/player.js');
const Game = require('./my_modules/game.js');
const Character = require('./my_modules/character.js');

const CONFIG = require('./config.json');

//  Public folders  ////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, '/public')));

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
      let p = Object.create(Player);
      let g = Object.create(Game);
      p.username = data.username;
      p.id = socket.id;
      g.players.push(p);
      g.sockets[socket.id] = socket;
      games[data.gameId] = g;
      games[data.gameId].emitUpdatePlayers();
    }
    else {
      socket.emit('ERROR', { code: 'duplicatedGame', message: `There is already a game called ${data.gameId}` });
    }
  })

  socket.on('joinGame', function (data) {
    if (games.hasOwnProperty(data.gameId)) {
      let p = Object.create(Player);
      p.username = data.username;
      p.id = socket.id;
      games[data.gameId].players.push(p);
      games[data.gameId].sockets[socket.id] = socket;
      games[data.gameId].emitUpdatePlayers();
    }
    else {
      socket.emit('ERROR', { code: 'noGame', message: `The game ${data.gameId} does not exist` });
    }
  })

  socket.on('inputCharacter', function (data) {
    let c = Object.create(Character);
    c.description = data.character;
    c.inputBy = data.playerId;
    games[data.gameId].characters.push(c);
    socket.emit('TEST', games[data.gameId].characters);
  })

  socket.on('disconnect', function () {
    // console.log('player disconnected');
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
