var koa = require('koa');
var timeout = require('koa-timeout')(500);
var heapdump = require('heapdump');
var app = koa();

app.on('error' , function (err,ctx) {
    console.log("error occur:",err.stack);
})
app.use(function * tryCatch(next) {
    try {
        yield next;
    } catch(e) {
        this.status = e.status || 500;
        this.body = e.message;
        this.app.emit('error', e, this);
        heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');
    }
});

app.use(timeout);

// Some potentially slow logic:
app.use(function * () {
    yield function(done) {
        setTimeout(done, 1000);
    };
});

app.listen(3000);