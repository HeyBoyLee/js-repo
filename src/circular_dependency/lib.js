var main = require('./main');

console.log(main);

var counter = 3;
function incCounter() {
  module.exports.counter = ++counter;
  return ;
}
module.exports = {
  counter: counter,
  incCounter: incCounter
};

// exports.counter = counter;
// exports.incCounter = incCounter;
//
// module.exports = exports;