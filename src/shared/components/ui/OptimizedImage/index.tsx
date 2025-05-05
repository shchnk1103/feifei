"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { useState, useEffect } from "react";
import {
  ImageCompressor,
  type CompressionOptions,
} from "@/shared/utils/imageCompression";
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
  enableCompression?: boolean;
  compressionOptions?: CompressionOptions;
  onCompressionComplete?: (result: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  }) => void;
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
  unoptimized = false,
  placeholder,
  blurDataURL,
  quality = 90,
  onLoadingComplete,
  onLoad,
  onError,
  enableCompression = true,
  compressionOptions,
  onCompressionComplete,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState(0);

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

  // 处理图片压缩
  useEffect(() => {
    if (
      !enableCompression ||
      (!src.startsWith("blob:") && !src.startsWith("data:"))
    ) {
      return;
    }

    const compressImage = async () => {
      try {
        // 获取图片文件
        const response = await fetch(src);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        // 压缩图片
        const result = await ImageCompressor.compress(
          file,
          {
            maxWidth: width,
            maxHeight: height,
            quality: quality / 100, // 转换quality为0-1范围
            ...compressionOptions,
          },
          (progress) => {
            setCompressionProgress(progress);
          }
        );

        // 更新压缩后的URL
        setCompressedUrl(result.url);

        // 调用压缩完成回调
        onCompressionComplete?.({
          originalSize: result.originalSize,
          compressedSize: result.size,
          compressionRatio: result.compressionRatio,
        });

        console.log("图片压缩完成:", {
          originalSize: formatSize(result.originalSize),
          compressedSize: formatSize(result.size),
          compressionRatio: result.compressionRatio.toFixed(2) + "%",
        });
      } catch (error) {
        console.error("图片压缩失败:", error);
        setHasError(true);
      }
    };

    compressImage();

    // 清理函数
    return () => {
      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
      }
    };
  }, [
    src,
    enableCompression,
    width,
    height,
    quality,
    compressionOptions,
    onCompressionComplete,
  ]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
    onLoadingComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
    console.error(`图片加载失败: ${src}`);
  };

  // 格式化文件大小
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn(styles.imageContainer, className)}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
        </div>
      )}

      {enableCompression &&
        compressionProgress > 0 &&
        compressionProgress < 100 && (
          <div className={styles.compressionOverlay}>
            <div className={styles.compressionProgress}>
              <div
                className={styles.progressBar}
                style={{ width: `${compressionProgress}%` }}
              />
              <span>{Math.round(compressionProgress)}%</span>
            </div>
          </div>
        )}

      {hasError ? (
        <div className={styles.errorContainer}>
          <span>图片加载失败</span>
        </div>
      ) : (
        <Image
          src={compressedUrl || src}
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
