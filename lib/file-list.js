var fs = require('fs');
//var path = './src/';

function getFileList(path){
  if(!path) path = './src/';
  var result = fs.readdirSync(path);

  var files = {};
  result.forEach(function(d){
    files[d.slice(0,d.indexOf('.'))] = path +d;
  });
  console.log(files);
  return files;
}

module.exports = getFileList;