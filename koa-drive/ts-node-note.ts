/**
 * @description 通过Koa中间件的方式 试图在路由注册前完成更多工作
 */
import * as Koa from 'koa';
import * as Router from 'koa-router';

const app = new Koa();

const router = new Router();

router.get('/', async (ctx, next) => {
    console.log('registry route');
    await next();
    console.log('middleware has called');
    ctx.body = 'te-node-note';
});

app.use(router.routes()).use(router.allowedMethods()).use(async (ctx, next) => {
    console.log('logger');
    await next();
});

app.listen(8091, () => {
    console.log('http://localhost:8091');
});
