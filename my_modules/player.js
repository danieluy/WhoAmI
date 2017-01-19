"use strict";

const Player = {
  id: undefined,//number
  name: undefined,
  owner: undefined,
  create: function (values) {
    const instance = Object.create(this);
    if (values)
      Object.keys(values).forEach(function (key) {
        instance[key] = values[key];
      })
    return instance;
  }
}

Object.defineProperty(Player, '__type__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: 'Player'
});

module.exports = Player;