import { Module } from '@decorators';
import { MongooseFactory } from '@db';
import { UserController } from './user.controller';

@Module({
    database: MongooseFactory,
    controllers: [UserController]
})
export class User {}
