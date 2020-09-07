import * as os from 'os';
import * as path from 'path';

declare global {
    interface String {
        trimAll: () => string;
    }
}

/**
 * @description 获取待检验变量实际类型
 * @param vars 待检验变量
 * @return typeString 变量类型字符串
 */
export function getPrototypeString<T> (vars: T): string {
    return Object.prototype.toString.call(vars).replace(/^\[object\s|\]$/g, '');
};

/**
 * @description 获取待检测对象原型类型
 * @param params 待检测类型对象
 * @param type 待检测对象指定类型
 * @returns isType 待检测对象是否属于目标类型
 */
export function prototypeAs<T> (params: T, type: string): boolean {
    return getPrototypeString(params) === type;
};

/**
 * @description 设置日期时间前缀
 * @param dateTime 日期时间参数
 */
function setDateTimePrefix (dateTime: number): string {
    return dateTime < 10 ? `0${dateTime}` : `${dateTime}`;
};

/**
 * @description 获取系统当前时间
 * @param null
 * @return clock 当前系统时间
 */
export function getSystemTime (): string {
    const dateTimestamp = new Date();
    // 获取日期时间
    const year = dateTimestamp.getFullYear();
    const month = setDateTimePrefix(dateTimestamp.getMonth() + 1);
    const date = setDateTimePrefix(dateTimestamp.getDate());
    const hh = setDateTimePrefix(dateTimestamp.getHours());
    const mm = setDateTimePrefix(dateTimestamp.getMinutes());
    const ss = setDateTimePrefix(dateTimestamp.getSeconds());
    //
    return `${year}-${month}-${date} ${hh}:${mm}:${ss}`;
};

/**
 * @description 获取服务运行设备地址
 * @param null
 * @return address 服务运行设备地址
 */
export function getIPAddress(): string {
    // 本机地址
    let address = 'localhost';
    //
    const interfaces = os.networkInterfaces();
    //
    for (const name in interfaces) {
        const ifa = interfaces[name];
        if (ifa) {
            for (let i = 0, len = ifa.length; i < len; i++) {
                const alias = ifa[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    address = alias.address;
                }
            }
        }
    }
    return address;
};

/**
 * @description 检验目标值是否为字符串类型
 * @param val 待检验目标参数
 * @returns isString
 */
export function isString (val: unknown): boolean {
    return prototypeAs(val, 'String');
};

/**
 * @description 检验目标值是否为对象类型
 * @param obj 待检验目标参数
 * @returns isObject
 */
export function isObject (obj: unknown): boolean {
    return prototypeAs(obj, 'Object');
};

/**
 * @description 检验目标值是否为数组类型
 * @param arr 待检验目标参数
 * @returns isArray
 */
export function isArray (arr: unknown): boolean {
    return prototypeAs(arr, 'Array');
};

/**
 * @description 检验目标值是否为 undefined 类型
 * @param tar 待检验目标参数
 * @returns isUndefined
 */
export function isUndefined (tar: unknown): boolean {
    return prototypeAs(tar, 'Undefined');
};

/**
 * @description 检验目标值是否为 null 类型
 * @param tar 待检验目标参数
 * @returns isNull
 */
export function isNull (tar: unknown): boolean {
    return prototypeAs(tar, 'Null');
};

/**
 * @description 检验目标值是否为 symbol 类型
 * @param sym 待检验目标参数
 * @returns isSymbol
 */
export function isSymbol (sym: unknown): boolean {
    return prototypeAs(sym, 'Symbol');
};

/**
 * @description 检验目标值是否为函数类型
 * @param func 待检验目标参数
 * @returns isFunction
 */
export function isFunction (func: unknown): boolean {
    return prototypeAs(func, 'Function');
};

/**
 * @description 检验目标值是否为数值类型
 * @param num 待检验目标参数
 * @returns isNumber
 */
export function isNumber (num: unknown): boolean {
    return prototypeAs(num, 'Number');
};

/**
 * @description 检验目标值是否为布尔类型
 * @param bool 待检验目标参数
 * @returns isBoolean
 */
export function isBoolean (bool: unknown): boolean {
    return prototypeAs(bool, 'Boolean');
};

/**
 * @description 检查目标对象是否为空对象的工具
 * @param obj 检测对象
 * @returns isEmpty 检测对象是否为空对象
 */
export function isEmptyObj (obj: unknown): boolean {
    return typeof obj === 'object' && isObject(obj) && obj !== null ? Object.keys(obj).length === 0 : false;
};

/**
 * @description 获取目标文件的绝对地址
 * @param filePath 文件地址
 * @return path 目标文件绝对地址
 */
export function resolve (filePath: string): string {
    return path.resolve(__dirname, '..', filePath);
}

/**
 * @description 去除字符串内所有空格
 * @param str 待去除空格的字符串
 * @return newStr 去除所有空格的字符串
 */
// eslint-disable-next-line no-extend-native
String.prototype.trimAll = function (): string {
    return this.replace(/\s/g, '');
};

/**
 * @description 使用正则表达式实现首字母大写其余字母小写的工具
 * @param str 需要首字母大写的字符串
 * @returns upperCase 首字母大写的字符串
 */
export function upperFirst (str: string): string {
    // return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};

export * from './await-to';

export * from './lowdb';

export * from './resource-validator';
