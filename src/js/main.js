require('../css/main.css');

// window.addEventListener("beforeunload", function (e) {
//   e.returnValue = "";
//   return confirmationMessage;
// });

document.addEventListener("DOMContentLoaded", function (event) {
  $main.init();
});

var $main = {
  gameData: {
    username: undefined,
    gameId: undefined,
    playersList: []
  },

  init: function () {
    this.socket = io();
    this.domCache();
    if (this.socket) {
      this.socket.on('ERROR', this.errorHandler.bind(this));
      this.socket.on('TEST', this.logTest.bind(this));
      this.socket.on('updatePlayers', this.render.updatePlayers.bind(this));
      this.socket.on('inputDone', this.inputCharacterDone.bind(this));
    }
  },

  logTest: function(data){
    console.log('<<< TEST >>>')
    console.log(data)
  },

  domCache: function () {
    this.join_game_button = document.getElementById('join-game-button');
    this.new_game_button = document.getElementById('new-game-button');
    this.input_character_button = document.getElementById('input-character-button');
    this.game_name = document.getElementById('game-name');
    this.character_name = document.getElementById('character-name');
    this.player_name = document.getElementById('player-name');
    this.domListeners();
  },

  domListeners: function () {
    this.join_game_button.addEventListener('click', this.joinGame.bind(this));
    this.new_game_button.addEventListener('click', this.createGame.bind(this));
    this.input_character_button.addEventListener('click', this.inputCharacter.bind(this));
  },

  createGame: function (e) {
    this.gameData.username = this.player_name.value;
    this.gameData.gameId = this.game_name.value;
    this.join_game_button.disabled = true;
    this.new_game_button.disabled = true;
    this.socket.emit('createGame', {
      gameId: this.gameData.gameId,
      username: this.gameData.username
    })
  },

  joinGame: function () {
    this.gameData.username = this.player_name.value;
    this.gameData.gameId = this.game_name.value;
    this.join_game_button.disabled = true;
    this.new_game_button.disabled = true;
    this.socket.emit('joinGame', {
      gameId: this.gameData.gameId,
      username: this.gameData.username
    })
  },

  inputCharacter: function () {
    this.socket.emit('inputCharacter', {
      gameId: this.gameData.gameId,
      username: this.gameData.username,
      character: this.character_name.value
    })
  },

  inputCharacterDone: function(){
    this.render.alertOk('Character correctly sended');
    this.input_character_button.disabled = true;
  },

  render: {
    alertOk: function (message) {
      console.log(message);
      alert(message)
    },
    alertError: function (message) {
      console.error(message);
      alert(message)
    },
    updatePlayers: function (players) {
      this.gameData.playersList = players;
      document.getElementById('players-wrapper').innerHTML = '';
      for (let i = 0; i < players.length; i++) {
        var pre = document.createElement('pre');
        pre.innerHTML = JSON.stringify(players[i], null, 2);
        document.getElementById('players-wrapper').appendChild(pre);
      }
    }
  },

  errorHandler: function (err) {
    if (err.code === 'duplicatedGame') {
      this.render.alertError(err.message);
      this.gameData.username = undefined;
      this.gameData.gameId = undefined;
      this.join_game_button.disabled = false;
      this.new_game_button.disabled = false;
    }
    if (err.code === 'noGame') {
      this.render.alertError(err.message);
      this.gameData.username = undefined;
      this.gameData.gameId = undefined;
      this.join_game_button.disabled = false;
      this.new_game_button.disabled = false;
    }
  }

}


module.exports = $main;