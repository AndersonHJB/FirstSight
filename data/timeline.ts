
import { TimelineEvent } from '../types';
import { BABY_PHOTOS } from './baby';

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
