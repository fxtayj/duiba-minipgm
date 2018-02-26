const md5 = require('../utils/signTools/md5')
const config = require('../config/config')

const appKey = config.duiba.appKey
const appSecret = config.duiba.appSecret

let res = {
    'status': 'fail',
    'errorMessage': '',
    'bizId': '',
    'credits': '0'
}

let consume = async (ctx, next) => {

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
    if (md5.signVerify(params, signParam)) {
        res.status = 'true'
        res.bizId = ''
        res.credits = ''
        ctx.body = JSON.stringify(res)
    }

}

module.exports = {
    'GET /duiba/consume': consume
};