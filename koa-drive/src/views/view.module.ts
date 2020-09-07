import { Module } from '@decorators';
import { ViewsController } from './view.controller';

@Module({
    controllers: [ViewsController]
})
export class Views {}
