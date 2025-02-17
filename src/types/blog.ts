export interface BaseBlock {
  id: string;
  type: string;
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
}

export interface TextBlock extends BaseBlock {
  type: "text";
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  metadata: {
    imageUrl: string;
    description?: string;
  };
}

export interface LinkBlock extends BaseBlock {
  type: "link";
  metadata: {
    url: string;
    imageUrl?: string;
    description?: string;
  };
}

export interface MusicBlock extends BaseBlock {
  type: "music";
  metadata: {
    coverUrl: string;
    musicUrl: string;
    title: string;
    artist: string;
    albumName: string;
    description?: string;
  };
}

export interface QuoteBlock extends BaseBlock {
  type: "quote";
  metadata?: {
    author?: string;
    source?: string;
  };
}

export type ContentBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | LinkBlock
  | MusicBlock
  | QuoteBlock;
