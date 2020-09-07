export interface HttpExceptionOptions {
    path?: string;
    code?: number;
    errorCode?: number;
    message: string;
}

/**
 * @description 请求异常处理类
 */
export class HttpException extends Error {
    public code?: number;
    public errorCode?: number;
    public path?: string;
    constructor (options: HttpException) {
        super();
        this.message = options.message;
        this.path = options.path;
        this.code = options.code;
        this.errorCode = options.errorCode;
    }
}
