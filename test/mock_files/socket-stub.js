"use strict";

const SocketStub = function (values) {
  this.id = values.id || undefined;
  this.events = {};
  this.on = function (event_name, callback) {
    this.events[event_name] = this.events[event_name] || [];
    this.events[event_name].push(callback);
  };
  this.off = function (event_name, callback) {
    if (this.events[event_name]) {
      this.events[event_name] = this.events[event_name].filter(function (evtCb) {
        return callback.toString() !== evtCb.toString()
      })
    }
  };
  this.emit = function (event_name, data) {
    if (this.events[event_name]) {
      this.events[event_name].forEach(function (callback) {
        callback(data);
      });
    }
  };
}

module.exports = SocketStub;