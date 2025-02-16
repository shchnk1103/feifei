"use client";

import ListItem from "./ListItem";
import styles from "./ListSection.module.css";
import { articles } from "../data/articles";

export default function ListSection() {
  return (
    <section className={styles.listSection}>
      <div className={styles.listContainer}>
        {articles.map((item) => (
          <ListItem
            key={item.id}
            imageSrc={item.imageSrc}
            title={item.title}
            description={item.description}
            articleContent={item.articleContent}
            author={item.author}
            createdAt={item.createdAt}
            updatedAt={item.updatedAt}
            tags={item.tags}
          />
        ))}
      </div>
    </section>
  );
}
