var mongoose = require('../db/init'),
  redisClient = require('../redis/connect');
require('./mongooseRedisCache')(mongoose, redisClient);
