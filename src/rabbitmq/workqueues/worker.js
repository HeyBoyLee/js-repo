#! /usr/bin/env node

/**
 *  noAck:false -
 *  In order to make sure a message is never lost, RabbitMQ supports message acknowledgments.
 *  An acknowledgement is sent back from the consumer to tell RabbitMQ that a particular message has been received,
 *  processed and that RabbitMQ is free to delete it.
 *
 *  If a consumer dies (its channel is closed, connection is closed, or TCP connection is lost) without sending an ack,
 *  RabbitMQ will understand that a message wasn't processed fully and will re-queue it.
 *  If there are other consumers online at the same time, it will then quickly redeliver it to another consumer.
 *
 *  There aren't any message timeouts; RabbitMQ will redeliver the message when the consumer dies.
 *  It's fine even if processing a message takes a very, very long time.
 *
 *  prefetch(1)---
 *  
 *  This tells RabbitMQ not to give more than one message to a worker at a time.
 *  Or, in other words, don't dispatch a new message to a worker until it has processed and acknowledged the previous one.
 *  Instead, it will dispatch it to the next worker that is not still busy.
 *  
 */

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost' , function(err , conn){
  conn.createChannel(function(err , ch){
    var q = 'task_queue';

    ch.assertQueue(q , {durable:true});
    ch.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

    ch.consume(q , function(msg){
      var secs = msg.content.toString().split('.').length -1;
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg);
      }, secs * 1000);
    }, {noAck: false});

  })
})