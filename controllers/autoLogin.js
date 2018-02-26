const md5 = require('../utils/signTools/md5')
const config = require('../config/config')

const prefix = 'https://home.m.duiba.com.cn/autoLogin/autologin?';
const appKey = config.duiba.appKey
const appSecret = config.duiba.appSecret

let autoLogin = async(ctx, next) => {
  let uid = ctx.request.query['uid'] || 'duiba';
  let credits = ctx.request.query['credits'] || '100';
  let redirect = ctx.request.query['dbredirect'];
  let timestamp = new Date().getTime();

  let params = new Map();
  params.set('uid', uid);
  params.set('credits', credits);
  params.set('appKey', appKey);
  params.set('timestamp', timestamp);
  if (!!redirect) {
    params.set('redirect', redirect);
  }
  params.set('appSecret', appSecret);

  let sign = md5.sign(params);

  let autoLoginUrl = '';
  if (!!redirect) {
    autoLoginUrl = prefix + 'uid=' + uid + '&credits=' + credits + '&appKey=' + appKey + '&timestamp=' + timestamp + '&sign=' + sign +'&redirect='+ encodeURIComponent(redirect);
  } else {
    autoLoginUrl = prefix + 'uid=' + uid + '&credits=' + credits + '&appKey=' + appKey + '&timestamp=' + timestamp + '&sign=' + sign;
  }

  ctx.redirect(autoLoginUrl);
}

module.exports = {
  'GET /duiba/autoLogin': autoLogin
};
