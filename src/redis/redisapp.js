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
var redisClient = new Redis([{"host":"127.0.0.1", "port":"6379"}]);
// var redisClient = new Redis({sentinels:[
//   {host:"10.232.46.24",port:"37001"},
//   {host:"10.232.46.24",port:"37002"},
//   {host:"10.232.46.24",port:"37003"}],
//   name:"core",
// });

redisClient.scan(0  ,'count' , 3, function(err , res){
  console.log(res instanceof Array);
  console.log(res);
});

function* scan(){
  var result = yield redisClient.scan('0');
  console.log('**********');
  console.log(result);
}
co(scan());
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

