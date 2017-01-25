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
    player: undefined,
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
      this.socket.on('gameStarted', this.gameStarted.bind(this));
      this.socket.on('gameCreated', this.gameCreatedJoined.bind(this));
      this.socket.on('gameJoined', this.gameCreatedJoined.bind(this));
    }
  },

  logTest: function (data) {
    console.log('<<< TEST >>>')
    console.log(data)
  },

  domCache: function () {
    this.start_wrapper = document.getElementsByClassName('start-wrapper')[0];
    this.select_character_wrapper = document.getElementsByClassName('select-character-wrapper')[0];
    this.start_game_wrapper_owner = document.getElementsByClassName('start-game-wrapper-owner')[0];
    this.start_game_wrapper_not_owner = document.getElementsByClassName('start-game-wrapper-not-owner')[0];
    this.new_game_button = document.getElementById('new-game-button');
    this.join_game_button = document.getElementById('join-game-button');
    this.input_character_button = document.getElementById('input-character-button');
    this.game_id = document.getElementById('game-name');
    this.character_name = document.getElementById('character-name');
    this.player_name = document.getElementById('player-name');
    this.players_wrapper = document.getElementById('players-wrapper');
    this.start_game_button = document.getElementById('start-game-button');
    this.domListeners();
  },

  domListeners: function () {
    this.new_game_button.addEventListener('click', this.createGame.bind(this));
    this.join_game_button.addEventListener('click', this.joinGame.bind(this));
    this.input_character_button.addEventListener('click', this.inputCharacter.bind(this));
    this.start_game_button.addEventListener('click', this.startGame.bind(this));
  },

  startGame: function () {
    this.socket.emit('startGame', {
      gameId: this.gameData.gameId
    })
  },

  gameStarted: function () {
    console.log('lalala')
    this.render.alertOk('Game started!!!')
  },

  createGame: function (e) {
    this.gameData.username = this.player_name.value;
    this.gameData.gameId = this.game_id.value;
    this.socket.emit('createGame', {
      gameId: this.gameData.gameId,
      username: this.gameData.username
    });
  },

  gameCreatedJoined: function (data) {
    this.gameData.player = data.player;
    this.start_wrapper.classList.add('hidden');
    this.select_character_wrapper.classList.remove('hidden');
  },

  joinGame: function () {
    this.gameData.username = this.player_name.value;
    this.gameData.gameId = this.game_id.value;
    this.socket.emit('joinGame', {
      gameId: this.gameData.gameId,
      username: this.gameData.username
    });
  },

  inputCharacter: function () {
    this.socket.emit('inputCharacter', {
      gameId: this.gameData.gameId,
      character: this.character_name.value
    })
  },

  inputCharacterDone: function () {
    this.select_character_wrapper.classList.add('hidden');
    if (this.gameData.player.owner)
      this.start_game_wrapper_owner.classList.remove('hidden');
    else
      this.start_game_wrapper_not_owner.classList.remove('hidden');
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
    updateCharacters: function (characters) {
      console.log(characters)
    }
  },

  errorHandler: function (err) {
    if (err.code === 'duplicatedGame') {
      this.render.alertError(err.message);
      this.gameData.username = undefined;
      this.gameData.gameId = undefined;
    }
    if (err.code === 'noGame') {
      this.render.alertError(err.message);
      this.gameData.username = undefined;
      this.gameData.gameId = undefined;
    }
    if (err.code === 'duplicatedCharacter') {
      this.render.alertError(err.message);
    }
    if (err.code === 'unableToStart') {
      this.render.alertError(err.message);
    }
  }

}


module.exports = $main;