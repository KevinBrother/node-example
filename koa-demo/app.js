const Koa = require('koa');
const app = new Koa();
const path = require("path")


// 解析post请求参数
const bodyParser = require('koa-bodyparser');

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();


// 模板引擎
// const nunjucks = require('nunjucks');
const koaNunjucks = require('koa-nunjucks-2');

app.use(koaNunjucks({
    // ext: 'njk',
    ext: 'html',
    path: path.join(__dirname, './views'),
    nunjucksConfig: {
        trimBlocks: true
    }
}));

// var s = env.render('hello.html', { name: '<script>alert("小明")</script>' });


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
const controller = require('./middleware/controller.js');

// 使用middleware:
app.use(controller())

// get
router.get("/hello/:name", async (ctx, next) => {
    var name = ctx.params.name;
    /* var s = env.render('hello.html', { name: name });
    ctx.response.body = s; */
    await ctx.render('hello', { name: name });

    // ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});
// post
router.post("/hello", async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    ctx.response.body = `<h1>Hello, ${name}!</h1>， 你的密码为${password}`;
});

app.use(bodyParser()); // 必须在router之前注册
app.use(router.routes());



// response
/* app.use(async ctx => {

    ctx.body = 'Hello World';
}); */

app.listen(3000, function (rst) {
    console.log(' app is running at http://localhost:3000');
});
/* app.listen(3001, function (rst) {
    console.log(' app is running at http://localhost:3001');
}); */


app.on('error', (err, ctx) => {
    console.log('server error', err, ctx);
});