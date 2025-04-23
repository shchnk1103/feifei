# FeiとFei - 生活记录与技术分享

这是一个基于Next.js 14的博客平台，包含用户认证、主题切换、文章编辑等功能。

## 项目结构

本项目采用功能模块化结构，按照功能模块组织代码，每个模块包含与该功能相关的所有代码。详细的项目结构说明请参考[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)。

如果您正在从旧版本迁移，请参考[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)。

## 技术栈

- **前端框架**: Next.js 14
- **UI库**: React
- **样式**: Tailwind CSS
- **状态管理**: React Context
- **认证**: Firebase Authentication
- **数据库**: Firebase Firestore
- **测试**: Jest, React Testing Library

## 功能特点

- 用户认证和权限管理
- 响应式设计
- 深色/浅色主题切换
- 文章编辑和发布
- 评论系统

## 开始使用

首先，安装依赖：

```bash
npm install
# 或
yarn
# 或
pnpm install
```

然后，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 测试

运行测试：

```bash
npm test
# 或
yarn test
# 或
pnpm test
```

## 部署

本项目可以部署在Vercel平台上：

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

## 贡献

欢迎提交Pull Request或Issue。

## 许可证

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
