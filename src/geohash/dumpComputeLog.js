
var geohash = require('ngeohash');
var _ = require('lodash');
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
var co = require('co');
var Redis = require('ioredis');

var db = mongoose.createConnection("mongodb://127.0.0.1:27017/metok_core");

var collection = 'apiStatistic';
var schema = mongoose.Schema({
  v : {type : String, trim : true},
  s : {type : String, trim : true},
  cellKey : {type : String, trim : true},
  cell : {type : Number, trim : true},
  bssid : {type : Number, trim : true},
  wifiKey : {type : String, trim : true},
  count : {type : Number},
  found : {type : Boolean},
  reason : {type : String, trim : true},
  app : {type : String, trim : true},
  highAccuracy : {type : Boolean},
  imei : {type : Number, trim : true},
  model : {type : String, trim : true},
  version : {type : String, trim : true},
  sdk : {type : String, trim : true},
  status : {type : Number},
  timeStamp : {type : String, trim : true},
  createDate : {type : Date, default : new Date()}
});

var model = db.model(collection, schema, collection);

model.find({s:"sdk", timeStamp:{$gte:"2017-01-24 00:00:00"}}).exec()
  .then(function(result){
    console.log(result.length);
    _.each(result, function(d){
      var b = new Buffer(JSON.stringify(d)+'\n');
      fs.appendFileSync('./dump_apiStatistic.log', b, 'binary');
    });
    console.log('over');
  });