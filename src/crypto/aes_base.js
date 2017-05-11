/**
 sk :787b6603728165530cffbec95df79380
 data :{"report_id":3,"report_data":{"c":[{"s":1488524400866,"e":1488528000866,"mc":0,"sc":11,"bc":11,"ap":{},"cc":0,"dc":0}],"t":1488530371553,"vp":"1.1.21","vd":3}}
 result :VnmMI9YgUlMFFZXW2He5YaMXEy1dQOkmf17MihIlpmR0dDQzqdS6hFtnHRWUE0qlMH6w7D3D4K8OTc2T9a8XlcUwylY31IagZtf0M7OTJac4MjHADoz1MShDdnQygsugysMqzbss5srQQlvH/r3rKk2E5TWvvMwexn8Ld2CL2jj057Q2Mq5x9YFpuvL/rQ+kHe3x69sh6xUHhfhZflJP9A==
 */

var crypto = require('crypto');
var algorithm = 'aes-128-ecb';
var clearEncoding = 'utf8';
var iv = "";
var cipherEncoding = 'base64';

function md5(k) {
  return crypto.createHash('md5').update(k).digest('hex').substr(0, 16);
}

function encryptAESBase64(data, secretKey) {
  var cipher = crypto.createCipheriv(algorithm, secretKey,iv);
  var cipherChunks = [];
  cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));
  return cipherChunks.join('');
}

function decryptAESBase64(data, secretKey) {
  var decipher = crypto.createDecipheriv(algorithm, secretKey,iv);
  var plainChunks = [];

  plainChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
  plainChunks.push(decipher.final(clearEncoding));
  return plainChunks.join('');
}

var res = require('./conf.json');
var key = require('./key.json');
var k = "mtk011796d82ca63e2608f";
if(process.argv.length > 2) k = process.argv[2] ;

var data = JSON.stringify(res.data);
var sk = key[k];
sk = md5(sk);
console.log(sk);
var x = encryptAESBase64(data, sk);
console.log(x);
//console.log(res.result.length/2014);
var y = decryptAESBase64(res.result, sk);
console.log(y);//JSON.parse(JSON.stringify(y, null , 2)));
// securityKey:V1o2sGQTx
try{
  JSON.parse(y)
}catch(e){
  if(e.message == "U")
  console.log(e)
}