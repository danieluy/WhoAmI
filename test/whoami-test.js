const assert = require('chai').assert;
const expect = require('chai').expect;
const Game = require('../my_modules/game.js');
const Player = require('../my_modules/player.js');
const Character = require('../my_modules/character.js');
const SocketStub = require('./mock_files/socket-stub.js');

describe('Player', function () {

  it('Instantiate a Player', function () {
    const p = new Player({ id: 'socketId', name: 'player', owner: true });
    assert.isTrue(Player.prototype.isPrototypeOf(p));
  });

});

describe('Character', function () {

  it('Instantiate a Character', function () {
    const c = new Character({})
    assert.isTrue(Character.prototype.isPrototypeOf(c));
  });

});

describe('Game', function () {

  let games = undefined;

  beforeEach(function () {
    games = {};
  })

  ///////////////////////////////  Game  ///////////////////////////////

  it('Instantiate a Game', function () {
    const g1 = new Game({});
    assert.isTrue(Game.prototype.isPrototypeOf(g1));
  });
  it('Add and retrieve a Game', function () {
    const g1 = new Game({ id: 'someid' });
    games['someid'] = g1;
    const g2 = games['someid'];
    g2.someKey1 = 'some value 1';
    assert.equal(g1.id, g2.id);
    assert.equal(g1.someKey1, g2.someKey1);
  });

  it('Game lists are independent', function () {
    const s1 = new SocketStub({ id: 'socket1' });
    const s2 = new SocketStub({ id: 'socket2' });
    const p1 = new Player({ id: s1.id, name: 'player1', owner: true });
    const p2 = new Player({ id: s2.id, name: 'player2' });
    const g1 = new Game({ id: 'game1' });
    const g2 = new Game({ id: 'game2' });
    g1.socket.add(s1);
    g1.player.add(p1);
    g2.socket.add(s1);
    g2.player.add(p1);
    expect(Object.keys(g1.socket.sockets).length).equal(Object.keys(g2.socket.sockets).length);
    g1.socket.add(s2);
    g1.player.add(p2);
    expect(Object.keys(g1.socket.sockets).length).not.equal(Object.keys(g2.socket.sockets).length);
  })

  ///////////////////////////////  Player  ///////////////////////////////

  it('Add and retrieve a Player', function () {
    const g = new Game({ id: 'game' });
    const p1 = new Player({ id: 'player', name: 'player', owner: true });
    g.player.add(p1);
    expect(g.player.get('player')).equal(p1);
    expect(g.player.players.hasOwnProperty('player')).be.true;
  });
  it('Delete a Player', function () {
    const g = new Game({ id: 'game' });
    const p1 = new Player({ id: 'player', name: 'player', owner: true });
    g.player.add(p1);
    expect(g.player.get('player')).not.be.undefined;
    expect(g.player.players.hasOwnProperty('player')).be.true;
    g.player.remove('player');
    expect(g.player.get('player')).be.undefined;
    expect(g.player.players.hasOwnProperty('player')).be.false;
  });
  it('Prevent duplicate players', function () {
    const g = new Game({ id: 'game' });
    const p1 = new Player({ id: 'player', name: 'player', owner: true });
    const p2 = new Player({ id: 'player', name: 'player' });
    g.player.add(p1);
    expect(() => g.player.add(p2)).throw("Player already exists");
  });
  it('Ensures owner\'s uniqueness', function () {
    const g = new Game({ id: 'game' });
    const p1 = new Player({ id: 'player1', name: 'player1', owner: true });
    const p2 = new Player({ id: 'player2', name: 'player2', owner: true });
    g.player.add(p1);
    expect(() => g.player.add(p2)).throw('The game already has an owner')
  });

  ///////////////////////////////  Character  ///////////////////////////////

  it('Add and retrieve a Character', function () {
    const g = new Game({ id: 'game' });
    const c1 = new Character({ id: 'char' });
    g.character.add(c1);
    expect(g.character.get('char')).equal(c1);
    expect(g.character.characters.hasOwnProperty('char')).be.true;
  });
  it('Delete a Character', function () {
    const g = new Game({ id: 'game' });
    const c1 = new Character({ id: 'char' });
    g.character.add(c1);
    expect(g.character.get('char')).not.be.undefined;
    expect(g.character.characters.hasOwnProperty('char')).be.true;
    g.character.remove('char');
    expect(g.character.get('char')).be.undefined;
    expect(g.character.characters.hasOwnProperty('char')).be.false;
  });
  it('Prevent duplicate characters', function () {
    const g = new Game({ id: 'game' });
    const c1 = new Character({ id: 'char' });
    const c2 = new Character({ id: 'char' });
    g.character.add(c1);
    expect(() => g.character.add(c2)).to.throw("Character already exists");
  });

  ///////////////////////////////  Socket  ///////////////////////////////

  it('Add and retrieve a Socket', function () {
    const g = new Game({ id: 'game' });
    const s1 = new SocketStub({ id: 'socket' });
    g.socket.add(s1);
    expect(g.socket.get('socket')).equal(s1);
    expect(g.socket.sockets.hasOwnProperty('socket')).be.true;
  });
  it('Delete a Socket', function () {
    const g = new Game({ id: 'game' });
    const s1 = new SocketStub({ id: 'socket' });
    g.socket.add(s1);
    expect(g.socket.get('socket')).not.be.undefined;
    expect(g.socket.sockets.hasOwnProperty('socket')).be.true;
    g.socket.remove('socket');
    expect(g.socket.get('socket')).be.undefined;
    expect(g.socket.sockets.hasOwnProperty('socket')).be.false;
  });
  it('Prevent duplicate sockets', function () {
    const g = new Game({ id: 'game' });
    const s1 = new SocketStub({ id: 'socket' });
    const s2 = new SocketStub({ id: 'socket' });
    g.socket.add(s1);
    expect(() => g.socket.add(s2)).to.throw("Socket already exists");
  });

  ///////////////////////////////  Emit  ///////////////////////////////

  it('Emits an event for every Player in the Game', function () {
    const emitted = [];
    const g = new Game({ id: 'game' });
    const s1 = new SocketStub({ id: 'socket1' });
    const s2 = new SocketStub({ id: 'socket2' });
    s1.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    s2.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    const p1 = new Player({ id: s1.id, name: 'player1', owner: true });
    const p2 = new Player({ id: s2.id, name: 'player2' });
    g.socket.add(s1);
    g.player.add(p1);
    g.updatePlayers();
    expect(emitted.length).equal(1);
    g.socket.add(s2);
    g.player.add(p2);
    g.updatePlayers();
    expect(emitted.length).equal(3);
  });
  it('Event emitions are game dependent', function () {
    const emitted = [];
    const s1 = new SocketStub({ id: 'socket1' });
    const s2 = new SocketStub({ id: 'socket2' });
    s1.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    s2.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    const p1 = new Player({ id: s1.id, name: 'player1', owner: true });
    const p2 = new Player({ id: s2.id, name: 'player2' });
    const g1 = new Game({ id: 'game1' });
    g1.socket.add(s1);
    g1.player.add(p1);
    g1.socket.add(s2);
    g1.player.add(p2);
    const g2 = new Game({ id: 'game2' });
    g2.socket.add(s1);
    g2.player.add(p1);
    g2.socket.add(s2);
    g2.player.add(p2);
    g1.updatePlayers();
    expect(emitted.length).equal(2);// g1 only
    g2.updatePlayers();
    expect(emitted.length).equal(4);// g1 + g2
  });

  ///////////////////////////////  Emit  ///////////////////////////////

  it('Every Player has a Character available', function () {
    const p1 = new Player({ id: 'player1', name: 'player1', owner: true });
    const p2 = new Player({ id: 'player2', name: 'player2' });
    const c1 = new Character({ id: 'player1', description: 'character input by player1' });
    const c2 = new Character({ id: 'player2', description: 'character input by player2' });
    const g1 = new Game({ id: 'game1' });
    g1.player.add(p1);
    g1.player.add(p2);
    g1.character.add(c1);
    expect(g1.characterPerPlayer()).not.be.true;
    g1.character.add(c2);
    expect(g1.characterPerPlayer()).be.true;
  });
  it('Every Player gets assigned a Character', function () {
    const emitted = [];
    const g = new Game({ id: 'game1' });
    const s1 = new SocketStub({ id: 'player1' });
    const s2 = new SocketStub({ id: 'player2' });
    s1.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    s2.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    const p1 = new Player({ id: 'player1', name: 'player1', owner: true });
    const p2 = new Player({ id: 'player2', name: 'player2' });
    const c1 = new Character({ id: 'player1', description: 'character input by player1' });
    const c2 = new Character({ id: 'player2', description: 'character input by player2' });
    g.socket.add(s1);
    g.socket.add(s2);
    g.player.add(p1);
    g.player.add(p2);
    g.character.add(c1);
    g.character.add(c2);
    g.started = true; // Testing purposes only
    g.assignCharacters();
    expect(Character.prototype.isPrototypeOf(p1.character)).be.true;
    expect(Character.prototype.isPrototypeOf(p2.character)).be.true;
    expect(p1.character).equal(c2);
    expect(p2.character).equal(c1);
  });
  it('Every Player gets assigned a Character diferent from the input one', function () {
    const emitted = [];
    const iter = 500;
    const g = new Game({ id: 'game1' });
    const s1 = new SocketStub({ id: 'player1' });
    s1.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    const p1 = new Player({ id: `player1`, name: `player1`, owner: true });
    const c1 = new Character({ id: `player1`, description: `character input by player1` });
    g.socket.add(s1);
    g.player.add(p1);
    g.character.add(c1);
    for (let i = 2; i <= iter; i++) {
      const s = new SocketStub({ id: `player${i}` });
      s.on('updatePlayers', function (data) {
        emitted.push(data)
      })
      const p = new Player({ id: `player${i}`, name: `player${i}` });
      const c = new Character({ id: `player${i}`, description: `character input by player${i}` });
      g.socket.add(s);
      g.player.add(p);
      g.character.add(c);
    }
    for (let i = 1; i <= iter; i++)
      expect(g.player.players[`player${i}`].character).be.undefined;
    g.assignCharacters();
    for (let i = 1; i <= iter; i++) {
      expect(Character.prototype.isPrototypeOf(g.player.players[`player${i}`].character)).be.true;
      expect(g.player.players[`player${i}`].character).not.equal(g.character.characters[`player${i}`])
    }
  });
  it('Game.startGame()', function () {
    const emitted = [];
    const iter = 10;
    const g = new Game({ id: 'game1' });
    const s1 = new SocketStub({ id: 'player1' });
    s1.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    const p1 = new Player({ id: `player1`, name: `player1`, owner: true });
    const c1 = new Character({ id: `player1`, description: `character input by player1` });
    g.socket.add(s1);
    g.player.add(p1);
    g.character.add(c1);
    expect(() => g.startGame(p1)).throw('Not enough players, the required minimum is two')
    for (let i = 2; i <= iter; i++) {
      const s = new SocketStub({ id: `player${i}` });
      s.on('updatePlayers', function (data) {
        emitted.push(data)
      })
      const p = new Player({ id: `player${i}`, name: `player${i}` });
      const c = new Character({ id: `player${i}`, description: `character input by player${i}` });
      g.socket.add(s);
      g.player.add(p);
      g.character.add(c);
    }
    const s11 = new SocketStub({ id: 'player11' });
    s11.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    const p11 = new Player({ id: `player11`, name: `player11` });
    g.player.add(p11);
    g.socket.add(s11);
    expect(() => g.startGame(g.player.get('player2'))).throw('A game can only be started by its owner');
    expect(() => g.startGame(p1)).throw('Some player have not input a Character yet');
    const c11 = new Character({ id: `player11`, description: `character input by player11` });
    g.character.add(c11);
    expect(g.started).not.be.true;
    g.startGame(p1);
    expect(g.started).be.true;
    expect(emitted.length).equal(11)
  });
  it('Emmit a players list with assigned characters after game start', function () {
    const emitted = [];
    const g = new Game({ id: 'game1' });
    const s1 = new SocketStub({ id: 'player1' });
    const s2 = new SocketStub({ id: 'player2' });
    s1.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    s2.on('updatePlayers', function (data) {
      emitted.push(data)
    })
    const p1 = new Player({ id: `player1`, name: `player1`, owner: true });
    const p2 = new Player({ id: `player2`, name: `player2` });
    const c1 = new Character({ id: `player1`, description: `character input by player1` });
    const c2 = new Character({ id: `player2`, description: `character input by player2` });
    g.socket.add(s1);
    g.socket.add(s2);
    g.player.add(p1);
    g.player.add(p2);
    g.character.add(c1);
    g.character.add(c2);
    expect(g.player.get('player1').character).be.undefined;
    expect(g.player.get('player2').character).be.undefined;
    g.startGame(p1);
    expect(Character.prototype.isPrototypeOf(g.player.get('player1').character)).be.true;
    expect(Character.prototype.isPrototypeOf(g.player.get('player2').character)).be.true;
    expect(emitted[0]['player1'].character.description).be.undefined;
    expect(emitted[0]['player2'].character.description).not.be.undefined;
    expect(emitted[1]['player1'].character.description).not.be.undefined;
    expect(emitted[1]['player2'].character.description).be.undefined;
  })

});