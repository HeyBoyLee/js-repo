var opt = {
  "thrift": "helloworld",
  "class": "HelloWorld",
  "handler":"helloworld"
};

module.exports = function(){
  opt.path = __dirname;
  return opt;
}();