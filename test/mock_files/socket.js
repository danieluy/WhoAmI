module.exports = {
  emitions: [],
  emit: function(event, data){
    this.emitions.push([event, data])
  }
}