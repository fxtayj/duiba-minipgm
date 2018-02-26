const config = {
    db: {
        database: 'duiba_mp', // 使用哪个数据库
        username: 'duiba', // 用户名
        password: 'duiba2018', // 口令
        host: '47.52.236.163', // 主机ip
        port: 3306 // 端口号，MySQL默认3306
    },
    duiba: {
        appKey: 'xcwb4dwGLtoX5N94zmrwh1JHLW3',
        appSecret: '3PbR3H9mXqZnLtPTFJqYnFuaayNj'
    },
    cookie: {
        domain: '127.0.0.1', // 写cookie所在的域名
        path: '/', // 写cookie所在的路径
        maxAge: 24 * 60 * 60 * 1000, // cookie有效时长
        expires: new Date('2020-02-15'), // cookie失效时间
        httpOnly: false, // 是否只用于http请求中获取
        overwrite: false // 是否允许重写
      }
}

module.exports = config