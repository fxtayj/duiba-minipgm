var crypto = require('crypto');
var algorithm = "bf-ecb";

function pad(text) {
  pad_bytes = 8 - (text.length % 8)
  for (var x=1; x<=pad_bytes;x++)
    text = text + String.fromCharCode(0)
  return text;
}

function Encryption() {
  self = this;
  self.encrypt = function(data, key) {
    var cipher = crypto.createCipheriv(algorithm, new Buffer(key), '');
    cipher.setAutoPadding(false);
    try {
      return new Buffer(cipher.update(pad(data), 'utf8', 'binary') + cipher.final('binary'), 'binary').toString('base64');
    } catch (e) {
      return null;
    }
  }

  self.decrypt = function(data, key) {
    var decipher = crypto.createDecipheriv(algorithm, new Buffer(key), '');
    decipher.setAutoPadding(false);
    try {
      return (decipher.update(new Buffer(data, 'base64').toString('binary'), 'binary', 'utf8')+ decipher.final('utf8')).replace(/\x00+$/g, '');
    } catch (e) {
      return null;
    }
  }
}

module.exports = Encryption;