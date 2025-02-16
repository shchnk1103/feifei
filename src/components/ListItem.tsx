"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Modal from "./Modal";
import styles from "./ListItem.module.css";

// 定义属性类型
type ListItemProps = {
  imageSrc: string;
  title: string;
  description: string;
  articleContent: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
};

export default function ListItem({
  imageSrc,
  title,
  description,
  articleContent,
  author,
  createdAt,
  updatedAt,
  tags,
}: ListItemProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    // 等待动画完成后再关闭模态框
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 350); // 动画持续时间为 350ms
  }, []);

  return (
    <>
      <div className={styles.listItem} onClick={() => setOpen(true)}>
        <Image
          src={imageSrc}
          alt={title}
          className={styles.image}
          width={800}
          height={500}
          objectFit="cover"
        />
        <div className={styles.overlay}>
          <div className={styles.title}>{title}</div>
        </div>
      </div>

      {open && (
        <Modal onClose={handleClose}>
          <div
            className={`${styles.modalOverlay} ${
              closing ? styles.closing : ""
            }`}
            onClick={handleClose}
          >
            <div
              className={`${styles.articleModalContent} ${
                closing ? styles.closingContent : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeButton} onClick={handleClose}>
                ×
              </button>
              <Image
                src={imageSrc}
                alt={title}
                className={styles.modalImage}
                width={800}
                height={500}
                objectFit="cover"
              />
              <div className={styles.modalTextContainer}>
                <h2 className={styles.modalTitle}>{title}</h2>
                <p className={styles.modalDescription}>{description}</p>
                {(author || createdAt || updatedAt || tags) && (
                  <div className={styles.articleMeta}>
                    {author && (
                      <span className={styles.author}>By {author}</span>
                    )}
                    {createdAt && (
                      <span className={styles.date}>Created: {createdAt}</span>
                    )}
                    {updatedAt && (
                      <span className={styles.date}>Updated: {updatedAt}</span>
                    )}
                    {tags && tags.length > 0 && (
                      <div className={styles.tags}>
                        {tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className={styles.articleContent}>{articleContent}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
