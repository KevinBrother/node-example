import { CONTROLLER_OPTIONS } from './constance';

export interface ControllerOptions {
    version?: string;
    url?: string;
    prefix?: string;
}

export function Controller (options?: ControllerOptions): ClassDecorator {
    return (target): void => {
        Reflect.defineMetadata(CONTROLLER_OPTIONS, options || {}, target.prototype);
    };
};
