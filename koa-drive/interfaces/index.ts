import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Body from 'koa-body';
import { AxiosPromise } from 'axios';

export type Application = Koa;

export type AppCtx = Koa.Context;

export type AppRouter = Router;

export type AppBody = Body.IKoaBodyOptions;

export type AnyType = any;

export interface ClsSchemaDefinition {
    type: () => AnyType;
    options?: AnyType;
    preset?: {
        description?: string;
        example?: number | string | boolean | object | Date;
    };
}

export interface ServerRouter extends AppRouter {
    [propName: string]: AnyType;
}

export interface ServerOptions {
    host?: string;
    port?: number;
    cors?: boolean;
    body?: AppBody;
}

export interface RegisterModelType extends Function {
    name: string;
    method: string;
    path: string;
    parameters?: {
        key: string;
        value?: AnyType;
    }[];
    Ctrl?: AnyType;
}

export interface ControllerModelMethod {
    get: <T = AnyType, P = AnyType>(url?: string, params?: P) => AxiosPromise<T>;
    post: <T = AnyType, D = AnyType>(url?: string, data?: D) => AxiosPromise<T>;
    put: <T = AnyType, D = AnyType>(url?: string, data?: D) => AxiosPromise<T>;
    delete: <T = AnyType, P = AnyType>(url?: string, params?: P) => AxiosPromise<T>;
}

export interface StoragePageProps {
    classCode?: string;
    className?: string;
    code: string;
    name: string;
    type: string;
    layout: object;
}

export interface ResponseType<U = AnyType> {
    status: number | string;
    data: U;
    message: string;
}

export interface StorageProps {
    json: string;
    key: string;
    time: number;
}

export interface StorageViewProps {
    code: string;
    name: string;
    type: string;
    modifier: object;
    layout: object[];
}

export type BackendStorageProps = ResponseType<StorageProps>;

export type BackendStorageKeys = ResponseType<string[]>;

export type KoaDriveViewProps = ResponseType<StorageViewProps | null>;

export type KoaDriveViewListProps = ResponseType<StorageViewProps[] | null>;

export interface ModelMetadata {
    imports?: AnyType;
    database?: AnyType;
    controllers?: AnyType;
}

export interface MetadataParams {
    type: string;
    key: string;
    index: number;
    funcName: string;
}

export interface MetaParamDecorator {
    target: AnyType;
    name: string | symbol;
    index: number;
    type: string;
    key?: string;
}

export interface ExternalDocsType {
    description?: string;
    url: string;
}

export interface SwaggerDocumentOptions {
    include?: Function[];
    extraModels?: Function[];
    ignoreGlobalPrefix?: boolean;
    deepScanRoutes?: boolean;
}

export interface SwaggerDocInfo {
    version?: string;
    title?: string;
    description?: string;
}

export interface SwaggerDocParams {
    name?: string;
    required?: boolean;
    in?: 'body' | 'query' | 'path';
    description?: string;
    schema: {
        required?: string | string[];
        properties?: {
            [name: string]: {
                type?: string;
                example?: AnyType;
            };
        };
    };
}

export interface SwaggerDocResponse {
    [name: string]: {
        description?: string;
        schema?: {
            required?: string | string[];
            properties?: {
                [name: string]: {
                    type?: string;
                    example?: AnyType;
                };
            };
        };
    };
}

export interface SwaggerDocPaths {
    [pathName: string]: {
        tags?: string[];
        summary?: string;
        description?: string;
        parameters?: SwaggerDocParams[];
        response?: SwaggerDocResponse;
    };
}

export interface SwaggerDocConfigOptions {
    readonly swagger?: string;
    info: SwaggerDocInfo;
    schemes: string[];
    host?: string;
    basePath?: string;
    paths?: SwaggerDocPaths;
}
