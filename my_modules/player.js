"use strict";

const Player = {
  id: null,//number
  username: null,
  create: function (id, name) {
    const instance = Object.create(this);
    if (id) instance.id = id;
    if (name) instance.username = name;
    return instance;
  }
}

module.exports = Player;