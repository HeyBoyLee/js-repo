var zookeeper = require('node-zookeeper-client'),
  os = require('os'),
  path = require('path');

var zkHosts = {
  mine: '127.0.0.1:2181'
};

var getIPv4 = function () {
  var network = os.networkInterfaces().eth0;
  if (!network || network.length < 1) return null;
  for (var i=0; i<network.length; i++) {
    if (network[i].family == 'IPv4') {
      return network[i].address;
    }
  }
};

var obj2ini = function (obj) {
  var cs = Object.keys(obj).map(function (k) {
    return '' + k + '=' + obj[k];
  });
  return cs.join('\n');
};

var genConfigDefault = function (poolSize, port) {
  return obj2ini({threadpoolsize: poolSize, port: port});
};

var genPoolNode = function (service, port) {
  var conf = {};
  conf['version'] = 1;
  conf['server.service.level'] = 10;
  conf['implementation'] = service;
  conf['thrift.runner.zookeeper.config'] = '/services/' + service + '/Configuration/Default';
  conf['host'] = getIPv4();
  conf['port'] = port;
  conf['weight'] = 10;
  return obj2ini(conf);
};

var zkUtils = function (env) {
  if (!(env in zkHosts)) return null;

  var zkClient = zookeeper.createClient(zkHosts[env]);
  zkClient.on('state', function (state) {
    C.logger.info('Client State: ' + state);
  });
  zkClient.connect();

  var genNodePath = function (service, port) {
    var ip = getIPv4();
    if (!ip) return null;
    var poolPath = path.join('/services', service, 'Pool');
    var nodeName = ip + ':' + port;
    return path.join(poolPath, nodeName);
  };

  var registerService = function (service, port, cb) {
    var nodePath = genNodePath(service, port);
    if (!nodePath) cb(new Error('Can not get IP'));
    var nodeData = genPoolNode(service, port);
    zkClient.create(nodePath, new Buffer(nodeData), zookeeper.CreateMode.EPHEMERAL, cb);
  };

  var removeService = function (service, port, cb) {
    var nodePath = genNodePath(service, port);
    zkClient.remove(nodePath, -1, cb);
  };

  var close = function () {
    zkClient.close();
  };

  return {
    registerService: registerService,
    removeService: removeService,
    close: close
  }

};

module.exports = zkUtils;
