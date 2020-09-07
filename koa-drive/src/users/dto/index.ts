import { ApiProperty, Prop } from '@decorators';

export class UserDto {
    @ApiProperty({
        description: '用户名',
        example: 'admin'
    })
    @Prop()
    username!: string;

    @ApiProperty({
        description: '用户密码',
        example: '123456'
    })
    @Prop()
    password!: string;
}
