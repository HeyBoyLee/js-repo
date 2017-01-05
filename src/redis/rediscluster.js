var Redis = require('ioredis');

var cluster = new Redis.Cluster([
  {host:'10.232.46.56',port:7000},
  {host:'10.232.46.56',port:7001},
  {host:'10.232.46.56',port:7002},
  {host:'10.232.46.56',port:7003},
  {host:'10.232.46.56',port:7004},
  {host:'10.232.46.56',port:7005}
]);

cluster.get('hi',function(err , res){
  console.log(res);
});

cluster.set('hui' , 'feng');

cluster.get('hui' , function(err , res){
  console.log(555);
  console.log(res);
});

var pipeline = cluster.pipeline();

pipeline.hset('hash' , 'luck' , 'good');

// pipeline.exec(function(err , result){
//   console.log(111);
//   console.log(result);
// });

pipeline.hgetall('hash');
pipeline.exec(function(err , result){
  console.log(222);
  console.log(result);
})

var stream = cluster.hscanStream('hash' , {match:"l*"});
stream.on('data' , function(res){
  console.log(333);
  console.log(res);
});
stream.on('end' , function(err , result){
  console.log(444);
  console.log(result);
});





