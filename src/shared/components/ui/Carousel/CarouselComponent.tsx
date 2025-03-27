"use client";

import { useState, useEffect, forwardRef, useCallback } from "react";
import { OptimizedImage } from "@/shared/components/ui/OptimizedImage";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import styles from "./styles.module.css";
import { CarouselProps } from "./types";
import { CAROUSEL_CONFIG } from "./constants";
import {
  calculateCoverflowParams,
  createSwiperParams,
  ensureSufficientImages,
} from "./utils";

// 核心轮播组件
export const CarouselComponent = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      images,
      autoplay = true,
      interval = 5000,
      showNavigation = true,
      showPagination = false,
      effect = "slide",
      height = CAROUSEL_CONFIG.DEFAULT_HEIGHT,
      borderRadius = CAROUSEL_CONFIG.DEFAULT_BORDER_RADIUS,
      coverflowRotate = CAROUSEL_CONFIG.DEFAULT_COVERFLOW_ROTATE,
      coverflowDepth = CAROUSEL_CONFIG.DEFAULT_COVERFLOW_DEPTH,
      coverflowStretch = CAROUSEL_CONFIG.DEFAULT_COVERFLOW_STRETCH,
      coverflowModifier = CAROUSEL_CONFIG.DEFAULT_COVERFLOW_MODIFIER,
      coverflowSlidesPerView = CAROUSEL_CONFIG.DEFAULT_COVERFLOW_SLIDES_PER_VIEW,
      objectFit = "cover",
      className = "",
    },
    ref
  ) => {
    // 状态管理
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const [mounted, setMounted] = useState(false);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(
      null
    );
    const [activeIndex, setActiveIndex] = useState(0);

    // 组件挂载和卸载
    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    // 处理图片加载
    const handleImageLoad = (index: number) => {
      setLoadedImages((prev) => new Set([...prev, index]));
    };

    // 处理幻灯片变化 - 使用useCallback记忆化函数
    const handleSlideChange = useCallback(() => {
      if (swiperInstance) {
        setActiveIndex(swiperInstance.realIndex);
      }
    }, [swiperInstance]);

    // 为Swiper设置事件处理
    const handleTouchStart = useCallback(() => {
      if (swiperInstance && autoplay) {
        swiperInstance.autoplay.stop();
      }
    }, [swiperInstance, autoplay]);

    const handleTouchEnd = useCallback(() => {
      if (swiperInstance && autoplay) {
        swiperInstance.autoplay.start();
      }
    }, [swiperInstance, autoplay]);

    // 监听幻灯片变化
    useEffect(() => {
      if (swiperInstance) {
        swiperInstance.on("slideChange", handleSlideChange);

        // 监听从实际循环的最后/最前到复制幻灯片的过渡，确保过渡流畅
        swiperInstance.on("loopFix", () => {
          // 当循环修复发生时，确保平滑过渡
          if (swiperInstance.previousIndex > swiperInstance.activeIndex) {
            // 向后导航时特别处理，确保不跳过
            requestAnimationFrame(() => {
              swiperInstance.slideToLoop(swiperInstance.realIndex, 0, false);
            });
          }
        });

        return () => {
          swiperInstance.off("slideChange", handleSlideChange);
          swiperInstance.off("loopFix");
        };
      }
    }, [swiperInstance, handleSlideChange]);

    // 如果没有图片，不渲染组件
    if (!images?.length) return null;

    // 确保至少有足够的图片用于展示
    const minSlidesNeeded = effect === "coverflow" ? 5 : 3;
    const displayImages = ensureSufficientImages(images, minSlidesNeeded);

    // 计算合适的slidesPerView值
    let slidesPerView = effect === "coverflow" ? coverflowSlidesPerView : 1;

    // 防止slidesPerView过大造成循环模式问题
    if (effect === "coverflow" && images.length > 0) {
      slidesPerView = Math.min(slidesPerView, images.length);
    }

    // 计算coverflow效果参数
    const coverflowParams = calculateCoverflowParams(images.length, {
      coverflowRotate,
      coverflowDepth,
      coverflowStretch,
      coverflowModifier,
    });

    // 创建Swiper参数
    const swiperParams = createSwiperParams(images, {
      // 如果图片数量少于3张且是coverflow效果，降级为slide效果
      effect: images.length < 3 && effect === "coverflow" ? "slide" : effect,
      slidesPerView,
      autoplay,
      interval,
      showNavigation,
      showPagination,
      coverflowParams,
      transitionSpeed: CAROUSEL_CONFIG.TRANSITION_SPEED,
    });

    return (
      <div
        className={`${styles.carouselContainer} ${className}`}
        style={{ height }}
        ref={ref}
      >
        <Swiper
          {...swiperParams}
          className={`${styles.swiper} ${
            effect === "coverflow" ? styles.coverflowSwiper : ""
          }`}
          onSwiper={setSwiperInstance}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {displayImages.map((image, index) => {
            // 计算是否是当前活跃幻灯片或前后相邻的幻灯片
            const isActive = index === activeIndex;
            const isPrev =
              index ===
              (activeIndex - 1 + displayImages.length) % displayImages.length;
            const isNext = index === (activeIndex + 1) % displayImages.length;
            const isVisible = isActive || isPrev || isNext;

            return (
              <SwiperSlide
                key={`slide-${index}`}
                className={`${styles.slide} ${styles.carouselSlide}`}
              >
                <div
                  className={`${styles.slideWrapper} ${
                    effect === "coverflow" ? styles.coverflowSlide : ""
                  } ${isActive ? styles.activeSlide : ""}`}
                  style={{
                    borderRadius,
                    overflow: "hidden",
                  }}
                >
                  {mounted && (
                    <div
                      className={styles.imageContainer}
                      style={{
                        objectFit: objectFit as "cover" | "contain" | "fill",
                      }}
                    >
                      <OptimizedImage
                        src={image.src}
                        alt={image.alt}
                        width={1920}
                        height={1080}
                        priority={index === 0 || isVisible}
                        quality={isVisible ? 95 : 85}
                        className={`${styles.image} ${
                          effect === "coverflow" ? styles.coverflowImage : ""
                        } ${isActive ? styles.activeImage : ""}`}
                        onLoadingComplete={() => handleImageLoad(index)}
                        placeholder="blur"
                        blurDataURL={image.blurDataURL}
                      />
                      {!loadedImages.has(index) && (
                        <div className={styles.swiperLazyPreloader}></div>
                      )}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }
);

CarouselComponent.displayName = "CarouselComponent";
