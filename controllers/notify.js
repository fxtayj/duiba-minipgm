const md5 = require('../utils/signTools/md5')
const config = require('../config/config')

const appKey = config.duiba.appKey
const appSecret = config.duiba.appSecret

let res = 'ok'

let notify = async (ctx, next) => {

    let requestQuery = ctx.request.query
    if (appKey != requestQuery.appKey) {
        res.errorMessage = 'appKey不匹配'
        ctx.body = JSON.stringify(res)
    }
    let signParam = requestQuery.sign
    delete requestQuery.sign
    requestQuery.appSecret = appSecret

    let params = new Map()
    for (let p in requestQuery) {
        params.set(p, requestQuery[p])

    }
    if (!md5.signVerify(params, signParam)) {
        ctx.body = '签名验证不通过'
    }else{
        //TODO  根据orderNum反查扣积分订单信息，如状态是失败就返还用户积分，否则返回ok

        //TODO  
    }

}

module.exports = {
    'GET /duiba/notify': notify
};