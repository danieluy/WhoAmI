"use strict";

const User = {
  id: '',
  username: ''
}

const list = {
  list: {},
  add: function (user) {
    if(this.list.hasOwnProperty(user.username))
      throw `The username "${user.username}" already exists`;
    else
      this.list[user.username] = user;
  },
  exists: function (user) {
    for (let i = 0; i < this.list.length; i++)
      if (this.list[i].id === user.id) return true;
    return false;
  },
  item: function (pos) {
    return this.list[pos];
  },
  get length() {
    return this.list.length;
  }
}

module.exports = {
  User: User,
  list: list
}