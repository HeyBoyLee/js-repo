
var co = require('co');
var mongoose = require('mongoose');
var Redis = require('ioredis');
var mongooseRedisCache = require('./mongooseRedis');
var redisClient = new Redis();

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

mongooseRedisCache(mongoose , redisClient);
var c = '海淀区';
function *gen(c) {
  try {
    var b = yield model.findOne({city: c}).lean();
    //var b = yield Promise.reject(new Error('b 错误'));
    console.log(b);
  } catch (e) {
    console.log('error', e);
  }
  return 'over';
}
co(gen(c)).then(function (value) {
  console.log(value);
}).catch(function (err) {
  console.error(err.stack);
});