export interface BaseBlockProps {
  className?: string;
  role?: string;
  "aria-label"?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: boolean;
}

export interface ImageMetadata {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}
