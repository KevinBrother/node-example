// 异常捕获处理
module.exports = async (ctx, next) => {
    try {
        await next()

        if (parseInt(ctx.status) === 404) {
            ctx.response.body = `<h1>Sorry, 404!</h1>`;
            // ctx.response.redirect("/404");
        }

    } catch (error) {
        /* {
            "timestamp": "2020-09-06 19:14:40",
            "status": 404,
            "error": "Not Found",
            "message": "No message available",
            "path": "//report/lps/getVesselInf12o"
        } */

        //  TODO 对请求java的请求做特殊处理
        /*  err = JSON.parse(error.message)
         ctx.response.body = {
             code: err.status,
             error: err.error,
             message: err.message
         } */

        let errMap = {}
        for (let key of Object.keys(error)) {
            errMap[key] = error[key];
        }

        ctx.response.body = errMap

        // sql Eroor
        /* {
            "code": "ER_NO_SUCH_TABLE",
            "errno": 1146,
            "sqlMessage": "Table 'runoob.cgi_task' doesn't exist",
            "sqlState": "42S02",
            "index": 0,
            "sql": "select * from cgi_task limit 10"
        } */
    }
}