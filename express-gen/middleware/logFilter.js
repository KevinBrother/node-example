var logger = require('../config/logConfig').logger;

module.exports = function (req, res, next) {
    let { method, path, query, body } = req;
    const ip = res.socket.remoteAddress;
    // const ip = req.ip;
    const port = res.socket.remotePort;
    // TODO 通过请求方式进行参数改变现实（get和post）

    let info = `${ip}:${port} - - method: ${method}, url: ${path}`;
    if (method === "GET") {
        info += `, 请求参数：${JSON.stringify(query)}`;
    } else if (method === "POST") {
        info += `, 请求参数：${JSON.stringify(body)}`;
    }

    logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    logger.info(info)
    /* 117.143.151.109 - -[05 / Sep / 2020: 11: 03: 15 + 0800] "GET /api/index/listTaskByPage?status=&taskType=2&pageNum=1 HTTP/1.1" 200 4852 "https://pre.mars-tech.com.cn/task/index" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 
        (KHTML, like Gecko) Chrome / 84.0.4147.135 Safari / 537.36" */
    logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    next()
}