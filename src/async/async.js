/*
  async 函数就是generator函数的语法糖
 */

// generator 函数
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};


/*

 */
//async 函数
var asyncReadFile = async function (){
  try{
    var f1 = await readFile('/etc/fstab');
    var f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
  }
  catch(err){
    console.log(err);
  }
  
};


