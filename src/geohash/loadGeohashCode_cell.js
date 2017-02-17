var loc = [116.358882,40.079018];
var geohash = require('ngeohash');
var _ = require('lodash');
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
var cluster = require('cluster');
var co = require('co');
var Redis = require('ioredis');
var thunkify = require('thunkify');
var execSync = require('child_process').execSync;
var logger = require('tracer').console();
var open = thunkify(fs.open);
var redisClient = new Redis([{"host":"127.0.0.1", "port":"6379"}]);

var db = mongoose.createConnection("mongodb://127.0.0.1:27017/metok_core");

// var db = mongoose.createConnection("mongodb://10.118.35.2:27020,10.118.36.2:27020,10.118.38.29:27020,10.136.5.44:27020/metok_core", {
//   replset: "miuisysMetokRs",
//   readPreference : "secondary",
//   auth: "SCRAM-SHA-1",
//   user: "wlf",
//   pass: "ms10vif"
// });

var collection = 'cell_position';
var schema = new mongoose.Schema({
  key: String,
  mcc: Number,
  mnc: Number,
  lac: Number,
  cid: Number,
  loc: {
    type: { type :String },
    coordinates: [Number]
  },
  diam: Number,
  samples: Number,
  accuracy: Number
});


var model = db.model(collection, schema, collection);

var FIELD = 'metok-geofence-cell';
var ONE = 9;
var FILE = './city'+(ONE-1)+'/test.json';
var START = 0; //不变
var SIZE= ONE * 1;
var POSITION=0;//164902680;
// var updateDateLen =0;
// var imeiCountLen =0;
// var setNum = 0;
var workerNum = 3;
var startLine = 0;
var endLine = execSync('wc -l '+FILE);
endLine = Number(endLine.toString().split(' ')[0]);
logger.debug('[%d] end line number:%d', process.pid, endLine);

if(cluster.isWorker){
  // logger.debug('[%d] start:%d, end:%d', process.pid, process.env.start/ONE, process.env.end/ONE);
  co(readFile(Number(process.env.start) , Number(process.env.end)));

}else if(cluster.isMaster){
  var i;
  var line = endLine - startLine;
  var wl = Math.round(line/workerNum);
  //var ls = [{start:POSITION, end:}, wl, wl, wl, line-(4*wl)];
  for(i=0; i<workerNum; i++){
    var args = {};
    if(i == workerNum -1){
      args = {start: (startLine+wl*i)*ONE, end: endLine*ONE};
    }else{
      args = {start: (startLine+wl*i)*ONE, end: (startLine+wl*(i+1))*ONE};
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
  logger.debug('[%d] start=%d, end=%d', process.pid, s/ONE, e/ONE);
  while(true){
    if(POSITION+SIZE >= e){
      SIZE = e-POSITION;
      bStop = true;
    }
    buf = new Buffer(SIZE);
    bytes = fs.readSync(fd, buf, START, SIZE, POSITION);
    POSITION += bytes;

    var arr = buf.toString().trim('\n').split('\n');

    logger.info('[%d], element:%s', process.pid, arr[arr.length -1]);

    if(1){
      arr = arr.map(function(c){return new RegExp('^'+c)});
      var result = yield model.find({loc_geohash:{$in:arr}},{_id:0});

      var obj = {};
      if(result.length >0){
        result = JSON.parse(JSON.stringify(result));
        logger.info('[%d] result length:%d, element:%s geohash=%s', process.pid, result.length, arr[arr.length -1], result[result.length-1].loc_geohash);
      }

      _.each(result, function(v){
        // var key = v.loc_geohash.substr(0,8);
        // filter(key, v, obj);
        filter(v.loc_geohash, v, obj);
      });
    }
    logger.info('[%d]已读行数：%d', process.pid, (POSITION)/ONE);

    if(bStop){
      logger.info('[%d] last element:%s', process.pid, arr[arr.length-1]);
      logger.info('######');
      process.exit(1);
      return;
    }
  }
}

function filter(k, v, obj){
  if(obj[k]){
    var o = obj[k];
    if(v.calculateDate > o.calculateDate){
      obj[k] = {samples: v.samples, calculateDate: v.calculateDate, key: v.key};
      redisClient.hset(FIELD, k, JSON.stringify({key:v.key, loc: v.loc.coordinates}));
    }else if(v.samples > o.samples){
      obj[k] = {samples: v.samples, calculateDate: v.calculateDate, key: v.key};
      redisClient.hset(FIELD, k, JSON.stringify({key:v.key, loc: v.loc.coordinates}));
    }
  }else{
    obj[k] = {imeiCount: v.imeiCount, date: v.updateDate, bssid: v.bssid};
    redisClient.hset(FIELD, k, JSON.stringify({key:v.key, loc: v.loc.coordinates}));
  }
}

