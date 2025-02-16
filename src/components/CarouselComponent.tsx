"use client";

import React from "react";
// 从 Swiper/react 中引入组件
import { Swiper, SwiperSlide } from "swiper/react";
// 导入 Swiper 样式
import "swiper/css";
import Image from "next/image";

// 引入 CSS 模块（确保在相应目录下创建该文件）
import styles from "./CarouselComponent.module.css";

// 轮播组件
const CarouselComponent = () => {
  return (
    <Swiper
      // 设置幻灯片之间无间隙，每次只显示一张图片
      spaceBetween={0}
      slidesPerView={1}
      // 开启无限循环轮播
      loop={true}
    >
      {/* 第一张幻灯片 */}
      <SwiperSlide>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/Home-0.jpeg"
            alt="图片1"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </SwiperSlide>
      {/* 第二张幻灯片 */}
      <SwiperSlide>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/Home-1.jpeg"
            alt="图片2"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </SwiperSlide>
      {/* 第三张幻灯片 */}
      <SwiperSlide>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/Home-2.jpeg"
            alt="图片3"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default CarouselComponent;
