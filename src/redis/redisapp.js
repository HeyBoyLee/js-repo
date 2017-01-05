/**
 redis 支持的类型
 1, key: String
 2, key: {key: value} -> hash
 3, key: [] -> list
 4, key: [] -> set
 5, key: [] -> sortedset
 6, key: hyperloglog
 7, key: geo
 */
var co = require('co');
var Redis = require('ioredis');
//var redisClient = new Redis([{"host":"127.0.0.1", "port":"6379"}]);
var redisClient = new Redis({sentinels:[
  {host:"127.0.0.1",port:"26379"} ,
  {host:"127.0.0.1",port:"26479"},
  {host:"127.0.0.1",port:"26579"}],
  name:"def_master",
});

redisClient.scan(0 , 'match' , 'li*' ,'count' , 3, function(err , res){
  console.log(res);
});

function* scan(){
  var result = yield redisClient.scan('0');
  console.log('**********');
  console.log(result);
}
//co(scan());
console.log(2222);
var f = scan.bind(this);
var gen = f();
console.log(f);
var stream =  redisClient.scanStream({match: 'li*' /*, count: 1*/});
var keys = new Array();

stream.on('data', function(resultKeys){
  console.log('----------');
  console.log(resultKeys);
  console.log('----------');
});

stream.on('end', function(err){
  console.log('end:'+err);
});


var hStream = redisClient.hscanStream('test' ,{match:'*key*'});

hStream.on('data', function(hash){
  console.log('hash');
  console.log(hash);
});

