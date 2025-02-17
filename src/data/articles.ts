import { Article as ArticleType } from "@/types/blog";

// Remove the local Article type definition since we're importing it
export const articles: ArticleType[] = [
  {
    id: 1,
    imageSrc: "/images/list_img_0.jpeg",
    title: "第一次一起滑雪",
    description: "浪漫的滑雪之旅",
    articleContent: {
      blocks: [
        {
          id: "1",
          type: "heading" as const,
          content: "标题文本",
          level: 2,
        },
        {
          id: "2",
          type: "text" as const,
          content:
            "这是一篇测试用的长文章。本文主要用于测试页面的滚动效果以及文本显示效果。",
        },
        {
          id: "3",
          type: "heading",
          content: "技术要点",
          level: 2,
        },
        {
          id: "4",
          type: "text",
          content:
            "在当今的开发领域，React、Next.js 和 TypeScript 等技术被广泛应用于构建现代化的 Web 应用程序。开发人员需要具备扎实的 JavaScript 基础，同时不断学习新技术以提升效率。",
        },
        {
          id: "5",
          type: "image",
          content: "滑雪照片",
          metadata: {
            imageUrl: "/images/list_img_0.jpeg",
            description: "美丽的滑雪场景",
          },
        },
        {
          id: "6",
          type: "link",
          content: "查看我的 GitHub 主页",
          metadata: {
            url: "https://github.com/doubleshy0n",
            imageUrl:
              "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            description: "欢迎访问我的 GitHub 主页，了解更多项目细节",
          },
        },
        {
          id: "7",
          type: "music",
          content: "亚麻色头发的少女", // 将作为主标题显示
          metadata: {
            musicUrl:
              "https://upload.wikimedia.org/wikipedia/commons/8/84/Claude_Debussy_-_The_Maid_with_the_Flaxen_Hair.ogg",
            artist: "德彪西 (Claude Debussy)", // 艺术家名称
            albumName: "钢琴前奏曲集 (Préludes)", // 专辑名称
            coverUrl:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Claude_Debussy_ca_1908%2C_foto_av_F%C3%A9lix_Nadar.jpg/800px-Claude_Debussy_ca_1908%2C_foto_av_F%C3%A9lix_Nadar.jpg",
            description:
              "德彪西最著名的钢琴小品之一，创作于1910年，描绘了一个温柔梦幻的场景。", // 音乐描述
          },
        },
        {
          id: "8",
          type: "quote" as const,
          content:
            "生活中最美好的事物都是免费的：拥抱、微笑、朋友、亲吻、家人、睡眠、爱、笑声和美好的回忆。",
          metadata: {
            author: "爱因斯坦",
            source: "人生箴言",
          },
        },
      ],
    },
    author: "shchk",
    createdAt: "2025-02-01",
    tags: ["滑雪", "旅行", "浪漫"],
  },
];
