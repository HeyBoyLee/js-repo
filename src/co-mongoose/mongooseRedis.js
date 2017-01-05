var _ = require('lodash');
var crypto = require('crypto');

var mongooseRedisCache = function(mongoose, redisClient) {
  var opts = {
    cache: true,
    expires: 60,  // unit: s
    prefix: 'mrc'
  };

  var redisClient = mongoose.redisClient = redisClient;

  // store original Query.exec
  mongoose.Query.prototype._exec = mongoose.Query.prototype.exec;

  // custom exec to use cache
  mongoose.Query.prototype._exec_callback = function(callback) {
    var self = this;

    var model = this.model;
    var query = this._conditions || {};
    var options = this._optionsForExec(model) || {};
    var fields = _.clone(this._fields) || {};
    // different from mongoose-redis-cache,
    // var populate = this.options.populate || {};
    var populate = this._mongooseOptions.populate || {};
    var collectionName = model.collection.name;
    var dbName = model.db.name;

    // use cache options set up by query statements first
    // also different from mongoose-redis-cache,
    // as setOptions() set options in this._optionsForExec(model)
    // but not this._mongooseOptions ???
    // var cacheOptions = _.assign(_.clone(_cacheOptions), options.cacheOptions);
    // cache only work in lean query
    if (!this._mongooseOptions.lean) opts.cache = false;

    // remove cacheOptions from options, for better redis key
    // delete options.cacheOptions;

    if (!opts.cache) {
      return mongoose.Query.prototype._exec.apply(self, arguments);
    }

    var hash = crypto.createHash('md5')
      .update(JSON.stringify(query))
      .update(JSON.stringify(options))
      .update(JSON.stringify(fields))
      .update(JSON.stringify(populate))
      .digest('hex');
    var key = [opts.prefix, dbName, collectionName, hash].join(':');

    redisClient.get(key, function(err, result) {
      if (err) return callback(err);
      if (!result) {
        return mongoose.Query.prototype._exec.call(self, function(err, docs) {
          if (err) return callback(err);
          var str = JSON.stringify(docs);
          redisClient.set(key, str, 'ex',opts.expires,function(err , res){
            if(err) console.log(err);
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
