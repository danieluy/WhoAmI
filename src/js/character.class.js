"use strict";

const Qa = require('./qa.class.js');

const Character = function (values) {
  this.id = values.id; // :string
  this.description = undefined; // :string
  this.qa = undefined; // :Array<Qa>
  if (values.description)
    this.description = values.description;
  if (values.qa)
    this.qa = values.qa.map(qa => new Qa(qa));
}

Character.prototype.view = function () {
  let div = document.createElement('div');

  let description = document.createElement('div');
  description.innerHTML = this.description ? this.description :  '·········';
  div.appendChild(description);

  if (this.qa) {
    let qas = document.createElement('div');
    for (var i = 0; i < this.qa.length; i++) {
      qas.appendChild(this.qa[i].view());
    }
    div.appendChild(qas);
  }
  
  return div;
}

module.exports = Character;