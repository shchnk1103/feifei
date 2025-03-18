import { useState, useEffect, useCallback } from "react";

/**
 * 封面图片管理Hook
 * 处理图片的上传、获取和删除
 */
export function useCoverImage(articleId?: string) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previousImageUrl, setPreviousImageUrl] = useState<string>("");

  /**
   * 从URL中提取文件路径
   */
  const extractImagePath = useCallback(
    (imageUrlToProcess: string): string | null => {
      const imagePathMatch = imageUrlToProcess.match(/\/articles\/.*?(?:\?|$)/);
      if (!imagePathMatch) return null;

      const imagePath = imagePathMatch[0].replace(/\?.*$/, "");
      return imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    },
    []
  );

  /**
   * 删除图片
   */
  const deleteImage = useCallback(
    async (imageUrlToDelete: string) => {
      if (!imageUrlToDelete) return;

      const imagePath = extractImagePath(imageUrlToDelete);
      if (!imagePath) return;

      try {
        const response = await fetch("/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: imagePath }),
        });

        if (response.ok) {
          console.log("已删除旧图片");
          return true;
        }
        return false;
      } catch (error) {
        console.error("删除图片失败:", error);
        return false;
      }
    },
    [extractImagePath]
  );

  /**
   * 更新文章封面图片
   */
  const updateArticleCover = useCallback(
    async (url: string) => {
      if (!articleId) return;

      try {
        // 如果 url 为空，使用 DELETE 方法删除封面
        if (url === "") {
          const response = await fetch(`/api/articles/${articleId}/cover`, {
            method: "DELETE",
          });

          if (response.ok || response.status === 404) {
            return;
          }
        } else {
          // 否则使用 POST 方法更新封面
          const response = await fetch(`/api/articles/${articleId}/cover`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          });

          if (!response.ok) {
            let errorMessage = `更新文章封面失败 (${response.status})`;

            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) {
              const errorData = await response.json().catch(() => ({}));
              if (errorData.message) {
                errorMessage = errorData.message;
              }
            }

            throw new Error(errorMessage);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("更新文章封面时发生错误");
      }
    },
    [articleId]
  );

  /**
   * 获取文章封面图片
   */
  const fetchArticleCoverImage = useCallback(async () => {
    if (!articleId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/articles/${articleId}/cover`);
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          setImageUrl(data.url);
        }
      }
    } catch (error) {
      console.error("获取文章封面图片失败:", error);
    } finally {
      setIsLoading(false);
    }
  }, [articleId]);

  // 当组件加载或文章ID变化时，尝试获取封面图片
  useEffect(() => {
    if (articleId) {
      fetchArticleCoverImage();
    }
  }, [articleId, fetchArticleCoverImage]);

  // 当imageUrl变化时，记录前一个URL以便稍后清理
  useEffect(() => {
    if (imageUrl && imageUrl !== previousImageUrl) {
      setPreviousImageUrl(imageUrl);
    }

    // 组件卸载时清理图片
    return () => {
      if (previousImageUrl && previousImageUrl !== imageUrl) {
        deleteImage(previousImageUrl);
      }
    };
  }, [imageUrl, previousImageUrl, deleteImage]);

  /**
   * 上传图片
   */
  const uploadImage = useCallback(
    async (file: File) => {
      if (!file || !file.type.startsWith("image/")) {
        throw new Error("请选择图片文件");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("图片大小不能超过5MB");
      }

      setIsUploading(true);
      setUploadProgress(0);

      // 记录原始图片URL以便后续删除
      const originalImageUrl = imageUrl;

      try {
        // 创建FormData对象
        const formData = new FormData();
        formData.append("file", file);
        if (articleId) {
          formData.append("articleId", articleId);
        }

        // 模拟上传进度
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 300);

        // 上传图片
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        // 清除进度模拟
        clearInterval(progressInterval);

        // 解析响应数据
        let responseData;
        try {
          responseData = await response.json();
        } catch (e) {
          console.error("解析响应数据失败:", e);
          throw new Error("无法解析服务器响应");
        }

        // 检查响应状态
        if (!response.ok) {
          throw new Error(
            responseData?.error ||
              responseData?.details ||
              "上传失败，请稍后重试"
          );
        }

        // 设置上传完成
        setUploadProgress(100);

        // 更新图片URL并删除旧图片
        return new Promise<string>((resolve) => {
          setTimeout(async () => {
            const newUrl = responseData.url;
            setImageUrl(newUrl);
            setIsUploading(false);

            // 更新文章封面图片
            await updateArticleCover(newUrl);

            // 如果有原始图片，尝试删除
            if (originalImageUrl && originalImageUrl !== newUrl) {
              await deleteImage(originalImageUrl);
            }

            resolve(newUrl);
          }, 500);
        });
      } catch (error) {
        setUploadProgress(0);
        setIsUploading(false);
        throw error;
      }
    },
    [imageUrl, articleId, deleteImage, updateArticleCover]
  );

  /**
   * 移除封面图片
   */
  const removeImage = useCallback(async () => {
    if (imageUrl) {
      setIsDeleting(true);
      try {
        // 先清除文章封面图片
        await updateArticleCover("");
        // 再删除存储中的图片
        await deleteImage(imageUrl);
      } catch (error) {
        console.error("删除封面图片失败:", error);
        throw error;
      } finally {
        setIsDeleting(false);
      }
    }

    setImageUrl("");
  }, [imageUrl, deleteImage, updateArticleCover]);

  return {
    imageUrl,
    isUploading,
    isLoading,
    isDeleting,
    uploadProgress,
    uploadImage,
    removeImage,
    setImageUrl,
  };
}
