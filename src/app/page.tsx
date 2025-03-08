"use client";

import { Carousel } from "@/shared";
import { ListSection } from "@/modules/blog/components/ListSection";
import styles from "./page.module.css";
import { articles } from "@/data/articles";
import type { ImageAsset } from "@/shared";

const images: ImageAsset[] = [
  {
    src: "/images/Home-0.jpeg",
    alt: "图片1",
    width: 1920,
    height: 1080,
    blurDataURL: "data:image/jpeg;base64,/9j...", // 可以使用工具生成
  },
  {
    src: "/images/Home-1.jpeg",
    alt: "图片2",
    width: 1920,
    height: 1080,
    blurDataURL: "data:image/jpeg;base64,/9j...",
  },
  {
    src: "/images/Home-2.jpeg",
    alt: "图片3",
    width: 1920,
    height: 1080,
    blurDataURL: "data:image/jpeg;base64,/9j...",
  },
];

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.hero}>
        <Carousel
          images={images}
          autoplay={true}
          interval={5000}
          showNavigation={true}
          showPagination={true}
          effect="fade"
          height="100vh"
        />
      </section>

      <section className={styles.content}>
        <ListSection
          title="最新文章"
          subtitle="发现更多精彩内容"
          articles={articles}
        />
      </section>
    </div>
  );
}
