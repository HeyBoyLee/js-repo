/**
 * The first thing to know about are types. The available types in Thrift are:
 *
 *  bool        Boolean, one byte
 *  i8 (byte)   Signed 8-bit integer
 *  i16         Signed 16-bit integer
 *  i32         Signed 32-bit integer
 *  i64         Signed 64-bit integer
 *  double      64-bit floating point value
 *  string      String
 *  binary      Blob (byte array)
 *  map<t1,t2>  Map from one type to another
 *  list<t1>    Ordered list of one type
 *  set<t1>     Set of unique elements of one type
 *
 * Did you also notice that Thrift supports C style comments?
 */

 /*
 * Command:
 *
 *  thrift --gen <language> <Thrift filename>
 *  example: 1)thrift -r --gen js:node helloworld.thrift  npm install thrift  位置： */node_modules
 *           2)thrift -r --gen py helloworld.thrift  pip install python   位置：**/python/dist-packages
 */

 service HelloWorld {
    void printHelloWorld(1: string name)
 }