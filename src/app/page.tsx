import { Suspense } from "react";
import { HomeClient } from "@/modules/home/components/HomeClient";
import { articles as staticArticlesData } from "@/data/articles";
import { mergeArticles } from "@/modules/blog/services/articleService";
import styles from "./page.module.css";
import type { ImageAsset } from "@/shared";

// 轮播图片数据
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

export default async function Home() {
  // 在服务器端获取文章数据
  let dbArticles = [];

  try {
    // 从API获取数据库文章
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/articles?status=published&visibility=public`,
      {
        next: { revalidate: 60 }, // 60秒缓存
      }
    );

    if (response.ok) {
      const data = await response.json();
      dbArticles = data.articles || [];
    }
  } catch (error) {
    console.error("获取文章失败:", error);
  }

  // 合并静态文章和数据库文章
  const articles = mergeArticles(staticArticlesData, dbArticles);

  return (
    <Suspense fallback={<div className={styles.loading}>正在加载内容...</div>}>
      <HomeClient
        images={images}
        articles={articles}
        title="最新文章"
        subtitle="发现更多精彩内容"
      />
    </Suspense>
  );
}
