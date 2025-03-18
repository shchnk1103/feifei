import { Block } from "@/modules/editor/types/blocks";

/**
 * 文本块编辑器组件的Props接口
 */
export interface TextBlockEditorProps {
  /** 当前编辑的块 */
  block: Block;
  /** 块是否处于活跃状态 */
  isActive: boolean;
  /** 当块内容变化时的回调 */
  onChange: (updatedBlock: Partial<Block>) => void;
  /** 当块获得焦点时的回调 */
  onFocus: () => void;
  /** 当块失去焦点时的回调 */
  onBlur: () => void;
  /** 当按下回车键时的回调 */
  onEnterKey?: () => void;
}
