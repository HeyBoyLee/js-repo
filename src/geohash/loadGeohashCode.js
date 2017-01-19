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
var cluster = require('cluster');
var co = require('co');
var Redis = require('ioredis');
var thunkify = require('thunkify');
var logger = require('tracer').console();
var open = thunkify(fs.open);
var redisClient = new Redis([{"host":"127.0.0.1", "port":"6379"}]);

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
var endLine = 35159307;
var startLine = 23439538;
var FILE = './city/bj.json';

// var endLine = 304;
// var startLine = 0;
// var FILE = './city/test.json';

//var BUF_SIZE=90;
var START = 0; //不变
var SIZE=900;
var POSITION=0;//164902680;
var updateDateLen =0;
var imeiCountLen =0;
var setNum = 0;
var workerNum = 6;

if(cluster.isWorker){
  // logger.debug('[%d] start:%d, end:%d', process.pid, process.env.start/9, process.env.end/9);
  co(readFile(Number(process.env.start) , Number(process.env.end)));

}else if(cluster.isMaster){
  var i;
  var line = endLine - startLine;
  var wl = Math.round(line/workerNum);
  //var ls = [{start:POSITION, end:}, wl, wl, wl, line-(4*wl)];
  for(i=0; i<workerNum; i++){
    var args = {};
    if(i == workerNum -1){
      args = {start: (startLine+wl*i)*9, end: endLine*9};
    }else{
      args = {start: (startLine+wl*i)*9, end: (startLine+wl*(i+1))*9};
    }
    cluster.fork(args);
  }
}

function* readFile(s, e){
  var fd = yield open(FILE,'r');
  var buf = null;
  POSITION = s;
  var bStop = false;
  var bytes = 0;
  logger.debug('[%d] start=%d, end=%d', process.pid, s/9, e/9);
  while(true){
    if(POSITION+SIZE >= e){
      SIZE = e-POSITION;
      bStop = true;
    }
    buf = new Buffer(SIZE);
    bytes = fs.readSync(fd, buf, START, SIZE, POSITION);
    POSITION += bytes;
   // var tp = POSITION+readfile;
    var arr = buf.toString().trim('\n').split('\n');
    // if(tp >= e) {
    //   arr = _.dropRight(arr, (tp-e)/9);
    //   logger.info('************');
    //   logger.info('[%d]end -> %d', process.pid, e/9);
    //   logger.info('[%d]last element -> %d', process.pid, arr[arr.length-1]);
    //   POSITION = e;
    //   bStop = true;ta
    // }
    // else{
    //   POSITION += readfile;
    // }
    arr = arr.map(function(c){return new RegExp('^'+c)});
    var result = yield model.find({loc_geohash:{$in:arr}},{_id:0, deviceType:0});
    var obj = {};
    logger.info('[%d] result length:%d, element:%s', process.pid, result.length, arr[arr.length -1]);
    _.each(result, function(v){
      if(obj[v.loc_geohash]){
        var o = obj[v.loc_geohash];
        if(v.updateDate > o.updateDate){
          //++updateDateLen;
          obj[v.loc_geohash] = {imeiCount: v.imeiCount, date: v.updateDate, bssid: v.bssid};
          redisClient.set(v.loc_geohash, v.bssid);
        }else if(v.imeiCount > o.imeiCount){
          //++imeiCountLen;
          obj[v.loc_geohash] = {imeiCount: v.imeiCount, date: v.updateDate, bssid: v.bssid};
          redisClient.set(v.loc_geohash, v.bssid);
        }
      }else{
        obj[v.loc_geohash] = {imeiCount: v.imeiCount, date: v.updateDate, bssid: v.bssid};
        redisClient.set(v.loc_geohash, v.bssid);
        //++setNum ;
      }
    });
    // console.log('---------------');
    // console.log('readfile 字节数 :'+readfile);
    // console.log('arr 长度:'+arr.length);
    // console.log('updateDate替换个数:'+updateDateLen);
    // console.log('imeiCount替换个数:'+imeiCountLen);
    // console.log('已设置个数:'+setNum);

    // logger.info('[%d]position at: %d', process.pid, POSITION);
    logger.info('[%d]已读行数：%d', process.pid, (POSITION)/9);

    if(bStop){
      logger.info('[%d] last element:%s', process.pid, arr[arr.length-1]);
      logger.info('######');
      process.exit(1);
      return;
    }
  }
}

