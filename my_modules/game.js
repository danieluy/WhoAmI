"use strict";

const Game = {
  players: {},
  sockets: {},
  characters: {},
  addSocket: function (socket) {
    if (this.sockets.hasOwnProperty(socket.id))
      throw 'Socket already exists';
    else
      this.sockets[socket.id] = socket;
  },
  addPlayer: function (player) {
    if (this.players.hasOwnProperty(player.id))
      throw 'Player already exists';
    else
      this.players[player.id] = player;
  },
  addCharacter: function (character) {
    if (this.characters.hasOwnProperty(character.id))
      throw 'Character already exists';
    else
      this.characters[character.id] = character;
  },
  emitUpdatePlayers: function () {
    for (key in this.players)
      this.sockets[key].emit('updatePlayers', this.players);
  }
}

module.exports = Game;