'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _m = require('./m2');

console.log(_m.counter); // 3
/**
  // 写法一
  export var m = 1;

  // 写法二
  var m = 1;
  export {m};

  // 写法三
  var n = 1;
  export {n as m};

   // 报错
   function f() {}
   export f;

   // 正确
   export function f() {};

   // 正确
   function f() {}
   export {f};
   
   //模块的继承
   export * from 'circle';
   export {area as circleArea} from 'circle';

   ES6模块加载的机制，与CommonJS模块完全不同。CommonJS模块输出的是一个值的拷贝，而ES6模块输出的是值的引用。
*/
(0, _m.incCounter)();
console.log(_m.counter); // 4

exports.default = 'm2';