"use strict";var obj1={foo:123};Object.getOwnPropertyDescriptor(obj1,"foo");var obj2={foo:"bar",baz:42};console.log(Object.entries(obj2));var obj4={method:function(){}};obj4.__proto__={foo:"xxx"};var obj5=Object.create({foo:"xxx"});obj5.method=function(){};var obj6={};Object.setPrototypeOf(obj6,{foo:"xxx"}),console.log(obj6);var z={a:3,b:4};n=Object.assign({},z);var o=Object.create({x:1,y:2});o.z=3;