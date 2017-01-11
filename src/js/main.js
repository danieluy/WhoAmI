require('../css/main.css');

document.addEventListener("DOMContentLoaded", function (event) {
  $main.init();
});

var $main = {
  init: function () {
    this.domCache();
  },
  domCache: function(){
    document.getElementsByTagName('button')[0].addEventListener('click', this.emitMessage.bind(this));
    this.login_input = document.getElementById('login-input');
    this.login_button = document.getElementById('login-button');
    this.domListeners();
  },
  domListeners: function(){
    this.login_button.addEventListener('click', this.login.bind(this));
  },
  login: function (e) {
    sessionStorage.setItem('username', this.login_input.value);
    this.emitMessage();
  },
  emitMessage: function () {
    socket.emit('login', {
      username: sessionStorage.getItem('username'),
      message: 'Message from web client'
    });
  }
}

module.exports = $main;