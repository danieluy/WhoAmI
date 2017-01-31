"use strict";

const Player = require('./player.js');
const Character = require('./character.js');

const Game = function (values) {

  this.id = values.id || undefined;
  this.started = false;
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
Game.prototype.startGame = function (player) { // NEEDS TESTING
  if (Object.keys(this.character.characters).length > 1) {
    if (player && player.owner) {
      if (this.characterPerPlayer()) {
        this.started = true;
        this.assignCharacters();
        this.assignTurns();
      }
      else
        throw new Error('Some player have not input a Character yet');
    }
    else
      throw new Error('A game can only be started by its owner');
  }
  else
    throw new Error('Not enough players, the required minimum is two');
};
Game.prototype.assignTurns = function () { // NEEDS TESTING
  const keys = Object.keys(this.player.players);
  const assigned = {};
  for (var key in this.player.players) {
    let i = 0;
    while (assigned.hasOwnProperty(keys[i]))
      i = Math.floor(Math.random() * keys.length);
    assigned[keys[i]] = null;
    this.player.players[key].next_player = this.player.players[keys[i]].id;
  }
  // emit ready !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
};
Game.prototype.updatePlayers = function () {
  if (this.started) {
    for (let key1 in this.player.players) {
      const redacted_players = {};
      for (let key2 in this.player.players) {
        const p = new Player({
          id: this.player.players[key2].id,
          name: this.player.players[key2].name,
          owner: this.player.players[key2].owner
        });
        if (key1 !== key2)
          p.character = this.player.players[key2].character;
        else {
          const c = new Character({
            id: this.player.players[key2].character.id,
            qa: this.player.players[key2].character.qa,
            assignedTo: this.player.players[key2].character.assignedTo
          })
          p.character = c;
        }
        redacted_players[key2] = p;
      }
      this.socket.sockets[key1].emit('updatePlayers', redacted_players);
    }
  }
  else {
    const redacted_players = {};
    for (let key in this.player.players) {
      const p = new Player({
        id: this.player.players[key].id,
        name: this.player.players[key].name,
        owner: this.player.players[key].owner
      });
      redacted_players[key] = p;
    }
    for (let key in this.player.players) {
      this.socket.sockets[key].emit('updatePlayers', redacted_players);
    }
  }
};
Game.prototype.characterPerPlayer = function () {
  for (var key in this.player.players) {
    if (!this.character.characters.hasOwnProperty(key))
      return false;
  }
  return true;
};
Game.prototype.assignCharacters = function () {
  const assingned_characters = {};
  const character_ids = Object.keys(this.character.characters);
  for (let key in this.player.players) {
    const p = this.player.players[key];
    let assigned = false;
    while (!assigned) {
      const character_id = character_ids[Math.floor(Math.random() * character_ids.length)];
      if (!assingned_characters.hasOwnProperty(character_id) && p.id !== character_id) {
        p.character = this.character.characters[character_id];
        assigned = true;
      }
    }
  };
  this.updatePlayers();
};

module.exports = Game;