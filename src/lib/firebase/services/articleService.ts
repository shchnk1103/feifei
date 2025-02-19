// import { db } from "../config";
// import {
//   collection,
//   getDocs,
//   getDoc,
//   doc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   query,
//   where,
//   orderBy,
//   serverTimestamp,
// } from "firebase/firestore";
// import { Article } from "@/types/blog";

// const COLLECTION_NAME = "articles";

// export const articleService = {
//   // 获取所有文章
//   async getAllArticles() {
//     const snapshot = await getDocs(
//       query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
//     );
//     return snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as Article[];
//   },

//   // 获取单篇文章
//   async getArticle(id: string) {
//     const docRef = doc(db, COLLECTION_NAME, id);
//     const snapshot = await getDoc(docRef);
//     if (!snapshot.exists()) return null;
//     return { id: snapshot.id, ...snapshot.data() } as Article;
//   },

//   // 创建文章
//   async createArticle(authorId: string): Promise<string> {
//     const newArticle = {
//       title: "未命名文章",
//       description: "暂无描述",
//       author: authorId,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//       content: {
//         blocks: [],
//       },
//       published: false,
//       tags: [],
//       imageSrc: "",
//     };

//     const docRef = await addDoc(collection(db, "articles"), newArticle);
//     return docRef.id;
//   },

//   // 更新文章
//   async updateArticle(id: string, article: Partial<Article>) {
//     const docRef = doc(db, COLLECTION_NAME, id);
//     await updateDoc(docRef, article);
//   },

//   // 删除文章
//   async deleteArticle(id: string) {
//     const docRef = doc(db, COLLECTION_NAME, id);
//     await deleteDoc(docRef);
//   },
// };
