import { ApiProperty, PostgresModule, Prop  } from '@decorators';

@PostgresModule({})
export class Post {
    @ApiProperty({
        description: '岗位名称',
        example: '研发'
    })
    @Prop()
    postName!: string;

    @ApiProperty({
        description: '岗位编号',
        example: 'a308'
    })
    @Prop()
    code!: string;

    @ApiProperty({
        description: '岗位职员',
        example: ['a', 'b']
    })
    @Prop()
    member!: string[];
}
