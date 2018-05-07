let index = async (ctx, next) => {
    ctx.body = '欢迎访问兑吧福利中心'
}

module.exports = {
    'GET /duiba/index': index,
    'GET /': index
};