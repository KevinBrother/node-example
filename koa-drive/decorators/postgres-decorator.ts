export function PostgresModule (options?: object): ClassDecorator {
    return (target): void => {
        //
        Reflect.defineMetadata('MODEL_OPTIONS', options || {}, target.prototype);
    };
};
