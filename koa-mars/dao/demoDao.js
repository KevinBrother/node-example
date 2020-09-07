const query = require("../config/db.js");

exports.getCourse = async function () {
    let sql = "select * from course limit 10";
    return await query(sql);
}