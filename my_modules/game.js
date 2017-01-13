"use strict";

const Game = {
  players: [],
  sockets: {},
  characters: [],
  emitUpdatePlayers: function() {
    for (let i = 0; i < this.players.length; i++)
      this.sockets[this.players[i].id].emit('updatePlayers', this.players);
  },
  getPlayer(playerId){
    for(let i=0; i<this.players.length; i++)
      if(this.players[i].id === playerId)
        return this.players[i];
    return null;
  }
}

module.exports = Game;