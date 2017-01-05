
var _ = require('lodash');
var PERF_COUNTERS = require('../../conf/perfcounters.json');

var buildApiPrefixName = function (service, version, api) {
  var prefix = PERF_COUNTERS.prefix.api;
  return prefix.replace('{service}', service).replace('{version}', version).replace('{api}', api)
};

var buildApiName = function (service, version, api) {
  var prefix = buildApiPrefixName(service, version, api);

  return _.mapValues(PERF_COUNTERS.api, function (suffix) {
    return prefix + suffix;
  });
};

module.exports = {
  apiName: buildApiName
};