const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// 导入controller middleware:
const controller = require('./utils/controller');
const templating = require('./utils/templating');

const isProduction = process.env.NODE_ENV === 'production';

const app = new Koa();

// log request URL:
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// 使用middleware:
if (!isProduction) {
    let staticFiles = require('./utils/static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}
//解析body
app.use(bodyParser());
//使用模板
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));
//控制器
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');