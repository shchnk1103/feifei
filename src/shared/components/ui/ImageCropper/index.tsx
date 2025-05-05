"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import styles from "./styles.module.css";

interface ImageCropperProps {
  image: File;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  aspectRatio = 16 / 9,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90 / aspectRatio,
    x: 5,
    y: 5,
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [pixelCrop, setPixelCrop] = useState<PixelCrop | null>(null);

  // 当组件加载时，创建图片URL
  useEffect(() => {
    const url = URL.createObjectURL(image);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // 处理裁剪变化
  const handleCropChange = useCallback((newCrop: Crop) => {
    setCrop(newCrop);
  }, []);

  // 处理裁剪完成
  const handleCropComplete = useCallback(async (crop: PixelCrop) => {
    console.log("裁剪区域更新:", crop);
    setPixelCrop(crop);
  }, []);

  // 处理确认按钮点击
  const handleConfirm = useCallback(async () => {
    console.log("确认按钮点击");
    if (!imageUrl || !isImageLoaded || !imageRef.current || !pixelCrop) {
      console.log("缺少必要数据:", {
        imageUrl: !!imageUrl,
        isImageLoaded,
        imageRef: !!imageRef.current,
        pixelCrop: !!pixelCrop,
      });
      return;
    }

    setIsProcessing(true);

    try {
      const image = imageRef.current;
      console.log("图片信息:", {
        实际宽度: image.naturalWidth,
        实际高度: image.naturalHeight,
        显示宽度: image.width,
        显示高度: image.height,
      });

      // 获取图片的实际尺寸和显示尺寸
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      console.log("缩放比例:", { scaleX, scaleY });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("无法创建 Canvas 上下文");
      }

      // 设置画布尺寸为裁剪区域大小
      canvas.width = pixelCrop.width * scaleX;
      canvas.height = pixelCrop.height * scaleY;

      console.log("画布尺寸:", {
        宽度: canvas.width,
        高度: canvas.height,
      });

      // 绘制裁剪后的图片
      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY
      );

      // 将画布内容转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("裁剪完成，Blob大小:", blob.size);
            onCropComplete(blob);
          } else {
            console.error("无法创建 Blob");
          }
          setIsProcessing(false);
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("裁剪过程出错:", error);
      setIsProcessing(false);
    }
  }, [imageUrl, onCropComplete, isImageLoaded, pixelCrop]);

  // 处理图片加载完成
  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      console.log("图片加载完成");
      setIsImageLoaded(true);
      imageRef.current = e.currentTarget;
    },
    []
  );

  return (
    <div className={styles.container}>
      <div className={styles.cropContainer}>
        {imageUrl && (
          <ReactCrop
            crop={crop}
            onChange={handleCropChange}
            onComplete={handleCropComplete}
            aspect={aspectRatio}
            className={styles.cropArea}
          >
            <img
              src={imageUrl}
              alt="待裁剪图片"
              className={styles.image}
              onLoad={handleImageLoad}
            />
          </ReactCrop>
        )}
      </div>
      <div className={styles.controls}>
        <button
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isProcessing}
        >
          取消
        </button>
        <button
          onClick={handleConfirm}
          className={styles.confirmButton}
          disabled={!isImageLoaded || !pixelCrop || isProcessing}
        >
          {isProcessing ? "处理中..." : "确认"}
        </button>
      </div>
      {isProcessing && (
        <div className={styles.processingOverlay}>
          <div className={styles.processingSpinner} />
          <span>正在处理图片...</span>
        </div>
      )}
    </div>
  );
}
