var os = require('os');
var request = require('request');

var config = require('./config');
var buildFalconArray = require('./falconDataBuilder').buildFalconArray;

var startPushTask = function (perfCounter) {
  this.interval = setInterval(function () {
    push(perfCounter);
  }, config.step * 1000);
};

var push = function (perfCounter) {
  var ms = buildFalconArray(perfCounter);
  var options = {
    method: 'POST',
    json: true,
    body: ms,
    url: config.agentUri
  };
  // C.logger.debug(JSON.stringify(ms));
  request(options, function onPushRequest(err, res, body) {
    if (err) C.logger.warn('[PerfCounter] Push PerfCounter to Falcon Agent Error:', err.message);
    else if (res.statusCode !== 200) C.logger.warn('[PerfCounter] Push PerfCounter to Falcon Agent Failed:', body);
    else C.logger.info('[PerfCounter] Push Perf Counter to Falcon Agent Succeed, Count:', ms.length);
  });
};

exports.startPushTask = startPushTask;
