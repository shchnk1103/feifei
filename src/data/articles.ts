export type Article = {
  id: number;
  imageSrc: string;
  title: string;
  description: string;
  articleContent: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
};

export const articles: Article[] = [
  {
    id: 1,
    imageSrc: "/images/list_img_0.jpeg",
    title: "第一次一起滑雪",
    description: "浪漫的滑雪之旅",
    articleContent: `
这是一篇测试用的长文章。本文主要用于测试页面的滚动效果以及文本显示效果。首先，我们介绍一些关于前端开发的技术要点。在当今的开发领域，React、Next.js 和 TypeScript 等技术被广泛应用于构建现代化的 Web 应用程序。开发人员需要具备扎实的 JavaScript 基础，同时不断学习新技术以提升效率。

接下来，我们讨论用户体验的重要性。优秀的用户体验设计不仅可以提升应用的易用性，还能吸引更多用户。设计师和开发者必须紧密合作，共同打造出符合用户需求的产品。多种前沿技术的结合使得页面动画、布局以及响应式设计变得更加流畅和富有创意。

此外，我们还探讨了项目结构和代码管理的重要性。在大型应用开发中，合理的项目结构可以帮助团队高效协作，同时保证代码的可维护性和可扩展性。版本控制工具如 Git 以及 CI/CD 流程的引入能够有效降低开发中的错误率，并提升项目发布效率。

在安全性方面，随着网络攻击方式的不断演变，前端安全实践也必须与时俱进。包括 XSS、CSRF 等常见攻击防护措施，以及对用户数据的加密存储和传输，都成为必须关注的重要议题。开发者需要从源头上防范和减少潜在安全风险。

最后，测试工作也是不可忽视的一环。从单元测试到集成测试，再到端到端测试，全面覆盖的测试策略能够确保产品在各种使用场景下的稳定运行。持续集成和自动化测试能够及时发现和修正问题，使得产品更加健壮。总之，技术的不断创新伴随着开发者的持续努力，共同推动着整个行业的进步。

这篇文章旨在为开发调试界面提供足够多的内容，以便观察滚动、动画与响应式布局的效果。请根据实际测试需求调整和扩展文本内容，以达到最佳的展示效果。
    `,
    author: "Alice",
    createdAt: "2025-02-01",
    updatedAt: "2025-02-10",
    tags: ["滑雪", "旅行", "浪漫"],
  },
  {
    id: 2,
    imageSrc: "/images/article2.jpg",
    title: "冬日温泉",
    description: "温暖舒适的温泉体验",
    articleContent:
      "Suspendisse potenti. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.",
    author: "Bob",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-20",
    tags: ["温泉", "休闲"],
  },
  {
    id: 3,
    imageSrc: "/images/article3.jpg",
    title: "山间湖泊",
    description: "宁静致远的湖畔景色",
    articleContent:
      "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Duis ac turpis.",
    author: "Catherine",
    createdAt: "2025-02-05",
    updatedAt: "2025-02-06",
    tags: ["湖泊", "自然", "旅行"],
  },
];
