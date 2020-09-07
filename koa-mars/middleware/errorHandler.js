// 异常捕获处理
module.exports = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        /* {
            "timestamp": "2020-09-06 19:14:40",
            "status": 404,
            "error": "Not Found",
            "message": "No message available",
            "path": "//report/lps/getVesselInf12o"
        } */

        //  TODO 对请求java的请求做特殊处理
        err = JSON.parse(error.message)
        ctx.response.body = {
            code: err.status,
            error: err.error,
            message: err.message
        }
        /* ctx.response.body = {
            code: "0000",
            message: '服务器异常',
            desc: error.message
        } */
    }
}