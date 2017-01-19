/**
 * framework 基础封装库 - thrift rpc封装
 *
 * 1：提供 thrift rpc server 的能力 （只用于对内提供 RPC 接口调用支持）
 *
 * 注意：
 * a：封装不包括多进程处理的能力，多进程通过 ClusterServer 统一提供。
 * b：需要提供处理多个 *.thrift 定义的能力。
 *
 * 2：提供 thrift rpc client 的能力（用于计算服务的 RPC 请求支持）
 *
 *
 * 3: 提供计算服务的调用支持（client再封装）
 *
 *
 * Created by vito on 16-11-25.
 */


function ThriftServer(services) {
  // TODO services like
  // services = [
  //   {
  //     cls: null,
  //     handler: null,
  //     options: {/*thrift config*/}
  //   }
  // ]
}

ThriftServer.prototype.run = function () {
//  TODO
};


function ThriftClient() {
//  TODO
}

module.exports = {
  ThriftServer: ThriftServer,
  ThriftClient: ThriftClient
};