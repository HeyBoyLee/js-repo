var kafka = require('kafka-node'),
  HighLevelProducer = kafka.HighLevelProducer,
  client = new kafka.Client(),
  producer = new HighLevelProducer(client),
  payloads = [
    { topic: 't1', messages: 'hi' },
    { topic: 't2', messages: ['hello', 'world'] }
  ];
producer.on('ready', function () {
  producer.send(payloads, function (err, data) {
    console.log(data);
  });
});