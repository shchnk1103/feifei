# 编辑器模块 (Editor Module)

## 目录结构

```
editor/
├── components/     # 编辑器相关的 React 组件
├── hooks/         # 自定义 React Hooks
│   └── utils/     # Hooks 相关的工具函数
├── services/      # 编辑器相关的服务
├── types/         # TypeScript 类型定义
└── utils/         # 通用工具函数
```

## 核心功能

### 1. 文章保存系统

编辑器模块实现了一个复杂的文章保存系统，包含以下特性：

- **本地自动保存**：实时保存到本地存储
- **数据库保存**：智能的数据库保存机制
- **防抖处理**：避免频繁的保存操作
- **状态追踪**：实时追踪保存状态和内容变化

#### 保存机制的主要组件：

- `useArticleSave`：主要的保存 Hook，协调本地保存和数据库保存
- `useLocalSaveHandler`：处理本地存储相关的逻辑
- `useDbSaveHandler`：处理数据库保存相关的逻辑

### 2. 内容管理

- 支持文章标题、内容块、封面图片和标签的管理
- 实时内容变化检测
- 自动保存和手动保存功能

### 3. 状态管理

- 编辑状态追踪
- 保存状态管理
- 内容变化检测
- 调试信息输出

## 主要 Hooks

### useArticleSave

主要的文章保存 Hook，提供以下功能：

- 本地自动保存
- 数据库保存
- 保存状态管理
- 内容变化检测

### useArticleEditor

文章编辑器的核心 Hook，提供：

- 文章内容管理
- 编辑状态控制
- 保存功能集成
- 发布功能集成

### useArticleLoad

文章加载 Hook，负责：

- 文章数据加载
- 初始状态设置
- 错误处理

### useArticlePublish

文章发布 Hook，处理：

- 发布流程控制
- 发布状态管理
- 发布前的验证

## 配置

编辑器模块的主要配置项：

```typescript
const CONFIG = {
  EDITING_IDLE_DELAY: 2000,    // 编辑停止后的延迟保存时间
  DB_SAVE_DELAY: 5000,        // 数据库保存的最小间隔
  LOCAL_SAVE_DELAY: 1000,     // 本地保存的最小间隔
};
```

## 使用示例

```typescript
// 在组件中使用编辑器
const Editor = () => {
  const {
    saveStatus,
    saveCount,
    handleLocalAutoSave,
    saveArticleToDb,
    checkAndSaveToDb,
    cleanupTimers,
    setInitialData
  } = useArticleSave({
    article,
    initialArticleId,
    title,
    blocks,
    coverImage,
    tags,
    updateArticle,
    setInitialLoadedData,
    updateDebugInfo
  });

  // ... 组件逻辑
};
```

## 调试信息

编辑器模块提供了详细的调试信息输出，包括：

- 保存状态变化
- 内容变化检测
- 保存操作执行
- 错误信息

## 注意事项

1. 确保在使用编辑器模块时正确设置所有必需的参数
2. 注意处理保存失败的情况
3. 在组件卸载时调用 `cleanupTimers` 清理定时器
4. 定期检查保存状态和内容变化

## 性能优化

- 使用防抖机制避免频繁保存
- 智能的内容变化检测
- 异步保存操作
- 状态缓存优化

## 错误处理

- 保存失败时的错误处理
- 网络错误处理
- 状态恢复机制
- 用户提示 