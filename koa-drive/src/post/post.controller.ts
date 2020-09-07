import { Controller, InjectModel } from '@decorators';
import { Post } from '@libs/models/post.model';

@Controller()
export class PostController {
    constructor (
        @InjectModel(Post, 'postgres') private readonly postModel: any
    ) {}
}
