var _ = require('lodash');
var crypto = require('crypto');

var monitorPerfCounter = require('../monitor/perfcounter');
var dbMonitor = new monitorPerfCounter.ModMonitor({mod: 'mongodb'});
var redisMonitor = new monitorPerfCounter.ModMonitor({mod: 'redis'});

var mongooseRedisCache = function(mongoose, redisClient) {
  var opts = {
    cache: C.modSwitch.cache,
    expires: 60,  // unit: s
    prefix: 'mrc'
  };

  mongoose.redisClient = redisClient;

  // store original Query.exec
  mongoose.Query.prototype._exec = mongoose.Query.prototype.exec;

  // custom exec to use cache
  mongoose.Query.prototype._exec_callback = function(callback) {
    var self = this;

    var model = this.model;
    var query = this._conditions || {};
    var options = this._optionsForExec(model) || {};
    var fields = _.clone(this._fields) || {};
    var populate = this._mongooseOptions.populate || {};
    var collectionName = model.collection.name;
    var dbName = model.db.name;

    var hash = crypto.createHash('md5')
      .update(JSON.stringify(query))
      .update(JSON.stringify(options))
      .update(JSON.stringify(fields))
      .update(JSON.stringify(populate)).digest('hex');
    var key = [opts.prefix, dbName, collectionName, hash].join(':');
    var monitor_key = [opts.prefix, dbName, collectionName].join(':');
    var dbM = dbMonitor.newMonitor('db-get:'+ monitor_key);

    if (!opts.cache) {
      // db in
      dbM.before();
      return mongoose.Query.prototype._exec.apply(self, arguments, function(err , docs){
        // db out
        if(err){
          dbM.error();
        } else {
          dbM.after();
        }
        callback(err , docs);
      });
    }
    if (!this._mongooseOptions.lean) {
      // db in
      dbM.before();
      return mongoose.Query.prototype._exec.apply(self, arguments, function(err , docs){
        // db out
        if(err){
          dbM.error();
        } else {
          dbM.after();
        }
        callback(err , docs);
      });
    }


    // redis in
    var redisM = redisMonitor.newMonitor('redis-get:'+ monitor_key);
    redisM.before();

    redisClient.get(key, function(err, result) {
      // redis out
      if (err) {
        redisM.error();
        return callback(err);
      }

      redisM.after();
      if (!result) {
        // db in
        dbM.before();
        return mongoose.Query.prototype._exec.call(self, function(err, docs) {
          if (err) {
            // db err
            dbM.error();
            return callback(err);
          }

          // db out
          dbM.after();
          var str = JSON.stringify(docs);

          var redisSetM = redisMonitor.newMonitor('redis-set:'+ monitor_key);
          redisSetM.before();
          redisClient.set(key, str, 'ex',opts.expires,function(err){
            if(err) {
              redisSetM.error();
              console.log(err);
            } else {
              redisSetM.after();
            }
          });
          return callback(null, docs);
        });
      }
      else {
        var docs = JSON.parse(result);
        return callback(null, docs);
      }
    });
    return this;
  };

  // support both callback style and promise
  mongoose.Query.prototype.exec = function(callback) {
    var self = this;
    if(callback){
      mongoose.Query.prototype._exec_callback.call(self, callback);
    }
    else{
      return new Promise(function(resolve, reject) {
        mongoose.Query.prototype._exec_callback.call(self, function(err, result) {
          if (err) return reject(err);
          else resolve(result);
        })
      });
    }
  }
};

module.exports = mongooseRedisCache;
