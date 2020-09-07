import { v4 as uuid } from 'uuid';

import { KoaDriveLowdb } from '@helpers';
import { StorageDto } from './dto/StorageDto';
import { ResponseType } from '@interfaces';
import { Controller, InjectLowdb, Post, Body } from '@decorators';

@Controller({
    prefix: process.env.API_PREFIX,
    version: process.env.API_VERSION,
    url: '/storage'
})
export class StorageController {
    constructor (
        @InjectLowdb({
            dir: './cache'
        }) private readonly storageModel: KoaDriveLowdb
    ) {}

    @Post('/')
    storageResource (@Body() body: StorageDto): ResponseType {
        //
        const { code, type } = body;
        //
        type && this.storageModel.folder(`/${type}`);
        //
        const filePath = type
            ? `/${type}/${code}.json`
            : `/${code}.json`;
        //
        this.storageModel.create(filePath)
            .defaults(body)
            .write();
        //
        return {
            status: 1,
            data: {
                id: uuid(),
                ...body
            },
            message: '操作成功'
        };
    }
}
