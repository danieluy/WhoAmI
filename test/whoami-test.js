const assert = require('chai').assert;
const expect = require('chai').expect;

describe('player.js', function () {
  let Player;

  before(function () {
    Player = require('../my_modules/player.js');
  });

  it('should instantiate a Player', function () {
    const p = Object.create(Player);
    assert.isTrue(Player.isPrototypeOf(p));
  });

});

describe('game.js', function () {
  let Game;

  before(function () {
    Game = require('../my_modules/game.js');
  });

  it('should instantiate a Game', function () {
    const g = Object.create(Game);
    assert.isTrue(Game.isPrototypeOf(g));
  });

  it('should add a Game', function () {
    const g = Object.create(Game);
    assert.isTrue(Game.isPrototypeOf(g));
  });

});

describe('character.js', function () {
  let Character;

  before(function () {
    Character = require('../my_modules/character.js');
  });

  it('should instantiate a Character', function () {
    const c = Object.create(Character);
    assert.isTrue(Character.isPrototypeOf(c));
  });

});