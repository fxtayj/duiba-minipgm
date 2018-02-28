const md5 = require('../utils/signTools/md5')
const config = require('../config/config')
const usersDAO = require('../dao/UsersDAO')
const ordersDAO = require('../dao/OrdersDAO')

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
    let orderEntity = requestQuery
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
        res.errorMessage = '签名验证不通过'
        ctx.body = JSON.stringify(res)
    } else {
        //TODO  扣积分订单信息入库，更新用户积分
        // try {
        let order = await ordersDAO.findOneByOrderNum(orderEntity.orderNum)
        if (!order) {
            order = await ordersDAO.createOrder(orderEntity)
            let user = await usersDAO.findOneByUid(orderEntity.uid)
            user.credits = user.credits - order.credits
            if (user.credits < 0) {
                res.errorMessage = "失败原因：积分不足！"
                ctx.body = JSON.stringify(res)
            } else {
                await usersDAO.updateUser(user)
                res.status = 'ok'
                res.bizId = order.id
                res.errorMessage = ''
                res.credits = user.credits
                ctx.body = JSON.stringify(res)
            }
        } else {
            res.errorMessage = "失败原因：订单号重复，OrderNum=" + order.orderNum
            ctx.body = JSON.stringify(res)
        }
        // } catch (error) {
        //     res.errorMessage = "失败原因："+error
        //     ctx.body = JSON.stringify(res)
        // }
    }
}

module.exports = {
    'GET /duiba/consume': consume
};