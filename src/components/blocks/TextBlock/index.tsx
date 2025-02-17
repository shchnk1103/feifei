import { TextBlock as TextBlockType } from "@/types/blocks";
import styles from "./styles.module.css";

interface TextBlockProps {
  block: TextBlockType;
}

export function TextBlock({ block }: TextBlockProps) {
  return <p className={styles.text}>{block.content}</p>;
}
