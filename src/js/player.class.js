"use strict";

const Character = require('./character.class.js');

const Player = function (values) {

  this.id = values.id; // :string
  this.name = values.name; // :string
  this.owner = values.owner; // :boolean
  this.character = undefined; // :Character
  if (values.character)
    this.character = new Character(values.character);
}

Player.prototype.preview = function () {
  let wrapper = document.createElement('div');
  wrapper.classList.add('player-preview-wrapper');

  let name = document.createElement('span');
  name.classList.add('player-preview-name');
  name.innerHTML = this.name;
  wrapper.appendChild(name);

  if (this.owner) {
    let owner = document.createElement('span');
    owner.classList.add('player-preview-owner');
    owner.innerHTML =
      '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M0 0h24v24H0z" fill="none"/>'
      + '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>'
      + '</svg>'
    wrapper.appendChild(owner);
  }

  return wrapper;
}

Player.prototype.view = function () {
  let wrapper = document.createElement('div');
  wrapper.classList.add('player-wrapper');

  let name = document.createElement('span');
  name.classList.add('player-name');
  name.innerHTML = this.name;
  wrapper.appendChild(name);

  if (this.owner) {
    let owner = document.createElement('span');
    owner.classList.add('player-owner');
    owner.innerHTML =
      '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M0 0h24v24H0z" fill="none"/>'
      + '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>'
      + '</svg>'
    wrapper.appendChild(owner);
  }

  let character = this.character.view();
  wrapper.appendChild(character);

  return wrapper;
}

module.exports = Player;