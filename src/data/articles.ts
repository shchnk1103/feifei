import { Article, ArticleStatus, ArticleVisibility } from "@/types/blog";

export const articles: Article[] = [
  {
    id: "1",
    slug: "first-ski-trip",
    imageSrc: "/images/list_img_0.jpeg",
    title: "第一次一起滑雪",
    description: "浪漫的滑雪之旅",
    articleContent: {
      blocks: [
        {
          id: "1",
          type: "quote" as const,
          content:
            "生活中最美好的事物都是免费的：拥抱、微笑、朋友、亲吻、家人、睡眠、爱、笑声和美好的回忆。",
          metadata: {
            author: "爱因斯坦",
            source: "人生箴言",
          },
        },
        {
          id: "2",
          type: "heading" as const,
          content: "属于我们的初次滑雪",
          level: 2,
        },
        {
          id: "3",
          type: "text" as const,
          content:
            "虽然我们刚认识不久，但是我们还是依然决定一起去滑雪。说实话，在我说出要跟你一起去滑雪的时候还是十分紧张的，毕竟我们还没有到那么的熟悉，但我还是想要跟你去做一些有意义的事情，幸好，你没有拒绝我。",
        },
        {
          id: "4",
          type: "heading",
          content: "出发",
          level: 2,
        },
        {
          id: "5",
          type: "text",
          content:
            "当时的我还是一个无业游民，有着充足的时间。于是，我便早早的就到了，在我的记忆中，我还在短时间里就跟名宿的老板混得熟络了起来。他跟我谈天说地，但我是一个i人，搭不上几句话，当时我的心里十分的希望你可以早点到来。",
        },
        {
          id: "6",
          type: "image",
          content: "滑雪照片",
          metadata: {
            imageUrl: "/images/beauty_0.jpeg",
            description: "美丽的女孩",
          },
        },
        {
          id: "7",
          type: "heading",
          content: "难忘的滑雪",
          level: 2,
        },
        {
          id: "8",
          type: "text",
          content:
            "看着你笨拙的穿上滑雪道具，我当时心里觉得你可爱极了！为什么世界上会有你这么可爱的女孩子呢，我当时就暗暗发誓，一定要把你追到手。然后我们就在雪地上摸爬滚打，虽然这个词用的可能不是那么贴切，但是我们当时确实是非常的狼狈。不经意间，我有牵着你的手，那一瞬间，我觉得时间好像暂停了，只有我的心脏还在跳动，扑通扑通，声音是那么的清晰，那么的响亮。甚至隔着滑雪服，混杂着其他人的尖叫声，我也害怕被你听到。不知道你当时有没有听到呢。",
        },
        {
          id: "9",
          type: "image",
          content: "滑雪照片",
          metadata: {
            imageUrl: "/images/beauty_1.jpeg",
            description: "喂小猪的小猪",
          },
        },
        {
          id: "10",
          type: "heading",
          content: "尾声",
          level: 2,
        },
        {
          id: "11",
          type: "text",
          content:
            "就在第二天，你送给了我你亲手做的饼干，我想其中肯定蕴藏着你的某种特殊的感情吧，毕竟，在我看来，我们也是十分的暧昧。之后，我们继续驾车去了另外的地方，你在喂小动物，而我的眼神只停留在了你的身上，我想此刻就是爱情吧。虽然我们的滑雪之旅只有短短的两天，但是我却记忆犹新。我想，这两天对于你来说也是一个特别的日子吧。我希望我们可以有更多的机会一起去做一些有意义的事情，不知道你愿不愿意呢？",
        },
      ],
      version: 1,
      schema: "1.0.0",
      lastEditedBy: "shchk",
    },
    author: {
      id: "author-1",
      name: "shchk",
      avatar: "/images/avatar.jpg",
    },
    createdAt: new Date("2023-12-23"),
    updatedAt: new Date("2023-12-23"),
    publishedAt: new Date("2023-12-23"),
    status: "published" as ArticleStatus,
    visibility: "public" as ArticleVisibility,
    allowComments: true,
    tags: ["滑雪", "旅行", "浪漫"],
    category: "旅行",
    metadata: {
      wordCount: 500,
      readingTime: 3,
      views: 0,
      likes: 0,
    },
    seoTitle: "第一次一起滑雪 - 浪漫的滑雪之旅",
    seoDescription: "记录我们第一次一起滑雪的美好时光",
  },
  {
    id: "2",
    slug: "disney-adventure",
    imageSrc: "/images/list_img_1.jpeg",
    title: "浪漫的迪士尼",
    description: "迪士尼之旅",
    articleContent: {
      blocks: [
        {
          id: "1",
          type: "quote",
          content: "浪漫有关的事物，都是美好的，而美好的事物，都是值得珍惜的。",
          metadata: {
            author: "shchk",
            source: "人生箴言",
          },
        },
        {
          id: "2",
          type: "heading",
          content: "迪士尼之旅",
          level: 2,
        },
        {
          id: "3",
          type: "text",
          content:
            "迪士尼是一个神奇的地方，这里有着许多的童话故事，有着许多的美好的回忆。我想，每个人都有着一个属于自己的迪士尼梦吧。而属于我的梦，就是和你一起去迪士尼。",
        },
        {
          id: "4",
          type: "heading",
          content: "出发",
          level: 2,
        },
        {
          id: "5",
          type: "text",
          content:
            "那天，是你下了班赶到了嘉兴，我第一次在嘉兴南站接到了你，远远地看到一个拖着黄色行李箱的女孩，我就知道那个人一定是你。我当时心里的感觉是十分的复杂，我不知道你是不是也有同样的感觉。内心带着些许紧张，又带着些许尴尬，但我还是鼓起勇气，走到了你的面前跟你搭了话。我们一起去吃了海底捞，不知道是因为很久没有和女孩接触了还是怎么的，我十分的紧张，我不知道我该怎么半，这时候房间都还没有订呢！鬼使神差之下，我就订了一间房。",
        },
        {
          id: "6",
          type: "image",
          content: "迪士尼照片",
          metadata: {
            imageUrl: "/images/beauty_2.jpeg",
            description: "吃饱了的小笨蛋",
          },
        },
        {
          id: "7",
          type: "heading",
          content: "正式开始梦幻之旅",
          level: 2,
        },
        {
          id: "8",
          type: "text",
          content:
            "即使前一晚的事情有点尴尬，但我们默契的选择都没有提起，经历过了短暂的尴尬之后，我们就开始了我们的迪士尼之旅。从检票口，我们就开始了打打闹闹，你不让我看你的身份证，也让我更加好奇了。不管是排队还是玩游戏，我们都可以聊的非常开心，这是我第一次来迪士尼，更是我第一次玩穿越地平线，逼真的显示技术，让我紧张到了爆炸，但是我还是想要给你留下一个好印象，所以我还是有了一点点假装自己不害怕的样子。",
        },
        {
          id: "9",
          type: "image",
          content: "迪士尼照片",
          metadata: {
            imageUrl: "/images/beauty_3.jpeg",
            description: "小矮人",
          },
        },
        {
          id: "10",
          type: "heading",
          content: "被发现了！",
          level: 2,
        },
        {
          id: "11",
          type: "text",
          content:
            "在小矮人矿车的时候，终于，我还是没有忍住，也许是发出了一点点的尖叫声（据你所说，我是觉得自己没有发出声音的），但还是被你敏锐地捕捉到了，你开始嘲笑我，但你嘲笑我的时候也还是那么可爱。之后，我们看了巡游，拍了照，吃了饭，我们的相处一直都是融洽的，我想，这正是爱情中最美好的时光吧，我们两的小心翼翼也正是在给我们的爱情做铺垫，属于我们的红毯，正在缓缓展开。",
        },
        {
          id: "12",
          type: "image",
          content: "帅哥",
          metadata: {
            imageUrl: "/images/handsome_0.jpeg",
            description: "帅哥",
          },
        },
        {
          id: "13",
          type: "heading",
          content: "被我发现了！",
          level: 2,
        },
        {
          id: "14",
          type: "text",
          content:
            "被我发现了吧，有些人这么美丽，但终归不是十全十美的人。有人的拍照技术，简直是可以用不忍直视来形容，但是这也是你的可爱之处吧。我们拍下了属于我们两的合照，记录下了这梦幻般的一天。",
        },
        {
          id: "15",
          type: "heading",
          content: "尾声",
          level: 2,
        },
        {
          id: "16",
          type: "text",
          content:
            "即使我有过想要表白的心，但是我总觉得不是最好的时机，所以还是隐藏了下来。这一天，我感觉我走过了我人生中最漫长的路，时间过得像是坐上了时光机，希望以后还能跟你一起，拥有美好的每一天！",
        },
      ],
      version: 1,
      schema: "1.0.0",
      lastEditedBy: "shchk",
    },
    author: {
      id: "author-1",
      name: "shchk",
      avatar: "/images/avatar.jpg",
    },
    createdAt: new Date("2023-09-23"),
    updatedAt: new Date("2023-09-23"),
    publishedAt: new Date("2023-09-23"),
    status: "published" as ArticleStatus,
    visibility: "public" as ArticleVisibility,
    allowComments: true,
    tags: ["迪士尼", "旅行", "浪漫"],
    category: "旅行",
    metadata: {
      wordCount: 500,
      readingTime: 3,
      views: 0,
      likes: 0,
    },
    seoTitle: "浪漫的迪士尼 - 迪士尼之旅",
    seoDescription: "记录我们浪漫的迪士尼之旅",
  },
  {
    id: "3",
    slug: "glad-you-exist",
    imageSrc: "/images/list_img_2.jpeg",
    title: "Glad you exsit!",
    description: "我们在一起啦！",
    articleContent: {
      blocks: [
        {
          id: "1",
          type: "quote",
          content: "爱情至死不渝",
          metadata: {
            author: "shchk",
            source: "人生箴言",
          },
        },
        {
          id: "2",
          type: "heading",
          content: "紧张的表白日",
          level: 2,
        },
        {
          id: "3",
          type: "text",
          content:
            "不知不觉，我们迎来了我们的第一个跨年日。我细数着后面的日子，好像没有比这一天更合适表白的了，于是我做了很多的准备，就只是想要给你一个完美的表白。",
        },
        {
          id: "4",
          type: "image",
          content: "准备",
          metadata: {
            imageUrl: "/images/handsome_1.png",
            description: "准备的清单🧾",
          },
        },
        {
          id: "5",
          type: "heading",
          content: "一天的开始",
          level: 2,
        },
        {
          id: "6",
          type: "text",
          content:
            "早上，我醒的甚至比闹钟还要早，我立刻赶去了我找了半天的花店，我想要预定一束这一天最美丽的花，万幸的是，今天没有因为是特殊的日子而被订购完。",
        },
        {
          id: "7",
          type: "heading",
          content: "表白道阻且长",
          level: 2,
        },
        {
          id: "8",
          type: "text",
          content:
            "我本来以为自己的安排是天衣无缝，但是结果发现你可能对于咖啡不是多么的热衷，对于美术馆也不是多么的热衷。下午虽然在咖啡馆里我们聊了很久，但是我的心里一直都在预演晚上的一切，我紧张，我不知道该跟你说什么，也听不到你在讲什么。时间过的又快又慢的，纳得美术馆没有小红书上所说的那么好逛，我们逛的过程中，虽然也是有说有笑，但地方有限，我们也很快就逛完了。",
        },
        {
          id: "9",
          type: "image",
          content: "咖啡馆的美女",
          metadata: {
            imageUrl: "/images/beauty_4.jpeg",
            description: "咖啡馆的美女",
          },
        },
        {
          id: "10",
          type: "heading",
          content: "好吃又尴尬的晚餐",
          level: 2,
        },
        {
          id: "11",
          type: "text",
          content:
            "晚餐的餐厅氛围，其实我是很满意的，有了一丝节日的氛围，吃的也十分好吃。但是最主要的是在这个时候，你最好的朋友来跟你打招呼了，我！真的！很想找个地缝钻进去，因为我的心中本来就是在一直盘算着怎么表白，这时候还有陌生人来看我，我害怕我入不了你朋友的法眼，害怕她对我做出不好的评价，害怕失去跟你再在一起的机会。",
        },
        {
          id: "12",
          type: "image",
          content: "表白",
          metadata: {
            imageUrl: "/images/love.jpeg",
            description: "表白",
          },
        },
        {
          id: "13",
          type: "heading",
          content: "我们在一起啦！",
          level: 2,
        },
        {
          id: "14",
          type: "text",
          content:
            "看电影的时候，虽然觉得这是一部烂片，但是能在人满为患的电影院里，在放映结束的那一刻，在灯光重新亮起的那一刻，拉着你的手表白，我都不敢想会有多浪漫。所以，这一切永远的存在于我的脑海中了，因为这个瞬间我怂了，我不敢了，我想到了我所有的后顾之忧。在送你回家的路上，我甚至说不出一句完整的话语，但我又觉得再不说就没有机会说了。于是，我一咬牙就想你表白了。我诉说了我的全部，你默默地听着。在得到了你说你愿意这三个字之后，我甚至激动到有些抽泣。真好，我们终于在一起了！",
        },
        {
          id: "15",
          type: "image",
          content: "就让我做个死",
          metadata: {
            imageUrl: "/images/beauty_5.jpeg",
            description: "就让我做个死",
          },
        },
        {
          id: "16",
          type: "heading",
          content: "尾声",
          level: 2,
        },
        {
          id: "17",
          type: "text",
          content:
            "感谢与你的相遇，我会好好与你走下去，希望几十年之后回首我们的今天，我们一直都是幸福的！",
        },
      ],
      version: 1,
      schema: "1.0.0",
      lastEditedBy: "shchk",
    },
    author: {
      id: "author-1",
      name: "shchk",
      avatar: "/images/avatar.jpg",
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    publishedAt: new Date("2024-01-01"),
    status: "published" as ArticleStatus,
    visibility: "public" as ArticleVisibility,
    allowComments: true,
    tags: ["跨年", "电影", "浪漫"],
    category: "旅行",
    metadata: {
      wordCount: 500,
      readingTime: 3,
      views: 0,
      likes: 0,
    },
    seoTitle: "Glad you exsit! - 我们在一起啦！",
    seoDescription: "记录我们在一起的美好时光",
  },
];

export type { Article };
