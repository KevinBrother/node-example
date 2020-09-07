import { Setup } from '@core';
import { User } from '@/users';
import { Views } from '@/views';
import { Post } from '@/post';

// // 默认开启输出日志以及构建swagger
// const userAndView = new Setup({
//     logger: true,
//     swagger: true,
//     controllers: [User, Views]
// });

// // 支持定义单个服务行为
// userAndView.listen({
//     port: 7980,
//     logger: true,
//     swagger: false,
//     controllers: [User]
// });
// userAndView.listen({
//     port: 7650,
//     logger: false,
//     swagger: true
// });

// 配置项为可选参数
const server = new Setup({
    controllers: [User, Views, Post]
});

// 监听7200端口
server.listen(7200);
