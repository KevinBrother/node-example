// eslint-disable-next-line @typescript-eslint/no-var-requires
const koaSwagger = require('koa2-swagger-ui');

import { getIPAddress } from '@helpers';
import {
    Application,
    SwaggerDocumentOptions,
    AppRouter,
    SwaggerDocConfigOptions
} from '@interfaces';
import { createSwaggerDocs } from './create-swagger-docs';

export class DocumentOptionsBuilder {
    private readonly document: SwaggerDocConfigOptions;
    constructor () {
        // 获取本机地址
        const address = getIPAddress();
        //
        const PORT = process.env.SERVER_PORT || 7200;
        // swagger 默认文档
        this.document = {
            swagger: '2.0',
            info: {
                version: '1.0',
                title: 'Koa drive API',
                description: 'Koa drive 后端服务接口'
            },
            schemes: ['http', 'https'],
            host: `${address}:${PORT}`,
            basePath: '/',
            paths: {}
        };
    }

    // public addTag (name: string, description?: string, externalDocs?: ExternalDocsType): this {
    //     return this;
    // }

    public build (app: Application): void {
        const metadata = Reflect.getMetadata('swagger_data', app);
        //
        if (metadata.router) {
            //
            const router: AppRouter = metadata.router;
            //
            const injectModels = metadata.models;
            //
            const documentOptions = createSwaggerDocs(injectModels);
            //
            this.document.paths = documentOptions;
            //
            const prefix = process.env.API_PREFIX;
            //
            let path = '/swagger-doc';
            //
            if (prefix) {
                path = `${prefix}${path}`;
            }
            //
            router.get(path, async (ctx) => {
                // 获取 swagger 文档
                const data: object = this.document;
                // 发送 swagger 文档
                ctx.body = data;
            });
        }
    }

    public addBearerAuth (): this {
        return this;
    }

    public setTitle (title?: string): this {
        this.document.info.title = title || 'Koa drive API';
        return this;
    }

    public setDescription (description?: string): this {
        this.document.info.description = description || 'Koa drive 后端服务接口';
        return this;
    }

    public setVersion (version?: string): this {
        this.document.info.version = version || '1.0';
        return this;
    }
}

export class SwaggerDocumentBuilder {
    public create (app: Application, path?: string, options?: SwaggerDocumentOptions): void {
        // 获取本机地址
        const address = getIPAddress();
        // 获取配置前缀
        const prefix = process.env.API_PREFIX || '';
        //
        const PORT = process.env.SERVER_PORT || 7200;
        // 创建 swagger 服务
        app.use(
            koaSwagger({
                routePrefix: path || '/api-docs',
                swaggerOptions: {
                    url: `http://${address}:${PORT}${prefix}/swagger-doc`,
                    ...options
                },
            }),
        );
    }
}

export const SwaggerDocument = new SwaggerDocumentBuilder();
