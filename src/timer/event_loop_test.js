var fs = require('fs');

setTimeout(function(){
    console.log('time out~');
}, 0);


//中间有费时的工作时（如：readFile），timeout是在immediate前执行的。
fs.readFile('./a.txt', function(err,data){
    console.log('read file~');
});

setImmediate(function(){
    console.log('immediate~');
});

// time out~
// immediate
// read file