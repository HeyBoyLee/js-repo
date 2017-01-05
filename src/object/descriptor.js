/*
  属性的可枚举性
  Object.getOwnPropertyDescriptor()
 */

let obj1 = { foo: 123 };
Object.getOwnPropertyDescriptor(obj1, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }

//受属性可枚举性影响的函数
/*
  for ... in ...
  Object.keys()
  JSON.Stringify()
  Object.values()
  Object.entries()

  Reflect.ownKeys()  返回对象自身的所有属性- 数组

  Object.getOwnPropertyNames() + Object.getOwnPropertySymbols() = Reflect.ownKeys()
 */

var obj2 = { foo: 'bar', baz: 42 };
console.log(Object.entries(obj2));
// [ ["foo", "bar"], ["baz", 42] ]



/*
  设置 __proto__ de三种办法
  - 直接赋值
  - Object.create()
  - Object.setPrototypeOf(1 , 2)

  Object.getPrototypeOf()
 */

// es6的写法
var obj4 = {
  method: function() {  }
};
obj4.__proto__ = {foo:'xxx'};

// es5的写法
var obj5 = Object.create({foo:'xxx'});
obj5.method = function() { };


var obj6 ={};
Object.setPrototypeOf(obj6 , {foo:'xxx'});
console.log(obj6);


//--------------------------------------------
// ** 扩展运算符

let z = { a: 3, b: 4 };
//let n = { ...z };

// 等同于
n = Object.assign({} , z);

//--------------------------------------------
// ** Rest 解构赋值

var o = Object.create({ x: 1, y: 2 });
o.z = 3;

//let { x, ...{ y, z } } = o;
// x // 1
// y // undefined
// z // 3
