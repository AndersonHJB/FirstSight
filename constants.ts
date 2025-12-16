import { AlbumType, Photo, TimelineEvent } from './types';

// ==========================================
//  配置指南 / Configuration Guide
// ==========================================
// 1. 将您的照片放入 public 文件夹中 (例如 public/photos/family/)
// 2. 将 url 修改为相对路径 (例如 '/photos/family/IMG_001.jpg')
// ==========================================

export const APP_NAME = "时光 · 家书";

const FAMILY_DATA = [
  {
    id: 'f1',
    url: [
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200',
      'https://ai.bornforthis.cn/images/P01-%E8%B4%BE%E7%BB%B4%E6%96%AF.png',
      'https://ai.bornforthis.cn/images/P02-ReadyGoDuel.png'
    ], // User requested example with array support
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
    photos: [BABY_PHOTOS[0]],
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

// === NEW GALLERY DATA ===
const GALLERY_DATA = [
  {
    id: 'g1',
    url: ['https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=1200'], // Snow/Landscape
    title: '雪落在丘陵上像蛋糕一样',
    date: '2025-02-08',
    location: '辽宁省凤城市',
    description: '在回家的路上拍的，冬日的阳光洒在积雪覆盖的山丘上，质感像极了刚抹好的奶油蛋糕。',
    tags: ['旅行日记'],
    exif: { device: 'iPhone 13 Pro', params: '26mm f1.5' }
  },
  {
    id: 'g2',
    url: ['https://images.unsplash.com/photo-1533552097808-166299d63f45?q=80&w=1200'], // Rickshaw / Street
    title: '坐黄包车',
    date: '2024-11-15',
    location: '天津五大道',
    description: '老师傅讲起过去的故事眉飞色舞，车轮滚过落叶的声音，是秋天最独特的配乐。',
    tags: ['生活点滴'],
    exif: { device: 'Canon EOS R6', params: '35mm f1.8' }
  },
  {
    id: 'g3',
    url: ['https://images.unsplash.com/photo-1616036740257-9449ea1f6605?q=80&w=1200'], // Sunset
    title: '火烧云',
    date: '2024-08-30',
    location: '北环路立交桥',
    description: '下班路上偶遇的一场壮丽晚霞，整个城市都被笼罩在橘红色的温柔里。',
    tags: ['生活点滴'],
    exif: { device: 'iPhone 15', params: '24mm f1.6' }
  },
  {
    id: 'g4',
    url: ['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1200'], // Great Wall / Winter
    title: '第一次爬长城',
    date: '2024-01-02',
    location: '北京八达岭',
    description: '不到长城非好汉。冬天的长城苍凉而壮阔，远处的烽火台在雪中若隐若现。',
    tags: ['旅行日记'],
    exif: { device: 'Sony A7M4', params: '16-35mm GM' }
  },
  {
    id: 'g5',
    url: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200'], // Coffee
    title: '库迪送的环保杯',
    date: '2025-01-15',
    location: '办公室',
    description: '新的一年，从一杯环保咖啡开始。这个小杯子意外的好用。',
    tags: ['旅行日记'], 
    exif: { device: 'iPhone 13 Pro', params: '26mm f1.5' }
  },
  {
    id: 'g6',
    url: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200'], // School
    title: '曾经辉煌的校园也落寞了',
    date: '2024-05-20',
    location: '丹东一中',
    description: '故地重游，教学楼还是那个教学楼，只是读书的人换了一茬又一茬。',
    tags: ['旅行日记'],
    exif: { device: 'iPhone 13 Pro', params: '77mm f2.8' }
  },
  {
    id: 'g7',
    url: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200'], // Cat 1
    title: '上次那个公司的小家伙自己跑丢了',
    date: '2024-06-10',
    location: '园区草坪',
    description: '来了只新的，看起来呆呆的，但眼神里充满了对世界的好奇。',
    tags: ['生活点滴'],
    exif: { device: 'iPhone 13 Pro', params: '26mm f1.5' }
  },
  {
    id: 'g8',
    url: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1200'], // Cat 2
    title: '公司来了个新的小家伙',
    date: '2024-06-12',
    location: '会议室',
    description: '它特别喜欢趴在键盘上，可能是想帮我写代码吧。',
    tags: ['生活点滴'],
    exif: { device: 'iPhone 13 Pro', params: '26mm f1.5' }
  }
];

export const GALLERY_PHOTOS: Photo[] = GALLERY_DATA.map(d => ({ ...d, albumType: AlbumType.GALLERY }));