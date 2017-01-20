"use strict";

const Game = function (values) {
  this.id = values.id || undefined;
  this.updatePlayers = function () {
    for (let key in this.player.players)
      this.socket.sockets[key].emit('updatePlayers', this.player.players);
  };
  this.player = {
    players: {},
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
  };
  this.socket = {
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
    remove: function (socket_id) {
      delete this.sockets[socket_id];
    }
  };
  this.updateCharacters = function () { // Wrong!!! is hiding the character from the one that inputs it instead of hiding  it from the one that has the character assigned to  //
    const redacted_characters = {};
    for (let player_id in this.player.players) {
      for (let character_id in this.character.characters) {
        const character = this.character.characters[character_id];
        if (character_id === player_id)
          character.description = '········';
        redacted_characters[character_id] = character;
      }
      this.socket.sockets[player_id].emit('updateCharacters', redacted_characters);
    }
  };
  this.character = {
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
    remove: function (character_id) {
      delete this.characters[character_id];
    }
  };
}

module.exports = Game;