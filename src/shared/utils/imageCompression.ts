/**
 * 图片压缩选项接口
 */
export interface CompressionOptions {
  /** 最大宽度 */
  maxWidth?: number;
  /** 最大高度 */
  maxHeight?: number;
  /** 压缩质量 (0-1) */
  quality?: number;
  /** 最大文件大小 (bytes) */
  maxSize?: number;
  /** 输出格式 */
  mimeType?: "image/jpeg" | "image/png" | "image/webp";
  /** 是否保持宽高比 */
  maintainAspectRatio?: boolean;
  /** 是否自动清理临时文件 */
  autoCleanup?: boolean;
  /** 最小压缩质量 */
  minQuality?: number;
  /** 是否启用渐进式压缩 */
  progressive?: boolean;
  /** 目标宽高比 (width/height) */
  targetAspectRatio?: number;
  /** 允许的宽高比误差范围 (0-1) */
  aspectRatioTolerance?: number;
  /** 是否优先满足宽度 */
  prioritizeWidth?: boolean;
}

/**
 * 压缩结果接口
 */
export interface CompressionResult {
  /** 压缩后的图片数据 */
  blob: Blob;
  /** 压缩后的图片URL */
  url: string;
  /** 压缩后的宽度 */
  width: number;
  /** 压缩后的高度 */
  height: number;
  /** 压缩后的文件大小 */
  size: number;
  /** 原始文件大小 */
  originalSize: number;
  /** 压缩比例 */
  compressionRatio: number;
  /** 压缩后的文件类型 */
  mimeType: string;
}

/**
 * 压缩进度回调函数类型
 */
export type ProgressCallback = (progress: number) => void;

/**
 * 图片压缩工具类
 */
export class ImageCompressor {
  private static readonly DEFAULT_OPTIONS: CompressionOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    maxSize: 5 * 1024 * 1024, // 5MB
    mimeType: "image/jpeg",
    maintainAspectRatio: true,
    autoCleanup: true,
    minQuality: 0.6,
    progressive: true,
    targetAspectRatio: 16 / 9, // 默认16:9比例
    aspectRatioTolerance: 0.1, // 允许10%的误差
    prioritizeWidth: true, // 默认优先满足宽度
  };

  private static readonly SUPPORTED_FORMATS = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  /**
   * 压缩图片
   * @param file 原始图片文件
   * @param options 压缩选项
   * @param onProgress 进度回调
   * @returns 压缩结果
   */
  public static async compress(
    file: File,
    options: CompressionOptions = {},
    onProgress?: ProgressCallback
  ): Promise<CompressionResult> {
    // 合并默认选项
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    let tempUrl: string | null = null;

    try {
      // 验证文件类型
      if (!file.type.startsWith("image/")) {
        throw new Error("不支持的文件类型，请上传图片文件");
      }

      // 验证文件大小
      if (file.size > opts.maxSize!) {
        throw new Error(`文件大小超过限制 (${opts.maxSize! / 1024 / 1024}MB)`);
      }

      // 验证输出格式
      if (opts.mimeType && !this.SUPPORTED_FORMATS.includes(opts.mimeType)) {
        throw new Error(`不支持的输出格式: ${opts.mimeType}`);
      }

      // 创建图片对象
      const image = await this.loadImage(file);
      tempUrl = image.src;

      // 计算新的尺寸
      const dimensions = this.calculateDimensions(
        image.width,
        image.height,
        opts
      );

      // 压缩图片
      const result = await this.compressImage(
        image,
        dimensions.width,
        dimensions.height,
        opts,
        onProgress
      );

      // 计算压缩比例
      const compressionRatio = (result.size / file.size) * 100;

      return {
        ...result,
        originalSize: file.size,
        compressionRatio,
        mimeType: opts.mimeType || file.type,
      };
    } catch (error) {
      console.error("图片压缩失败:", error);
      throw error;
    } finally {
      // 清理临时文件
      if (tempUrl && opts.autoCleanup) {
        URL.revokeObjectURL(tempUrl);
      }
    }
  }

  /**
   * 加载图片
   * @param file 图片文件
   * @returns Promise<HTMLImageElement>
   */
  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("图片加载失败"));
      image.src = URL.createObjectURL(file);
    });
  }

  /**
   * 计算压缩后的尺寸
   * @param width 原始宽度
   * @param height 原始高度
   * @param options 压缩选项
   * @returns 新的尺寸
   */
  private static calculateDimensions(
    width: number,
    height: number,
    options: CompressionOptions
  ): { width: number; height: number } {
    const {
      maxWidth,
      maxHeight,
      maintainAspectRatio,
      targetAspectRatio: initialTargetRatio,
      aspectRatioTolerance = 0.1,
      prioritizeWidth = true,
    } = options;

    // 如果没有设置最大尺寸，直接返回原始尺寸
    if (!maxWidth && !maxHeight) {
      return { width, height };
    }

    // 计算原始宽高比
    const originalAspectRatio = width / height;

    // 确定最终使用的宽高比
    let finalAspectRatio = originalAspectRatio;
    if (initialTargetRatio && maintainAspectRatio) {
      const ratioDiff = Math.abs(originalAspectRatio - initialTargetRatio);

      // 如果比例差异在容差范围内，保持原始比例
      if (ratioDiff > aspectRatioTolerance) {
        finalAspectRatio = initialTargetRatio;
      }
    }

    let newWidth = width;
    let newHeight = height;

    // 根据优先选项决定计算顺序
    if (prioritizeWidth) {
      // 优先满足宽度
      if (maxWidth && width > maxWidth) {
        newWidth = maxWidth;
        newHeight = maintainAspectRatio
          ? Math.round(newWidth / finalAspectRatio)
          : height;
      }

      // 检查高度是否超出限制
      if (maxHeight && newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maintainAspectRatio
          ? Math.round(newHeight * finalAspectRatio)
          : width;
      }
    } else {
      // 优先满足高度
      if (maxHeight && height > maxHeight) {
        newHeight = maxHeight;
        newWidth = maintainAspectRatio
          ? Math.round(newHeight * finalAspectRatio)
          : width;
      }

      // 检查宽度是否超出限制
      if (maxWidth && newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = maintainAspectRatio
          ? Math.round(newWidth / finalAspectRatio)
          : height;
      }
    }

    // 确保尺寸为整数
    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    };
  }

  /**
   * 压缩图片
   * @param image 图片对象
   * @param width 目标宽度
   * @param height 目标高度
   * @param options 压缩选项
   * @param onProgress 进度回调
   * @returns 压缩结果
   */
  private static async compressImage(
    image: HTMLImageElement,
    width: number,
    height: number,
    options: CompressionOptions,
    onProgress?: ProgressCallback
  ): Promise<CompressionResult> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("无法创建 Canvas 上下文"));
        return;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制图片
      ctx.drawImage(image, 0, 0, width, height);

      // 如果启用了渐进式压缩
      if (options.progressive) {
        this.progressiveCompress(canvas, options, onProgress)
          .then(resolve)
          .catch(reject);
      } else {
        // 直接压缩
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("图片压缩失败"));
              return;
            }

            const url = URL.createObjectURL(blob);
            resolve({
              blob,
              url,
              width,
              height,
              size: blob.size,
              originalSize: 0,
              compressionRatio: 0,
              mimeType: options.mimeType || "image/jpeg",
            });
          },
          options.mimeType,
          options.quality
        );
      }
    });
  }

  /**
   * 渐进式压缩
   * @param canvas Canvas对象
   * @param options 压缩选项
   * @param onProgress 进度回调
   * @returns 压缩结果
   */
  private static async progressiveCompress(
    canvas: HTMLCanvasElement,
    options: CompressionOptions,
    onProgress?: ProgressCallback
  ): Promise<CompressionResult> {
    const { quality = 0.8, minQuality = 0.6 } = options;
    let currentQuality = quality;
    let lastBlob: Blob | null = null;

    while (currentQuality >= minQuality) {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("压缩失败"));
          },
          options.mimeType,
          currentQuality
        );
      });

      // 计算压缩进度
      const progress =
        ((quality - currentQuality) / (quality - minQuality)) * 100;
      onProgress?.(Math.min(progress, 100));

      // 如果压缩后的文件大小已经足够小，就停止压缩
      if (blob.size <= (options.maxSize || Infinity)) {
        lastBlob = blob;
        break;
      }

      lastBlob = blob;
      currentQuality -= 0.1;
    }

    if (!lastBlob) {
      throw new Error("压缩失败");
    }

    const url = URL.createObjectURL(lastBlob);
    return {
      blob: lastBlob,
      url,
      width: canvas.width,
      height: canvas.height,
      size: lastBlob.size,
      originalSize: 0,
      compressionRatio: 0,
      mimeType: options.mimeType || "image/jpeg",
    };
  }
}
