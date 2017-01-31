"use strict";

const Player = function (values) {
  this.id = values.id || undefined; // :number
  this.name = values.name || undefined; // :string
  this.owner = values.owner || false; // :boolean
  this.character = undefined; // :Character
  this.next_player = undefined; // :string (Character id)
}

module.exports = Player;