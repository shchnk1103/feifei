import Image from "next/image";
import { ImageBlock as ImageBlockType } from "@/types/blocks";
import styles from "./styles.module.css";

interface ImageBlockProps {
  block: ImageBlockType;
}

export function ImageBlock({ block }: ImageBlockProps) {
  return (
    <figure className={styles.figure}>
      <div className={styles.imageWrapper}>
        <Image
          src={block.metadata?.imageUrl || ""}
          alt={block.content || ""}
          width={800}
          height={500}
          className={styles.image}
          priority={false}
        />
      </div>
      {block.metadata?.description && (
        <figcaption className={styles.caption}>
          {block.metadata.description}
        </figcaption>
      )}
    </figure>
  );
}
