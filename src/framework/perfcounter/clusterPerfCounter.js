
var _ = require('lodash');
var cluster = require('cluster');

var config = require('./config');

var ClusterPerfCounter = function () {
  var self = this;
  this.perfCounter = null;
  this.initMetrics();

  if (cluster.isMaster) {
    C.logger.info("Init perfCounter (master)");
    this.perfCounter = require('./prefCounter').getInstance();
    cluster.on('online', function (worker) {
      worker.on('message', function (data) {
        if (data.type === 'PUSH_METRICS') {
          self.handleMessage(data.value);
        }
      });
    });
  } else {
    C.logger.info("Init perfCounter (worker)");
    setInterval(function () {
      self.sendToMaster();
    }, config.cluster.mergeInterval * 1000);
  }
};

ClusterPerfCounter.genTags = function (tags) {
  tags = tags || {};
  var ts = Object.keys(tags).map(function (name) {
    return name + '=' + tags[name];
  });
  return ts.join(',');
};

ClusterPerfCounter.genName = function (name, tags) {
  if(tags === {}) return name;
  return name + config.user_tags_delimiter + ClusterPerfCounter.genTags(tags);
};

ClusterPerfCounter.prototype.initMetrics = function () {
  this.tags = {};
  this.counters = {};
  this.meters = {};
  this.hists = {};
  this.timers = {};
  // this.gauges = {};
  this.healths = {};
};

ClusterPerfCounter.prototype.handleMessage = function(metrics) {
  var self = this;
  // for (var name in metrics.counters) {
  //   this.perfCounter.incCounter(name, metrics.counters[name]);
  // }
  _.forEach(metrics.counters, function (counter, name) {
    self.perfCounter.incCounter(name, counter, {});
  });

  // for (var name in metrics.meters) {
  //   this.perfCounter.markMeter(name, metrics.meters[name]);
  // }
  _.forEach(metrics.meters, function (meter, name) {
    self.perfCounter.markMeter(name, meter, {});
  });

  // for (var name in metrics.hists) {
  //   for (var i in metrics.hists[name]) {
  //     this.perfCounter.updateHistogram(name, metrics.hists[name][i]);
  //   }
  // }
  _.forEach(metrics.hists, function (hist, name) {
    _.forEach(hist, function (h) {
      self.perfCounter.updateHistogram(name, h, {});
    });
  });

  // for (var name in metrics.timers) {
  //   for (var i in metrics.timers[name]) {
  //     this.perfCounter.updateTimer(name, metrics.timers[name][i]);
  //   }
  // }
  _.forEach(metrics.timers, function (timer, name) {
    _.forEach(timer, function (t) {
      self.perfCounter.updateTimer(name, t, {});
    });
  });

  // for (var name in metrics.tags) {
  //   this.perfCounter.addTags(name, metrics.tags[name]);
  // }
  _.forEach(metrics.tags, function (tag, name) {
    self.perfCounter.addTags(name, tag);
  });

  _.forEach(metrics.healths, function (health, name) {
    var h = _.every(health, function(h){return h === 1});
    self.perfCounter.health(name, Number(h), {});
  })
};

ClusterPerfCounter.prototype.incCounter = function (name, n, tags) {
  if(!_.isEmpty(name)) {
    name = ClusterPerfCounter.genName(name, tags);
    if (!_.has(this.counters, name)) this.counters[name] = 0;
    this.counters[name] += n;
  }
};

ClusterPerfCounter.prototype.markMeter = function (name, n, tags) {
  if(!_.isEmpty(name)) {
    name = ClusterPerfCounter.genName(name, tags);
    if (!_.has(this.meters, name)) this.meters[name] = 0;
    this.meters[name] += n;
  }
};

ClusterPerfCounter.prototype.updateHistogram = function (name, n, tags) {
  if(!_.isEmpty(name)) {
    name = ClusterPerfCounter.genName(name, tags);
    if (!_.has(this.hists, name)) this.hists[name] = [];
    this.hists[name].push(n);
  }
};

ClusterPerfCounter.prototype.updateTimer = function (name, n, tags) {
  if(!_.isEmpty(name)) {
    name = ClusterPerfCounter.genName(name, tags);
    if (!_.has(this.timers, name)) this.timers[name] = [];
    this.timers[name].push(n);
  }
};


ClusterPerfCounter.prototype.updateHealth = function (name, n, tags) {
  if(!_.isEmpty(name)) {
    name = ClusterPerfCounter.genName(name, tags);
    if (!_.has(this.healths, name)) this.healths[name] = [];
    n = n >=1 ? 1 : 0;
    this.healths[name].push(n);
  }
};

ClusterPerfCounter.prototype.health = function (name, n, tags) {
  this.updateHealth(name, n, tags);
};

ClusterPerfCounter.prototype.count = function (name, count, tags) {
  this.markMeter(name, count, tags);
};

ClusterPerfCounter.prototype.duration = function (name, duration, tags) {
  this.updateTimer(name, duration, tags);
};

ClusterPerfCounter.prototype.addTags = function (name ,tags) {
  var t = this.tags[name] = this.tags[name] || {};
  // for (var k in tags) {
  //   if (tags.hasOwnProperty(k)) {
  //     t[k] = tags[k];
  //   }
  // }
  _.forEach(tags, function (tag, k) {
    t[k] = tag;
  });
};

ClusterPerfCounter.prototype.sendToMaster = function () {
  var data = {
    pid: process.pid,
    type: 'PUSH_METRICS',
    value: {
      counters: this.counters,
      meters: this.meters,
      hists: this.hists,
      timers: this.timers,
      tags: this.tags,
      healths: this.healths
    }
  };
  process.send(data);
  this.initMetrics();
};

var getInstance = function () {
  var instance;
  return function () {
    if (!instance) {
      instance = new ClusterPerfCounter();
    }
    return instance;
  }
}();

exports.getInstance = getInstance;
