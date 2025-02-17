"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { ImageAsset } from "@/types/image";
import styles from "./styles.module.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface CarouselProps {
  images: ImageAsset[];
  autoplay?: boolean;
  interval?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  effect?: "slide" | "fade";
  height?: string;
}

export function Carousel({
  images,
  autoplay = true,
  interval = 5000,
  showNavigation = true,
  showPagination = true,
  effect = "slide",
  height = "600px",
}: CarouselProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  if (!images?.length) return null;

  return (
    <div className={styles.carouselContainer} style={{ height }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect={effect}
        autoplay={
          autoplay
            ? {
                delay: interval,
                disableOnInteraction: false,
              }
            : false
        }
        navigation={showNavigation}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        className={styles.swiper}
      >
        <AnimatePresence mode="wait">
          {images.map((image, index) => (
            <SwiperSlide key={index} className={styles.slide}>
              <motion.div
                className={styles.slideWrapper}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: loadedImages.has(index) ? 1 : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {mounted && (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1920}
                    height={1080}
                    priority={index === 0}
                    quality={90}
                    className={styles.image}
                    onLoad={() => handleImageLoad(index)}
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                    sizes="100vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}
              </motion.div>
            </SwiperSlide>
          ))}
        </AnimatePresence>
      </Swiper>
    </div>
  );
}
