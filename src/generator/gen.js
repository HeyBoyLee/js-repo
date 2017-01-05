var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.status);
}

/**
 *  gen.next(data) - 把执行权交给生成器 - data是交给生成器时的返回值
 *  yield - 把执行权交出去 - yield 后面是交出执行权时的返回值
 */

function run(gen){
  var g = gen();
  
  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }
  
  next();
}

run(gen);