var loc = [116.358882,40.079018];
var geohash = require('ngeohash');
var _ = require('lodash');
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
var cluster = require('cluster');
var co = require('co');
var geoHelper = require('./geoOperator').GeoHelper;
var Redis = require('ioredis');
var thunkify = require('thunkify');
var execSync = require('child_process').execSync;
var logger = require('tracer').console();
var open = thunkify(fs.open);
var redisClient = new Redis([{"host":"127.0.0.1", "port":"6379"}]);

var db = mongoose.createConnection("mongodb://127.0.0.1:27017/metok_core");
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

var FIELD = 'metok:geofence:cell:';
var ONE = 6;
var FILE = './city'+(ONE-1)+'/test.json';
if(process.argv.length >2) FILE = './city'+(ONE-1)+'/'+process.argv[2]+'.json';

var START = 0; //不变
var SIZE= ONE * 1;
var POSITION=0;//164902680;
// var updateDateLen =0;
// var imeiCountLen =0;
// var setNum = 0;
var workerNum = 1;
var startLine = 0;
var chunk = 200;
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
      var code = arr[0];

      var r = geohash.decode_bbox(code);
      code = FIELD + code;
      // console.log(r);
      // or.minlat, or.minlon, or.maxlat, or.maxlon
      var minloc = {lng: r[1], lat: r[0]};
      var maxloc = {lng: r[3], lat: r[2]};
      minloc = geoHelper.moveToSouthWest(minloc, 1450);
      maxloc = geoHelper.moveToNorthEast(maxloc, 1450);
      // console.log(minloc);
      // console.log(maxloc);
      var box = geohash.bboxes(minloc.lat, minloc.lng, maxloc.lat, maxloc.lng, 8);
      box = _.chunk(box, chunk);
      for(var i=0;i< box.length;i++){
        var d = box[i];
        d = d.map(function(c){return new RegExp('^'+c)});
        var result = yield model.find({loc_geohash:{$in:d}, samples:{$gt:6}},{_id:0});
        if(result.length >0){
          result = JSON.parse(JSON.stringify(result));
          logger.info('[%d], FOUND CELL:%d', process.pid, result.length);
          result = _.sortBy(result, [function(o){return -o.samples}]);
        }

        var obj = {};

        for(var j=0;j<result.length;j++){
          var b = false;
          var v = result[j];
          var x = null;
          if(1){  // 存8位geohash
            var k = v.loc_geohash.substring(0,8);

            x = yield redisClient.hexists(code, k);
            // console.log(x);
            if(x == 0) filter(code, k, v, obj);
          }else{  // 存9位geohash
            var n = geohash.neighbors(v.loc_geohash);
            for(var m=0;m<n.length;i++){
              x = yield redisClient.hexists(code, n[m]);
              if(x) {
                b = true;
                break;
              }
            }
            if(!b) filter(code, v.loc_geohash, v, obj);
          }
        }
      }
    }

    logger.info('[%d]已读行数：%d', process.pid, (POSITION)/ONE);

    if(bStop){
      logger.info('[%d] last element:%s', process.pid, arr[arr.length-1]);
      logger.info('######');
      console.log(count);
      process.exit(1);
      return;
    }
  }
}

function filter(f, k, v, obj){

  if(0){

  }else{

    hset(f, k, JSON.stringify({key:v.key, loc: v.loc.coordinates}));
  }
}
var count =0;
function hset(f , k , s){
  redisClient.hset(f, k, s);
  count ++;
}

function cset(k, s){
  redisClient.set(k, s);
}

