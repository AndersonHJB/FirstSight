
import { FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, TRAVEL_TRIPS } from './index';

export interface FloatingLifeRecord {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  content: string;
}

/**
 * ==========================================
 *  浮生六记数据配置 / Floating Life Data
 * ==========================================
 * 您可以在此处自由修改每一章节的图片路径和文案。
 * 图片路径支持：
 * 1. 本地 public 路径 (例如: '/photos/records/01.jpg')
 * 2. 外部 URL 链接
 */
export const FLOATING_LIFE_RECORDS: FloatingLifeRecord[] = [
  {
    title: "壹 · 晨曦",
    subtitle: "The Dawn of Life",
    desc: "余生平素喜静，晨间之光，最是动人。记录下这岁月的平淡与真实。",
    // 示例：修改为本地路径请填入 '/photos/family/your_image.jpg'
    image: FAMILY_PHOTOS[0]?.url[0] || "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200",
    content: "生活不需要惊天动地，清晨的一碗粥，足矣。"
  },
  {
    title: "贰 · 童稚",
    subtitle: "Leisurely Pleasures",
    desc: "见藐小之物必细察其纹理，故时有物外之趣。见证生命的每一个奇迹。",
    image: BABY_PHOTOS[0]?.url[0] || "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200",
    content: "宝贝的小脚丫，第一次发出的笑声，都是这世界上最美的诗。"
  },
  {
    title: "叁 · 行旅",
    subtitle: "Glimpses of the World",
    desc: "山川异域，风月同天。与所爱之人，共览世间繁华与寂寥。",
    image: TRAVEL_TRIPS[0]?.photos[0]?.url[0] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200",
    content: "走过的路，看过的云，都刻在了我们的呼吸里。"
  },
  {
    title: "肆 · 烟火",
    subtitle: "A Table for Two",
    desc: "饮食男女，人之大欲存焉。一餐一饭，皆是温情的流淌。",
    image: GALLERY_PHOTOS[2]?.url[0] || "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1200",
    content: "最暖的灯火，莫过于厨房那一抹氤氲的蒸汽。"
  },
  {
    title: "伍 · 华年",
    subtitle: "Eternal Promises",
    desc: "往事如烟，唯爱永存。回首向来萧瑟处，也无风雨也无晴。",
    image: GALLERY_PHOTOS[1]?.url[0] || "https://images.unsplash.com/photo-1511285560982-1356c11d4606?q=80&w=1200",
    content: "记忆会泛黄，但誓言依旧清晰如初。"
  },
  {
    title: "陆 · 归心",
    subtitle: "Quiet Reflections",
    desc: "心之所向，便是吾乡。在时光的尽头，寻一份内心的安宁。",
    image: FAMILY_PHOTOS[3]?.url[0] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200",
    content: "世界很喧嚣，但只要家人在侧，心便是安静的。"
  },
  {
    title: "柒 · 四时",
    subtitle: "Seasons Change",
    desc: "春有百花秋有月，夏有凉风冬有雪。若无闲事挂心头，便是人间好时节。",
    image: GALLERY_PHOTOS[5]?.url[0] || "https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=1200",
    content: "陪你看过十次冬雪，便也白了头。"
  },
  {
    title: "捌 · 碎念",
    subtitle: "Daily Whispers",
    desc: "草木有情，云霞有心。那些琐碎的对话，拼凑出我们最完整的生活。",
    image: FAMILY_PHOTOS[2]?.url[0] || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200",
    content: "听你讲些毫无逻辑的话，是我一天中最轻松的时刻。"
  },
  {
    title: "玖 · 远方",
    subtitle: "Beyond the Horizon",
    desc: "世界是一本书，不旅行的人只读了其中一页。愿你永远保有出发的勇气。",
    image: TRAVEL_TRIPS[2]?.photos[0]?.url[0] || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200",
    content: "星辰大海，不及你回眸一笑。"
  },
  {
    title: "拾 · 守望",
    subtitle: "Silent Sentinel",
    desc: "家是一盏灯，无论多晚都为你亮着。那是所有漂泊的终点。",
    image: FAMILY_PHOTOS[1]?.url[0] || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
    content: "时光不老，我们不散。"
  }
];
