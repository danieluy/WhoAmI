"use strict";

const Character = {
  id: null,
  description: null,
  qa: [],
  assignedTo: null,
  inputBy: null,
  create: function (values) {
    const instance = Object.create(this);
    if (values)
      Object.keys(values).forEach(function (key) {
        instance[key] = values[key];
      })
    return instance;
  }
}

Object.defineProperty(Character, '__type__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: 'Character'
});

module.exports = Character;