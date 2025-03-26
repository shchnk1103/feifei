"use client";

import { memo } from "react";
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage";
import { ImageBlock as ImageBlockType } from "@/modules/editor/types/blocks";
import { useImage } from "@/shared/hooks/useImage";
import { LoadingPlaceholder } from "../shared/LoadingPlaceholder";
import { validateImageSize, getImageAlt } from "../shared/utils";
import styles from "./styles.module.css";
import sharedStyles from "../shared/styles.module.css";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";

interface ImageBlockProps {
  block: ImageBlockType;
  className?: string;
  onLoadingComplete?: () => void;
  onError?: () => void;
}

export const ImageBlock = memo(function ImageBlock({
  block,
  className,
  onLoadingComplete,
  onError,
}: ImageBlockProps) {
  const { isLoading, error, handleLoadComplete, handleError } = useImage({
    onLoadingComplete,
    onError,
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const {
    metadata: {
      imageUrl,
      caption,
      width: customWidth,
      height: customHeight,
      alt: customAlt,
    },
    content,
  } = block;

  const { width, height } = validateImageSize({
    width: customWidth,
    height: customHeight,
  });

  const alt = getImageAlt(customAlt || content || "", caption || "");

  // 检查imageUrl是否为空字符串
  const hasValidImageUrl = imageUrl && imageUrl.trim() !== "";
  const showImageError = error || !hasValidImageUrl;

  return (
    <figure
      ref={ref}
      className={clsx(
        sharedStyles.blockBase,
        styles.figure,
        inView && styles.visible,
        className
      )}
    >
      <div
        className={clsx(
          styles.imageWrapper,
          sharedStyles.imageContainer,
          isLoading && sharedStyles.loading,
          showImageError && sharedStyles.error
        )}
      >
        {!showImageError ? (
          <OptimizedImage
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className={clsx(styles.image, isLoading && sharedStyles.loading)}
            priority={false}
            onLoadingComplete={handleLoadComplete}
            onError={handleError}
          />
        ) : (
          <div className={styles.errorPlaceholder}>
            <span role="alert">
              {!hasValidImageUrl ? "没有提供图片" : "图片加载失败"}
            </span>
          </div>
        )}
        {isLoading && !showImageError && <LoadingPlaceholder />}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
});
