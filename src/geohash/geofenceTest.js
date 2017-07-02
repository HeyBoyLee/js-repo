var geohash = require('ngeohash');
var _ = require('lodash');
var Redis = require('ioredis');
var co = require('co');
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

function getGeohashList(loc, radius){
  var r = getRound(loc[1], loc[0], radius);
  var acc = 8;
  var geohash_list = geohash.bboxes(r.minlat, r.minlon, r.maxlat, r.maxlon, acc);
  return geohash_list;
}

function getGeohashCode(loc){
  var acc = 5;
  return geohash.encode(loc[1], loc[0], acc);
}

// var redisClient = new Redis.Cluster([
//   {host:'redis-phone-geo-huyu-dba.marathon.mesos-c3',port:6380}
// ]);

var loc = [116.327882833333, 40.0260475];
var code = getGeohashCode(loc);
var geohash_list = getGeohashList(loc, 500);

function* getValue(){
  console.log(code);
  console.log(geohash_list.length);
  var result = yield redisClient.hmget("metok:geofence:wifi:"+code, geohash_list);
  //result = _.difference(result, [null]);
  console.log(result.length);
}

co(getValue);
