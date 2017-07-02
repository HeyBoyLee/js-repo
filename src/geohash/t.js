var loc = [116.327882, 40.026047];
var loc1 = [116.3278, 40.02604];
var geohash = require('ngeohash');
var _ = require('lodash');
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
var co = require('co');
var Redis = require('ioredis');

var db = mongoose.createConnection("mongodb://127.0.0.1:27017/metok_core");


var collection = 'wifi_position';
var schema = new mongoose.Schema({
  loc: {
    type: { type :String },
    coordinates: [Number]
  },
  imeiCount: Number,
  updateDate: Date,
  loc_geohash: String,
  bssid: String,
  ssid: String
});

var model = db.model(collection, schema, collection);

// console.log(geohash.neighbors('wx4gcpfcc'));
console.log(geohash.encode(loc[1], loc[0], 12));
console.log(geohash.encode(loc1[1], loc1[0], 12));

// model.find({bssid:"00:00:00:01:00:20"}).exec()
//   .then(function(result){
//     console.log(result);
//   });

//model.findOne({bssid:{$in:["00:00:c5:00:83:04"]}});

function *gen(){
  console.log("###");
  var result = yield model.findOne({bssid:"00:00:00:01:00:20"});
  console.log("111:"+result)
}
// co(gen);
 var g = gen();
var p = g.next();
p.then();
// yield * g;
//
// var y = g.next();
//console.log(y);
// g.next();
// var x = 0;
// function *gen(){
//   // for(var i=0;i<10000;i++){
//   //   x ++;
//   // }
//   x++;
//   yield x;
//   x++
// }
//
// var g = gen();
// g.next();
//
// console.log(x);
// g.next();
// console.log(x);