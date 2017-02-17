
var geohash = require('ngeohash');
var _ = require('lodash');
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
var co = require('co');
var Redis = require('ioredis');

var db = mongoose.createConnection("mongodb://10.232.41.42:27017/metok_core");
// var db = mongoose.createConnection("mongodb://10.118.35.2:27020,10.118.36.2:27020,10.118.38.29:27020,10.136.5.44:27020/metok_core", {
//   replset: "miuisysMetokRs",
//   readPreference : "secondary",
//   auth: "SCRAM-SHA-1",
//   user: "wlf",
//   pass: "ms10vif"
// });

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

model.find({bssid:{$in:["00:00:c5:00:83:04"]}}).exec()
  .then(function(result){
    console.log(result);
  });