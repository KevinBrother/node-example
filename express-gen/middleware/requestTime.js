module.exports = function (option) {
    return function (req, res, next) {
        console.log("---------中间件的-----", Date.now());
        next()
    }
}