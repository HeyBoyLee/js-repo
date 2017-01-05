var kafka = require('kafka-node');

var options = {
  host: 'zookeeper:2181',
  zk : undefined,   // put client zk settings if you need them (see Client)
  batch: undefined, // put client batch settings if you need them (see Client)
  ssl: true, // optional (defaults to false) or tls options hash
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  // An array of partition assignment protocols ordered by preference.
  // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
  protocol: ['roundrobin'],
  
  // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
  // equivalent to Java client's auto.offset.reset
  fromOffset: 'latest', // default
  
  migrateHLC: false,    // for details please see Migration section below
  migrateRolling: true
};

var consumerGroup = new ConsumerGroup(options, ['RebalanceTopic', 'RebalanceTest']);

// Or for a single topic pass in a string

var consumerGroup = new ConsumerGroup(options, 'RebalanceTopic');