'use strict';

var _obj;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  ** 属性简洁表达法 (变量, 方法)
 */

var birth = '2000/01/01';

var Person = {

  name: '张三',

  //等同于birth: birth
  birth: birth,

  // 等同于hello: function ()...
  hello: function hello() {
    console.log('我的名字是', this.name);
  }
};

//----------------------------------------------
//** 属性的赋值器 setter , 取值器 getter

var cart = {
  _wheels: 4,

  get wheels() {
    return 5;
    return this._wheels;
  },

  set wheels(value) {
    if (value < this._wheels) {
      throw new Error('数值太小了！');
    }
    this._wheels = value;
  }
};
console.log(cart.wheels);
cart.wheels = 3;
console.log(Object.getOwnPropertyDescriptor(cart, '_wheels'));

//----------------------------------------------
// **属性名表达式 ,表达式作为属性名, 表达式要放到方括号里
// **方法名表达式 同上

var lastWord = 'last word';

var a = _defineProperty({
  'first word': 'hello'
}, lastWord, 'world');

a['first word']; // "hello"
a[lastWord]; // "world"
a['last word']; // "world"

//** 属性名表达式和简洁表达式不能同时使用
// 报错
var foo = 'bar';
var bar = 'abc';
//var baz = { [foo] };

// 正确
var foo = 'bar';
var baz = _defineProperty({}, foo, 'abc');

//----------------------------------------------
// ** 方法的属性name

var person = {
  age: 10,
  sayName: function sayName() {
    console.log(this.name);
  },

  get firstName() {
    return "Nicholas";
  }
};

person.sayName.name // "sayName"
//person.firstName.name // "get firstName"

(new Function()).name; // "anonymous"

var doSomething = function doSomething() {
  // ...
};
doSomething.bind().name; // "bound doSomething"
var key1 = Symbol('description');
var key2 = Symbol();
var obj = (_obj = {}, _defineProperty(_obj, key1, function () {}), _defineProperty(_obj, key2, function () {}), _obj);
obj[key1].name; // "[description]"
obj[key2].name; // ""

//------------------------------------
// ** Object.is()
// ** 相等运算符（==）和严格相等运算符（===）。它们都有缺点，前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0

console.log(+0 === -0); //true
console.log(NaN === NaN); // false

console.log(Object.is(+0, -0)); // false
console.log(Object.is(NaN, NaN)); // true