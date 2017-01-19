var ttypes = require("node-helloworld").ttypes;

function printHelloWorld(name , result) {
  console.log("node - name:"+name);
  result(null);
}

module.exports ={
  printHelloWorld: printHelloWorld
};