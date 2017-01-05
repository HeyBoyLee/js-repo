var thrift = require('thrift');
var HelloWorld = require('./gen-nodejs/HelloWorld');
var ttypes = require('./gen-nodejs/helloworld_types');

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 9090, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
  assert(false, err);
});

// Create a Calculator client with the connection
var client = thrift.createClient(HelloWorld, connection);


client.printHelloWorld('huifeng', function(err, response) {
  console.log('call helloworld!');
});
