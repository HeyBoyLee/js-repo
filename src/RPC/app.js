var Cache = require('../controllers/cache'),
    Cellgeos = require('../controllers/cellgeos');

var thrift = require('thrift'),
    co = require('co'),
    LocationQuery = require('./gen-nodejs/LocationQuery'),
    ttypes = require('./gen-nodejs/metok_types');

// /*
//  * New interface 4 Mi AD team.
//  * added by Vito - 2016-06-16 15:41:10
//  */
// var AddressQuery = require('./gen-nodejs_bak/AddressQuery'),
//     aqTypes = require('./gen-nodejs_bak/metok_v2_types');


var NotFoundException = new ttypes.NotFoundException({status: 404, message: 'Not Found'});

var exception = function (status, message) {
  if (status === 404) return new ttypes.NotFoundException({status: 404, message: 'Not Found'});
  return new ttypes.MetokQueryException({status: status, message: message});
};

var locTokenQuery = function (locToken, key, cb) {
  if (!locToken || !key) return cb(exception(400, 'Lack of Args'));
  //C.logger.debug('locToken Query from:', key);
  Cache.addAccessKey(key);
  if (!Cache.isKeyIn(key)) return cb(exception(401, 'Invalid API_KEY'));

  co(function *() {
    var val = yield * Cache.getGeoLocate(locToken);
    if (val == null) {
      val = yield * Cellgeos.token2loc(locToken);
      if (val) yield * Cache.setGeoLocate(locToken, val);
      else yield * Cache.setGeoLocate(locToken, '');
    }
    return val;
  }).then(function (loc) {
    //if (!loc) return cb(NotFoundException);
    if (!loc) return cb(exception(404, 'Not Found'));
    else return cb(null, new ttypes.Location({lat: loc.lat, lng: loc.lng}));
  }, function (err) {
    return cb(exception(err.status || 500, err.message));
  });
};

var addrTokenQuery = function (locToken, key, cb) {
  if (!locToken || !key) return cb(exception(400, 'Lack of Args'));
  //C.logger.debug('locToken Query from:', key);
  Cache.addAccessKey(key);
  if (!Cache.isKeyIn(key)) return cb(exception(401, 'Invalid API_KEY'));

  co(function *() {
    var val = yield * Cache.getGeoAddress(locToken);
    if (val == null) {
      val = yield * Cellgeos.token2Addr(locToken);
      if (val) yield * Cache.setGeoAddress(locToken, val);
      else yield * Cache.setGeoAddress(locToken, '');
    }
    return val;
  }).then(function (addr) {
    // if (!addr) return cb(exception(404, 'Not Found'));
    var record = {infocode: 0};

    if(addr){
      record.infocode = 1;
      record.province = addr.province;
      record.city = addr.city;
      record.district = addr.district;
      record.districtCode = addr.districtCode;
    }
    return cb(null, new ttypes.AddressComponent(record));
  }, function (err) {
    return cb(exception(err.status || 500, err.message));
  });
};

var app = thrift.createServer(LocationQuery, {
      locTokenQuery: locTokenQuery,
      addrTokenQuery: addrTokenQuery
    },
    {
      transport: thrift.TFramedTransport
    });

exports.services = {
  locTokenQuery: locTokenQuery,
  addrTokenQuery:addrTokenQuery
};
