// // main.js
// import { mixins } from './mixins'
//
// const Foo = {
//   foo() { console.log('foo') }
// };
//
// @mixins(Foo)
// class MyClass {}
//
// let obj = new MyClass();
// obj.foo() // 'foo'
var co = require('co');
var _ = require('lodash');



function decorator(func){
  // var func = arguments
  // console.log(arguments);
  function* wrapper(){
    var args = Array.prototype.slice.call(arguments);
    var beginTime = new Date();
    yield test.apply(this, args);
    var endTime = new Date();
    var gap = endTime - beginTime;
    console.log('gap:'+gap);
  }
  return wrapper;
  // var func = args[0];
  // args = _.slice(args, 1, args.length);
  // return func.apply(this, args);
  //console.log(111);
}

// co(decorator(test, 111, 222))
// var f = decorator(test);
// f(111, 222);
function *test(x, y){
  console.log(x, y);
}

co(decorator(test)(1,2));