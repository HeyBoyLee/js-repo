"use strict";function mixins(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){Object.assign.apply(Object,[e.prototype].concat(t))}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.mixins=mixins;