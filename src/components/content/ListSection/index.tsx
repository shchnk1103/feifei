"use client";

import { motion } from "framer-motion";
import { ListItem } from "./components/ListItem";
import styles from "./styles.module.css";
import { Article } from "@/types/article";

interface ListSectionProps {
  title: string;
  subtitle: string;
  articles?: Article[];
}

export function ListSection({
  title,
  subtitle,
  articles = [],
}: ListSectionProps) {
  return (
    <section className={styles.section}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
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
