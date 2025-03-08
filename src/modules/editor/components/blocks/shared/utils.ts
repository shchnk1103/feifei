import { ImageMetadata } from "./types";

export const validateImageSize = ({
  width,
  height,
}: Partial<ImageMetadata>) => ({
  width: width || 800,
  height: height || 600,
});

export const getImageAlt = (content: string, fallback: string) =>
  content || fallback;

export const truncateText = (text: string, maxLength: number = 100) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
