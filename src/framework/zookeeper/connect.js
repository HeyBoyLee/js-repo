module.exports = function(){
  var zookeeper = require('node-zookeeper-client');
  var client = zookeeper.createClient(C.zookeeper.uri , {sessionTimeout: 100000});
  client.on('state', function(state){
    console.log("[zookeeper]: client state:"+state);
  });
  client.connect();
  return client;
}();

