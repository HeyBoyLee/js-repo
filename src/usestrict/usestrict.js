/**
 变量必须声明后再使用
 函数的参数不能有同名属性，否则报错
 不能使用with语句
 不能对只读属性赋值，否则报错
 不能使用前缀0表示八进制数，否则报错
 不能删除不可删除的属性，否则报错
 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
 eval不会在它的外层作用域引入变量
 eval和arguments不能被重新赋值
 arguments不会自动反映函数参数的变化
 不能使用arguments.callee
 不能使用arguments.caller
 禁止this指向全局对象
 不能使用fn.caller和fn.arguments获取函数调用的堆栈
 增加了保留字（比如protected、static和interface）
 */
//"use strict";

var _ = require('underscore');
// 严格模式下 , this为undefined 所以!this为true
// 禁止函数内部遍历调用栈
function x(){
  console.log(this);

  //x.caller;     //报错
  //x.arguments;   //报错

  return !this;
}
console.log(x());

// 只有configurable设置为true时 才能删除
var o = Object.create(null, {'x': {
  value: 1,
  configurable: true
}});
delete o.x; // 删除成功

// 对象不能有重名的属性
var o = {
  p: 1,
  //p: 2
}; // 语法错误

//严格模式下, 限制了arguments的使用
//不在追踪参数的变化
function f(a) {
  "use strict";
  a = 2;
  return [a, arguments[0]];
}
f(1); // 严格模式为[2,1]
// 禁止使用arguments.callee
var f = function() { return arguments.callee; };
f(); // 报错

//函数必须声明在顶部
if (true) {
  function f() { } // 语法错误
}
for (var i = 0; i < 5; i++) {
  function f2() { } // 语法错误
}





