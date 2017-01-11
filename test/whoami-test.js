const assert = require('assert');

describe('users.js', function () {
  let users;
  let list;
  let User;

  before(function () {
    users = require('../my_modules/users.js');
    list = users.list;
    User = users.User;
  });

  it('should instantiate a User', function () {
    const u1 = Object.create(User);
    assert.ok(User.isPrototypeOf(u1));
  });

  it('should add a User', function () {
    const u1 = Object.create(User);
    let length = list.length;
    list.add(u1);
    assert.equal(length+1, list.length);
    assert.ok(User.isPrototypeOf(list.item(0)));
  });

});