var client = require('./connect'),
  ZOOKEEPER = require('node-zookeeper-client'),
  os = require('os'),
  path = require('path');

function getIPv4() {
  var network = os.networkInterfaces().eth0;
  if (!network || network.length < 1) return null;
  for (var i=0; i<network.length; i++) {
    if (network[i].family == 'IPv4') {
      return network[i].address;
    }
  }
}

function obj2ini(obj) {
  var cs = Object.keys(obj).map(function (k) {
    return '' + k + '=' + obj[k];
  });
  return cs.join('\n');
}

// function genConfigDefault(poolSize, port) {
//   return obj2ini({threadpoolsize: poolSize, port: port});
// }

function genPoolNode(service, port) {
  var conf = {};
  conf['version'] = 1;
  conf['server.service.level'] = 10;
  conf['implementation'] = service;
  conf['thrift.runner.zookeeper.config'] = '/services/' + service + '/Configuration/Default';
  conf['host'] = getIPv4();
  conf['port'] = port;
  conf['weight'] = 10;
  return obj2ini(conf);
}

function genNodePath(service, port) {
  var ip = getIPv4();
  if (!ip) return null;
  var poolPath = path.join('/services', service, 'Pool');
  var nodeName = ip + ':' + port;
  return path.join(poolPath, nodeName);
}

function registerService(service, port, cb) {
  var nodePath = genNodePath(service, port);
  if (!nodePath) cb(new Error('Can not get IP'));
  var nodeData = genPoolNode(service, port);
  client.mkdirp(nodePath, new Buffer(nodeData), cb);
}

function removeService(service, port, cb) {
  var nodePath = genNodePath(service, port);
  client.remove(nodePath, -1, cb);
}

function close() {
  client.close();
}

module.exports = {
  registerService: registerService,
  removeService: removeService,
  close: close
};
