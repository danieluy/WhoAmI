const assert = require('chai').assert;
const expect = require('chai').expect;

describe('Object', function(){
  it.only('????????????', function(){
    const Game = require('../my_modules/game.js');
    const Player = require('../my_modules/player.js');
    console.log(Game.player.players);
    let p = Object.create(Player);
    p.id = 'someId'
    Game.player.add(p);
    console.log(Game.player.players);

    let g = Object.create(Game);
    let p1 = Object.create(Player);
    p1.id = 'someOtherId'
    g.player.add(p1)

    console.log(Game.player.players);
  })
})

describe('Player', function () {
  let Player;

  before(function () {
    Player = require('../my_modules/player.js');
  });

  it('should instantiate a Player', function () {
    const p = Object.create(Player);
    assert.isTrue(Player.isPrototypeOf(p));
  });

});

describe('Game', function () {
  let Game;
  let Player;

  before(function () {
    Game = require('../my_modules/game.js');
    Player = require('../my_modules/player.js');
  });

  it('Instantiate a Game', function () {
    const g = Object.create(Game);
    assert.isTrue(Game.isPrototypeOf(g));
  });

  it('Add and retrieve a Game', function () {
    const games = {};
    const g1 = Object.create(Game);
    g1.id = 'someid';
    games[g1.id] = g1;
    const g2 = games.someid;
    g1.someKey = 'some value';
    assert.equal(g1.someKey, g2.someKey);
  });

  it('Add and retrieve a Player', function () {
    const g = Object.create(Game);
    const p1 = Object.create(Player);
    p1.id = 'someId'
    g.player.add(p1);
    const p2 = g.player.get('someId');
    p2.username = 'some name';
    assert.equal(p1.username, p2.username);
  });

  it('Should throw "Player already exists"', function () {
    const g = Object.create(Game);
    const p1 = Object.create(Player);
    const p2 = Object.create(Player);
    p1.id = 'someId';
    p2.id = 'someId';
    g.player.add(p1);
    try {
      g.player.add(p2);
    }
    catch (error) {
      assert.equal(error.message, "Player already exists");
    }
  });

});

describe('Character', function () {
  let Character;

  before(function () {
    Character = require('../my_modules/character.js');
  });

  it('should instantiate a Character', function () {
    const c = Object.create(Character);
    assert.isTrue(Character.isPrototypeOf(c));
  });

});