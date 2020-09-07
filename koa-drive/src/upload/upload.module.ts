import { Module } from '@decorators';
import { UploadController } from './upload.controller';

@Module({
    controllers: [UploadController]
})
export class Upload {}
