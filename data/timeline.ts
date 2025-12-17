
import { ChildTimeline } from '../types';
import { BABY_PHOTOS_1, BABY_PHOTOS_2, BABY_PHOTOS_3 } from './baby';

export const MULTI_CHILD_TIMELINES: ChildTimeline[] = [
  {
    name: '棠棠',
    nickname: '大宝',
    birthday: '2022.05.20',
    gender: 'boy',
    avatar: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=200',
    events: [
      {
        id: 't1-1',
        date: '2022.05',
        age: '出生',
        title: '天使降临',
        description: '从两个人变成三口之家，世界变得柔软了许多。那是这一年最动人的时刻。',
        photos: [BABY_PHOTOS_1[0]],
      },
      {
        id: 't1-2',
        date: '2023.06',
        age: '1岁1个月',
        title: '学会走路啦',
        description: '在草地上迈出了第一步。虽然摔了一跤，但你没有哭。',
        photos: [BABY_PHOTOS_1[1]],
      },
      {
        id: 't1-3',
        date: '2025.09',
        age: '3岁3个月',
        title: '入园第一天',
        description: '你是最勇敢的宝宝，挥手告别时没有哭，反而给了爸爸一个飞吻。',
        photos: [BABY_PHOTOS_1[2]],
      }
    ]
  },
  {
    name: '小悦',
    nickname: '二宝',
    birthday: '2024.06.15',
    gender: 'girl',
    avatar: 'https://images.unsplash.com/photo-1523293836414-f04e712e1f3b?q=80&w=200',
    events: [
      {
        id: 't2-1',
        date: '2024.06',
        age: '出生',
        title: '欢迎来到这个世界',
        description: '妹妹的到来让家里更热闹了。她的眼睛圆圆的，像极了妈妈。',
        photos: [BABY_PHOTOS_2[0]],
      },
      {
        id: 't2-2',
        date: '2024.09',
        age: '3个月',
        title: '百日纪念',
        description: '拍了人生第一组艺术照。虽然折腾了一整天，但效果真的太棒了！',
        // 多图演示
        photos: [BABY_PHOTOS_2[1], BABY_PHOTOS_2[2]], 
      },
      {
        id: 't2-3',
        date: '2024.10',
        age: '4个月',
        title: '运动天赋觉醒',
        description: '已经可以熟练翻身了，看来以后是个运动健儿。',
        // 视频演示
        photos: [BABY_PHOTOS_2[3]], 
      }
    ]
  },
  {
    name: '小小悦',
    nickname: '三宝',
    birthday: '2025.01.10',
    gender: 'boy',
    avatar: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=200',
    events: [
      {
        id: 't3-1',
        date: '2025.01',
        age: '出生',
        title: '生命之光',
        description: '哥哥姐姐都围着你转，你是我们家最小的开心果。',
        photos: [BABY_PHOTOS_3[0]],
      }
    ]
  }
];
