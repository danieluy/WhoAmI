"use strict";

const Character = function (values) {
  this.id = values.id || undefined; // :string (corresponds to the id of whoever input it)
  this.description = values.description || undefined; // :string
  this.qas = values.qas || []; // :Array<Qa>
  this.assignedTo = values.assignedTo || undefined; // :string (player id)
}

module.exports = Character;