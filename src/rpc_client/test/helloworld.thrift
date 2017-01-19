/**
thrift -r --gen js:node helloworld.thrift
**/

service HelloWorld {
  void printHelloWorld(1: string name)
}