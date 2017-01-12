require('../css/main.css');

const dsAjax = require('./ds-ajax.js');

// window.addEventListener("beforeunload", function (e) {
//   e.returnValue = "";
//   return confirmationMessage;
// });

document.addEventListener("DOMContentLoaded", function (event) {
  $main.init();
});

var socket = null;

var $main = {
  init: function () {
    this.socket = io();
    this.domCache();
    if (this.socket) {
      this.socket.on('ERROR', function (err) { console.error(err) })
    }
  },
  domCache: function () {
    this.game_button = document.getElementById('game-button');
    this.game_input = document.getElementById('game-input');
    this.login_input = document.getElementById('login-input');
    this.login_button = document.getElementById('login-button');
    this.domListeners();
  },
  domListeners: function () {
    if (this.game_button) this.game_button.addEventListener('click', this.createGame.bind(this));
    if (this.login_button) this.login_button.addEventListener('click', this.login.bind(this));
  },
  createGame: function (e) {
    this.socket.emit('createGame', {
      gameId: this.game_input.value
    })
  },
  login: function (e) {
    this.socket.emit('login', {
      username: this.login_input.value,
      message: 'Message from web client'
    });
  }
}


module.exports = $main;