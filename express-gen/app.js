var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var requestTime = require('./middleware/requestTime')
var logFilter = require('./middleware/logFilter')
var bodyParser = require('body-parser')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var errorRouter = require('./routes/error');

var app = express();

// 获取post请求参数
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const log = require('./config/logConfig');
var logger = require('./config/logConfig').logger;

// 添加Log4js配置 /
//结合express使用，记录请求日志
log.use(app);
//手动记录，可以代替console.log
logger.info('test info 1');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware
var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}
app.use(myLogger);

// middleware第二种方法
app.use(requestTime({ name: 1 }))

// 实际使用的日志拦截器
app.use(logFilter);
/* const logFilter = function (req, res, next) {
  let { method, path, query } = req;
  // query = query.toString();
  let info = `method: ${method}, url: ${path}, 请求参数：${JSON.stringify(query)}`;
  console.log('-------------logFIlter--------', logger.info(info));
  console.log('-------------logFIlter--------', logger.info(query.toString()));
  next()
}
app.use(logFilter); */

app.use(indexRouter);
app.use('/users', usersRouter);
app.use('/error', errorRouter);


// catch 404 and forward to error handler
/* app.use(function (req, res, next) {
  next(createError(404));
}); */

// error handler
app.use(function (err, req, res, next) {

  logger.info("---------错误日志--------", err);
  res.json({ error: err.message })
  next()
});

/* app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  console.log("----------错误日志--------", err);
  // res.render('error', { error: err });

  res.json({ error: err.message });
  // res.json({ error: err })
  // res.send({ error: err })

}); */

module.exports = app;

