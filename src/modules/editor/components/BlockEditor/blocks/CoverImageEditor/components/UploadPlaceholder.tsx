import { BiUpload } from "react-icons/bi";
import { RefObject } from "react";
import styles from "../styles.module.css";

interface UploadPlaceholderProps {
  isUploading: boolean;
  uploadProgress: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleImageClick: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 封面图片上传占位组件
 * 当没有图片时显示此组件
 */
export function UploadPlaceholder({
  isUploading,
  uploadProgress,
  fileInputRef,
  handleImageClick,
  handleMouseEnter,
  handleMouseLeave,
  handleFileChange,
}: UploadPlaceholderProps) {
  return (
    <div
      className={styles.coverImagePlaceholder}
      onClick={handleImageClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isUploading ? (
        <ProgressIndicator progress={uploadProgress} />
      ) : (
        <UploadPrompt />
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
        disabled={isUploading}
      />
    </div>
  );
}

/**
 * 上传进度指示器
 */
function ProgressIndicator({ progress }: { progress: number }) {
  return (
    <div className={styles.uploadProgress}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      <span>{progress}%</span>
    </div>
  );
}

/**
 * 上传提示
 */
function UploadPrompt() {
  return (
    <>
      <BiUpload size={32} className={styles.uploadIcon} />
      <span>添加封面图片</span>
    </>
  );
}
