"use strict";

const Game = {
  id: null,

  player: {
    players: {},
    add: function (player) {
      if (this.players.hasOwnProperty(player.id))
        throw new Error('Player already exists');
      else
        this.players[player.id] = player;
    },
    get: function (player_id) {
      return this.players[player_id];
    },
    delete: function (player_id) {
      delete this.players[player_id];
    }
  },
  character: {
    characters: {},
    add: function (character) {
      if (this.characters.hasOwnProperty(character.id))
        throw new Error('Character already exists');
      else
        this.characters[character.id] = character;
    },
    get: function (character_id) {
      return this.characters[character_id];
    },
    delete: function (character_id) {
      delete this.characters[character_id];
    }
  }
}

Game.prototype.socket = {
  sockets: {},
  add: function (socket) {
    if (this.sockets.hasOwnProperty(socket.id))
      throw new Error('Socket already exists');
    else
      this.sockets[socket.id] = socket;
  },
  get: function (socket_id) {
    return this.sockets[socket_id];
  },
  delete: function (socket_id) {
    delete this.sockets[socket_id];
  }
}

module.exports = Game;