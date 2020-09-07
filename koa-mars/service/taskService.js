
const taskDao = require("../dao/taskDao.js")
exports.getCourse = async function (opt) {

    // return `恭喜，你拿到东西了 ${opt}`
    return await taskDao.getCourse()
} 