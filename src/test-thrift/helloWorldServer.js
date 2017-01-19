var thrift = require("thrift");
var HelloWorld = require("./gen-nodejs/HelloWorld");
var ttypes = require("./gen-nodejs/helloworld_types");

var data = {};

var server = thrift.createServer(HelloWorld, {
  printHelloWorld: function(name , result) {
    console.log("node - name:"+name);
    result(null);
  }
});

server.listen(9090);