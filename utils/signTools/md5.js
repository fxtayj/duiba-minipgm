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

//验证签名，传入的params参数需要包含appSecret
let signVerify = (params,sign) => {
  const hash = crypto.createHash('md5');
  let array = [];
  let signStr = '';
  if(isIterable(params)) {
    for (let param of params) {
      array.push(param);
    }
  } else {
    for (let param in params) {
      array.push(param);
    }
  }
  
  let sortParams = new Map(array.sort());
  for (let value of sortParams.values()) {
    signStr += value;
  }
  hash.update(signStr)
  var signV = hash.digest('hex')
  return signV == sign;
}

//判断是否为iterable类型
function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

module.exports = {
  sign: sign,
  signVerify: signVerify
}
