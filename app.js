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

  socket.on('startGame', function (data) {
    if (games.hasOwnProperty(data.gameId)) {
      const g = games[data.gameId];
      const p = g.player.get(socket.id);
      try {
        g.startGame(p);
        socket.emit('gameStarted');
      } catch (err) {
        socket.emit('ERROR', { code: 'unableToStart', message: err.message });
      }
    }
    else {
      socket.emit('ERROR', { code: 'noGame', message: `The game ${data.gameId} does not exists` });
    }
  })

  socket.on('createGame', function (data) {
    if (!games.hasOwnProperty(data.gameId)) {
      const g = new Game({ id: data.gameId });
      games[data.gameId] = g;
      const p = new Player({ id: socket.id, name: data.username, owner: true });
      try {
        g.player.add(p);
        g.socket.add(socket);
        g.updatePlayers();
      } catch (err) {
        if (err.message === 'Player already exists')
          socket.emit('ERROR', { code: 'duplicatedPlayer', message: `Duplicated player id: ${data.username}` });
        if (err.message === 'Socket already exists')
          socket.emit('ERROR', { code: 'duplicatedPlayer', message: `Duplicated socket id: ${data.username}` });
      }
    }
    else {
      socket.emit('ERROR', { code: 'duplicatedGame', message: `There is already a game called ${data.gameId}` });
    }
  });

  socket.on('joinGame', function (data) {
    if (games.hasOwnProperty(data.gameId)) {
      const g = games[data.gameId];
      const p = new Player({ id: socket.id, name: data.username, owner: false });
      try {
        g.player.add(p);
        g.socket.add(socket);
        g.updatePlayers();
      } catch (err) {
        if (err.message === 'Player already exists')
          socket.emit('ERROR', { code: 'duplicatedPlayer', message: `Duplicated player id: ${data.username}` });
        if (err.message === 'Socket already exists')
          socket.emit('ERROR', { code: 'duplicatedPlayer', message: `Duplicated socket id: ${data.username}` });
      }
    }
    else {
      socket.emit('ERROR', { code: 'noGame', message: `The game ${data.gameId} does not exists` });
    }
  })

  socket.on('inputCharacter', function (data) {
    if (games.hasOwnProperty(data.gameId)) {
      const g = games[data.gameId];
      let c = new Character({ id: socket.id, description: data.character });
      try {
        g.character.add(c);
        socket.emit('inputCharacterDone');
        io.emit('TEST', g.character.characters)
      }
      catch (err) {
        socket.emit('ERROR', { code: 'duplicatedCharacter', message: `Duplicated character id: ${data.username}` });
      }
    }
    else {
      socket.emit('ERROR', { code: 'noGame', message: `The game ${data.gameId} does not exists` });
    }
  })

  socket.on('startGame', function (data) {
    if (games.hasOwnProperty(data.gameId)) {
      const g = games[data.gameId];
      const p = g.player.get(socket.id)
      try {
        g.startGame(p);
      }
      catch (err) {
        socket.emit('ERROR', { code: 'notTheOwner', message: `The game can only be started by its owner` });
      }
    }
    else {
      socket.emit('ERROR', { code: 'noGame', message: `The game ${data.gameId} does not exists` });
    }
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
