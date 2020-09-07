import { METHODS, PATH } from './constance';

export function Route(path: string, method: METHODS): PropertyDecorator {
    return function (target: object, name: string | symbol): void {
        const meta = Reflect.getMetadata(PATH, target) || [];
        meta.push({
            name,
            method,
            path
        });
        Reflect.defineMetadata(PATH, meta, target);
    };
};

export function All (path: string): PropertyDecorator {
    return Route(path, METHODS.ALL);
};

export function Get (path: string): PropertyDecorator {
    return Route(path, METHODS.GET);
};

export function Post (path: string): PropertyDecorator {
    return Route(path, METHODS.POST);
};

export function Put (path: string): PropertyDecorator {
    return Route(path, METHODS.PUT);
};

export function Delete (path: string): PropertyDecorator {
    return Route(path, METHODS.DELETE);
};
