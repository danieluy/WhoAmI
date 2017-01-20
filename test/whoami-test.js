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
    expect(JSON.stringify(emitted[0]).replace(' ', '')).equal('{"socket1":{"id":"socket1","name":"player1","owner":true}}');
    g.socket.add(s2);
    g.player.add(p2);
    g.updatePlayers();
    expect(emitted.length).equal(3);// total count of emitions
    expect(emitted[0]).equal(emitted[1]);
  });

  ///////////////////////////////  Emit  ///////////////////////////////
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


});