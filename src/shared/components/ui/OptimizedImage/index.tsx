"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { useState } from "react";
import styles from "./styles.module.css";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  quality?: number;
  onLoadingComplete?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 优化的图片组件，支持本地和远程图片
 *
 * 注意：如果使用远程图片，需要在next.config.js中配置remotePatterns
 * 例如：
 *
 * ```js
 * // next.config.js
 * module.exports = {
 *   images: {
 *     remotePatterns: [
 *       {
 *         protocol: 'https',
 *         hostname: 'firebasestorage.googleapis.com',
 *       },
 *     ],
 *   },
 * }
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  width = 1200,
  height = 600,
  className,
  priority = false,
  unoptimized = false, // 默认使用Next.js的优化
  placeholder,
  blurDataURL,
  quality = 90,
  onLoadingComplete,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Firebase URL检测
  const isFirebaseUrl =
    src.includes("firebasestorage.googleapis.com") ||
    src.includes("storage.googleapis.com");

  // 检测URL长度
  const isLongUrl = src.length > 500;

  // 检测签名参数（Firebase存储URL通常包含这些）
  const hasSignatureParams =
    src.includes("GoogleAccessId") ||
    src.includes("Expires") ||
    src.includes("Signature");

  // 针对Firebase URL的特殊处理：
  // 如果是Firebase URL且是长URL或包含签名参数，强制使用unoptimized=true
  const shouldSkipOptimization =
    unoptimized || (isFirebaseUrl && (isLongUrl || hasSignatureParams));

  // 默认模糊占位符数据
  const defaultBlurDataUrl =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==";

  const handleLoad = () => {
    setIsLoading(false);
    // 调用两个回调以保持向后兼容性
    onLoad?.();
    onLoadingComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
    console.error(`图片加载失败: ${src}`);
  };

  return (
    <div className={cn(styles.imageContainer, className)}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
        </div>
      )}

      {hasError ? (
        <div className={styles.errorContainer}>
          <span>图片加载失败</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={styles.image}
          priority={priority}
          unoptimized={shouldSkipOptimization}
          quality={quality}
          placeholder={placeholder || (blurDataURL ? "blur" : undefined)}
          blurDataURL={blurDataURL || defaultBlurDataUrl}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
