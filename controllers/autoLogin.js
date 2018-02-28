const md5 = require('../utils/signTools/md5')
const config = require('../config/config')
const usersDAO = require('../dao/UsersDAO')

const prefix = 'https://home.m.duiba.com.cn/autoLogin/autologin?';
const appKey = config.duiba.appKey
const appSecret = config.duiba.appSecret

let autoLogin = async(ctx, next) => {
  let uid = ctx.request.query['uid'] || 'duiba';
  let redirect = ctx.request.query['dbredirect'];
  let timestamp = new Date().getTime();
  let credits

  let user = await usersDAO.findOneByUid(uid)

  if(user && user.credits) {
    credits = user.credits
  } else {
    credits = 100
    let userEntity = {
      uid:uid,
      credits:credits,
      nickName:'',
      gender:''
    }
    await usersDAO.createUser(userEntity)
  }

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
