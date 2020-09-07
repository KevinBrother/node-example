import { ROUTE_INFO } from '@decorators/constance';
import { isArray, getPrototypeString } from '@helpers';
import { ApiOptionsProps, MemberParams } from '@decorators';
import { RegisterModelType, SwaggerDocPaths, ClsSchemaDefinition, AnyType } from '@interfaces';

interface SwaggerBuilderProps {
    name: string;
    path: string;
    member: MemberParams;
    model: Record<string, ClsSchemaDefinition>;
}

interface SwaggerParamsDoc {
    name: string;
    type?: string;
    required: boolean;
    in: string;
    description?: string;
    schema?: {
        required: string[];
        properties: {
            type: string;
            example: unknown;
        };
    };
}

function getSwaggerParamsDoc (params: SwaggerBuilderProps): SwaggerParamsDoc[] {
    //
    const parameters = [];
    //
    const { name, path, member: modelMemberParams, model: modelType } = params;
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const pathMatched = path.match(/\/\{(.*)\}/);
    //
    if (pathMatched) {
        parameters.push({
            name: pathMatched[1],
            type: 'string',
            required: true,
            in: 'path',
            description: ''
        });
    }
    //
    if (modelMemberParams) {
        if (modelMemberParams?.parameters?.some(item => item.key === 'body')) {
            //
            const required = Object.keys(modelType);
            //
            const properties = required.reduce((prev: AnyType, cur) => {
                prev[cur] = {
                    type: getPrototypeString(modelType[cur].type()),
                    example: modelType[cur]?.preset?.example
                };
                return prev;
            }, {});
            //
            parameters.push({
                // 必须存在
                name,
                required: true,
                in: 'body',
                // description: '用户',
                schema: {
                    // title: 'UserDto',
                    required,
                    properties
                }
            });
        }
    }
    return parameters;
};

export function createSwaggerDocs (models: Pick<RegisterModelType[] | RegisterModelType, AnyType>): SwaggerDocPaths {
    //
    const swaggerDoc: Record<string, Record<string, object>> = {};
    //
    if (models as RegisterModelType[]) {
        //
        for (let i = 0, len = models.length; i < len; i++) {
            const model: RegisterModelType = models[i];
            //
            const metadata = Reflect.getMetadata(ROUTE_INFO, model.prototype);
            //
            if (metadata) {
                //
                for (const item of metadata) {
                    //
                    let { name, method, path, Ctrl } = item;
                    // 替换为swagger占位符
                    path = path.replace(/\/:(.[a-z]*)/g, (L: string, P: string) => {
                        return `/{${P}}`;
                    });
                    //
                    const InjectedModel = Reflect.getMetadata('injected_model', Ctrl) || 'Model';
                    //
                    const modelType: Record<string, ClsSchemaDefinition> = Reflect.getMetadata('model:definition', Ctrl) || {};
                    //
                    const funcParams: MemberParams[] = Reflect.getMetadata('model:memberParams', Ctrl.prototype) || [];
                    //
                    const swaggerTags = Reflect.getMetadata('Swagger_tags', Ctrl.prototype) || [];
                    //
                    const swaggerOptions: ApiOptionsProps[] = Reflect.getMetadata('self:apiOperation', Ctrl.prototype) || [];
                    //
                    const apiOperation = swaggerOptions.find((item) => item.key === name);
                    //
                    if (!apiOperation) return {};
                    //
                    const modelMemberParams = funcParams.find((item) => item.name === name) || { name: '' };
                    //
                    // if (!modelMemberParams) return;
                    // 生成Swagger文档参数
                    const parameters = getSwaggerParamsDoc({
                        name: InjectedModel,
                        path,
                        member: modelMemberParams,
                        model: modelType
                    });
                    // swagger doc
                    const swaggerDocument = {
                        tags: isArray(swaggerTags) ? swaggerTags : [swaggerTags],
                        summary: apiOperation?.options?.summary || '- Null -',
                        description: '',
                        produces: ['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded', 'text/plain'],
                        parameters,
                        responses: {}
                    };
                    //
                    if (swaggerDoc[path]) {
                        swaggerDoc[path][method] = swaggerDocument;
                    } else {
                        swaggerDoc[path] = {
                            [method]: swaggerDocument
                        };
                    }
                }
            }
        }
    }
    return swaggerDoc;
};
