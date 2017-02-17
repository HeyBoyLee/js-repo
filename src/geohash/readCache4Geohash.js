var geohash = require('ngeohash');
var _ = require('lodash');
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
var co = require('co');
var Redis = require('ioredis');
var redisClient = new Redis([{"host":"10.106.125.78", "port":"6379"}]);


function getRound(lat, lon, radius){
  var PI = 3.14159265;               // 圆周率
  var EARTH_RADIUS = 6378137;     // 地球半径
  var RAD = Math.PI / 180.0;         // 弧度
  var result = {};

  var latitude = lat;
  var longitude = lon;
  var degree = (24901*1609)/360.0;
  var raidusMile = radius;

  var dpmLat = 1/degree;
  var radiusLat = dpmLat*raidusMile;
  var minLat = latitude - radiusLat;
  var maxLat = latitude + radiusLat;

  var mpdLng = degree*Math.cos(latitude * (PI/180));
  var dpmLng = 1 / mpdLng;
  var radiusLng = dpmLng*raidusMile;
  var minLng = longitude - radiusLng;
  var maxLng = longitude + radiusLng;
  result['minlat']=minLat;
  result['minlon']=minLng;
  result['maxlat']=maxLat;
  result['maxlon']=maxLng;
  return result;
}
var loc = [116.358882,40.079018];

var radius = 500;
var acc = 9;
var or = getRound(loc[1], loc[0], radius);
console.log(or);

var olist = geohash.bboxes(or.minlat, or.minlon, or.maxlat, or.maxlon, acc);


var wifis = [];
var t = Date.now();

function* readCache(){
  var r = yield redisClient.mget(olist);

  wifis = _.difference(r, [null]);
  console.log('确定wifi个数:'+wifis.length);
  console.log('总时长:'+(new Date() - t));
}
co(readCache());

