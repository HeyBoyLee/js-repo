var _ = require('lodash');
var os = require('os');

var conf = {
  agentUri: 'http://127.0.0.1:1988/v1/push',
  step: 60,
  endpoint: os.hostname() || 'localhost',
  user_tags_delimiter: '##',
  cluster: {
    mergeInterval: 1
  }
};
var envPrefCounterConf = _.get(C, 'prefCounter', {});
conf = _.merge(conf, envPrefCounterConf);
module.exports = conf;