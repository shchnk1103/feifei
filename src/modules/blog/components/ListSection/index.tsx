import { motion } from "framer-motion";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ListItem } from "./components/ListItem";
import styles from "./styles.module.css";
import { Article } from "@/modules/blog/types/blog";
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
  const { user, isAdmin } = useAuth();

  const handleCreateArticle = () => {
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
          {/* 只有当用户为管理员时才显示创建按钮 */}
          {user && isAdmin && (
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
