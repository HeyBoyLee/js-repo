'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.counter = undefined;
exports.incCounter = incCounter;

var _m = require('./m1');

var _m2 = _interopRequireDefault(_m);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_m2.default); /**
                          
                           */
var counter = exports.counter = 3;
function incCounter() {
  exports.counter = counter += 1;
}