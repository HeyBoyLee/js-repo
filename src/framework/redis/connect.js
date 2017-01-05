module.exports = function(info,uri){
  var Redis = require('ioredis');
  var client = null;
  //var info = C.redis.info;
  switch (info.mode){
    case "single":
      client = new Redis(uri[0]);
      break;
    case "sentinels":
      var opt = {name:info.name};
      client = new Redis(uri, opt );
      break;
    case "cluster":
      client = new Redis.Cluster(uri);
      break;
  }
  return client;
}();