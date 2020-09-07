export interface SwaggerApiOperation {
    summary?: string;
    description?: string;
    example?: number | string | boolean | object | Date;
}

export interface SwaggerApiProperty {
    key: string | symbol;
    options: Omit<SwaggerApiOperation, 'summary'>;
}

export interface ApiOptionsProps {
    key: string | symbol;
    options: SwaggerApiOperation;
}

export function ApiOperation (options?: SwaggerApiOperation): PropertyDecorator {
    return (target: object, key: string | symbol): void => {
        // Record
        const metadata: ApiOptionsProps[] = Reflect.getMetadata('self:apiOperation', target) || [];
        //
        const existDataIdx = metadata.findIndex((data) => data.key === key);
        //
        if (typeof options !== 'undefined') {
            if (existDataIdx > -1) {
                metadata[existDataIdx] = { key, options };
            } else {
                metadata.push({ key, options });
            }
        }
        //
        Reflect.defineMetadata('self:apiOperation', metadata, target);
    };
};

export function ApiTags (tags?: string | string[]): ClassDecorator {
    return (target): void => {
        //
        Reflect.defineMetadata('Swagger_tags', tags || '', target.prototype);
    };
};

export function ApiProperty (options: Omit<SwaggerApiOperation, 'summary'>): PropertyDecorator {
    return (target: object, key: string | symbol): void => {
        // Partial
        const metadata: SwaggerApiProperty[] = Reflect.getMetadata('self:apiProperty', target) || [];
        //
        const existDataIdx = metadata.findIndex((data: SwaggerApiProperty) => data.key === key);
        //
        if (existDataIdx > -1) {
            metadata[existDataIdx] = { key, options };
        } else {
            metadata.push({ key, options });
        }
        //
        Reflect.defineMetadata('self:apiProperty', metadata, target);
    };
}
