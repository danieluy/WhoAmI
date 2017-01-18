module.exports = {
  id: undefined,
  create: function(id){
    const instance = Object.create(this);
    instance.id = id;
    return instance;
  }
}