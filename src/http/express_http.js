/**
 *  node 主线程  , 消息循环 不要混淆
 */

var express = require('express');
var https = require('https');
var http = require('http');
// var bodyparser = require('body-parser');
var fs = require('fs');
var bodyParser = require('body-parser');
var responseTime = require('response-time')

// var options = {
//   ca: [fs.readFileSync(PATH_TO_BUNDLE_CERT_1), fs.readFileSync(PATH_TO_BUNDLE_CERT_2)],
//   cert: fs.readFileSync(PATH_TO_CERT),
//   key: fs.readFileSync(PATH_TO_KEY)
// };
//------------ test success ------------------
// var privateKey  = fs.readFileSync('server.key', 'utf8');
// var certificate = fs.readFileSync('server.cert', 'utf8');
// var credentials = {key: privateKey, cert: certificate};
var app = express()
app.use(bodyparser.json());
app.use(responseTime());
app.use(bodyParser.json());
app.use('/static' , express.static('public'));

app.get('/', function(req,res) {
  //res.send('hello');
  setTimeout(function(){
    console.log(1);
  } , 10000);
});

app.get('/jsonp/test' , function(req , res){
  var result = req.query.callback +'({price: 9, tickets:script})'
 // res.send(''+req.query.code + req.query.callback);
  res.send(result);
});


app.get('/jsonp/ajax' , function(req , res){
  //var result = req.query.callback +'({price: 9, tickets:ajax})'
  // res.send(''+req.query.code + req.query.callback);
  res.jsonp({price:100 , tickets:'ajax'});
});

app.get('/jsonp' , function(req , res){
  //var result = req.query.callback +'({price: 9, tickets:ajax})'
  // res.send(''+req.query.code + req.query.callback);
  res.jsonp({status:'jsonp'});
});

app.get('/json' , function(req , res){
  //var result = req.query.callback +'({price: 9, tickets:ajax})'
  // res.send(''+req.query.code + req.query.callback);
  new Promise(function(resolve , reject){

  })
  console.log(2);
  res.send({status:'json'});
});

app.post('/submit', function(req, res){
  console.log(req.body);
  res.send({result:'ok'});

});

//var server = https.createServer(credentials,app);
var server = http.createServer(app);
server.on('connection', function(){})

server.listen(8001, function(){
  console.log("server running at https://IP_ADDRESS:8001/")
});
