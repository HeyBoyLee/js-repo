var koa = require('koa');
var Router = require('koa-router');
var bodyparser = require('koa-bodyparser');
var app = koa();

app.on('error', function (err, context) {
  console.log('error:' + err + ', context:' + context);
});
// x-response-time
var router = new Router();
app.use(bodyparser());
app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response
var time;
app.use(function*(next) {
  // time = setInterval(function(){
  //     var err = new Error('name required!');
  //     err.status = 400;
  //    // return this.res.end()
  //     throw err;
  // }, 3000);
  yield next;
})

router.get('/', function *(next) {   // get
  this.body = 'Hello World';
  var err = new Error('name required!');
  err.status = 400;
  // return this.res.end()
  throw err;
  //return this.res.end();
  //clearInterval(time);
  //yield next;
  //return this.res.end()

})
  .post('/', function*(next) {         //post
    try {
      console.log(process.pid);
      time = setInterval(function () {
        console.log(process.pid);
        var err = new Error('name required2');
        err.status = 400;
        throw err;
      }, 3000);
      this.body = 'Hello Post';
      //yield hold;
    }
    catch (e) {
      console.log('error:', e);
    }
  });

router.get('/end', function*() {
  // this.res.end();
  console.log(222);
  yield function*(){
    var p = new Promise((resolve, reject)=> {

    }).then(r => {
      console.log(r);
    });
    return p;
  }

});

app.use(router.routes());

process.on('uncaughtException', function (err) {
  console.log('uncaughtException fired: ', err);
  //invokeTermHandlers();
});

function * hold() {
  while (1) {

  }
}

function * sleep(time) {
  var start = new Date;
  var diff = new Date - start;
  while (diff < time) {
    diff = new Date - start;
  }
}

app1 = koa();

app1.use(function *(next) {
  this.body = "app1";
})

app.listen(3000);
//app1.listen(5000);