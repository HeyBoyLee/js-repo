var express = require('express');
var co = require("co");
var router = express.Router();
var mongoBasedao = require('../dao/mongoBasedao');
var connectionName = "test";
var c1 = 0;
var c2 = 0;
router.post('/', function (req, res) {
  test(req, res);
});
function test(req, res) {
  co(function*() {
    var result = yield mongoBasedao.count({}, connectionName);
    console.log("count:" + result);
    c1++;
    console.log("c1:" + c1);
    if (result > 10) {
      var error = {
        code: 10000,
        msg: "max"
      }
      return yield Promise.reject(error);
    }
    var doc = {
      "name": "wade",
      "age": 15
    };
    yield mongoBasedao.insertOne(doc, connectionName);
    c2++;
    console.log("c2:" + c2);
    var success = {
      code: 0,
      msg: "success"
    }
    return yield Promise.resolve(success);
  }).then(function (result) {
    res.json(result);
  }, function (err) {
    res.json(err);
  });
}