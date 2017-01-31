require('../css/main.css');
const Player = require('./player.class.js');

// window.addEventListener("beforeunload", function (e) {
//   e.returnValue = "";
//   return confirmationMessage;
// });

document.addEventListener("DOMContentLoaded", function (event) {
  $main.init();
});

var $main = {

  username: undefined,
  gameId: undefined,
  player: undefined,
  game_started: false,
  my_turn: undefined,
  playersList: [],

  init: function () {
    this.socket = io();
    this.domCache();
    if (this.socket) {
      this.socket.on('ERROR', this.errorHandler.bind(this));
      this.socket.on('TEST', this.logTest.bind(this));
      this.socket.on('inputCharacterDone', this.inputCharacterDone.bind(this));
      this.socket.on('gameCreated', this.gameCreatedJoined.bind(this));
      this.socket.on('updatePlayers', this.updatePlayers.bind(this));
      this.socket.on('gameJoined', this.gameCreatedJoined.bind(this));
      this.socket.on('gameStarted', this.gameStarted.bind(this));
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
    this.players_wrapper = document.getElementById('players-wrapper');
    this.players_preview_wrapper = document.getElementById('players-preview-wrapper');
    this.new_game_button = document.getElementById('new-game-button');
    this.join_game_button = document.getElementById('join-game-button');
    this.input_character_button = document.getElementById('input-character-button');
    this.game_id = document.getElementById('game-name');
    this.character_name = document.getElementById('character-name');
    this.player_name = document.getElementById('player-name');
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
      gameId: this.gameId
    });
  },

  gameStarted: function () {
    this.players_wrapper.classList.remove('hidden');
    if (this.player.owner)
      this.start_game_wrapper_owner.classList.add('hidden');
    else
      this.start_game_wrapper_not_owner.classList.add('hidden');
    this.players_preview_wrapper.classList.add('hidden');
    this.game_started = true;
  },

  createGame: function (e) {
    this.username = this.player_name.value;
    this.gameId = this.game_id.value;
    this.socket.emit('createGame', {
      gameId: this.gameId,
      username: this.username
    });
  },

  gameCreatedJoined: function (data) {
    this.player = data.player;
    this.start_wrapper.classList.add('hidden');
    this.select_character_wrapper.classList.remove('hidden');
  },

  joinGame: function () {
    this.username = this.player_name.value;
    this.gameId = this.game_id.value;
    this.socket.emit('joinGame', {
      gameId: this.gameId,
      username: this.username
    });
  },

  inputCharacter: function () {
    this.socket.emit('inputCharacter', {
      gameId: this.gameId,
      character: this.character_name.value
    });
  },

  inputCharacterDone: function () {
    this.select_character_wrapper.classList.add('hidden');
    if (this.player.owner)
      this.start_game_wrapper_owner.classList.remove('hidden');
    else
      this.start_game_wrapper_not_owner.classList.remove('hidden');
    this.players_preview_wrapper.classList.remove('hidden');
  },

  updatePlayers: function (players) {
    this.playersList = [];
    for (var key in players) {
      this.playersList.push(new Player({
        id: players[key].id,
        name: players[key].name,
        owner: players[key].owner,
        character: players[key].character || undefined
      }));
    }
    if (this.game_started)
      this.render.players.call(this);
    else
      this.render.playersPreview.call(this);
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
    playersPreview: function () {
      this.players_preview_wrapper.innerHTML = '';
      for (var i = 0; i < this.playersList.length; i++)
        this.players_preview_wrapper.appendChild(this.playersList[i].preview());
    },
    players: function () {
      this.players_wrapper.innerHTML = '';
      for (var i = 0; i < this.playersList.length; i++) {
        this.players_wrapper.appendChild(this.playersList[i].view());
      }
    }
  },

  // {
  //   "id": "TOkdu-sy8e21ZeaEAAAC",
  //   "name": "asd",
  //   "owner": true,
  //   "character": {
  //     "id": "-ZAbcXaNevKkRXrqAAAE",
  //     "description": "qwe",
  //     "qa": []
  //   }
  // }
  // {
  //   "id": "-ZAbcXaNevKkRXrqAAAE",
  //   "name": "qwe",
  //   "owner": false,
  //   "character": {
  //     "id": "TOkdu-sy8e21ZeaEAAAC",
  //     "qa": []
  //   }
  // }

  errorHandler: function (err) {
    if (err.code === 'parameterMismatch') {
      console.error(err.message);
      this.render.alertError(err.message);
    }
    if (err.code === 'duplicatedGame') {
      console.error(err.message);
      this.render.alertError(err.message);
      this.username = undefined;
      this.gameId = undefined;
    }
    if (err.code === 'noGame') {
      console.error(err.message);
      this.render.alertError(err.message);
      this.username = undefined;
      this.gameId = undefined;
    }
    if (err.code === 'duplicatedCharacter') {
      console.error(err.message);
      this.render.alertError(err.message);
    }
    if (err.code === 'unableToStart') {
      console.error(err.message);
      this.render.alertError(err.message);
    }
  }

}

module.exports = $main;