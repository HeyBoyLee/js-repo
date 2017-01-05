'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

var _a = require('./a.js');

function bar() {
  console.log('bar');
  if (Math.random() > 0.5) {
    (0, _a.foo)();
  }
} /**
  
   */