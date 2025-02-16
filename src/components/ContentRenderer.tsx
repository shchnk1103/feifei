import { ArticleContent } from "../types/article";
import Image from "next/image";
import styles from "./ContentRenderer.module.css";
import { createElement } from "react";
import { MusicPlayer } from "./MusicPlayer";

export default function ContentRenderer({
  content = { blocks: [] },
}: {
  content?: ArticleContent;
}) {
  if (!content?.blocks) {
    return <div className={styles.contentContainer} />;
  }

  return (
    <div className={styles.contentContainer}>
      {content.blocks.map((block) => {
        switch (block.type) {
          case "heading":
            return createElement(
              `h${block.level || 2}`,
              {
                key: block.id,
                className: styles[`heading${block.level}`],
              },
              block.content
            );
          case "text":
            return (
              <p key={block.id} className={styles.paragraph}>
                {block.content}
              </p>
            );
          case "image":
            return (
              <div key={block.id} className={styles.imageBlock}>
                <Image
                  src={block.metadata?.imageUrl || ""}
                  alt={block.content || ""}
                  width={800}
                  height={500}
                  className={styles.articleImage}
                  objectFit="cover"
                />
                {block.metadata?.description && (
                  <p className={styles.imageCaption}>
                    {block.metadata.description}
                  </p>
                )}
              </div>
            );
          case "link":
            return (
              <div key={block.id} className={styles.linkBlock}>
                <a
                  href={block.metadata?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <div className={styles.linkCard}>
                    {block.metadata?.imageUrl && (
                      <Image
                        src={block.metadata.imageUrl}
                        alt={block.content || ""}
                        width={120}
                        height={120}
                        className={styles.linkImage}
                        objectFit="cover"
                      />
                    )}
                    <div className={styles.linkContent}>
                      <h3 className={styles.linkTitle}>{block.content}</h3>
                      {block.metadata?.description && (
                        <p className={styles.linkDescription}>
                          {block.metadata.description}
                        </p>
                      )}
                      <span className={styles.linkUrl}>
                        {block.metadata?.url}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            );
          case "music":
            return <MusicPlayer key={block.id} block={block} />;
          case "quote":
            return (
              <blockquote key={block.id} className={styles.quoteBlock}>
                <p className={styles.quoteContent}>{block.content}</p>
                {block.metadata?.author && (
                  <footer className={styles.quoteFooter}>
                    <cite className={styles.quoteAuthor}>
                      {block.metadata.author}
                    </cite>
                    {block.metadata?.source && (
                      <span className={styles.quoteSource}>
                        {block.metadata.source}
                      </span>
                    )}
                  </footer>
                )}
              </blockquote>
            );
          default:
            return (
              <div key={block.id} className={styles.block}>
                {block.content}
              </div>
            );
        }
      })}
    </div>
  );
}
