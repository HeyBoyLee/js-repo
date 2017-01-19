var _ = require('lodash');
var thrift = require('thrift');
var Exceptions = require('../exceptions');
var execSync = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
// function checkThriftParam(p, c, cls, service){
//   if(_.isEmpty(c))
//     return new Exceptions.ThriftProcessorError('[%s]: Not Found config file',p);
// }
function search_thrift_dir(dir){
  cwd = process.cwd();
  var index = cwd.lastIndexOf('/');
  while(index >0){
    p = path.resolve(cwd, dir);
    if(!fs.existsSync(p)){
      index = cwd.lastIndexOf('/');
      if(index === 0) return null;
      cwd = cwd.substr(0, index);
    }
    else{
      return p;
    }
  }
  return null;
}

function search_node_modules(path){
  var index = path.lastIndexOf('/');
  while(index >0){
    if(!fs.existsSync(path+'/node_modules')){
      index = path.lastIndexOf('/');
      if(index === 0) return null;
      path = path.substr(0, index);
    }
    else{
      return path+'/node_modules';
    }
  }
  return null;
}

function load(file, path, cls){
  var nm = search_node_modules(path);
  var lf = nm+'/node-'+file;
  var command = 'rm -rf '+lf;
  command += '&& mkdir '+lf;
  command += '&& thrift -r --out '+lf+' --gen js:node '+path+'/'+file+'.thrift';
  command += "&& echo 'exports.ttypes=require(\""+lf+"/"+file+"_types\");\n' > "+lf+"/index.js";
  execSync(command);
  return  cls = require(lf+'/'+cls);
}

function wrapServices(services , s) {
  var asyncCounterDecorator = require('./decorator').asyncCounterDecorator;
  _.each(services, function(v, k){
    s[k] = asyncCounterDecorator(k , v);
  });
  return s;
}

function createThriftServer(thrift_path) {
  if (_.isEmpty(thrift_path)) {
    throw new Exceptions.ThriftProcessorError("project Name is null ");
  }
  var projDir = search_thrift_dir(thrift_path);
  var conf = require(projDir);
  var thriftClass = load(conf.thrift, projDir, conf.class);
  var thriftServices = require(projDir + '/' + conf.handler);
  var s = {};
  return thrift.createServer(
    thriftClass,
    wrapServices(thriftServices, s),
    {
      transport: thrift.TFramedTransport
    }
  );
}

function createMultiThriftServer(thrift_path) {
  if(_.isEmpty(thrift_path)){
    throw new Exceptions.ThriftProcessorError("project Name is null ");
  }

  mp = new thrift.MultiplexedProcessor();
  _.each(thrift_path, function(tp){
    var projDir = search_thrift_dir(tp);
    var conf = require(projDir);
    var thriftClass = load(conf.thrift, projDir, conf.class);
    var thriftServices = require(projDir+'/'+conf.handler);

    var s = {};
    var tc = new thriftClass.Processor(wrapServices(thriftServices , s));
    mp.registerProcessor(conf.handler, tc);
  });

  return thrift.createMultiplexServer(mp, {transport: thrift.TFramedTransport});
}

function createThriftClient(thrift_path, host, port, options){
  if(_.isEmpty(thrift_path)){
    throw new Exceptions.ThriftProcessorError("project Name is null ");
  }
  if(_.isEmpty(options)) options = {transport: thrift.TFramedTransport, protocol: thrift.TBinaryProtocol};

  var projDir = search_thrift_dir(thrift_path);
  var conf = require(projDir);
  var thriftClass = load(conf.thrift, projDir, conf.class);

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

function createMulitThriftClient(thrift_path, host, port, options){
  if(_.isEmpty(thrift_path)){
    throw new Exceptions.ThriftProcessorError("project Name is null ");
  }
  if(_.isEmpty(options)) options = {transport: thrift.TFramedTransport, protocol: thrift.TBinaryProtocol};
  var projDir = search_thrift_dir(thrift_path);
  var conf = require(projDir);
  var thriftClass = load(conf.thrift, projDir, conf.class);

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
  return multiplexer.createClient(conf.handler, thriftClass, con);
}

exports.createThriftServer = createThriftServer;
exports.createMultiThriftServer = createMultiThriftServer;
exports.createThriftClient = createThriftClient;
exports.createMulitThriftClient = createMulitThriftClient;