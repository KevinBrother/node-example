# koa-drive

## 丐中丐版NestJS :neutral_face:

#### 介绍
- `Nodejs` 框架选择 `Koa2`，预计支持连接 `MongoDB` 、 `MySQL` 以及 `Redis`。使用 `TypeScript` 编写逻辑代码。通过 `Decorator` ，以及 `Reflect` 实现路由去中心化。内置功能包括：`RESTful API` 、`Swagger UI`、`CURD` 插件、`GraphQL`、文件上传以及输出请求响应日志。不必担心没接触过 `TypeScript` ，所有正常的 `JavaScript` 代码基本上可以算是合法的 `TypeScript` 代码。拥有 `JavaScript` 基础，便可以理解本项目大部分代码。

### 依赖包管理
- 考虑到依赖的安全性和安装速度，本次升级由 `npm` 迁移至 `yarn` ，若本地没有安装 `yarn` ，只需执行 `npm i -g yarn` 便可全局使用 `yarn`。

## Install dependences
```bash
yarn install
```

### Upgrade all dependences
```bash
yarn run upgrade
```

### Check dependency and select to upgrade
```bash
yarn run interactive
```

### Project setup and hot-reloads for development
```bash
yarn run dev
```

### Setup Nodejs Server
```bash
yarn run serve
```
