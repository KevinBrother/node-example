import * as helpers from '@helpers';
import { PARAM } from './constance';
import { MetaParamDecorator, MetadataParams, AnyType } from '@interfaces';

export interface MemberParams {
    name: string | symbol;
    parameters?: {
        key: string;
        value?: AnyType;
    }[];
}

/**
 * @description 创建参数修饰器反射方法
 * @param params 创建参数修饰器构造参数
 */
function createParamsDecorator (params: MetaParamDecorator): void {
    const { target, name, index, type, key } = params;
    const instance = new target.constructor();
    const fn = instance[name];
    //
    const modelParams: MemberParams[] = Reflect.getMetadata('model:memberParams', target) || [];
    //
    const metadata = Reflect.getMetadata(PARAM, fn.constructor) || [];
    //
    const targetIndex = metadata.findIndex((item: MetadataParams) => item.funcName === name && item.key === key);
    if (helpers.isNumber(targetIndex) && targetIndex > -1) {
        metadata[targetIndex].index = index;
    } else {
        metadata.push({ type, key, index, funcName: name });
    }
    //
    const currentFuncParams = modelParams.find((item: MemberParams) => item.name === name);
    //
    if (typeof key !== 'undefined') {
        if (currentFuncParams) {
            if (currentFuncParams.parameters) {
                currentFuncParams.parameters.push({ key });
            } else {
                currentFuncParams.parameters = [{ key }];
            }
        } else {
            //
            modelParams.push({
                name,
                parameters: [{ key }]
            });
        }
    }
    //
    Reflect.defineMetadata(PARAM, metadata, fn.constructor);
    //
    Reflect.defineMetadata('model:memberParams', modelParams, target);
};

/**
 * @description 创建request修饰器
 * @return parameterDecorator request参数修饰器构造函数
 */
export function Req (): ParameterDecorator {
    return (target: object, key: string | symbol, index: number): void => {
        createParamsDecorator({
            target,
            name: key,
            index,
            type: 'request',
            key: 'all'
        });
    };
};

/**
 * @description 创建body修饰器
 * @return parameterDecorator body参数修饰器构造函数
 */
export function Body (): ParameterDecorator {
    return (target: object, key: string | symbol, index: number): void => {
        createParamsDecorator({
            target,
            name: key,
            index,
            type: 'request',
            key: 'body'
        });
    };
};

/**
 * @description 获取请求参数中目标字段
 * @param key 请求上下文中目标参数名
 * @return parameterDecorator para,s参数修饰器构造函数
 */
export function Params (key?: string): ParameterDecorator {
    // params 可能存在多个参数的情况！！
    return (target: object, name: string | symbol, index: number): void => {
        //
        if (!key) {
            key = 'all';
        }
        //
        createParamsDecorator({
            target,
            name,
            index,
            type: 'params',
            key
        });
    };
};
