import { ImageAsset } from "@/shared/types/image";

export interface CarouselImage {
  src: string;
  alt: string;
  thumbSrc?: string;
}

export interface CarouselProps {
  images: ImageAsset[];
  autoplay?: boolean;
  interval?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  showThumbs?: boolean;
  effect?: "slide" | "fade" | "coverflow";
  height?: string;
  borderRadius?: string;
  coverflowRotate?: number;
  coverflowDepth?: number;
  coverflowStretch?: number;
  coverflowModifier?: number;
  coverflowSlidesPerView?: number;
  objectFit?: "cover" | "contain" | "fill";
  className?: string;
  thumbsPosition?: "bottom" | "right";
}

// coverflow效果参数接口
export interface CoverflowEffectParams {
  rotate: number;
  stretch: number;
  depth: number;
  modifier: number;
  slideShadows: boolean;
}
