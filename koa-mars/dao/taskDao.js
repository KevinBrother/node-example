const { query } = require("../config/db.js")("remote13");

exports.getCourse = async function () {
    let sql = "select * from cgi_task limit 10";
    return await query(sql);
}