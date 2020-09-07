var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 命名callback结尾bug
router.get('/callback/abc', function (req, res, next) {
  console.log("first callback");
  next()
}, function (req, res, next) {
  console.log("second callback");
  next()
}, function (req, res, next) {
  // res.send(new Buffer('heheda'));
  res.send('heheda');
});

module.exports = router;
