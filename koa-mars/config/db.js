

// 数据库连接
var mysql = require('mysql');

let pool = ""

let optMap = {
    "local": {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "runoob"
    },
    "13": {
        host: "192.168.1.13",
        user: "root",
        password: "uENQfwm2kiTBkyhQ",
        database: "francis"
    },
    "remote13": {
        host: "pre.mars-tech.com.cn",
        port: "33060",
        user: "root",
        password: "uENQfwm2kiTBkyhQ",
        database: "francis"
    }
}

function getPool(key) {
    key = key || "local"
    let opt = optMap[key];

    return mysql.createPool(opt)
}


// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

let query = function (sql, values) {
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}

module.exports = function (key) {
    pool = getPool(key)
    return {
        query
    }

}