var log4js = require('log4js');
log4js.configure({
    appenders: {
        ruleConsole: { type: 'console' },
        ruleFile: {
            type: 'dateFile',
            // 这个目录是相对于根目录的，即与app.js 是同一级的
            filename: 'logs/server-',
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 10 * 1000 * 1000,
            numBackups: 3,
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: { appenders: ['ruleConsole', 'ruleFile'], level: 'info' }
    }
});
var logger = log4js.getLogger('normal');

exports.logger = logger;

exports.use = function (app) {
    //页面请求日志,用auto的话,默认级别是WARN
    //这样会自动记录每次请求信息，放在其他use上面
    app.use(log4js.connectLogger(logger, { level: 'debug', format: ':method :url' }));
}


/*
const log = require('./config/logConfig');
var logger = require('./config/logConfig').logger;
// 添加Log4js配置 /
//结合express使用，记录请求日志
log.use(app);
//手动记录，可以代替console.log
logger.info('test info 1');
 */