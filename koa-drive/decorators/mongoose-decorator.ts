import { SchemaOptions, Model, Document, Types } from 'mongoose';

import { AnyType } from '@interfaces';

export type RefType = number | string | Types.ObjectId | Buffer;

export abstract class Base<T_ID extends RefType = Types.ObjectId> {
    _id!: T_ID;
    __v!: number;
    __t: undefined | string | number;
}

export type DocumentType<T> = (T extends Base ? Omit<Document, '_id'> & T : Document & T);

export type ModelType<T> = Model<DocumentType<T>> & T;

export type AnyParamConstructor<T> = new (...args: AnyType) => T;

export type ReturnModelType<U extends AnyParamConstructor<T>, T = AnyType> = ModelType<InstanceType<U>> & U;

export interface MongoModelPropOptions {
    select?: boolean;
    set?: (value: AnyType) => AnyType;
    get?: (value: AnyType) => AnyType;
}

export function MongooseModule (options?: SchemaOptions): ClassDecorator {
    return (target): void => {
        //
        Reflect.defineMetadata('MODEL_OPTIONS', options || {}, target.prototype);
    };
};

export function Prop (options?: MongoModelPropOptions): PropertyDecorator {
    return (target: object, key: string | symbol): void => {
        //
        const schemaOptions = Reflect.getMetadata('sch_definition', target) || {};
        // 获取类属性类型
        const metadata = Reflect.getMetadata('design:type', target, key);
        //
        schemaOptions[key] = {
            options: options || {},
            type: metadata
        };
        Reflect.defineMetadata('sch_definition', schemaOptions, target);
    };
};
