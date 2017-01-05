var fs = require('fs');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFile('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFile('/etc/shells');
  console.log(r2.toString());
};

/**
 *  gen.next(data) - 把执行权交给生成器 - data是交给生成器时的返回值
 *  yield - 把执行权交出去 - yield 后面是交出执行权时的返回值
 */

function run(fn) {
  var gen = fn();
  
  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }
  
  next(null , 1);
}

run(gen);