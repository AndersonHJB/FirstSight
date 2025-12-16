
import { AlbumType, Photo } from '../types';

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
