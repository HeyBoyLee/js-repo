/**
 cluster 机制
 集群模块支持两种分发传入连接的方法。

 第一个（除了Windows之外的所有平台上的默认值）是循环方法，其中主进程在端口上侦听，
 接受新连接并以循环方式在工作线程中分布它们，在智能，以避免重载工作进程。(主进程接收新的连接)

 第二种方法是主进程创建侦听套接字并将其发送给感兴趣的工作进程。(工作进程然后直接接受传入连接。)

 第二种方法在理论上应该给出最好的性能。
 然而，在实践中，由于操作系统调度器变幻莫测，分布往往非常不平衡。
 已经观察到负载，其中超过70％的所有连接最终只在两个过程中，总共八个。

 cluster.schedulingPolicy = cluster.SCHED_NONE;

 export NODE_CLUSTER_SCHED_POLICY="none" # "rr" is round-robin
 */
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
require('./log');

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    // fork 后 程序重新加载所有资源
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log('xxx');
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);
}