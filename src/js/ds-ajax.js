// data = {
//   url: 'http://domain/route',
//   successCb: function(),
//   errorCb: function()
//   [, params: {key: value, ...}]
//   [, onEndCb: function()]
//   [, delayMs: integer]
// }
module.exports = (function (){

  var req;

  function init (successCb, errorCb, onEndCb, delayMs){
    req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200){
        if(delayMs) simulateDelay(parseInt(delayMs));
        if(onEndCb) onEndCb();
        successCb(this.responseText)
      }
      else if (this.readyState == 4){
        if(onEndCb) onEndCb();
        errorCb(this.responseText);
      }
    };
  }

  function get (data){
    console.log(data);
    checkData(data);
    init(data.successCb, data.errorCb, data.onEndCb, data.delayMs);
    req.open('GET', (data.params ? (data.url + '?' + formatParams(data.params)) : data.url), true);
    req.send();
  }

  function post (data){
    checkData(data);
    init(data.successCb, data.errorCb, data.onEndCb, data.delayMs);
    req.open('POST', data.url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data.params ? req.send(formatParams(data.params)) : req.send();
  }

  function put (data){
    checkData(data);
    init(data.successCb, data.errorCb, data.onEndCb, data.delayMs);
    req.open('PUT', data.url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data.params ? req.send(formatParams(data.params)) : req.send();
  }

  function formatParams (params){
    var str_params = '';
    for(var key in params){
      if(params[key]){
        str_params += key + '=' + params[key] + '&';
      }
    }
    return str_params.slice(0,-1);
  }

  function checkData (data){
    if(!data.url)
      throw 'ERROR - dsAjax.js - A URL must be provided';
    if(!data.successCb)
      throw 'ERROR - dsAjax.js - A success handler must be provided';
    if(!data.errorCb)
      throw 'ERROR - dsAjax.js - A error handler must be provided';
    if(data.delayMs && isNaN(parseInt(data.delayMs)))
      throw 'ERROR - dsAjax.js - The optional parameter delayMs can only be an integer';
  }

  function simulateDelay (ms){
    var start = new Date().getTime();
    while (new Date().getTime() < start + ms) {continue}
    return;
  }

  return {
    post: post,
    get: get,
    put: put,
    simulateDelay: simulateDelay
  }

})();
