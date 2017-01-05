global.C = {
  "zookeeper": {
    "uri": "127.0.0.1:2181"
  },
  logger: require('tracer').colorConsole({level: 'debug'}),
};
var zk = require('./index');


zk.registerService('zkTEST','9898',function(err , res){
  console.log(err, res);
});