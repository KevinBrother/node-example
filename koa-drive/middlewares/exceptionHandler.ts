import { AppCtx, ResponseType } from '@interfaces';

/**
 * @description 全局异常处理器
 * @param ctx koa上下文
 * @param next 下一个执行中间件
 */
export const catchError = async (ctx: AppCtx, next: () => unknown): Promise<ResponseType<null> | undefined> => {
    try {
        await next();
    } catch (err) {
        // 切换请求状态 - 内部服务错误
        ctx.status = 500;
        // 解构获取请求参数 组织提示信息
        const { method, url } = ctx.request;
        // 返回错误信息
        return ctx.body = {
            status: 0,
            data: null,
            message: `${err.message} - when ${method} ${url}`
        };
    }
};
