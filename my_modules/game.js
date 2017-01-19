"use strict";

const Game = {
  id: undefined,
  create: function (values) {
    const instance = Object.create(this);
    if (values)
      Object.keys(values).forEach(function (key) {
        instance[key] = values[key];
      })
    instance.player.players = {};
    instance.socket.sockets = {};
    instance.character.characters = {};
    return instance;
  },
  updateList: function () {
    for (let key in this.player.players)
      this.socket.sockets[key].emit('updateList', this.player.players);
  },
  player: {
    players: undefined,
    add: function (player) {
      if (this.players.hasOwnProperty(player.id))
        throw new Error('Player already exists');
      else if (Object.keys(this.players).length && player.owner)
        throw new Error('The game already has an owner');
      else
        this.players[player.id] = player;
    },
    get: function (player_id) {
      return this.players[player_id];
    },
    remove: function (player_id) {
      delete this.players[player_id];
    }
  },
  socket: {
    sockets: undefined,
    add: function (socket) {
      if (this.sockets.hasOwnProperty(socket.id))
        throw new Error('Socket already exists');
      else
        this.sockets[socket.id] = socket;
    },
    get: function (socket_id) {
      return this.sockets[socket_id];
    },
    remove: function (socket_id) {
      delete this.sockets[socket_id];
    }
  },
  character: {
    characters: undefined,
    add: function (character) {
      if (this.characters.hasOwnProperty(character.id))
        throw new Error('Character already exists');
      else
        this.characters[character.id] = character;
    },
    get: function (character_id) {
      return this.characters[character_id];
    },
    remove: function (character_id) {
      delete this.characters[character_id];
    }
  }
}

Object.defineProperty(Game, '__type__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: 'Game'
});

module.exports = Game;