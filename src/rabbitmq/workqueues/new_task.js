#! /usr/bin/env node

/**
 * durable , persistent
 *
 * This durable option change needs to be applied to both the producer and consumer code.
 * At this point we're sure that the task_queue queue won't be lost even if RabbitMQ restarts.
 * Now we need to mark our messages as persistent - by using the persistent option Channel.sendToQueue takes.
 */


var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost' , function(err , conn){
  conn.createChannel(function(err , ch){
    var q = 'task_queue';
    var msg = process.argv.slice(2).join(' ')||'hello world!';

    ch.assertQueue(q , {durable:true});
    ch.sendToQueue(q , new Buffer(msg) , {persistent:true});

    console.log("[x] Send is '%s'" , msg);
  });

  setTimeout(function(){conn.close(); process.exit(0)} ,500);
})