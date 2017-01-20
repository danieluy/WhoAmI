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
      this.socket.on('updateCharacters', this.render.updateCharacters.bind(this));
      this.socket.on('inputCharacterDone', this.inputCharacterDone.bind(this));
    }
  },

  logTest: function (data) {
    console.log('<<< TEST >>>')
    console.log(data)
  },

  domCache: function () {
    this.new_game_button = document.getElementById('new-game-button');
    this.join_game_button = document.getElementById('join-game-button');
    this.input_character_button = document.getElementById('input-character-button');
    this.game_id = document.getElementById('game-name');
    this.character_name = document.getElementById('character-name');
    this.player_name = document.getElementById('player-name');
    this.players_wrapper = document.getElementById('players-wrapper');
    this.domListeners();
  },

  domListeners: function () {
    this.new_game_button.addEventListener('click', this.createGame.bind(this));
    this.join_game_button.addEventListener('click', this.joinGame.bind(this));
    this.input_character_button.addEventListener('click', this.inputCharacter.bind(this));
  },

  createGame: function (e) {
    this.gameData.username = this.player_name.value;
    this.gameData.gameId = this.game_id.value;
    this.join_game_button.disabled = true;
    this.new_game_button.disabled = true;
    this.socket.emit('createGame', {
      gameId: this.gameData.gameId,
      username: this.gameData.username
    })
  },

  joinGame: function () {
    this.gameData.username = this.player_name.value;
    this.gameData.gameId = this.game_id.value;
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
      character: this.character_name.value
    })
  },

  inputCharacterDone: function () {
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
      this.players_wrapper.innerHTML = "";
      for (var key in players) {
        if (players.hasOwnProperty(key)) {
          var pre = document.createElement('pre');
          pre.innerHTML = JSON.stringify(players[key], null, 2);
          this.players_wrapper.appendChild(pre);
        }
      }
    },
    updateCharacters: function(characters){
      console.log(characters)
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
      this.input_character_button.disabled = false;
    }
    if (err.code === 'duplicatedCharacter') {
      this.render.alertError(err.message);
      this.input_character_button.disabled = false;
    }
  }

}


module.exports = $main;