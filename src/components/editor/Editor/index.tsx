// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Article } from "@/types/article";
// import styles from "./styles.module.css";

// interface EditorProps {
//   article: Article;
// }

// export function Editor({ article }: EditorProps) {
//   const router = useRouter();
//   const [title, setTitle] = useState(article.title);
//   const [description, setDescription] = useState(article.description);
//   const [content, setContent] = useState(article.articleContent);
//   const [tags, setTags] = useState(article.tags);
//   const [published, setPublished] = useState(article.createdAt);
//   const [saving, setSaving] = useState(false);

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const response = await fetch(`/api/articles/${article.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title,
//           description,
//           content,
//           tags,
//           published,
//           updatedAt: new Date().toISOString(),
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to save article");
//     } catch (error) {
//       console.error("Error saving article:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className={styles.editor}>
//       <header className={styles.header}>
//         <div className={styles.titleSection}>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className={styles.titleInput}
//             placeholder="文章标题"
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className={styles.descriptionInput}
//             placeholder="文章描述"
//           />
//           <div className={styles.tagInput}>
//             {/* TODO: Add tag input component */}
//           </div>
//         </div>
//         <div className={styles.actions}>
//           <div className={styles.publishToggle}>
//             <label className={styles.switch}>
//               <input
//                 type="checkbox"
//                 checked={published}
//                 onChange={(e) => setPublished(e.target.checked)}
//               />
//               <span className={styles.slider}></span>
//             </label>
//             <span>{published ? "已发布" : "草稿"}</span>
//           </div>
//           <motion.button
//             className={styles.saveButton}
//             onClick={handleSave}
//             disabled={saving}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             {saving ? "保存中..." : "保存"}
//           </motion.button>
//           <motion.button
//             className={styles.backButton}
//             onClick={() => router.back()}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             返回
//           </motion.button>
//         </div>
//       </header>
//       <div className={styles.editorContent}>
//         {/* TODO: Add content editor component */}
//       </div>
//     </div>
//   );
// }
