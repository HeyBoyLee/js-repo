// nextTick -> 当前执行栈的尾部时执行
// setTimeout setImmediate :


setImmediate(function(){
  console.log(3);
  process.nextTick(function(){
    console.log(13);
    setImmediate(function(){
      console.log(14);
    })
  })

});

setTimeout(function(){
  console.log(1);
  process.nextTick(function(){
    console.log(6);
    setImmediate(function(){
      console.log(12);
    });
    setTimeout(function(){
      console.log(8);
    });
  });
},0);

// setInterval(function(){
//   console.log(4)
// } , 0);
setTimeout(function(){
  console.log(4);
},0);


process.nextTick(function(){
  console.log(2)
  process.nextTick(function(){
    console.log(11);
  })
});

process.nextTick(function(){
  console.log(7)
  setTimeout(function(){
    console.log(5)
    setTimeout(function(){
      console.log(9)
    });
  });
});

console.log(10)


// 2 1 4 5 6 3
