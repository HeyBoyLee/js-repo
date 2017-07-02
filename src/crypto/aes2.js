// 结果与java 加密结果一致
var crypto = require('crypto');

// var data = "156156165152165156156";
var data = {"report_id":3,"report_data":{"c":[{"s":1488524400866,"e":1488528000866,"mc":0,"sc":11,"bc":11,"ap":{},"cc":0,"dc":0}],"t":1488530371553,"vp":"1.1.21","vd":3}};
data = JSON.stringify(data)
console.log('Original cleartext: ' + data);
var algorithm = 'aes-128-ecb';
var key = '787b660372816553';
var clearEncoding = 'utf8';
var iv = "";
//var cipherEncoding = 'hex';
//If the next line is uncommented, the final cleartext is wrong.
var cipherEncoding = 'base64';
var cipher = crypto.createCipheriv(algorithm, key,iv);

var cipherChunks = [];
cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
cipherChunks.push(cipher.final(cipherEncoding));
var x = cipherChunks.join('');
console.log(cipherEncoding + ' ciphertext: ' + x);

var decipher = crypto.createDecipheriv(algorithm, key,iv);
var plainChunks = [];
// for (var i = 0;i < cipherChunks.length;i++) {
//   plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
// }
plainChunks.push(decipher.update(x, cipherEncoding, clearEncoding));
plainChunks.push(decipher.final(clearEncoding));
console.log("UTF8 plaintext deciphered: " + plainChunks.join(''));