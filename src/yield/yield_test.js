/****
 gen.next 得到yield 后执行函数或对象的结果　result = {done:true/false , value: object/promise..}
 通过自实现的next函数,把result中的value 提取出来,调用gen.next(result.value中的实际值)传给yield前的变量
 */
var co = require('co');

function logT(){
  console.log(new Date());
  return Promise.resolve("logT");
}

function logT1(){
  console.log('?????');
  return "logT1";//Promise.resolve("logT");
  //return null;
}


co(function* gen() {
  /********************************************************************
   co module
   You may only yield a function, promise, generator, array, or object*
   ********************************************************************/
  var x = yield {x:'string'};
  console.log(x);

  var t = yield logT();
  console.log(t);

  console.log(yield logT1()); //error!!

  var a = yield Promise.resolve('a 值');
  console.log(a);
  try {
   // var b = yield model.findOne()
    //var b = yield Promise.reject(new Error('b 错误'));
    var c = yield Promise.resolve('c 值');
    //console.log(b, c);
  } catch(e) {
    console.log('error', e);
  }
  return 'over';
}).then(function (value) {
  console.log(value);
}).catch(function (err) {
  console.error(err.stack);
});

function* gen1(){
  var a = yield 'a';

  var b = yield 'b';
}

var f = gen1();
var m = f.next();
/*********************************************************************
 { value: 'a', done: false } yield 返回结构
 f.next(param) 通过param传递变量给yield 前的变量
 *********************************************************************/
console.log(m);
var n = f.next(m);//{ value: 'b', done: false }
console.log(n);
var o = f.next(n);
console.log(o);