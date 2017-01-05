/*
 Object.assign(target ,source)
 用于对象的合并 :
    - 将源对象（source）的所有可枚举属性，复制到目标对象（target）。
    - 浅拷贝
 */

var target = { a: 1 };

var source1 = { b: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
console.log(target) // {a:1, b:2, c:3}

//浅拷贝
var obj1 = {a: {b: 1}};
var obj2 = Object.assign({}, obj1);

console.log(Object.is(obj1.a , obj2.a));
console.log(Object.is(obj1 , obj2));

var obj3 = Object.assign({} , {source1 , source2})
console.log(obj3);
obj3.source1.b = 4;
console.log(source1);