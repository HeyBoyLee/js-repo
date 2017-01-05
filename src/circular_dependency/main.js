/**
 ES6模块加载的机制，与CommonJS模块完全不同。CommonJS模块输出的是一个值的拷贝，而ES6模块输出的是值的引用。
 CommonJS，一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。
 */
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3

module.exports = 'exports lib';

require('./other');