var _ = require('lodash');
var thrift = require('thrift');
var Exceptions = require('../exceptions');
// function checkThriftParam(p, c, cls, service){
//   if(_.isEmpty(c))
//     return new Exceptions.ThriftProcessorError('[%s]: Not Found config file',p);
// }

function wrapServices(services , s) {
  var asyncCounterDecorator = require('./decorator').asyncCounterDecorator;
  _.each(services, function(v, k){
    s[k] = asyncCounterDecorator(k , v);
  });
  return s;
}

function createThriftServer(projName) {
  if(_.isEmpty(projName)){
    throw new Exceptions.ThriftProcessorError("project Name is null ");
  }
  var conf = require('../../rpc_server/'+projName+'/conf');
  var thriftClass = require('../../rpc_server/'+projName+'/gen-nodejs/'+conf.service);
  var thriftServices = require('../../rpc_server/'+projName+'/'+conf.file);

  var s = {};
  return thrift.createServer(
    thriftClass, //processor
    wrapServices(thriftServices , s), //handler
    {
      transport: thrift.TFramedTransport
    }
  );
}

function createMultiThriftServer(projNames) {
  if(_.isEmpty(projNames)){
    throw new Exceptions.ThriftProcessorError("project Name is null ");
  }
  mp = new thrift.MultiplexedProcessor();
  _.each(projNames, function(p){
    var conf = require('../../rpc_server/'+p+'/conf');
    var thriftClass = require('../../rpc_server/'+p+'/gen-nodejs/'+conf.service);
    var thriftServices = require('../../rpc_server/'+p+'/'+conf.file);
    var s = {};
    var tc = new thriftClass.Processor(wrapServices(thriftServices , s));
    mp.registerProcessor(conf.service, tc);
  });

  return thrift.createMultiplexServer(mp, {transport: thrift.TFramedTransport});
}

function createThriftClient(projName, host, port, options){
  if(_.isEmpty(projName)){
    throw new Exceptions.ThriftProcessorError("project Name is null ");
  }
  if(_.isEmpty(options)) options = {transport: thrift.TFramedTransport, protocol: thrift.TBinaryProtocol};
  var conf = require('../../rpc_client/'+projName+'/conf');
  var thriftClass = require('../../rpc_server/'+projName+'/gen-nodejs/'+conf.service);
  var con = thrift.createConnection(host, port,
    {
      transport: options.transport,
      protocol: options.protocol
    }
  );
  con.on('error', function(err){
    C.logger.error(err.stack);
  });
  return thrift.createClient(thriftClass, con);
}

function createMulitThriftClient(projName, host, port, options){
  if(_.isEmpty(projName)){
    throw new Exceptions.ThriftProcessorError("project Name is null ");
  }
  if(_.isEmpty(options)) options = {transport: thrift.TFramedTransport, protocol: thrift.TBinaryProtocol};
  var conf = require('../../rpc_client/'+projName+'/conf');
  var thriftClass = require('../../rpc_server/'+projName+'/gen-nodejs/'+conf.service);
  var con = thrift.createConnection(host, port,
    {
      transport: options.transport,
      protocol: options.protocol
    }
  );
  con.on('error', function(err){
    C.logger.error(err.stack);
  });
  var multiplexer = new thrift.Multiplexer();
  return multiplexer.createClient(conf.service, thriftClass, con);
}

exports.createThriftServer = createThriftServer;
exports.createMultiThriftServer = createMultiThriftServer;
exports.createThriftClient = createThriftClient;
exports.createMulitThriftClient = createMulitThriftClient;