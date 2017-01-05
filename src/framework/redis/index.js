var CONST = require('./const');
var client = require('./connect');
var _ = require('lodash');
// function* incrApiKey(type, k, uri, t){
//   var c;
//   switch(type){
//     case "day":
//       k = CONST.api_key_day_rate+k;
//       c = yield client.incr(k);
//       if(c ==1 && t)  yield client.expire(k , t);
//       return c;
//       break;
//     case "minute":
//       k = CONST.api_key_minute_rate+k;
//       c = yield client.incr(k);
//       if(c ==1 && t) yield client.expire(k, t);
//       return c;
//       break;
//     case "quota":
//       return yield client.hvals(CONST.api_key_quota_count+k);
//       break;
//     default:
//       return null;
//   }
// }

function* incrApiKey(type, k, uri, t){
  var c , r;
  switch(type){
    case "day":
      if(k){
        k = CONST.api_key_day_rate+k;
        c = yield client.incr(k);
        if(c ==1 && t) r = yield client.expire(k , t);
        return c;
      }
      break;
    case "minute":
      if(k){
        k = CONST.api_key_minute_rate+k;
        c = yield client.incr(k);
        if(c ==1 && t) r = yield client.expire(k, t);
        return c;
      }
      break;
    case "quota":
      if(uri){
        k = CONST.api_key_quota_count+k;
        r = yield client.hincrby(k, uri , 1);
        if(!_.isArray(r)) r = [r];
        return r;
      }
      break;
    default:
      return -1;
  }
  return -1;
}

function* scan(cursor){
  return yield client.scan(cursor);
}

function* hscan(f, k){
  return yield client.hscan(f, k, 'COUNT', 5000);
}

function* hincrby(f, k, n){
  return yield client.hincrby(f, k, n);
}

function* hdel(f, k){
  return yield client.hdel(f, k);
}

function* incr(k){
  return yield client.incr(k);
}

exports.incrApiKey = incrApiKey;
exports.scan = scan;
exports.hscan = hscan;
exports.hincrby = hincrby;
exports.hdel = hdel;
exports.incr = incr;