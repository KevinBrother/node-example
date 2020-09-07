// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
const basicService = require('../service/basicService.js')

// get  // http://localhost:3000/api/basic/getVesselStructure?vesselId=10;
router.get("/basic/getVesselStructure", async (ctx, next) => {
    let vesselId = ctx.query.vesselId
    let authorization = ctx.request.headers.authorization

    const vesselStructure = await basicService.getVesselStructure(vesselId, authorization);
    /* console.log(vesselStructure);
    ctx.response.body = JSON.stringify(vesselStructure); */
    // await ctx.render('hello', { name: vesselInfo });

    console.log(vesselStructure)

    await ctx.render('vesselStructure', {
        vessel: vesselStructure.vessel,
        topViewData: vesselStructure.topViewData
    })
});

module.exports = router