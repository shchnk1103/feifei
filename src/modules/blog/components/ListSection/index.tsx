"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ListItem } from "./components/ListItem";
import styles from "./styles.module.css";
import { Article } from "@/modules/blog/types/blog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

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
  const { user, isAdmin: contextIsAdmin } = useAuth(); // 重命名以避免冲突
  const [isAdminUser, setIsAdminUser] = useState(false);

  // 添加备份检查机制，以防 context 中的 isAdmin 不正确
  useEffect(() => {
    if (user) {
      const checkAdminStatus = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setIsAdminUser(userData.role === "admin");
            console.log("直接检查结果 - 用户角色:", userData.role);
          }
        } catch (error) {
          console.error("检查管理员状态失败:", error);
        }
      };

      checkAdminStatus();
    } else {
      setIsAdminUser(false);
    }
  }, [user]);

  // 使用 context 中的值或直接检查的结果
  const isAdmin = contextIsAdmin || isAdminUser;

  // 添加调试输出
  console.log("ListSection - user:", user?.uid);
  console.log("ListSection - contextIsAdmin:", contextIsAdmin);
  console.log("ListSection - isAdminUser:", isAdminUser);
  console.log("ListSection - isAdmin (combined):", isAdmin);

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
