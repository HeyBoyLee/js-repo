var loc = [116.358882,40.079018];

var geohash = require('ngeohash');
var _ = require('lodash');
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
var co = require('co');
var Redis = require('ioredis');
var redisClient = new Redis([{"host":"127.0.0.1", "port":"6379"}]);
var FILE = 'b815_1000m';
var res = require('./res/'+FILE);
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
var data = [['标题',	'经度','纬度','地图']];
var wifis;
try{
  wifis = res.areaData[FILE].wifis;
}catch(e){
  wifis = res.wifis;
}

//gen_excel();
function gen_excel(){
  model.find({bssid:{$in:wifis}},{_id:0}).exec()
    .then(function(result){
      // console.log('查询时长:'+(new Date() - t));
      resultLen = result.length;

      console.log('wifi个数:'+resultLen);
      var i = 0;
      _.each(result,function(v){
        var c = v.loc.coordinates;
        var d = [++i, c[0], c[1], '谷歌'];
        data.push(d);
      });

      var buffer = xlsx.build([{name:'coordinates', data:data}]);
      fs.writeFileSync('./excel/'+FILE+'.xlsx', buffer, 'binary');
      console.log('over!');
    });
}

gen_excel_no_db();
function gen_excel_no_db(){
  var wifis = res.wifis;
  var i =0;
  _.each(wifis,function(v){
    try{
      var c = v.loc;
      var d = [++i, c[0], c[1], '谷歌'];
      data.push(d);
    }catch(e){
      console.log(e);
    }
  });
  var buffer = xlsx.build([{name:'coordinates', data:data}]);
  fs.writeFileSync('./excel/'+FILE+'.xlsx', buffer, 'binary');
  console.log('over!');
}


//console.log(wifis.length);

