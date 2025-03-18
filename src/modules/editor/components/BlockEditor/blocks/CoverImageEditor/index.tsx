import { useRef, useState } from "react";
import { useCoverImage } from "@/modules/editor/hooks/useCoverImage";
import { UploadPlaceholder } from "./components/UploadPlaceholder";
import { CoverImageDisplay } from "./components/CoverImageDisplay";
import styles from "./styles.module.css";

interface CoverImageEditorProps {
  onChange: (imageUrl: string) => void;
  articleId?: string;
}

/**
 * 封面图片编辑器组件
 * 支持图片上传、预览、更改和删除功能
 */
export function CoverImageEditor({
  onChange,
  articleId,
}: CoverImageEditorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    imageUrl: currentImageUrl,
    isUploading,
    isLoading,
    isDeleting,
    uploadProgress,
    uploadImage,
    removeImage,
  } = useCoverImage(articleId);

  // 点击选择文件
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const newUrl = await uploadImage(file);
        onChange(newUrl);
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "上传图片失败，请稍后重试"
        );
      }
    }
  };

  // 移除封面图片
  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeImage();
      onChange("");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "删除封面图片失败，请稍后重试"
      );
    }
  };

  // 处理鼠标事件
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <span>正在加载封面图片...</span>
      </div>
    );
  }

  // 如果正在删除，显示删除状态
  if (isDeleting) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <span>正在删除封面图片...</span>
      </div>
    );
  }

  // 如果没有图片，显示上传占位符
  if (!currentImageUrl) {
    return (
      <UploadPlaceholder
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        fileInputRef={fileInputRef}
        handleImageClick={handleImageClick}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handleFileChange={handleFileChange}
      />
    );
  }

  return (
    <>
      <CoverImageDisplay
        imageUrl={currentImageUrl}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        isHovering={isHovering}
        onImageClick={handleImageClick}
        onRemove={handleRemove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
        disabled={isUploading}
      />
    </>
  );
}
