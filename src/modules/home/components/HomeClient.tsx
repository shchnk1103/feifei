"use client";

import { Carousel } from "@/shared";
import { Article } from "@/modules/blog/types/blog";
import { ArticleCard } from "@/modules/blog/components/ArticleCard";
import { motion } from "framer-motion";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { ImageAsset } from "@/shared";
import styles from "./styles.module.css";

interface HomeClientProps {
  images: ImageAsset[];
  articles: Article[];
  title: string;
  subtitle: string;
}

export function HomeClient({
  images,
  articles,
  title,
  subtitle,
}: HomeClientProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  // 双重检查用户是管理员 - 既检查hook提供的isAdmin，也直接检查用户角色
  const userIsAdmin = isAdmin || (user && user.role === "admin");

  const handleCreateArticle = () => {
    router.push("/editor/new");
  };

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
          height="calc(100vh - var(--header-height))"
        />
      </section>

      <section className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <header className={styles.header}>
            <div className={styles.headerText}>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.subtitle}>{subtitle}</p>
            </div>

            {/* 使用userIsAdmin变量检查权限 */}
            {user && userIsAdmin && (
              <motion.button
                className={styles.createButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateArticle}
              >
                创建文章
              </motion.button>
            )}
          </header>

          {/* 文章列表 */}
          <div className={styles.grid}>
            {articles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
            {articles.length === 0 && (
              <p className={styles.noArticles}>暂无文章</p>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
