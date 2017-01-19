const SocketStub = {
  id: undefined,
  events: {},
  create: function (values) {
    const instance = Object.create(this);
    if (values)
      Object.keys(values).forEach(function (key) {
        instance[key] = values[key];
      })
    return instance;
  },
  on: function (event_name, callback) {
    this.events[event_name] = this.events[event_name] || [];
    this.events[event_name].push(callback);
  },
  off: function(event_name, callback) {
    if (this.events[event_name]) {
      this.events[event_name] = this.events[event_name].filter(function(evtCb){
        return callback.toString() !== evtCb.toString()
      })
    }
  },
  emit: function (event_name, data) {
    if (this.events[event_name]) {
      this.events[event_name].forEach(function(callback) {
        callback(data);
      });
    }
  }
}

Object.defineProperty(SocketStub, '__type__', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: 'SocketStub'
});

module.exports = SocketStub;