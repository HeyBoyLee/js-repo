var Redis = require('ioredis');
var co = require('co');
var client = new Redis({"host":"127.0.0.1", "port":"6379"});
//var client = new Redis({"host":"10.232.46.56", "port":"6379"});
// Redis (error) NOAUTH Authentication required
// var client = new Redis({sentinels:[
//     {host:"127.0.0.1",port:"26379" , password:"012_345^678-90"} ,
//     {host:"127.0.0.1",port:"26479", password:"012_345^678-90"},
//     {host:"127.0.0.1",port:"26579", password:"012_345^678-90"}],
//   });

// ok
// var client = new Redis({sentinels:[
//     {host:"127.0.0.1",port:"26379"} ,
//     {host:"127.0.0.1",port:"26479"},
//     {host:"127.0.0.1",port:"26579"}],
//   name:"def_master",
//   });
co(getHi);
function* getHi(){
  var hi = yield client.get('hi');
  console.log(hi);
}


client.set('token', 'abcd' , 'EX' , 1000 , function(err, res){
  console.log(err , res);
  console.log('@@@@@');
});

// client.setex('niu','bi',30,function(err , res){
//   console.log(err , res);
//   console.log('^^^^^^^');
// })

client.get('token').then(function(data){
  console.log(data);
});


function* getAllvals(){
  //yield log();
  var s = yield client.hvals('token1');
  console.log(s);
}

function* getAllvals2(){
  //yield log();
  yield client.hvals('token1');
  yield client.hvals('token1');
}

//co(getAllvals);
var f =getAllvals2();
f = f.next();
//console.log(f);

client.hvals('token1').then(function(s){
  console.log(s);
});


client.hset('token1' , "hello" , "world" ,function(err , res){
  console.log('-----');
  console.log(err , res);
});
client.expire('token1' ,10 , function(err , res){
  console.log('*****');
  console.log(err , res);
});

//client.close();




