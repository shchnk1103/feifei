# EditorContent 组件文档

## 组件概述
EditorContent 是一个富文本编辑器组件，用于支持文章内容的编辑和管理。该组件支持多种内容块类型（如文本、标题、图片等），并提供了用户友好的编辑体验。

## 文件结构

| 文件名                      | 功能描述                                                         |
| --------------------------- | ---------------------------------------------------------------- |
| `EditorContent.tsx`         | 主组件实现，负责管理和渲染编辑器的整体内容，包括封面图片和内容块 |
| `index.ts`                  | 统一入口文件，导出组件和类型，便于外部导入                       |
| `BlockFactory.ts`           | 块创建逻辑，负责创建不同类型的内容块（文本、图片、标题等）       |
| `animations.ts`             | 动画配置，定义所有UI元素的动画效果                               |
| `DynamicBlockRenderer.tsx`  | 块渲染组件，根据块类型动态渲染不同的编辑器组件                   |
| `EmptyBlockPlaceholder.tsx` | 空白占位符组件，显示在内容块列表底部，方便用户添加新块           |
| `KeyboardShortcuts.tsx`     | 键盘快捷键功能，处理编辑器的键盘交互和快捷操作                   |
| `styles.module.css`         | 样式文件，包含所有组件的样式定义                                 |

## 使用方法

```tsx
import { EditorContent } from '@/modules/editor/components/EditorContent';

// 使用示例
const MyEditor = () => {
  const [blocks, setBlocks] = useState([]);
  const [coverImage, setCoverImage] = useState('');

  return (
    <EditorContent
      blocks={blocks}
      coverImage={coverImage}
      onBlocksChange={setBlocks}
      onCoverImageChange={setCoverImage}
    />
  );
};
```

## 组件依赖关系

- `EditorContent` 作为主组件，依赖其他所有组件
- `DynamicBlockRenderer` 负责渲染单个内容块
- `EmptyBlockPlaceholder` 在内容列表底部显示
- `BlockFactory` 被主组件用于创建新的内容块
- `KeyboardShortcuts` 提供全局键盘操作支持

## 扩展指南

1. 添加新的块类型：
   - 在 `BlockFactory.ts` 中添加新的块类型定义
   - 在 `DynamicBlockRenderer.tsx` 中添加新块类型的渲染逻辑
   - 在相应的样式文件中添加样式定义

2. 添加新的键盘快捷键：
   - 在 `KeyboardShortcuts.tsx` 中的 `useKeyboardShortcuts` 钩子中添加新的快捷键处理逻辑

## 维护注意事项

- 保持各文件的单一职责原则
- 修改时注意保持动画的一致性
- 新增功能时应该考虑添加到最合适的文件中，避免主组件文件过于臃肿 