import { MusicBlock as MusicBlockType } from "@/types/blog";

export interface MusicBlockProps {
  block: MusicBlockType;
}

export interface MusicPlayerProps extends MusicBlockProps {
  variant?: "full" | "simple";
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}
