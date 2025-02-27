"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ListItem } from "./components/ListItem";
import styles from "./styles.module.css";
import { Article } from "@/types/blog";
import { useRouter } from "next/navigation";

interface ListSectionProps {
  title: string;
  subtitle: string;
  articles: Article[];
}

export function ListSection({
  title,
  subtitle,
  articles = [],
}: ListSectionProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleCreateArticle = () => {
    // 在测试阶段，简单地跳转到新文章创建页面
    router.push("/editor/new");
  };

  return (
    <section className={styles.section}>
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
          {user && (
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

        <div className={styles.grid}>
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ListItem article={article} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
