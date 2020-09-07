import { Module } from '@decorators';
import { StorageController } from './storage.controller';

@Module({
    controllers: [StorageController]
})
export class Storage {}
