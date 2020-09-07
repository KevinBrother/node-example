var express = require('express');
var router = express.Router();
let fs = require("fs")
let path = require('path')

// err处理
router.get('/', function (req, res) {
    throw new Error('哇哦，错了！')
})

router.get("/errFile", function (req, res, next) {
    console.log("----------------------__dirname-------------", __dirname);
    console.log("----------------------__filename-------------", __filename);
    console.log("----------------------   path.resolve()-------------", path.resolve());

    fs.readFile(__filename + 1, function (err, data) {
        if (err) {
            next(new Error('上传文件，错了！'));
        } else {
            res.send(data.toString())
        }
    })
})

router.get("/errJson", function (req, res, next) {
    fs.readFile(__filename + 1, function (err, data) {
        if (err) {
            next(new Error('上传文件，错了！'));
        } else {
            res.send(data.toString())
        }
    })
})
module.exports = router;