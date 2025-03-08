export interface CarouselImage {
  src: string;
  alt: string;
  thumbSrc?: string;
}

export interface CarouselProps {
  images: CarouselImage[];
  autoplay?: boolean;
  interval?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  showThumbs?: boolean;
  effect?: "slide" | "fade" | "cube";
  height?: string;
  thumbsPosition?: "bottom" | "right";
}
