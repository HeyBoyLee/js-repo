var kafka = require('kafka-node'),
  HighLevelConsumer = kafka.HighLevelConsumer,
  client = new kafka.Client(),
  consumer = new HighLevelConsumer(client , [{ topic: 't1' }, { topic: 't2' }]);

// consumer.addTopics(['t1', 't2'], function (err, added) {
// });

consumer.on('message', function (message) {
  console.log(message);
});