var Encryption = require('./utils/encryption');
var e = new Encryption();
var key = "Ziy66Kf";
var text = "2dvVjNPS7KNFRfjRZXrTvvvsUak7nJDwgh4QhaA";

var encrypted = e.encrypt(text, key);
console.log("Encrypted text: "+encrypted);

var decrypted = e.decrypt(encrypted, key);
console.log("Decrypted text: "+decrypted);