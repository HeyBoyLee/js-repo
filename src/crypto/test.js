var buffer = new Buffer('shawntsia');

var json  = JSON.stringify(buffer);
console.log(json);

var array = JSON.parse(json);
console.log(array);

var buffer2 = new Buffer(array);
console.log(buffer2.toString());