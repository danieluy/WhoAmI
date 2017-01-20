"use strict";

const Character = function (values) {
  this.id = values.id || undefined; // corresponds to the id of whoever input it
  this.description = values.description || undefined;
  this.qa = values.qa || [];
  this.assignedTo = values.assignedTo || undefined;
}

module.exports = Character;