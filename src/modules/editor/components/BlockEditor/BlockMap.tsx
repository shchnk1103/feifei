import React from "react";
import { Block, BlockType } from "@/modules/editor/types/blocks";
import { TextBlockEditor } from "./blocks/TextBlockEditor";
import { HeadingBlockEditor } from "./blocks/HeadingBlockEditor";

/**
 * 块编辑器组件的基础Props接口
 */
export interface BaseBlockEditorProps {
  block: Block;
  isActive: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (updatedBlock: Partial<Block>) => void;
  onEnterKey?: () => void;
}

/**
 * 块类型到编辑器组件的映射
 *
 * 使用此映射可以轻松添加新的块类型编辑器
 */
export const BlockMap: Record<
  BlockType,
  React.ComponentType<BaseBlockEditorProps>
> = {
  text: TextBlockEditor as React.ComponentType<BaseBlockEditorProps>,
  heading: HeadingBlockEditor as React.ComponentType<BaseBlockEditorProps>,
  // 以下块类型需要实现对应的编辑器组件
  image: (props) => (
    <div className="placeholder">
      图片编辑器组件 (待实现): {props.block.type}
    </div>
  ),
  quote: (props) => (
    <div className="placeholder">
      引用编辑器组件 (待实现): {props.block.type}
    </div>
  ),
  code: (props) => (
    <div className="placeholder">
      代码编辑器组件 (待实现): {props.block.type}
    </div>
  ),
  divider: (props) => (
    <div className="placeholder">分隔线组件 (待实现): {props.block.type}</div>
  ),
  link: (props) => (
    <div className="placeholder">
      链接编辑器组件 (待实现): {props.block.type}
    </div>
  ),
  table: (props) => (
    <div className="placeholder">
      表格编辑器组件 (待实现): {props.block.type}
    </div>
  ),
};

/**
 * 检查块类型是否有对应的编辑器组件实现
 * @param type 块类型
 * @returns 是否有实现
 */
export function hasEditorImplementation(type: BlockType): boolean {
  return BlockMap[type] !== undefined;
}
