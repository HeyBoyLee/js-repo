var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('127.0.0.1:2181' , {sessionTimeout: 100000});
//var path = process.argv[2];

client.once('connected', function () {
  console.log('Connected to the server.');

  client.mkdirp('/test/1/2',
    new Buffer('data'),
    //zookeeper.ACL.OPEN_ACL_UNSAFE,
    //zookeeper.CreateMode.EPHEMERAL,
    function (error) {
    if (error) {
      console.log('Failed to create node: %s due to: %s.', '/test/local', error);
    } else {
      console.log('Node: %s is successfully created.', '/test/local');

      client.remove('/test/1/2' , -1, function(error){
        if (error) {
          console.log(error.stack);
          return;
        }

        console.log('Node is deleted.');
      });

    }
    client.close();
  });



  // client.create('/test/demo', function (error, path) {
  //   if (error) {
  //     if (error.getCode() == zookeeper.Exception.NODE_EXISTS) {
  //       console.log('Node exists.');
  //     } else {
  //       console.log(error.stack);
  //     }
  //     return;
  //   }
  //   console.log('Node: %s is created.', path);
  // });
});

client.connect();