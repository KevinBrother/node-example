import 'reflect-metadata';
import 'core-js';

import * as Koa from 'koa';
import * as cors from 'koa2-cors';
import * as KoaBody from 'koa-body';
import * as Router from 'koa-router';

import { Logger } from '../logger';
import * as helpers from '@helpers';
import { Print } from '@helpers/chalk';
import { catchError } from '@middlewares/exceptionHandler';
import { ROUTE_INFO, PARAM, MODEL_CONSTRUCTOR } from '@decorators/constance';
import { Application, AppCtx, AppBody, ServerRouter, ServerOptions, MetadataParams, RegisterModelType, AnyType } from '@interfaces';

export class ServerFactory {
    public app: Application;
    private router: ServerRouter;
    private options: ServerOptions = {
        cors: true
    };

    constructor() {
        this.app = new Koa();
        // 获取全局路由前缀 注册路由信息
        this.router = new Router();
        // 设置 body 参数
        this.setAppBody();
    }

    // private async createConnect (): Promise<boolean> {
    //     // 链接 `mongoose`
    //     try {
    //         await MongooseFactory(this.app);
    //         return true;
    //     } catch (err) {
    //         Print.error(err.message);
    //         return false;
    //     }
    // }

    public async create (models: AnyType, options?: ServerOptions): Promise<Application> {
        // 设置服务配置数据
        this.setServerOptions(options);
        // 注册注入路由
        if (helpers.isArray(models)) {
            models.forEach((model: RegisterModelType) =>  {
                this.registryRouter(model);
            });
        } else {
            this.registryRouter(models);
        }
        // 错误处理
        this.app.on('error', (err) => {
            Print.error(err.message);
        });
        //
        Reflect.defineMetadata('swagger_data', { router: this.router, models }, this.app);
        // 返回服务实例
        return this.app;
    }

    public logger (log: boolean): this {
        log && this.app.use(async (ctx, next) => {
            // 响应开始时间
            const start = Date.now();
            // 响应间隔时间
            let ms: number;
            try {
                await next();
                ms = Date.now() - start;
                // 记录响应日志
                new Logger().logResponse(ctx, ms);
            } catch (error) {
                ms = Date.now() - start;
                // 记录异常日志
                new Logger().logError(ctx, error, ms);
            }
        });
        return this;
    }

    private registryRouter (model: RegisterModelType): void {
        // 获取路由元数据
        const metadata = Reflect.getMetadata(ROUTE_INFO, model.prototype);
        // 默认访问路由
        this.router.get('/', async ctx => {
            //
            const address = helpers.getIPAddress();
            //
            ctx.body = `
                <h1 style="text-align: center;">Koa drive by TypeScript! Server is running...</h1>
                <h3 style="text-align: center;"><a href="http://${address}:7200/api-docs">Swagger document</a></h3>
            `;
        });
        // 全局异常处理
        this.app.use(catchError);
        //
        for (const item of metadata) {
            // 结构路由元数据参数
            const { name, method, path, Ctrl } = item;
            //
            const modelType = Reflect.getMetadata('model:definition', Ctrl) || {};
            //
            const constructorParams = Reflect.getMetadata(MODEL_CONSTRUCTOR, Ctrl) || [];
            //
            if (Ctrl) {
                const router = this.router[method](path, async (ctx: AppCtx) => {
                    //
                    let body = {};
                    //
                    const instance = new Ctrl(...constructorParams);
                    //
                    const metadata: MetadataParams[] = Reflect.getMetadata(PARAM, instance[name].constructor) || [];
                    //
                    const metaTypeList = ['params', 'request'];
                    //
                    const args = metadata
                        .filter((meta) => meta.funcName === name)
                        .reduce<MetadataParams[]>((prev, cur) => {
                        if (metaTypeList.includes(cur.type) && cur.key === 'all') {
                            prev[cur.index] = ctx[cur.type];
                        } else {
                            prev[cur.index] = ctx[cur.type][cur.key];
                            //
                            if (cur.key === 'body') {
                                //
                                for (const key in ctx[cur.type].body) {
                                    if (modelType?.[key]?.options) {
                                        if (helpers.isFunction(modelType[key].options.set)) {
                                            ctx[cur.type].body[key] = modelType[key].options.set(ctx[cur.type].body[key]);
                                        }
                                    }
                                }
                            }
                        }
                        return prev;
                    }, []);
                    //
                    body = await instance[name].call(instance, ...args);
                    //
                    ctx.body = body;
                });
                //
                this.app.use(router.routes()).use(router.allowedMethods());
            }
        }
    }

    private setAppBody (): void {
        //
        const defaultBodyOpt: AppBody = {
            multipart: true,
            formidable: {
                maxFieldsSize: 2 * 1024
            },
            // 解析 `get` `put` `post` 请求体参数
            parsedMethods: ['get', 'put', 'post'],
        };
        //
        const mergeBodyOpt: AppBody = Object.assign({}, defaultBodyOpt, this.options.body);
        //
        this.app.use(KoaBody(mergeBodyOpt));
    }

    private setServerOptions (options?: ServerOptions): void {
        if (options) {
            this.options = options;
        }
        if (this.options.cors) {
            this.app.use(cors());
        }
    }
}
