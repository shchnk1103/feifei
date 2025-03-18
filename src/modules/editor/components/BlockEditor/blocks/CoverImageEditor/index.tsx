import { useRef, useState } from "react";
import { BiUpload, BiX, BiPencil } from "react-icons/bi";
import styles from "./styles.module.css";
import Image from "next/image";

interface CoverImageEditorProps {
  imageUrl: string;
  onChange: (imageUrl: string) => void;
}

export function CoverImageEditor({
  imageUrl,
  onChange,
}: CoverImageEditorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 点击选择文件
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }

    // 在实际应用中，这里应该上传图片到服务器
    // 这里仅做演示，使用本地URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // 移除封面图片
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  if (!imageUrl) {
    return (
      <div
        className={styles.coverImagePlaceholder}
        onClick={handleImageClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <BiUpload size={32} className={styles.uploadIcon} />
        <span>添加封面图片</span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
    );
  }

  return (
    <div
      className={styles.coverImageContainer}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        src={imageUrl}
        alt="封面图片"
        className={styles.coverImage}
        width={1200}
        height={600}
      />

      {isHovering && (
        <>
          <div className={styles.coverImageOverlay} onClick={handleImageClick}>
            <div className={styles.changeImageButton}>
              <BiPencil size={16} />
              <span>更改图片</span>
            </div>
          </div>
          <button
            className={styles.removeImageButton}
            onClick={handleRemove}
            aria-label="移除封面图片"
          >
            <BiX size={18} />
          </button>
        </>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
}
