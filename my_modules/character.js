"use strict";

const Character = {
  id:  null,
  description: null,
  qa: [],
  assignedTo: null,
  inputBy: null,
  create: function (id) {
    const instance = Object.create(this);
    instance.id = id;
    return instance;
  }
}

module.exports = Character;