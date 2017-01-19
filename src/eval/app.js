var w = require('a');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
exec('ls -al', function(err , res){
  console.log(res);
})
var p = process.cwd();//path.resolve(process.cwd(), '../node_modules');

var rp = path.resolve(p , './shell');
var index = p.lastIndexOf('/');

var tp = search_thrift_dir('./shell');

p = search_modules_folder(p);

console.log(p);

function search_thrift_dir(dir){
  cwd = process.cwd();
  var index = cwd.lastIndexOf('/');
  while(index >0){
    p = path.resolve(cwd, dir);
    if(!fs.existsSync(p)){
      index = cwd.lastIndexOf('/');
      if(index === 0) return null;
      cwd = cwd.substr(0, index);
    }
    else{
      return p;
    }
  }
  return null;
}

function search_modules_folder(p){
  var index = p.lastIndexOf('/');
  while(index >0){
    if(!fs.existsSync(p+'/node_modules')){
      index = p.lastIndexOf('/');
      if(index === 0 ) return null;
      p = p.substr(0, index);
    }
    else{
      return p+'/node_modules';
    }
  }
}