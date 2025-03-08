# 项目结构说明

本项目采用功能模块化结构，按照功能模块组织代码，每个模块包含与该功能相关的所有代码。

## 目录结构

```
src/
├── modules/                # 按功能模块组织
│   ├── auth/               # 认证相关
│   │   ├── components/     # 认证相关组件
│   │   ├── hooks/          # 认证相关钩子
│   │   ├── services/       # 认证相关服务
│   │   ├── types/          # 认证相关类型
│   │   └── index.ts        # 模块导出
│   ├── blog/               # 博客相关
│   │   ├── components/     # 博客相关组件
│   │   ├── hooks/          # 博客相关钩子
│   │   ├── services/       # 博客相关服务
│   │   ├── types/          # 博客相关类型
│   │   └── index.ts        # 模块导出
│   ├── editor/             # 编辑器相关
│   │   ├── components/     # 编辑器相关组件
│   │   ├── hooks/          # 编辑器相关钩子
│   │   ├── types/          # 编辑器相关类型
│   │   └── index.ts        # 模块导出
│   └── theme/              # 主题相关
│       ├── components/     # 主题相关组件
│       ├── hooks/          # 主题相关钩子
│       ├── contexts/       # 主题相关上下文
│       └── index.ts        # 模块导出
├── shared/                 # 共享资源
│   ├── components/         # 共享组件
│   │   ├── ui/             # UI组件库
│   │   └── layout/         # 布局组件
│   ├── hooks/              # 共享钩子
│   ├── utils/              # 共享工具函数
│   ├── types/              # 共享类型定义
│   └── index.ts            # 共享资源导出
├── app/                    # Next.js应用路由
├── lib/                    # 第三方库集成
├── styles/                 # 全局样式
└── index.ts                # 根导出
```

## 模块说明

### 1. 认证模块 (auth)

认证模块包含所有与用户认证、注册、登录和权限管理相关的代码。

- **组件**：登录表单、注册表单、认证对话框等
- **钩子**：useAuth、useUserInfo等
- **服务**：authService等
- **类型**：User、UserData等

### 2. 博客模块 (blog)

博客模块包含所有与文章、博客内容相关的代码。

- **组件**：文章内容、文章头部等
- **钩子**：useArticle等
- **服务**：articles等
- **类型**：Article、Blog等

### 3. 编辑器模块 (editor)

编辑器模块包含所有与内容编辑相关的代码。

- **组件**：文章编辑器、块编辑器、编辑器侧边栏、编辑器头部等
- **钩子**：useEditorShortcuts等
- **类型**：Block、EditorState等

### 4. 主题模块 (theme)

主题模块包含所有与主题切换、暗色/亮色模式相关的代码。

- **组件**：主题切换按钮等
- **钩子**：useTheme等
- **上下文**：ThemeProvider等

### 5. 共享资源 (shared)

共享资源包含可以被多个模块使用的通用组件、钩子、工具函数和类型定义。

- **UI组件**：按钮、卡片、输入框、模态框等
- **布局组件**：页头、页脚等
- **钩子**：useImage、useScrollLock等
- **工具函数**：日期格式化、动画、样式工具等
- **类型定义**：通用类型、图片类型等

## 导入规则

在项目中导入模块时，应遵循以下规则：

1. **导入模块**：
   ```typescript
   import { Auth, Blog, Editor, Theme } from '@/';
   ```

2. **导入特定组件或钩子**：
   ```typescript
   import { AuthDialog, useAuth } from '@/modules/auth';
   import { Button, Card } from '@/shared';
   ```

3. **导入命名空间**：
   ```typescript
   import * as Auth from '@/modules/auth';
   ```

## 优势

这种模块化结构有以下优势：

1. **关注点分离**：相关功能的所有代码放在一起，使开发者可以专注于特定功能。
2. **可扩展性**：随着项目增长，可以轻松添加新模块，而不会影响现有代码。
3. **团队协作**：团队成员可以按模块分工，减少代码冲突。
4. **代码重用**：模块可以定义清晰的公共接口，便于其他模块使用。
5. **符合领域驱动设计**：按业务功能组织代码，更符合领域驱动设计的思想。 