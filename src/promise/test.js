console.log("A");

setTimeout(() => {
  console.log("A - setTimeout");
}, 0);

new Promise((resolve) => {
  resolve();
})
  .then(() => {
    return console.log("A - Promise 1");
  })
  .then(() => {
    return console.log("B - Promise 1");
  });

new Promise((resolve) => {
  resolve();
})
  .then(() => {
    return console.log("A - Promise 2");
  })
  .then(() => {
    return console.log("B - Promise 2");
  })
  .then(() => {
    return console.log("C - Promise 2");
  });

console.log("AA");