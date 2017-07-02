var express = require('express');
var bodyparser = require('body-parser');
var http = require('http');
var crypto = require('crypto');
var app = express();
console.log(process.argv);
// app.use();
var users={};
app.get('/newUser', function (req, res) {
    var username = req.query.username || '';
    var password = req.query.password || '';

    username = username.replace(/[!@#$%^&*]/g, '');

    if (!username || !password || users.username) {
        return res.sendStatus(400);
    }

    var salt = crypto.randomBytes(128).toString('base64');
    var hash = crypto.pbkdf2Sync(password, salt, 10000, 512);

    users[username] = {
        salt: salt,
        hash: hash
    };

    res.sendStatus(200);
});

app.get('/auth', function (req, res) {
    var username = req.query.username || '';
    var password = req.query.password || '';

    username = username.replace(/[!@#$%^&*]/g, '');

    if (!username || !password || !users[username]) {
        return res.sendStatus(400);
    }

    var hash = crypto.pbkdf2Sync(password, users[username].salt, 10000, 512);

    if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

var server = http.createServer(app);
server.on('connection', function(){})

server.listen(8001, function(){
    console.log("server running at https://IP_ADDRESS:8001/")
});