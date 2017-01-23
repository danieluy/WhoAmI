"use strict";

const Player = function (values) {
  this.id = values.id || undefined;//number
  this.name = values.name || undefined;
  this.owner = values.owner || false;
  this.character = undefined; // Character
}

module.exports = Player;