/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { configure, getLogger, Logger as Logger4js } from 'log4js';

import { AppCtx, AnyType } from '@interfaces';
import { loggerConfig } from './logger-config';

export class Logger {
    public logText = '';
    public errorLogger: Logger4js;
    public resLogger: Logger4js;

    constructor () {
        // 加载配置文件
        configure(loggerConfig);
        //
        this.errorLogger = getLogger('errorLogger');
        this.resLogger = getLogger('resLogger');
    }

    // 格式化请求日志
    public formatReqLog (req: AnyType, resTime: number): void {
        //
        const method = req.method;
        // 访问方法
        this.logText += 'request method: ' + method + '\n';
        // 请求原始地址
        this.logText += 'request originalUrl:  ' + req.originalUrl + '\n';
        // 客户端ip
        this.logText += 'request client ip:  ' + req.ip + '\n';
        // 开始时间
        // let startTime: string;
        // 请求参数
        if (method === 'GET') {
            this.logText += 'request query:  ' + JSON.stringify(req.query) + '\n';
            // startTime = req.query.requestStartTime;
        } else {
            this.logText += 'request body: ' + JSON.stringify(req.body, null, 4) + '\n';
            // startTime = req.body.requestStartTime;
        }
        // 服务器响应时间
        this.logText += 'response time: ' + resTime + '\n';
    }

    // 格式化响应日志
    public formatRes (ctx: AppCtx, resTime: number): void {
        // 响应日志开始
        this.logText += '\n' + '*************** response log start ***************' + '\n';
        // 添加请求日志
        this.formatReqLog(ctx.request, resTime);
        // 响应状态码
        this.logText += 'response status: ' + ctx.status + '\n';
        // 响应内容
        this.logText += 'response body: ' + JSON.stringify(ctx.body, null, 4) + '\n';
        // 响应日志结束
        this.logText += '*************** response log end ***************' + '\n';
    }

    // 格式化错误日志
    public formatError (ctx: AppCtx, err: AnyType, resTime: number): void {
        // 错误信息开始
        this.logText += '\n' + '*************** error log start ***************' + '\n';
        // 添加请求日志
        this.formatReqLog(ctx.request, resTime);
        // 错误名称
        this.logText += 'err name: ' + err.name + '\n';
        // 错误信息
        this.logText += 'err message: ' + err.message + '\n';
        // 错误详情
        this.logText += 'err stack: ' + err.stack + '\n';
        // 错误信息结束
        this.logText += '*************** error log end ***************' + '\n';
    }

    // 封装错误日志
    public logError (ctx: AppCtx, error: AnyType, resTime: number): void {
        if (ctx && error) {
            //
            this.formatError(ctx, error, resTime);
            //
            this.errorLogger.error(this.logText);
        }
    }

    // 封装响应日志
    public logResponse (ctx: AppCtx, resTime: number): void {
        if (ctx &&
            ctx.request.url &&
            ctx.request.url !== '/api-docs' &&
            ctx.request.url !== '/swagger-doc' &&
            !ctx.request.url.includes('favicon')
        ) {
            //
            this.formatRes(ctx, resTime);
            //
            this.resLogger.info(this.logText);
        }
    }
}
