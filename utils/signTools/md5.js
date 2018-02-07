const crypto = require('crypto');

let sign = (params) => {
  const hash = crypto.createHash('md5');
  let array = [];
  let signStr = '';
  for (let param of params) {
    array.push(param);
  }
  let sortParams = new Map(array.sort());
  for (let value of sortParams.values()) {
    signStr += value;
  }
  hash.update(signStr);
  return hash.digest('hex');
}

module.exports = {
  sign: sign
}
