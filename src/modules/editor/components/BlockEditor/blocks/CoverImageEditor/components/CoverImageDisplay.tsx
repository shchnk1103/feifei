import { BiPencil, BiX } from "react-icons/bi";
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage";
import styles from "../styles.module.css";

interface CoverImageDisplayProps {
  imageUrl: string;
  isUploading: boolean;
  uploadProgress: number;
  compressionProgress: number;
  isHovering: boolean;
  onImageClick: () => void;
  onRemove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * 封面图片显示组件
 * 当有图片时显示此组件
 */
export function CoverImageDisplay({
  imageUrl,
  isUploading,
  uploadProgress,
  compressionProgress,
  isHovering,
  onImageClick,
  onRemove,
  onMouseEnter,
  onMouseLeave,
}: CoverImageDisplayProps) {
  return (
    <div
      className={styles.coverImageContainer}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <OptimizedImage
        src={imageUrl}
        alt="封面图片"
        className={styles.coverImage}
        width={1200}
        height={600}
        enableCompression={false} // 禁用 OptimizedImage 的压缩，因为我们已经在 useCoverImage 中处理了
      />

      {isUploading && (
        <div className={styles.uploadingOverlay}>
          <div className={styles.uploadProgress}>
            {compressionProgress > 0 && compressionProgress < 100 && (
              <>
                <div className={styles.progressLabel}>压缩中...</div>
                <div
                  className={styles.progressBar}
                  style={{ width: `${compressionProgress}%` }}
                />
                <span>{Math.round(compressionProgress)}%</span>
              </>
            )}
            {compressionProgress === 100 && (
              <>
                <div className={styles.progressLabel}>上传中...</div>
                <div
                  className={styles.progressBar}
                  style={{ width: `${uploadProgress}%` }}
                />
                <span>{uploadProgress}%</span>
              </>
            )}
          </div>
        </div>
      )}

      {isHovering && !isUploading && (
        <>
          <div className={styles.coverImageOverlay} onClick={onImageClick}>
            <div className={styles.changeImageButton}>
              <BiPencil size={16} />
              <span>更改图片</span>
            </div>
          </div>
          <button
            className={styles.removeImageButton}
            onClick={onRemove}
            aria-label="移除封面图片"
          >
            <BiX size={18} />
          </button>
        </>
      )}
    </div>
  );
}
