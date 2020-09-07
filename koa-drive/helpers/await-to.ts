import { AnyType } from '@interfaces';

/**
 * @description await function错误处理机制 参考 https://github.com/scopsy/await-to-js
 * @param promise 待执行的promise函数
 * @param errExt 传递给异常参数error的信息
 * @return promise 包含错误信息和异步数据
 */
export function to<T, U = AnyType>(
    promise: Promise<T>,
    errExt?: object
): Promise<[U | null, T | null]> {
    return promise.then<[null, T]>((data: T) => [null, data]).catch<[U, null]>(err => {
        if (errExt) {
            Object.assign(err, errExt);
        }
        return [err, null];
    });
};
