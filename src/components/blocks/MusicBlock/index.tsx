import { MusicPlayer } from "./MusicPlayer";
import { MusicBlockProps } from "./types";

export function MusicBlock({ block }: MusicBlockProps) {
  return <MusicPlayer block={block} variant="full" />;
}
