
import { AlbumType, Photo, TimelineEvent, WeddingSeries } from './types';

// ==========================================
//  配置指南 / Configuration Guide
// ==========================================
// 1. 将您的照片放入 public 文件夹中 (例如 public/photos/family/)
// 2. 将 url 修改为相对路径 (例如 '/photos/family/IMG_001.jpg')
// ==========================================

export const APP_NAME = "时光 · 家书";

const FAMILY_DATA = [
  {
    id: 'v1',
    url: ['https://github.com/AndersonHJB/AndersonHJB.github.io/releases/download/V0.0.4/03-why-code.mp4'],
    mediaType: 'video' as const,
    poster: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200',
    title: '为什么写代码',
    date: '2024.01.01',
    location: '书房',
    description: '通过代码构建世界，这是一种独特的浪漫。记录下敲击键盘的声音和思考的瞬间。',
    tags: ['编程', '生活', '视频'],
  },
  {
    id: 'f1',
    url: [
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200',
      'https://ai.bornforthis.cn/images/P01-%E8%B4%BE%E7%BB%B4%E6%96%AF.png',
      'https://ai.bornforthis.cn/images/P02-ReadyGoDuel.png'
    ], 
    title: '春日野餐',
    date: '2023.04.15',
    location: '奥林匹克森林公园',
    description: '阳光正好的午后，草地有些微微湿润。爸爸带了风筝，虽然最后挂在了树上，但大家的笑声填满了整个下午。',
    tags: ['春游', '野餐', '周末'],
  },
  {
    id: 'f2',
    url: ['https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=1200'],
    title: '海边日落',
    date: '2023.07.20',
    location: '阿那亚',
    description: '海浪的声音很温柔。我们光着脚踩在沙滩上，看着太阳一点点沉入海平面，把天空染成了橘子味的气泡水。',
    tags: ['旅行', '海边', '夏天'],
  },
  {
    id: 'f3',
    url: ['https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1200'],
    title: '除夕夜',
    date: '2024.02.09',
    location: '奶奶家',
    description: '热气腾腾的饺子，窗外的烟花，还有这一年一度的团圆饭。不管世界怎么变，家的味道永远不变。',
    tags: ['春节', '团圆', '美食'],
  },
  {
    id: 'f4',
    url: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200'],
    title: '雨天读书',
    date: '2023.11.05',
    location: '家中书房',
    description: '难得的雨天周末，大家都窝在沙发上。一杯热茶，几本闲书，猫咪在脚边打呼噜。',
    tags: ['日常', '宁静'],
  },
  {
    id: 'f5',
    url: ['https://images.unsplash.com/photo-1476900966801-48610a599696?q=80&w=1200'],
    title: '登山远眺',
    date: '2023.09.10',
    location: '香山',
    description: '虽然爬得气喘吁吁，但登上山顶那一刻，俯瞰整个城市的灯火，一切疲惫都值得了。',
    tags: ['运动', '秋天'],
  },
  {
    id: 'f6',
    url: ['https://images.unsplash.com/photo-1572061489719-798eb488a0b0?q=80&w=1200'],
    title: '游乐园一日游',
    date: '2023.06.01',
    location: '环球影城',
    description: '排了两个小时的队才坐上过山车，虽然尖叫声很大，但下来的那一刻感觉自己是个勇士。',
    tags: ['游乐园', '快乐', '六一'],
  },
  {
    id: 'f7',
    url: ['https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=1200'],
    title: '第一次做烘焙',
    date: '2023.12.24',
    location: '家中厨房',
    description: '烤箱里飘出的黄油香味是圣诞节最好的装饰。虽然姜饼人长得有点奇怪，但味道好极了。',
    tags: ['美食', '圣诞', '尝试'],
  },
  {
    id: 'f8',
    url: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1200'],
    title: '森林露营',
    date: '2023.10.02',
    location: '郊区营地',
    description: '没有信号的周末。我们在篝火旁烤棉花糖，看星星连成线，听虫鸣唱着歌。',
    tags: ['露营', '自然', '秋天'],
  },
  {
    id: 'f9',
    url: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200'],
    title: '生日惊喜',
    date: '2023.03.18',
    location: '家中',
    description: '没想到大家会提前躲在门后。吹灭蜡烛的那一刻，我许愿时光能慢一点，再慢一点。',
    tags: ['生日', '惊喜', '派对'],
  },
  {
    id: 'f10',
    url: ['https://images.unsplash.com/photo-1596464716127-f9a8759fa21d?q=80&w=1200'],
    title: '晨跑打卡',
    date: '2024.04.01',
    location: '河滨公园',
    description: '早起虽然痛苦，但看到清晨的第一缕阳光穿过树叶，呼吸着微凉的空气，感觉世界都清醒了。',
    tags: ['运动', '自律', '春天'],
  },
  {
    id: 'f11',
    url: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200'],
    title: '花园修剪',
    date: '2023.05.05',
    location: '后院',
    description: '手忙脚乱的一下午，把杂草清理干净，种下了新的月季。期待花开的那一天。',
    tags: ['园艺', '劳动', '生活'],
  },
  {
    id: 'f12',
    url: ['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200'],
    title: '好久不见',
    date: '2024.01.20',
    location: '老街咖啡馆',
    description: '和大学室友的匆匆一聚。聊起当年的糗事，大家都笑得前仰后合，仿佛从未分开过。',
    tags: ['聚会', '友情', '怀旧'],
  },
  {
    id: 'f13',
    url: ['https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1200'],
    title: '美味早餐',
    date: '2023.08.15',
    location: '家中',
    description: '用心摆盘的早餐，即使只是简单的煎蛋和吐司，也能开启元气满满的一天。',
    tags: ['美食', '早餐', '日常'],
  },
   {
    id: 'f14',
    url: ['https://images.unsplash.com/photo-1516733968668-dbdce39c4651?q=80&w=1200'],
    title: '雪山之旅',
    date: '2024.01.05',
    location: '长白山',
    description: '第一次看见这么厚的雪，世界变成了纯白色。我们在雪地里打滚，像个孩子一样。',
    tags: ['旅行', '冬日', '雪景'],
  }
];

export const FAMILY_PHOTOS: Photo[] = FAMILY_DATA.map(d => ({ ...d, albumType: AlbumType.FAMILY, width: 800, height: 600 }));

const BABY_DATA = [
  {
    id: 'b1',
    url: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200',
      'https://ai.bornforthis.cn/images/P01-%E8%B4%BE%E7%BB%B4%E6%96%AF.png',
      'https://ai.bornforthis.cn/images/P02-ReadyGoDuel.png'
    ],
    title: '初次见面',
    date: '2022.05.20',
    location: '医院',
    description: '你好呀，小家伙。虽然你皱巴巴的，哭声却那么响亮。这是我们第一次牵手，以后请多关照。',
    tags: ['新生', '感动'],
  },
  {
    id: 'b2',
    url: ['https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1200'],
    title: '百日宴',
    date: '2022.08.28',
    location: '家中',
    description: '穿上了姥姥做的小老虎鞋，希望你像小老虎一样健康壮实，虽然你现在只会吐泡泡。',
    tags: ['百天', '纪念'],
  },
  {
    id: 'b3',
    url: ['https://images.unsplash.com/photo-1519894759955-488663806a6b?q=80&w=1200'],
    title: '第一次站立',
    date: '2023.03.15',
    location: '客厅地毯',
    description: '扶着沙发，颤颤巍巍地站了起来！虽然只坚持了三秒钟就一屁股坐下了，但这是巨大的一步！',
    tags: ['成长', '里程碑'],
  },
  {
    id: 'b4',
    url: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200'],
    title: '公园玩耍',
    date: '2023.06.01',
    location: '儿童公园',
    description: '第一次坐滑梯，既害怕又兴奋的表情太搞笑了。',
    tags: ['儿童节', '快乐'],
  },
  {
    id: 'b5',
    url: ['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=1200'],
    title: '专注时刻',
    date: '2023.10.12',
    location: '书桌',
    description: '拿着画笔在纸上乱涂乱画，嘴里还念念有词，俨然一个小画家的样子。',
    tags: ['艺术', '探索'],
  }
];

export const BABY_PHOTOS: Photo[] = BABY_DATA.map(d => ({ ...d, albumType: AlbumType.BABY, width: 800, height: 600 }));


export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 't1',
    date: '2022.05',
    age: '0岁',
    title: '天使降临',
    description: '从两个人变成三口之家，世界变得柔软了许多。',
    photos: [BABY_PHOTOS[0], BABY_PHOTOS[1], BABY_PHOTOS[1]],
  },
  {
    id: 't2',
    date: '2022.08',
    age: '3个月',
    title: '慢慢长大',
    description: '开始对色彩感兴趣，喜欢盯着转动的床铃看个不停。',
    photos: [BABY_PHOTOS[1]],
  },
  {
    id: 't3',
    date: '2023.05',
    age: '1周岁',
    title: '蹒跚学步',
    description: '开始跌跌撞撞地探索这个世界，每一个角落都是新大陆。',
    photos: [BABY_PHOTOS[2], BABY_PHOTOS[3]],
  },
];

// === GALLERY DATA ===
const GALLERY_DATA = [
  {
    id: 'gv1',
    url: [
      'https://github.com/AndersonHJB/AndersonHJB.github.io/releases/download/V0.0.4/03-why-code.mp4',
      ],
    mediaType: 'video' as const,
    title: '编码艺术',
    date: '2024-02-15',
    location: '办公室',
    description: '代码不仅是逻辑，也是流动的艺术。',
    tags: ['视频', '创作'],
    poster: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200',
    exif: { device: 'Screen Record', params: '1080p' }
  },
  {
    id: 'g1',
    url: ['https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=1200'], 
    title: '雪落在丘陵上像蛋糕一样',
    date: '2025-02-08',
    location: '辽宁省凤城市',
    description: '在回家的路上拍的，冬日的阳光洒在积雪覆盖的山丘上，质感像极了刚抹好的奶油蛋糕。',
    tags: ['旅行日记'],
    exif: { device: 'iPhone 13 Pro', params: '26mm f1.5' }
  },
  {
    id: 'g2',
    url: ['https://images.unsplash.com/photo-1533552097808-166299d63f45?q=80&w=1200'], 
    title: '坐黄包车',
    date: '2024-11-15',
    location: '天津五大道',
    description: '老师傅讲起过去的故事眉飞色舞，车轮滚过落叶的声音，是秋天最独特的配乐。',
    tags: ['生活点滴'],
    exif: { device: 'Canon EOS R6', params: '35mm f1.8' }
  },
  {
    id: 'g3',
    url: ['https://images.unsplash.com/photo-1616036740257-9449ea1f6605?q=80&w=1200'],
    title: '火烧云',
    date: '2024-08-30',
    location: '北环路立交桥',
    description: '下班路上偶遇的一场壮丽晚霞，整个城市都被笼罩在橘红色的温柔里。',
    tags: ['生活点滴'],
    exif: { device: 'iPhone 15', params: '24mm f1.6' }
  },
  {
    id: 'g4',
    url: ['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1200'],
    title: '第一次爬长城',
    date: '2024-01-02',
    location: '北京八达岭',
    description: '不到长城非好汉。冬天的长城苍凉而壮阔，远处的烽火台在雪中若隐若现。',
    tags: ['旅行日记'],
    exif: { device: 'Sony A7M4', params: '16-35mm GM' }
  },
  {
    id: 'g5',
    url: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200'],
    title: '库迪送的环保杯',
    date: '2025-01-15',
    location: '办公室',
    description: '新的一年，从一杯环保咖啡开始。这个小杯子意外的好用。',
    tags: ['旅行日记'], 
    exif: { device: 'iPhone 13 Pro', params: '26mm f1.5' }
  },
  {
    id: 'g6',
    url: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200'],
    title: '曾经辉煌的校园也落寞了',
    date: '2024-05-20',
    location: '丹东一中',
    description: '故地重游，教学楼还是那个教学楼，只是读书的人换了一茬又一茬。',
    tags: ['旅行日记'],
    exif: { device: 'iPhone 13 Pro', params: '77mm f2.8' }
  },
  {
    id: 'g7',
    url: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200'],
    title: '上次那个公司的小家伙自己跑丢了',
    date: '2024-06-10',
    location: '园区草坪',
    description: '来了只新的，看起来呆呆的，但眼神里充满了对世界的好奇。',
    tags: ['生活点滴'],
    exif: { device: 'iPhone 13 Pro', params: '26mm f1.5' }
  },
  {
    id: 'g8',
    url: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1200'],
    title: '公司来了个新的小家伙',
    date: '2024-06-12',
    location: '会议室',
    description: '它特别喜欢趴在键盘上，可能是想帮我写代码吧。',
    tags: ['生活点滴'],
    exif: { device: 'iPhone 13 Pro', params: '26mm f1.5' }
  }
];

export const GALLERY_PHOTOS: Photo[] = GALLERY_DATA.map(d => ({ ...d, albumType: AlbumType.GALLERY }));


// === WEDDING DATA ===
// Helper to create mock wedding photos
const createWeddingPhotos = (count: number, prefix: string, tag: string): Photo[] => {
  const images = [
     'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
     'https://images.unsplash.com/photo-1511285560982-1356c11d4606?q=80&w=1200',
     'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200',
     'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200',
     'https://images.unsplash.com/photo-1520854221250-8c12521743d2?q=80&w=1200',
     'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200'
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: `w-${prefix}-${i}`,
    url: [images[i % images.length]],
    title: `${tag} Series ${i + 1}`,
    date: '2023.05.20',
    description: 'Love is not about how many days, months, or years you have been together. It is about how much you love each other every single day.',
    tags: [tag, 'Wedding'],
    albumType: AlbumType.WEDDING,
    width: 800,
    height: 1000,
    exif: { device: 'Sony A7R4', params: '50mm f1.2' }
  }));
};

export const WEDDING_COLLECTIONS: WeddingSeries[] = [
  {
    id: 'ws1',
    title: 'The White Vows',
    subtitle: '纯白誓言 · 室内主纱',
    cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
    date: '2023.05.20',
    photographer: 'Art Studio',
    description: '极简的背景，突显最纯粹的情感。白纱落地，此刻即是永恒。',
    photos: createWeddingPhotos(6, 'main', 'Classic'),
  },
  {
    id: 'ws2',
    title: 'Vintage Romance',
    subtitle: '复古胶片 · 城市漫步',
    cover: 'https://images.unsplash.com/photo-1511285560982-1356c11d4606?q=80&w=1200',
    date: '2023.05.21',
    photographer: 'Film Lab',
    description: '漫步在老城区的街道，胶片的颗粒感记录下像电影一样的瞬间。',
    photos: createWeddingPhotos(8, 'retro', 'Vintage'),
  },
  {
    id: 'ws3',
    title: 'Forest & Light',
    subtitle: '森系光影 · 自然礼赞',
    cover: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200',
    date: '2023.05.22',
    photographer: 'Nature Lens',
    description: '清晨的第一缕阳光穿过树叶，我们在森林里举行了一场只有风知道的婚礼。',
    photos: createWeddingPhotos(5, 'forest', 'Forest'),
  },
];
