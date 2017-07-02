var Redis = require('ioredis');

var cluster = new Redis.Cluster([
  {host:'10.118.29.53',port:9128},
  {host:'10.118.29.53',port:9129},
  {host:'10.118.15.29',port:9130},
  {host:'10.118.15.29',port:9131},
  {host:'10.118.15.28',port:9132},
  {host:'10.118.15.28',port:9133}
]);

var pipeline = cluster.pipeline();

pipeline.get('wqjdbpud');
pipeline.get('wx4spb1v');
pipeline.get('wtmww3p1');
pipeline.exec(function(err , result){
  console.log(222);
  console.log(result);
});




