# BlockEditor 组件文档

## 组件概述
BlockEditor 是一个专注于渲染不同类型内容块的组件，提供了基础的块编辑功能，包括文本块、标题块等。该组件作为 EditorContent 的子组件，负责具体内容块的内容渲染和编辑交互。

## 组件架构与职责分工

在重构后的架构中，我们实现了清晰的职责分离：

| 组件名称                 | 主要职责                                            |
| ------------------------ | --------------------------------------------------- |
| **EditorContent**        | 顶层编辑器组件，负责整体布局、状态管理、块操作逻辑  |
| **DynamicBlockRenderer** | 负责单个内容块的渲染容器、UI交互、外观动画          |
| **BlockEditor**          | 专注于不同类型内容块的编辑、内容变更、焦点管理      |
| **BlockMap**             | 映射不同块类型到对应的编辑器组件                    |
| **特定块编辑器组件**     | 处理特定类型块的编辑界面和交互（如TextBlockEditor） |

这种架构确保了：
1. 每个组件都有明确的单一职责
2. 减少了代码重复
3. 提高了可维护性和可扩展性

## BlockEditor 与 DynamicBlockRenderer 的关系

BlockEditor 与 DynamicBlockRenderer 的关系：
- DynamicBlockRenderer 是容器组件，提供块的外层UI结构和操作按钮
- BlockEditor 专注于内容块的具体编辑和渲染，不包含块操作逻辑
- DynamicBlockRenderer 通过回调函数将块操作委托给 EditorContent
- BlockEditor 仅负责渲染不同类型的编辑器组件和处理内容变更

## 主要功能

BlockEditor 提供以下核心功能：

| 功能     | 描述                           |
| -------- | ------------------------------ |
| 块渲染   | 根据块类型渲染不同的编辑器组件 |
| 内容更新 | 处理块内容的更新并通知父组件   |
| 焦点管理 | 管理块的焦点状态和交互反馈     |
| 回车处理 | 提供回车键处理以支持创建新块   |

## 使用示例

```tsx
import { BlockEditor } from '@/modules/editor/components/BlockEditor';

// 使用示例
const SimpleEditor = () => {
  const [blocks, setBlocks] = useState([]);

  return (
    <BlockEditor
      blocks={blocks}
      onBlocksChange={setBlocks}
      onEnterKey={(blockId) => {
        // 处理回车键创建新块的逻辑
      }}
    />
  );
};
```

## 块类型支持

当前支持的块类型：
- 文本块 (TextBlockEditor)
- 标题块 (HeadingBlockEditor)

可以通过添加新的块编辑器组件并在 BlockMap 中注册来扩展更多类型。

## 组件架构

### BlockMap

BlockEditor 使用 BlockMap 来映射块类型与对应的编辑器组件：

```tsx
// BlockMap.tsx 示例
export const BlockMap: Record<BlockType, React.ComponentType<BaseBlockEditorProps>> = {
  text: TextBlockEditor as React.ComponentType<BaseBlockEditorProps>,
  heading: HeadingBlockEditor as React.ComponentType<BaseBlockEditorProps>,
  // 可以添加更多类型...
};
```

通过这种方式，可以轻松扩展新的块类型而无需修改 BlockEditor 的核心逻辑。

## 数据流

BlockEditor组件的数据流向：

1. EditorContent 维护整体块数据状态
2. 数据通过 DynamicBlockRenderer 传递给 BlockEditor
3. BlockEditor 负责渲染和更新块内容
4. 内容变更通过回调函数传回 EditorContent

## 维护注意事项

1. BlockEditor 现在专注于块的渲染和内容编辑，块操作逻辑（添加、删除、移动等）已移至 EditorContent
2. DynamicBlockRenderer 负责块的UI容器和交互体验，但不包含具体的操作逻辑实现
3. 在扩展新块类型时，只需要:
   - 创建新的块编辑器组件（类似 TextBlockEditor）
   - 在 BlockMap 中注册该类型的编辑器组件
4. 保持各组件的单一职责，避免再次引入重复逻辑
5. 块的创建逻辑位于 BlockFactory 类，不再在其他组件中重复 