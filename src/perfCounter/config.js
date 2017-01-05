var os = require('os');

var config = {
  agentUri: 'http://127.0.0.1:1988/v1/push',
  step: 60,
  endpoint: os.hostname() || 'localhost',
  cluster: {
    connInterval: 1
  }
};

module.exports = config;

