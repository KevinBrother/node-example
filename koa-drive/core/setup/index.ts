import { ServerFactory } from '@core/http';
import { Print } from '@helpers/chalk';
import { getIPAddress } from '@helpers';
import { DocumentOptionsBuilder, SwaggerDocument } from '@core/swagger';
import { AnyType } from '@interfaces';

interface SetupOptions {
    controllers?: AnyType[];
    swagger?: boolean;
    logger?: boolean;
    cors?: boolean;
}

interface SetupListenOptions extends SetupOptions {
    port?: number;
}

export class Setup {
    private swagger!: boolean;
    private logger!: boolean;
    private controllers: AnyType[];
    private cors!: boolean;

    constructor (options?: SetupOptions) {
        this.swagger = options?.swagger ?? true;
        this.logger = options?.logger ?? true;
        this.controllers = options?.controllers ?? [];
        this.cors = options?.cors ?? true;
    }

    async listen (handler?: SetupListenOptions | number): Promise<void> {
        // 单服务监听端口 默认为7200
        let PORT = Number(process.env.SERVER_PORT || 7200);
        // 单服务配置controller
        let serverControllers = this.controllers;
        // 开启输出日志
        let outputLogger = this.logger;
        // 是否生成swagger文档
        let swaggerBuilder = this.swagger;
        // 是否支持跨域
        let cors = this.cors;
        // 当配置参数为数值类型 则默认为监听端口配置
        if (typeof handler === 'number') {
            PORT = handler;
        } else if (handler as SetupListenOptions) {
            // 获取单服务监听端口
            PORT = handler?.port || PORT;
            // 单服务个性化controller与setup实例配置controller合并
            serverControllers = [...this.controllers, ...(handler?.controllers || [])];
            // 获取单服务是否输出日志
            outputLogger = handler?.logger ?? this.logger;
            // 是否开启单服务swagger日志
            swaggerBuilder = handler?.swagger ?? this.swagger;
            // 单服务是否支持跨域
            cors = handler?.cors ?? this.cors;
        }
        //
        try {
            // 服务类实例化 以保证服务单例
            const server = new ServerFactory();
            // 由于 Koa middleware 的特点 所以要保证开启 logger 后再创建服务
            const app = await server.logger(outputLogger).create(serverControllers, { cors });
            if (swaggerBuilder) {
                // 构建 swagger 文档
                new DocumentOptionsBuilder()
                    .setTitle()
                    .setVersion()
                    .setDescription()
                    .build(app);
                // 创建 swagger 服务
                SwaggerDocument.create(app, '/api-docs');
            }
            // 监听端口 服务启动完毕
            app.listen(PORT);
            // 控制台提示
            Print.log(`Local: http://localhost:${PORT}`);
            Print.log(`Network: http://${getIPAddress()}:${PORT}`);
        } catch (err) {
            Print.error(err.message);
        }
    }
}
