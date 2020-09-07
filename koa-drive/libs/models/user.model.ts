import { Prop, ApiProperty, MongooseModule } from '@decorators';
import { hashSync, genSaltSync } from 'bcryptjs';

@MongooseModule({
    timestamps: true
})
export class User {
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
    @Prop({
        set (val: string): string {
            const salt = genSaltSync(10);
            return val ? hashSync(val, salt) : val;
        }
    })
    password!: string;
}
