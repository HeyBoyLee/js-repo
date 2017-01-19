var PerfCounter = require('../perfcounter').getClusterInstance();

function counterDecorator(name, func) {

  return function () {
    PerfCounter.count(name + '.Call', 1);
    var start = Date.now();
    try {
      func.apply(arguments);
    } catch (err) {
      PerfCounter.count(name + '.Call.Exception', 1);
      throw err;
    } finally {
      var end = Date.now();
      PerfCounter.duration(name + '.Call.Duration', end - start);
    }
  }

}

function asyncCounterDecorator(name, func) {

  function cbDecorator(cbArg, start) {
    return function () {
      if (arguments[0]) {
        PerfCounter.count(name + 'Call.Exception', 1);
      }
      var end = Date.now();
      PerfCounter.duration(name + 'Call.Duration', end - start);
      cbArg.apply(null, arguments);
    }
  }

  return function () {
    PerfCounter.count(name + '.Call', 1);
    var args = Array.prototype.slice.call(arguments, 0, -1);
    var cbArg = arguments[arguments.length - 1];
    var start = Date.now();
    var cb = cbDecorator(cbArg, start);
    func.apply(null, args.concat(cb));
  }

}

exports.counterDecorator = counterDecorator;
exports.asyncCounterDecorator = asyncCounterDecorator;
