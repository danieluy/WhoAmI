const assert = require('chai').assert;
const expect = require('chai').expect;
const Game = require('../my_modules/game.js');
const Player = require('../my_modules/player.js');
const Character = require('../my_modules/character.js');
const SocketStub = require('./mock_files/socket.js');

describe('Player', function () {

  it('Instantiate a Player', function () {
    const p = Player.create();
    assert.isTrue(Player.isPrototypeOf(p));
  });

});

describe('Character', function () {

  it('Instantiate a Character', function () {
    const c = Character.create();
    assert.isTrue(Character.isPrototypeOf(c));
  });

});

describe('Game', function () {

  let games = undefined;

  beforeEach(function(){
    games = {};
  })

  ///////////////////////////////  Game  ///////////////////////////////

  it('Instantiate a Game', function () {
    const g1 = Game.create();
    const g2 = Game.create();
    assert.isTrue(Game.isPrototypeOf(g1));
    assert.isTrue(Game.isPrototypeOf(g2));
    expect(g1).not.equal(g2)
  });
  it('Add and retrieve a Game', function () {
    const g1 = Game.create('someid');
    games['someid'] = g1;
    g1.someKey1 = 'some value 1';
    const g2 = games['someid'];
    g2.someKey2 = 'some value 2';
    assert.equal(g1.id, g2.id);
    assert.equal(g1.someKey1, g2.someKey1);
    assert.equal(g1.someKey2, g2.someKey2);
  });

  ///////////////////////////////  Player  ///////////////////////////////

  it('Add and retrieve a Player', function () {
    const g = Game.create('game');
    const p1 = Player.create('player');
    g.player.add(p1);
    expect(g.player.get('player')).equal(p1);
    expect(g.player.players.hasOwnProperty('player')).be.true;
  });
  it('Delete a Player', function () {
    const g = Game.create('game');
    const p1 = Player.create('player');
    g.player.add(p1);
    g.player.remove('player');
    expect(g.player.get('player')).be.undefined;
    expect(g.player.players.hasOwnProperty('player')).be.false;
  });
  it('Prevent duplicate players', function () {
    const g = Game.create('game');
    const p1 = Player.create('player');
    const p2 = Player.create('player');
    g.player.add(p1);
    expect( () => g.player.add(p2) ).to.throw("Player already exists");
  });

  ///////////////////////////////  Character  ///////////////////////////////

  it('Add and retrieve a Character', function () {
    const g = Game.create('game');
    const c1 = Character.create('char');
    g.character.add(c1);
    expect(g.character.get('char')).equal(c1);
    expect(g.character.characters.hasOwnProperty('char')).be.true;
  });
  it('Delete a Character', function () {
    const g = Game.create('game');
    const c1 = Character.create('char');
    g.character.add(c1);
    g.character.remove('char');
    expect(g.character.get('char')).be.undefined;
    expect(g.character.characters.hasOwnProperty('char')).be.false;
  });
  it('Prevent duplicate characters', function () {
    const g = Game.create('game');
    const c1 = Character.create('char');
    const c2 = Character.create('char');
    g.character.add(c1);
    expect( () => g.character.add(c2) ).to.throw("Character already exists");
  });

  ///////////////////////////////  Socket  ///////////////////////////////

  it('Add and retrieve a Socket', function () {
    const g = Game.create('game');
    const s1 = SocketStub.create('socket');
    g.socket.add(s1);
    expect(g.socket.get('socket')).equal(s1);
    expect(g.socket.sockets.hasOwnProperty('socket')).be.true;
  });
  it('Delete a Socket', function () {
    const g = Game.create('game');
    const s1 = SocketStub.create('socket');
    g.socket.add(s1);
    g.socket.remove('socket');
    expect(g.socket.get('socket')).be.undefined;
    expect(g.socket.sockets.hasOwnProperty('socket')).be.false;
  });
  it('Prevent duplicate sockets', function () {
    const g = Game.create('game');
    const s1 = SocketStub.create('socket');
    const s2 = SocketStub.create('socket');
    g.socket.add(s1);
    expect( () => g.socket.add(s2) ).to.throw("Socket already exists");
  });

});