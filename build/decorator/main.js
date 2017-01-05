'use strict';

var _mixins = require('./mixins');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // main.js


var Foo = {
  foo: function foo() {
    console.log('foo');
  }
};

var MyClass = function MyClass() {
  _classCallCheck(this, MyClass);
};

var obj = new MyClass();
obj.foo(); // 'foo'