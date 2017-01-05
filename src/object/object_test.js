/**
 - Object.is  比较两个值是否相等  与 === 的行为基本一致
 - Object.assign 对象的合并 ， 只拷贝源对象的自身属性(不拷贝继承属性，也不拷贝不可枚举的属性) 浅拷贝
 - Object.clone ?? 克隆
 - Object.create 第一个参数是要继承的原型，第二个是对象属性描述符
 - Object.getPrototypeOf
 - Object.setPrototypeOf
 - Object.defineProperty(obj, property, descriptor)
 - Object.getOwnPropertyDescriptor  -> {value , writable , enumerable , configurable ， get , set}

 - Object.values
 - Object.entries
 - Object.keys  如下方法会忽略enumerable为flase的属性
    for ... in 循环
    Object.keys
    JSON.stringify
 - Object.getOwnPropertyNames 返回自身所有属性，包含不可枚举属性（不含继承的， 不含Symbol属性）
 - Object.getOwnpropertySymbols
 - Reflect.ownKeys 返回所有属性

 参考： lodash
 - _.assign(target , source)  //source 覆盖 target
 - _.default(target , source)  //替换target中值为undefined的属性
 - _.defaultDeep 深拷贝
 - _.clone()
 - _.cloneDeep

 参考 util
 - util.inherits(constructor, superConstructor)是一个实现对象间原型继承的函数
 */
var _ = require('lodash');
var objects = [{ 'a': 1 }, { 'b': 2 }];
var shallow = _.clone(objects);
shallow[0].a = 3;
console.log(Object.is('foo', 'foo'));
// true
Object.is({}, {});

var obj = {
  a:1
}
// __proto__ 对象属性  ， prototype 方法属性
console.log(obj.__proto__); //{}
console.log(obj.prototype); // undefined


var obj = {

  a:function(){
    console.log(100)
  },
  b:function(){
    console.log(200)
  },
  c:function(){
    console.log(300)
  }

};

var newObj = {};

newObj = Object.create(obj,{
  t1:{
    value:'yupeng',
    writable:true
  },
  bar: {
    configurable: false,
    get: function() { return bar; },
    set: function(value) { bar=value },
    //writable: false,
    //value:3
  }

});

console.log(newObj.a());
console.log(newObj.t1);
newObj.t1='yupeng1';
console.log(newObj.t1);
newObj.bar=201;
console.log(newObj.bar);

function Parent() { }
var parent = new Parent();
var child = Object.create(parent, {
  dataDescriptor: {
    value: "This property uses this string as its value.",
    writable: true,
    enumerable: true
  },
  accessorDescriptor: {
    get: function () { return "I am returning: " + accessorDescriptor; },
    set: function (val) { accessorDescriptor = val; },
    configurable: true
  }
});

child.accessorDescriptor = 'YUPENG';
console.log(child.accessorDescriptor);



var Car2 = function(){
  this.name = 'aaaaaa'
} //this is an empty object, like {}
Car2.prototype = {
  getInfo: function() {
    return 'A ' + this.color + ' ' + this.desc + '.';
  }
};

var newCar = new Car2();

var car2 = Object.create(newCar, {
  //value properties
  color:   { writable: true,  configurable:true, value: 'red' },
  //concrete desc value
  rawDesc: { writable: true, configurable:true, value: 'Porsche boxter' },
  // data properties (assigned using getters and setters)
  desc: {
    configurable:true,
    get: function ()      { return this.rawDesc.toUpperCase();  },
    set: function (value) { this.rawDesc = value.toLowerCase(); }
  }
});
car2.color = 'blue';
console.log(car2.getInfo());
car2.desc = "XXXXXXXX";
console.log(car2.getInfo());
console.log(car2.name);