import * as path from 'path';
import { existsSync, mkdirSync, statSync } from 'fs';

import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';

import { AnyType } from '@interfaces';

export type KoaDriveLowdbType<T> = lowdb.LowdbSync<T>;

export interface KoaDriveLowdbOptions {
    rootDir?: string;
}

export class KoaDriveLowdb {
    // 缓存文件根路径
    public rootDir = '';

    constructor (options: KoaDriveLowdbOptions) {
        if (options.rootDir) {
            // 缓存跟目录路径
            this.rootDir = options.rootDir;
            // 实例化后创建缓存文件根目录文件夹
            this.folder(options.rootDir);
        }
    }

    /**
     * @description 创建缓存文件根目录
     * @param dir 目录路径
     */
    public folder (dir: string): void {
        // 判断路径合法性
        if (dir) {
            // 获取绝对路径
            const dirPath = path.resolve(__dirname, '../', dir);
            // 若目标路径不为文件夹 则创建文件夹
            if (!existsSync(dirPath) ||
                !statSync(dirPath).isDirectory()
            ) {
                mkdirSync(dirPath);
            }
        }
    }

    /**
     * @description 生成缓存文件
     * @param path 缓存文件目录以及名称
     */
    public create (path: string): KoaDriveLowdbType<AnyType> {
        const adapter = new FileSync(`${this.rootDir}${path}`);

        return lowdb(adapter);
    }
}
