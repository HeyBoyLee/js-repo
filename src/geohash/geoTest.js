var loc = [116.358882,40.079018];
// var loc = [108.99652966666665, 34.251886166666665];
// var loc = [119.19502972000001, 35.75455784666666];
// var loc = [121.59382166666667, 37.3949105];
// var loc = [113.28303357638889, 23.102542409722222];
//var loc = [119.53290883333335, 35.40887641666667];
// var loc = [116.327882833333, 40.0260475];
// var loc =  [118.642497, 31.921281]
var geohash = require('ngeohash');
var _ = require('lodash');
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
var co = require('co');
var Redis = require('ioredis');
var redisClient = new Redis([{"host":"127.0.0.1", "port":"6379"}]);

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

// var h = geohash.encodeGeoHash(loc[1], loc[0]);
// console.log(h);
//
// var l = geohash.decodeGeoHash(h);
// console.log(l);
//
// var th = geohash.calculateAdjacent(h, 'top');
// console.log(th);
// var tl = geohash.decodeGeoHash(th);
// console.log(tl);


//geohash.bboxes (minlat, minlon, maxlat, maxlon, precision=9)

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

var radius = 500;
var acc = 9;
var imeicount = 1;
var or = getRound(loc[1], loc[0], radius);
console.log(or);
var ir = getRound(loc[1], loc[0], radius-radius);
console.log(ir);

var olist = geohash.bboxes(or.minlat, or.minlon, or.maxlat, or.maxlon, acc);

var ilist = geohash.bboxes(ir.minlat, ir.minlon, ir.maxlat, ir.maxlon, acc);
var list = _.difference(olist, ilist);
// list=list.map(function(l){
//   return new RegExp('^'+l);
// });
// list=list.map(function(l){
//   return {loc_geohash: new RegExp('^'+l)};
// });

var wifis = [];
var data = [['标题',	'经度','纬度','地图']];
var obj = {};
var t = Date.now();
//console.log(new Date().Format("yyyy-MM-dd hh:mm:ss.S"));
//console.log('list:'+list);
var resultLen = 0;
var updateDateLen = 0;
var imeiCountLen = 0;


//readDB();

function* storeWifiDatas(){
  var i ;
  for(i =0; i< list.length; i++){
    var b = yield model.findOne({loc_geohash:list[i]},{bssid:1, _id:0});
    if(!_.isEmpty(b))redisClient.set(list[i],b.bssid);
  }
  console.log('总时长:'+(new Date() - t));
}
//co(storeWifiDatas());

function* readCache(){
  var r = yield redisClient.mget(list);

  wifis = _.difference(r, [null]);
  console.log('确定wifi个数:'+wifis.length);
  console.log('总时长:'+(new Date() - t));
}
//co(readCache());

function readDB(){
  model.find({loc_geohash:{$in:list},imeiCount:{$gte:imeicount}},{_id:0}).exec()
  //model.find({$or:list,imeiCount:{$gte:imeicount}},{_id:0}).exec()
    .then(function(result){
      console.log('查询时长:'+(new Date() - t));
      resultLen = result.length;
      console.log('geohash块:'+list.length);
      console.log('wifi个数:'+resultLen);
      _.each(result,function(v){
        var c = v.loc.coordinates;
        var d = ['', c[0], c[1], '谷歌'];
        if((c[0] <= or.maxlon && c[1] <=or.maxlat )&&(c[0] >= or.minlon && c[1] >= or.minlat)){
          if(obj[v.loc_geohash]){
            var o = obj[v.loc_geohash];
            if(v.updateDate > o.updateDate){
              ++updateDateLen;
              _.pull(wifis, o.bssid);
              _.pull(data, o.coordinates);
              data.push(d);
              wifis.push(v.bssid);

              //redisClient.delete(o.loc_geohash);
              redisClient.set(v.loc_geohash ,v.bssid);

            }else if(v.imeiCount > o.imeiCount){
              ++imeiCountLen;
              _.pull(wifis, o.bssid);
              _.pull(data, o.coordinates);
              data.push(d);
              wifis.push(v.bssid);
              //redisClient.delete(o.loc_geohash);
              redisClient.set(v.loc_geohash ,v.bssid);
            }
          }else{
            obj[v.loc_geohash] = {imeiCount: v.imeiCount, date: v.updateDate, coordinates: d};
            wifis.push(v.bssid);
            data.push(d);
            redisClient.set(v.loc_geohash, v.bssid);
          }
        }
      });
      console.log('确定wifi个数:'+wifis.length);
      console.log('过滤掉的wifi个数:'+(resultLen - wifis.length));
      console.log('根据updateDate替换个数:'+updateDateLen);
      console.log('根据imeiCount替换个数:'+imeiCountLen);
      //console.log(new Date().Format("yyyy-MM-dd hh:mm:ss.S"));
      console.log('总时长:'+(new Date() - t));

      var buffer = xlsx.build([{name:'coordinates', data:data}]);
      //fs.writeFileSync('./1000-3.xlsx', buffer, 'binary');
      console.log('over!');
    });
}

//console.log(wifis.length);

