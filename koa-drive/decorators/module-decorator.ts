import { Sequelize } from 'sequelize';

import { ControllerOptions } from './controller-decorator';
import { ModelMetadata, RegisterModelType } from '@interfaces';
import { PATH, ROUTE_INFO, CONTROLLER_OPTIONS } from './constance';

export function Module (metadata: ModelMetadata): ClassDecorator {
    return (target): void => {
        const { controllers, database } = metadata;
        //
        for(const Ctrl of controllers) {
            //
            if (database) {
                // TODO 后续需要考虑若某模块已经创建相同数据库的链接 重复连接是否会出现异常情况
                // 将sequelize实例绑在controller上
                database()
                    .then((res: any): void => {
                        if (res as Sequelize) {
                            Reflect.defineMetadata('Sequelize_instance', res, Ctrl.prototype);
                        }
                    });
            }
            //
            const ctrlOpt: ControllerOptions = Reflect.getMetadata(CONTROLLER_OPTIONS, Ctrl.prototype) || {};
            //
            const pathMeta: RegisterModelType[] = Reflect.getMetadata(PATH, Ctrl.prototype) || [];
            //
            const routeInfo = [];
            for(const item of pathMeta) {
                //
                item.path = ctrlOpt.url ? `${ctrlOpt.url}${item.path}` : item.path;
                //
                item.path = ctrlOpt.version ? `/${ctrlOpt.version}${item.path}` : item.path;
                //
                item.path = ctrlOpt.prefix ? `${ctrlOpt.prefix}${item.path}` : item.path;
                //
                routeInfo.push({ Ctrl, ...item });
            }
            Reflect.defineMetadata(ROUTE_INFO, routeInfo, target.prototype);
        }
    };
};
