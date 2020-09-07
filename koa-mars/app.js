const Koa = require('koa');
const app = new Koa();

// 解析post请求参数
const bodyParser = require('koa-bodyparser');

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

const errorHandler = require('./middleware/errorHandler.js');
// 异常捕获逻辑，一定要放在第一个中间件
app.use(errorHandler)

// 加载配置文件
const config = require("./config/index.js")
config.use(app)

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// 导入controller middleware:
// const controller = require('./middleware/controller.js');

// 使用middleware:
// app.use(controller())

// 导入controller
let demo = require('./controller/demoController.js');
let basic = require('./controller/basicController.js');
let task = require('./controller/taskController.js');
router.use('/demo', demo.routes());
router.use('/api', basic.routes());
router.use('/task', task.routes());

app.use(bodyParser()); // 必须在router之前注册
app.use(router.routes());

app.listen(3000, function (rst) {
    console.log(' app is running at http://localhost:3000');
});

/* app.on('error', (err, ctx) => {
    console.log('server error', err, ctx);
}); */