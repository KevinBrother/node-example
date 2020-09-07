import { Module } from '@decorators';
import { PostgresFactory } from '@libs/db';
import { PostController } from './post.controller';

@Module({
    database: PostgresFactory,
    controllers: [PostController]
})
export class Post {}
