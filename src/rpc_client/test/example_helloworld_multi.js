var createThriftClient = require('../../framework/thrift').createThriftClient;
var createMulitThriftClient = require('../../framework/thrift').createMulitThriftClient;
var THRIFT = require('thrift');
var transport = THRIFT.TFramedTransport;
var protocol = THRIFT.TBinaryProtocol;

var client = createMulitThriftClient('rpc_client/test','localhost', 8989, {
  transport : transport,
  protocol : protocol
});

client.printHelloWorld('thrift', function(err, response) {
  console.log('call helloworld!');
});