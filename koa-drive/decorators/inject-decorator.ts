import { Schema, model, Model } from 'mongoose';
import axios, { AxiosPromise, Method } from 'axios';
import * as Sequelize from 'sequelize';

import { KoaDriveLowdb } from '@helpers';
import { MODEL_CONSTRUCTOR } from './constance';
import { SwaggerApiProperty } from '@decorators';
import { ClsSchemaDefinition, AnyType } from '@interfaces';
import { carrier } from '@helpers/carrier';

interface MongoSchemaParams {
    name: string;
    definitions: Pick<ClsSchemaDefinition, AnyType>;
    options: object;
}

function buildMongoSchema ({ name, definitions, options }: MongoSchemaParams): Model<AnyType> {
    const sch = new Schema(definitions, options);
    return model(name, sch);
};

interface PostgresBuilder {
    name: string;
    options: Sequelize.ModelAttributes;
}

type SequelizeModel = typeof Sequelize.Model;

function buildPostgresSchema (params: PostgresBuilder): void {
    // 解构参数
    const { name, options } = params;
    // 获取全局变量
    // TIP 关键在于如何获取postgres连接数据库的实例
    const sequelize = carrier.get<Sequelize.Sequelize>('sequelize');
    console.log(carrier);
    console.log(sequelize);
    // // 使用sequelize.defined注册表
    // const model = sequelize.define(name, {}, options);
    // // 返回创建的模型
    // return model;
};

type ModelTypes = 'mongo' | 'postgres';

export function InjectModel (model: AnyType, type: ModelTypes = 'mongo'): ParameterDecorator {
    return (target: object, name: string | symbol, index: number): void => {
        // design:paramtypes
        // const data = Reflect.getOwnMetadata('design:paramtypes', target);
        //
        const options = Reflect.getMetadata('MODEL_OPTIONS', model.prototype) || {};
        //
        const modelName = Object.getOwnPropertyDescriptors(model).name.value;
        //
        const definitions: Record<string, ClsSchemaDefinition> = Reflect.getMetadata('sch_definition', model.prototype) || {};
        //
        const apiProperties: SwaggerApiProperty[] = Reflect.getMetadata('self:apiProperty', model.prototype) || [];
        //
        apiProperties.forEach((item) => {
            if (typeof item.key === 'string' && definitions[item.key]) {
                definitions[item.key].preset = item.options;
            }
        });
        // 声明模型实例
        let modelInstance: unknown;
        // 根据类型判断创建的模型实例
        if (type === 'mongo') {
            modelInstance = buildMongoSchema({ name: modelName, definitions, options });
        } else if (type === 'postgres') {
            // 构建postgres实例
            // console.log(definitions);
            modelInstance = buildPostgresSchema({ name: modelName, options: {} });
        }
        // 声明参数数组
        const params = [];
        // 根据参数索引 设置实参数据
        params[index] = modelInstance;
        //
        Reflect.defineMetadata('injected_model', modelName, target);
        //
        Reflect.defineMetadata(MODEL_CONSTRUCTOR, params, target);
        //
        Reflect.defineMetadata('model:definition', definitions, target);
    };
};

export interface InjectLowdbOptions {
    dir: string;
}

export function InjectLowdb (options: InjectLowdbOptions): ParameterDecorator {
    //
    const lowdb = new KoaDriveLowdb({
        rootDir: options.dir
    });
    //
    return (target: object, name: string | symbol, index: number): void => {
        //
        const params = Reflect.getMetadata(MODEL_CONSTRUCTOR, target) || [];
        //
        params[index] = lowdb;
        //
        Reflect.defineMetadata(MODEL_CONSTRUCTOR, params, target);
    };
}

export interface InjectAxiosOptions {
    original?: string;
    suffix: string;
}

export interface AxiosInstanceOptions {
    method?: Method;
    params?: AnyType;
    data?: AnyType;
    url: string;
}

function createAxiosInstance (params: AxiosInstanceOptions, options?: InjectAxiosOptions): AxiosPromise<AnyType> {
    //
    const baseBackendUrl = process.env.BACKEND_BASE_URL || 'http://192.168.1.204:8081';
    //
    let baseURL = `${baseBackendUrl}${options?.suffix || ''}`;
    //
    if (options?.original) {
        baseURL = options.original;
    }
    //
    return axios({
        baseURL,
        timeout: 6000,
        url: params.url,
        method: params.method || 'get',
        params: params.params || {},
        data: params.data || {},
        withCredentials: true
    });
}

export function InjectAxios (options?: InjectAxiosOptions): ParameterDecorator {
    //
    return (target: object, name: string | symbol, index: number): void => {
        //
        const params = Reflect.getMetadata(MODEL_CONSTRUCTOR, target) || [];
        //
        params[index] = {
            get: <U = AnyType, P = AnyType>(url: string, params?: P): AxiosPromise<U> => {
                return createAxiosInstance({ url, params }, options);
            },
            post: <U = AnyType, D = AnyType>(url: string, data?: D): AxiosPromise<U> => {
                return createAxiosInstance({ url, data, method: 'post' }, options);
            },
            put: <U = AnyType, D = AnyType>(url: string, data?: D): AxiosPromise<U> => {
                return createAxiosInstance({ url, data, method: 'put' }, options);
            },
            delete: <U = AnyType, P = AnyType>(url: string, params?: P): AxiosPromise<U> => {
                return createAxiosInstance({ url, params, method: 'delete' }, options);
            }
        };
        //
        Reflect.defineMetadata(MODEL_CONSTRUCTOR, params, target);
    };
};
