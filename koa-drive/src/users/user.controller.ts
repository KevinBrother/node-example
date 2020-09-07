import { UserDto } from './dto';
import { User } from '@models/user.model';
import { ResponseType } from '@interfaces';
import { Body, Params } from '@decorators/params-decorator';
import { Controller } from '@decorators/controller-decorator';
import { Get, Post, Put, Delete } from '@decorators/method-decorator';
import { ApiTags, ApiOperation, InjectModel, ReturnModelType, DocumentType } from '@decorators';

type UserDocument = ReturnModelType<typeof User>;

type UserResponse = ResponseType<DocumentType<User> | null>;

type UserResponseList = ResponseType<DocumentType<User>[] | null>;

@Controller({
    url: '/user',
    prefix: process.env.API_PREFIX,
    version: process.env.API_VERSION
})
@ApiTags('用户')
export class UserController {
    constructor (
        @InjectModel(User) private readonly userModel: UserDocument
    ) {}

    /**
     * @description 创建新用户
     * @param body 创建用户参数
     */
    @Post('/')
    @ApiOperation({
        summary: '创建用户'
    })
    async createUser (@Body() body: UserDto): Promise<UserResponse> {
        // 调用创建方法
        const data = await this.userModel.create(body);
        // 返回页面数据
        return {
            status: 1,
            data,
            message: '新增成功'
        };
    }

    /**
     * @description 查询所有用户记录
     */
    @Get('/')
    @ApiOperation({
        summary: '查询所有用户'
    })
    async fetchUserList (): Promise<UserResponseList> {
        // 调用查询方法
        // 调用exec为了返回Promise对象
        const data = await this.userModel.find().exec();
        // 向页面发送用户数据
        return {
            status: 1,
            data,
            message: '查询成功'
        };
    }

    /**
     * @description 根据用户id查询用户详细信息
     * @param id 用户id
     */
    @Get('/:id')
    @ApiOperation({
        summary: '根据id查询用户'
    })
    async queryUserById (@Params('id') id: string): Promise<UserResponse> {
        // 调用查询详细信息方法
        const data = await this.userModel.findById(id).exec();
        // 向页面发送数据
        return {
            status: 1,
            data,
            message: '查询成功'
        };
    }

    /**
     * @description 根据用户id编辑用户信息
     * @param id 用户id
     * @param body 更新参数
     */
    @Put('/:id')
    @ApiOperation({
        summary: '编辑用户'
    })
    async findAndUpdateUser (
        @Params('id') id: string,
            @Body() body: Record<string, UserDto>
    ): Promise<UserResponse> {
        // 更具当前用户id查询用户当前数据
        const data = await this.userModel.findById(id).exec();
        // 若存在用户 则进行遍历赋值
        if (data) {
            for (const key in body) {
                data.set(key, body[key]);
            }
            // 调用保存方法 更新记录
            await data.save();
        }
        return {
            status: 1,
            data,
            message: '编辑成功'
        };
    }

    /**
     * @description 根据用户id删除用户信息
     * @param id 用户id
     */
    @Delete('/:id')
    @ApiOperation({
        summary: '删除用户'
    })
    async findUserAndDelete (@Params('id') id: string): Promise<ResponseType<null>> {
        // 根据用户id查询当前用户信息
        const data = await this.userModel.findById(id).exec();
        // 若用户存在 则删除用户
        data && await data.remove();
        // 删除成功 data返回null
        return {
            status: 1,
            data: null,
            message: '编辑成功'
        };
    }
}
