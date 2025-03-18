import { Block, BlockType } from "@/modules/editor/types/blocks";
import { v4 as uuidv4 } from "uuid";

/**
 * 块创建工厂 - 负责创建不同类型的编辑器块
 */
export const BlockFactory = {
  /**
   * 创建一个新的内容块
   * @param type 块类型
   * @returns 新创建的块对象
   */
  createBlock(type: BlockType = "text"): Block {
    const blockId = uuidv4();

    const baseBlock = {
      id: blockId,
      type,
      content: "",
    };

    switch (type) {
      case "heading":
        return {
          ...baseBlock,
          type: "heading",
          level: 2,
        };
      case "image":
        return {
          ...baseBlock,
          type: "image",
          metadata: {
            imageUrl: "",
            alt: "",
            caption: "",
          },
        };
      case "quote":
        return {
          ...baseBlock,
          type: "quote",
          metadata: {
            author: "",
            source: "",
          },
        };
      case "code":
        return {
          ...baseBlock,
          type: "code",
          metadata: {
            language: "javascript",
            highlightLines: [],
          },
        };
      case "table":
        return {
          ...baseBlock,
          type: "table",
          metadata: {
            rows: [{ cells: ["", ""] }, { cells: ["", ""] }],
            headers: ["", ""],
            caption: "",
          },
        };
      case "divider":
        return {
          ...baseBlock,
          type: "divider",
        };
      default:
        return baseBlock;
    }
  },
};
