import { Block, BlockMetadata } from "@/types/blocks";
import { BaseBlock } from "@/types/blog";

export function isValidBlock(block: any): block is Block {
  return (
    typeof block === "object" &&
    "id" in block &&
    "type" in block &&
    "content" in block &&
    typeof block.id === "string" &&
    typeof block.type === "string" &&
    typeof block.content === "string"
  );
}

export function validateBlockMetadata<T extends BaseBlock>(
  block: T,
  requiredFields: string[]
): boolean {
  // Early return if metadata is undefined
  if (!block.metadata) return false;

  // Type assertion to ensure metadata is treated as non-null
  const metadata = block.metadata as Record<string, unknown>;

  return requiredFields.every((field) => {
    return field in metadata && metadata[field] !== undefined;
  });
}

// Example usage for specific block types
export function validateImageBlock(block: BaseBlock): boolean {
  if (!block.metadata) return false;

  return (
    block.type === "image" &&
    validateBlockMetadata(block, ["imageUrl"]) &&
    typeof block.metadata.imageUrl === "string" &&
    validateImageUrl(block.metadata.imageUrl)
  );
}

export function validateMusicBlock(block: BaseBlock): boolean {
  if (!block.metadata) return false;

  return (
    block.type === "music" &&
    validateBlockMetadata(block, ["musicUrl", "coverUrl", "artist"]) &&
    typeof block.metadata.musicUrl === "string" &&
    validateMusicUrl(block.metadata.musicUrl)
  );
}

export function validateImageUrl(url: string): boolean {
  try {
    new URL(url);
    return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
  } catch {
    return false;
  }
}

export function validateMusicUrl(url: string): boolean {
  try {
    new URL(url);
    return url.match(/\.(mp3|wav|ogg|m4a)$/i) !== null;
  } catch {
    return false;
  }
}

export function createBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
