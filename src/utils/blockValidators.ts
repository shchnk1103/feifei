import { Block, BlockMetadata } from "@/types/blocks";

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

export function validateBlockMetadata<T extends Block>(
  block: T,
  requiredFields: (keyof BlockMetadata<T>)[]
): boolean {
  if (!block.metadata) return false;

  return requiredFields.every(
    (field) => field in block.metadata && block.metadata[field] !== undefined
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
