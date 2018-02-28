const md5 = require('../utils/signTools/md5')
const config = require('../config/config')
const ordersDAO = require('../dao/OrdersDAO')
const usersDAO = require('../dao/UsersDAO')

const appKey = config.duiba.appKey
const appSecret = config.duiba.appSecret

let notify = async (ctx, next) => {

    let requestQuery = ctx.request.query
    if (appKey != requestQuery.appKey) {
        ctx.body = 'appKey不匹配'
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
        let order = await ordersDAO.findOneByOrderNum(requestQuery.orderNum)
        if(order && !order.finished){
            if(!requestQuery.success){
                let user = await usersDAO.findOneByUid(order.uid)
                user.credits = user.credits + order.credits
                await usersDAO.updateUser(user)
            }
            order.finished = true
            await ordersDAO.updateOrder(order)
            ctx.body = 'ok'
        }else {
            ctx.body = '订单不存在或已处理'
        }
    }

}

module.exports = {
    'GET /duiba/notify': notify
};