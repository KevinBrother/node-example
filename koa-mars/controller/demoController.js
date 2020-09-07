// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
const basicService = require('../service/demoService.js')

/* var name = ctx.params.name;
name = ctx.request.body.name || '',
password = ctx.request.body.password || ''; */

// get  // http://localhost:3000/demo/getCourse
router.get("/getCourse", async (ctx, next) => {
    let vesselId = ctx.params.vesselId
    let opt = {
        vesselId,
        def: 12
    }
    // await ctx.render('hello', { name: vesselInfo });
    // ctx.response.body = `<h1>Hello, </h1>， 你的密码为 ${JSON.stringify(opt)}; `;

    const vesselInfo = await basicService.getCourse(opt)
    console.log(vesselInfo);
    ctx.response.body = JSON.stringify(vesselInfo);
});

module.exports = router