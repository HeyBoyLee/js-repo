var createThriftClient = require('../../framework/thrift').createThriftClient;
var THRIFT = require('thrift');
var transport = THRIFT.TFramedTransport;
var protocol = THRIFT.TBinaryProtocol;

var client = createThriftClient('test','localhost', 8989, {
  transport : transport,
  protocol : protocol
});

client.printHelloWorld('thrift', function(err, response) {
  console.log('call helloworld!');
});

//client.close();
