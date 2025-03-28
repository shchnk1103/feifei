"use client";

import { Carousel } from "@/shared";
import { Article } from "@/modules/blog/types/blog";
import { ArticleCard } from "@/modules/blog/components/ArticleCard";
import { motion } from "framer-motion";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { ImageAsset } from "@/shared";
import { Button } from "@/shared/components/ui/Button";

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
    <div className="home-page">
      <section className="home-hero">
        <Carousel
          images={images}
          autoplay={true}
          interval={8000}
          showNavigation={false}
          showPagination={false}
          effect="coverflow"
          height="80vh"
          borderRadius="16px"
          coverflowRotate={35}
          coverflowDepth={180}
          coverflowStretch={0}
          coverflowModifier={1.2}
          coverflowSlidesPerView={1.8}
          objectFit="cover"
          className="home-carousel"
        />
      </section>

      <section className="home-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <header className="home-header">
            <div className="home-header-text">
              <h2 className="home-title">{title}</h2>
              <p className="home-subtitle">{subtitle}</p>
            </div>

            {/* 使用userIsAdmin变量检查权限 */}
            {user && userIsAdmin && (
              <Button
                onClick={handleCreateArticle}
                variant="primary"
                size="medium"
                className="home-create-button"
              >
                创建文章
              </Button>
            )}
          </header>

          {/* 文章列表 */}
          <div className="home-grid">
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
              <p className="home-no-articles">暂无文章</p>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
