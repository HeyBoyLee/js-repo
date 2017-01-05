var _ = require('lodash');
var metrics = require('metrics');
var startPushTask = require('./pushTask').startPushTask;
var config = require('./config');

var Gauge = function Gauge() {
  this.count = 0;
  this.type = 'gauge';
};

Gauge.prototype.set = function(val) {
  if (!val) { val = 0; }
  this.count = val;
};

Gauge.prototype.clear = function() {
  this.count = 0;
};

Gauge.prototype.printObj = function() {
  return {type: this.type, count: this.count};
};

var PerfCounter = function () {
  this.tags = {};
  this.counters = {};
  this.meters = {};
  this.hists = {};
  this.timers = {};
  this.gauges = {};
  this.healths = {};
};

PerfCounter.genTags = function (tags) {
  var ts = Object.keys(tags).map(function (name) {
    return name + '=' + tags[name];
  });
  return ts.join(',');
};

PerfCounter.genName = function (name, tags) {
  if(_.isEmpty(tags)) return name;
  return name + config.user_tags_delimiter + PerfCounter.genTags(tags);
};

PerfCounter.prototype.addTags = function (name ,tags) {
  var t = this.tags[name] = this.tags[name] || {};
  for (var k in tags) {
    if (tags.hasOwnProperty(k)) {
      t[k] = tags[k];
    }
  }
};

PerfCounter.prototype.getTag = function (name) {
  return this.tags[name] || {};
};

PerfCounter.prototype.getCounter = function (name, tags) {
  name = PerfCounter.genName(name, tags);
  return this.counters[name] = this.counters[name] || new metrics.Counter();
};

PerfCounter.prototype.incCounter = function (name, n, tags) {
  this.getCounter(name, tags).inc(n);
};

PerfCounter.prototype.getMeter = function (name, tags) {
  name = PerfCounter.genName(name, tags);
  return this.meters[name] = this.meters[name] || new metrics.Meter();
};

PerfCounter.prototype.markMeter = function (name, n, tags) {
  this.getMeter(name, tags).mark(n);
};

PerfCounter.prototype.getHistogram = function (name, tags) {
  name = PerfCounter.genName(name, tags);
  return this.hists[name] = this.hists[name] || new metrics.Histogram();
};

PerfCounter.prototype.updateHistogram = function (name, n, tags) {
  this.getHistogram(name, tags).update(n);
};

PerfCounter.prototype.getTimer = function (name, tags) {
  name = PerfCounter.genName(name, tags);
  return this.timers[name] = this.timers[name] || new metrics.Timer();
};

PerfCounter.prototype.updateTimer = function (name, n, tags) {
  this.getTimer(name, tags).update(n);
};

PerfCounter.prototype.getGauge = function (name, tags) {
  name = PerfCounter.genName(name, tags);
  return this.gauges[name] = this.gauges[name] || new Gauge();
};

PerfCounter.prototype.gauge = function (name, n, tags) {
  this.getGauge(name, tags).set(n);
};

PerfCounter.prototype.getHealths = function (name, tags) {
  name = PerfCounter.genName(name, tags);
  return this.healths[name] = this.healths[name] || new Gauge();
};

PerfCounter.prototype.health = function (name, health, tags) {
  health = health >= 1 ? 1: 0;
  this.getHealths(name, tags).set(health);
};

PerfCounter.prototype.count = function (name, count, tags) {
  this.markMeter(name, count, tags);
};

PerfCounter.prototype.duration = function (name, duration, tags) {
  this.updateTimer(name, duration, tags);
};

PerfCounter.prototype.printObj = function () {
  var metricObj = {};
  var types = ['counters', 'meters', 'hists', 'timers', 'gauges', 'healths'];
  for (var i in types) {
    var type = types[i];
    metricObj[type] = {};
    for (var name in this[type]) {
      metricObj[type][name] = this[type][name].printObj();
    }
  }
  return metricObj;
};

var getInstance = function () {
  var instance;
  return function() {
    if (!instance) {
      instance = new PerfCounter();
      startPushTask(instance);
    }
    return instance;
  }
}();

exports.getInstance = getInstance;