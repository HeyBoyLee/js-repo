
var _ = require('lodash');
var os = require('os');
var config = require('./config');

var buildFalconTag = function (tags) {
  if(_.isObject(tags)) {
    var ts = Object.keys(tags).map(function (name) {
      return name + '=' + tags[name];
    });
    return ts.join(',');
  } else{
    return tags;
  }
};

var buildFalconObj = function (type, k, v, tags, ts) {
  var obj = {};
  obj.endpoint = config.endpoint;
  obj.metric = k;
  obj.timestamp = ts || Math.floor(Date.now() / 1000);
  obj.step = config.step;
  obj.value = v || 0;
  obj.counterType = type;
  obj.tags = buildFalconTag(tags);
  return obj;
};

var buildCounter = function (name, counter) {
  var values = name.split(config.user_tags_delimiter, 2);
  name = values[0];
  var tags = values[1];
  var m1 = buildFalconObj('COUNTER', name, counter.count, tags);
  return [m1];
};

var buildMeter = function (name, meter) {
  var values = name.split(config.user_tags_delimiter, 2);
  name = values[0];
  var tags = values[1];
  var m1 = buildFalconObj('COUNTER', name, meter.count, tags);
  var m2 = buildFalconObj('GAUGE', name + '.' + 'CPS-1-min', meter.oneMinuteRate(), tags);
  var m3 = buildFalconObj('GAUGE', name + '.' + 'CPS-5-min', meter.fiveMinuteRate(), tags);
  var m4 = buildFalconObj('GAUGE', name + '.' + 'CPS-15-min', meter.fifteenMinuteRate(), tags);
  return  [m1, m2, m3, m4];
};

var buildHistogram = function (name, hist) {
  var values = name.split(config.user_tags_delimiter, 2);
  name = values[0];
  var tags = values[1];
  var percentiles = hist.percentiles();
  var m1 = buildFalconObj('GAUGE', name + '.' + '75-percentile', percentiles[0.75], tags);
  var m2 = buildFalconObj('GAUGE', name + '.' + '95-percentile', percentiles[0.95], tags);
  var m3 = buildFalconObj('GAUGE', name + '.' + '99-percentile', percentiles[0.99], tags);
  var m4 = buildFalconObj('GAUGE', name + '.' + '999-percentile', percentiles[0.999], tags);
  hist.clear();
  return [m1, m2, m3, m4];
};

var buildTimer = function (name, timer) {
  var ms1 = buildMeter(name, timer.meter);
  var ms2 = buildHistogram(name, timer.histogram);
  timer.clear();
  return ms1.concat(ms2);
};

var buildGauge = function (name, gauge) {
  var values = name.split(config.user_tags_delimiter, 2);
  name = values[0];
  var tags = values[1];
  var m1 = buildFalconObj('GAUGE', name, gauge.count, tags);
  return [m1];
};

var buildHealth = function (name, health) {
  var values = name.split(config.user_tags_delimiter, 2);
  name = values[0];
  var tags = values[1];
  var m1 = buildFalconObj('GAUGE', name, health.count, tags);

  health.clear();

  return [m1];
};

var buildFalconArray = function (perfCounter) {
  var ms = [];
  // for (var name in perfCounter.counters) {
  //   ms = ms.concat(buildCounter(name, perfCounter.getCounter(name), perfCounter.getTag(name)));
  // }
  _.forEach(perfCounter.counters, function (_, nameWithTags) {
    ms = ms.concat(buildCounter(nameWithTags, perfCounter.getCounter(nameWithTags)));
  });

  // for (var name in perfCounter.meters) {
  //   ms = ms.concat(buildMeter(name, perfCounter.getMeter(name), perfCounter.getTag(name)));
  // }
  _.forEach(perfCounter.meters, function (_, nameWithTags) {
    ms = ms.concat(buildMeter(nameWithTags, perfCounter.getMeter(nameWithTags)));
  });

  // for (var name in perfCounter.hists) {
  //   ms = ms.concat(buildHistogram(name, perfCounter.getHistogram(name), perfCounter.getTag(name)));
  // }
  _.forEach(perfCounter.hists, function (_, nameWithTags) {
    ms = ms.concat(buildHistogram(nameWithTags, perfCounter.getHistogram(nameWithTags)));
  });

  // for (var name in perfCounter.timers) {
  //   ms = ms.concat(buildTimer(name, perfCounter.getTimer(name), perfCounter.getTag(name)));
  // }
  _.forEach(perfCounter.timers, function (_, nameWithTags) {
    ms = ms.concat(buildTimer(nameWithTags, perfCounter.getTimer(nameWithTags)));
  });

  _.forEach(perfCounter.gauges, function (_, nameWithTags) {
    ms = ms.concat(buildGauge(nameWithTags, perfCounter.getGauge(nameWithTags)));
  });

  _.forEach(perfCounter.healths, function (_, nameWithTags) {
    ms = ms.concat(buildHealth(nameWithTags, perfCounter.getHealths(nameWithTags)));
  });

  return ms;
};

exports.buildFalconArray = buildFalconArray;
