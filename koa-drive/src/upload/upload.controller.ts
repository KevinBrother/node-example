import { createReadStream, createWriteStream } from 'fs';

import { Controller, Post, Req } from '@decorators';
import { UploadDto } from './dto/upload.dto';
import { ResponseType } from '@interfaces';
import { resolve } from '@helpers';

@Controller({
    version: process.env.API_VERSION,
    prefix: process.env.API_PREFIX,
    url: '/upload'
})
export class UploadController {
    @Post('/')
    async uploadFile (@Req() req: UploadDto): Promise<ResponseType> {
        //
        const { files } = req;
        //
        if (!files.file) {
            return {
                status: 0,
                data: null,
                message: '上传失败'
            };
        }
        //
        const reader = createReadStream(files.file.path);
        //
        const filePath = `${resolve('upload')}/${files.file.name}`;
        // 创建可写流
        const upStream = createWriteStream(filePath);
        //
        reader.pipe(upStream);
        //
        return {
            status: 1,
            data: null,
            message: '上传成功'
        };
    }
}
