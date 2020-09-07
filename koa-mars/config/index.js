
const path = require("path")

// 模板引擎
const koaNunjucks = require('koa-nunjucks-2');

const tplEngine = koaNunjucks({
    ext: 'html',
    path: path.join(__dirname, '../views'),
    nunjucksConfig: {
        trimBlocks: true
    }
})

exports.use = function (app) {
    app.use(tplEngine);
}


