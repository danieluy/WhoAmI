"use strict";

const Player = require('./player.js');

const Owner = Player.create();

const Owner = {
  __proto__: Player,
  create: function (id, username) {
    const instance = Object.create(this);
    instance.id = id;
    instance.username = username;
    return instance;
  }
}

module.exports = Owner;