const https = require('https');

let onLogin = async (ctx, next) => {
    console.log(JSON.stringify(ctx.request.body))
    let code = ctx.request.body.code;
    

    https.get('https://encrypted.google.com/', (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

    }).on('error', (e) => {
        console.error(e);
    });

    let A = 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code'
}