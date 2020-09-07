import { uniquenessValidator } from '@helpers';
import { Controller, InjectAxios, Post, Params, Body, Get, Delete, Put } from '@decorators';
import {
    ControllerModelMethod,
    ResponseType,
    BackendStorageProps,
    StorageViewProps,
    BackendStorageKeys,
    KoaDriveViewProps,
    KoaDriveViewListProps
} from '@interfaces';

@Controller({
    version: process.env.API_VERSION,
    prefix: '/views'
})
export class ViewsController {
    constructor (
        @InjectAxios({
            suffix: '/api/v1/storage'
        }) private readonly storageModel: ControllerModelMethod
    ) {}

    /**
     * @description 创建配置资源
     * @param identity 模型identity
     * @param key 配置编号
     * @param body 保存数据
     */
    @Post('/:identity/:key')
    async createView (
        @Params('identity') identity: string,
            @Params('key') key: string,
            @Body() body: StorageViewProps
    ): Promise<KoaDriveViewProps> {
        // 视图资源唯一性校验
        await uniquenessValidator({ code: key, type: 'views', identity });
        // 调用接口新增配置数据
        const { data: result } = await this.storageModel.post<BackendStorageProps>(`/${identity}/views-${key}`, { ...body });
        // 配置数据
        const config: StorageViewProps = JSON.parse(result?.data?.json || '{}');
        // 若返回数据为null 则说明请求失败
        const data: StorageViewProps | null = result?.data ? config : null;
        // 向页面发送数据
        return {
            status: Number(result.status),
            data,
            message: result.message || '创建成功'
        };
    }

    /**
     * @description 根据页面编号编辑报表信息
     * @param identity 模型编号
     * @param code 页面编号
     * @param body 编辑参数
     */
    @Put('/:identity/:code')
    async modifyViewByCode (
        @Params('identity') identity: string,
            @Params('code') code: string,
            @Body() body: StorageViewProps
    ): Promise<KoaDriveViewProps> {
        // 调用后端接口 编辑视图资源
        const { data: result } = await this.storageModel.post<BackendStorageProps>(`/${identity}/views-${code}`, { ...body });
        // 配置数据
        const config: StorageViewProps = JSON.parse(result?.data?.json || '{}');
        // 若返回数据为null 则说明请求失败
        const data: StorageViewProps | null = result?.data ? config : null;
        // 向页面发送数据
        return {
            status: Number(result.status),
            data,
            message: result.message || '操作完毕'
        };
    }

    @Get('/:identity/:code')
    async fetchViewByCode (
        @Params('identity') identity: string,
            @Params('code') code: string
    ): Promise<KoaDriveViewProps> {
        // 兼容获取带有前缀的配置资源
        const res = await Promise.allSettled([
            this.storageModel.get<BackendStorageProps>(encodeURI(`/${identity}/${code}`)),
            this.storageModel.get<BackendStorageProps>(encodeURI(`/${identity}/views-${code}`))
        ]);
        // 目标配置
        let data: KoaDriveViewProps = {
            status: 0,
            data: null,
            message: `不存在编号为【${code}】的视图资源`
        };
        // 根据返回数据状态 判断是否获取到目标资源
        data = res.reduce<KoaDriveViewProps>((tar, cur) => {
            // 根据status判断
            if (cur.status === 'fulfilled' && Number(cur.value.data?.status) === 1) {
                // 不存在json 则返回null
                const data: StorageViewProps | null = JSON.parse(cur.value?.data?.data?.json || 'null');
                tar = {
                    status: cur.value.data.status,
                    data,
                    message: cur.value.data.message
                };
            }
            return tar;
        }, data);
        // 返回目标配置
        return data;
    }

    @Get('/:identity')
    async fetchViewList (@Params('identity') identity: string): Promise<KoaDriveViewListProps> {
        // 获取模型下所有配置资源编号
        const { data: resourceKeys } = await this.storageModel.get<BackendStorageKeys>(`/${identity}`);
        // 根据编号获取所有配置资源
        const viewList = await Promise.allSettled(resourceKeys?.data?.map((key: string) => this.fetchViewByCode(identity, key)) || []);
        // 判断allSettled.status即可断定请求是否完成
        if (viewList.length === 0 || viewList.every(item => item.status === 'rejected')) {
            return {
                status: 0,
                data: null,
                message: '获取视图资源异常'
            };
        }
        // 返回配置列表
        const data = viewList.reduce<StorageViewProps[]>((tar, cur) => {
            // 若请求状态为fulfilled 则发送到页面
            if (cur.status === 'fulfilled' && cur.value?.data?.type === 'views') {
                // 截取pages前缀后的编号
                const matchCode = cur.value?.data?.code?.match(/views-(.*)/);
                // 若没有截取目标 则获取当前页面编号
                const code = matchCode ? matchCode[1] : cur.value.data.code;
                // 组织页面列表数据
                tar = [
                    ...tar,
                    {
                        ...cur.value.data,
                        code
                    }
                ];
            }
            return tar;
        }, []);
        // 返回页面数据
        return {
            status: 1,
            data,
            message: `查询成功，共查询到 ${data.length} 条数据。`
        };
    }

    @Delete('/:identity/:code')
    async removePageByCode (@Params('identity') identity: string, @Params('code') code: string): Promise<ResponseType<null>> {
        // 兼容没有前缀的配置资源
        const res = await Promise.allSettled([
            this.storageModel.delete<ResponseType<null>>(`/${identity}/${code}`),
            this.storageModel.delete<ResponseType<null>>(`/${identity}/views-${code}`)
        ]);
        // 根据allSettled.status 判断目标请求
        return res.reduce<ResponseType<null>>((prev, cur) => {
            if (cur.status === 'fulfilled' && Number(cur.value.data?.status) === 1) {
                prev = cur.value.data;
            }
            return prev;
        }, {
            status: 0,
            data: null,
            message: '操作失败'
        });
    }
}
