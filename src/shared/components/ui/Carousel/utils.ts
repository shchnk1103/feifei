import { ImageAsset } from "@/shared/types/image";
import { CoverflowEffectParams } from "./types";
import type { SwiperOptions } from "swiper/types";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  EffectCoverflow,
  Mousewheel,
} from "swiper/modules";

/**
 * 创建Swiper参数配置
 */
export const createSwiperParams = (
  originalImages: ImageAsset[],
  options: {
    effect: string;
    slidesPerView: number;
    autoplay: boolean;
    interval: number;
    showNavigation: boolean;
    showPagination: boolean;
    coverflowParams: CoverflowEffectParams;
    transitionSpeed: number;
  }
): SwiperOptions => {
  // 确定是否启用循环模式 - 图片至少3张才能启用
  const hasEnoughSlides = originalImages.length >= 3;

  // 调整slidesPerView值，避免超过可用图片数量
  let finalSlidesPerView = options.slidesPerView;
  if (options.effect === "coverflow") {
    // coverflow效果需要特殊处理slidesPerView
    finalSlidesPerView = hasEnoughSlides
      ? Math.min(options.slidesPerView, originalImages.length - 1)
      : 1;
  } else {
    // 非coverflow效果时使用1
    finalSlidesPerView = 1;
  }

  // 基础Swiper参数
  const baseParams: SwiperOptions = {
    modules: [
      Navigation,
      Pagination,
      Autoplay,
      EffectFade,
      EffectCoverflow,
      Mousewheel,
    ],
    speed: options.transitionSpeed,
    spaceBetween: options.effect === "coverflow" ? -10 : 30,
    slidesPerView: finalSlidesPerView,
    centeredSlides: true,
    effect: options.effect,
    grabCursor: options.effect === "coverflow",
    autoplay: options.autoplay
      ? {
          delay: options.interval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }
      : false,
    navigation: options.showNavigation,
    pagination: options.showPagination
      ? {
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }
      : false,
    mousewheel: {
      forceToAxis: true,
      sensitivity: 1,
      releaseOnEdges: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    observer: true,
    observeParents: true,
    watchSlidesProgress: true,
  };

  // 特效配置
  if (options.effect === "coverflow") {
    baseParams.coverflowEffect = options.coverflowParams;
  }

  // 只有当幻灯片数量足够时才启用循环模式
  if (hasEnoughSlides) {
    return {
      ...baseParams,
      loop: true,
      loopPreventsSliding: false,
      loopAdditionalSlides: originalImages.length,
      rewind: false,
      allowSlidePrev: true,
      allowSlideNext: true,
      speed: Math.min(options.transitionSpeed, 400),
    };
  }

  // 幻灯片数量不足时，禁用循环模式
  return {
    ...baseParams,
    loop: false,
  };
};

/**
 * 根据图片数量计算最佳的Coverflow效果参数
 */
export const calculateCoverflowParams = (
  originalImagesCount: number,
  options: {
    coverflowRotate: number;
    coverflowDepth: number;
    coverflowStretch: number;
    coverflowModifier: number;
  }
): CoverflowEffectParams => {
  const baseParams: CoverflowEffectParams = {
    rotate: options.coverflowRotate,
    stretch: options.coverflowStretch,
    depth: options.coverflowDepth,
    modifier: options.coverflowModifier,
    slideShadows: true,
  };

  // 如果原始图片数量较少，调整参数
  if (originalImagesCount < 5) {
    return {
      ...baseParams,
      rotate: options.coverflowRotate * 0.7,
      depth: options.coverflowDepth * 0.7,
    };
  }

  return baseParams;
};

/**
 * 确保图片数量足够进行循环播放，并且优化循环顺序
 * 采用更均匀的复制策略，确保向前和向后切换都流畅
 */
export const ensureSufficientImages = (
  images: ImageAsset[],
  minCount: number
): ImageAsset[] => {
  if (!images?.length) return [];

  // 如果图片数量已经足够，直接返回原始数组
  if (images.length >= minCount) return [...images];

  // 计算需要复制的次数
  const repeatCount = Math.ceil(minCount / images.length);

  // 创建均匀分布的数组
  // 策略：前半部分放置images复制，中间放置原始images，后半部分再放置images复制
  // 这样能确保无论向前还是向后切换，都能有一致的体验
  let result: ImageAsset[] = [];

  // 添加前置复制 (确保向后切换时的流畅性)
  for (let i = 0; i < Math.floor(repeatCount / 2); i++) {
    result = [...result, ...images];
  }

  // 添加原始图片
  result = [...result, ...images];

  // 添加后置复制 (确保向前切换时的流畅性)
  for (let i = 0; i < Math.ceil(repeatCount / 2); i++) {
    result = [...result, ...images];
  }

  return result;
};
