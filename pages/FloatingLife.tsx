
import React, { useRef, useEffect, useState } from 'react';
import { FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, TRAVEL_TRIPS, ESSAY_DATA } from '../data';
import { Scroll, Quote, Calendar, Bookmark, MoveRight } from 'lucide-react';

export const FloatingLife: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 10 Chapters for a longer, more immersive scroll
  const chapters = [
    {
      title: "壹 · 晨曦",
      subtitle: "The Dawn of Life",
      desc: "余生平素喜静，晨间之光，最是动人。记录下这岁月的平淡与真实。",
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

  // Mouse wheel horizontal scroll handler & Progress calculation
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 3,
          behavior: 'auto' // Faster response for better dragging feel
        });
      };
      
      const onScroll = () => {
        const total = el.scrollWidth - el.clientWidth;
        const current = el.scrollLeft;
        setScrollProgress((current / total) * 100);
      };

      el.addEventListener('wheel', onWheel, { passive: false });
      el.addEventListener('scroll', onScroll);
      return () => {
        el.removeEventListener('wheel', onWheel);
        el.removeEventListener('scroll', onScroll);
      };
    }
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = containerRef.current;
    if (el) {
      const val = parseFloat(e.target.value);
      const total = el.scrollWidth - el.clientWidth;
      el.scrollLeft = (val / 100) * total;
      setScrollProgress(val);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f2ede4] overflow-hidden select-none animate-fade-in font-serif">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")' }} />
      
      {/* Top Bar Label */}
      <div className="absolute top-28 right-12 z-20 hidden lg:block">
         <div className="flex flex-col items-center">
            <div className="h-24 w-px bg-stone-300 mb-4" />
            <span className="font-serif text-[10px] tracking-[0.8em] text-stone-400 uppercase [writing-mode:vertical-rl]">Records of Floating Life</span>
         </div>
      </div>

      {/* Main Horizontal Container */}
      <div 
        ref={containerRef}
        className="flex h-full items-center overflow-x-auto overflow-y-hidden scrollbar-hide px-[10vw] relative z-10"
      >
        
        {/* Intro Section */}
        <div className="shrink-0 flex flex-col items-center justify-center mr-[15vw]">
           <div className="relative mb-12">
              <Scroll size={100} className="text-stone-300 animate-float" strokeWidth={0.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="font-serif text-xs text-stone-500 font-bold">卷</span>
              </div>
           </div>
           <h1 className="font-hand text-[10rem] text-ink leading-tight [writing-mode:vertical-rl] tracking-tighter drop-shadow-sm">
              浮生六记
           </h1>
           <p className="mt-8 font-serif text-stone-400 italic text-sm tracking-widest uppercase flex items-center gap-4">
             <div className="h-px w-8 bg-stone-200" />
             The Ten Chapters of Soul
             <div className="h-px w-8 bg-stone-200" />
           </p>
           <div className="mt-12 flex flex-col items-center gap-3 text-stone-300">
              <span className="text-[10px] uppercase tracking-[0.4em]">Horizontal Scroll</span>
              <MoveRight size={24} strokeWidth={1} className="animate-pulse" />
           </div>
        </div>

        {/* Chapters Sections */}
        {chapters.map((chapter, idx) => (
          <section key={idx} className="shrink-0 flex items-center gap-24 mr-[20vw] group">
            
            {/* Image Box with refined "Paper Frame" effect */}
            <div className="relative w-[32vw] h-[65vh] transition-all duration-1000">
               <div className="absolute -inset-4 border border-stone-200/50 -rotate-1 group-hover:rotate-0 transition-transform duration-700" />
               <div className="relative w-full h-full overflow-hidden bg-stone-100 shadow-[20px_20px_60px_rgba(0,0,0,0.05)] border-[15px] border-white">
                  <img 
                    src={chapter.image} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out" 
                    alt={chapter.title}
                  />
                  <div className="absolute inset-0 bg-orange-950/5 mix-blend-overlay" />
                  
                  {/* Watermark Logo */}
                  <div className="absolute bottom-6 right-6 opacity-30 group-hover:opacity-60 transition-opacity">
                     <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center text-[8px] text-white">时光</div>
                  </div>
               </div>
               
               {/* Chapter Number Badge */}
               <div className="absolute -top-6 -left-6 w-14 h-14 bg-ink text-white flex items-center justify-center font-hand text-2xl shadow-xl">
                  {idx + 1}
               </div>
            </div>

            {/* Text Box */}
            <div className="w-[20vw] flex flex-col items-start pt-12 relative">
               <div className="flex items-start gap-10">
                  <h2 className="font-hand text-7xl text-ink leading-none [writing-mode:vertical-rl] tracking-tighter group-hover:text-accent-brown transition-colors duration-500">
                    {chapter.title}
                  </h2>
                  <div className="pt-2">
                     <p className="font-serif text-[11px] tracking-[0.5em] text-stone-400 uppercase mb-12 whitespace-nowrap border-b border-stone-200 pb-4">
                        {chapter.subtitle}
                     </p>
                     <div className="space-y-6">
                        <p className="font-serif text-xl text-stone-600 leading-[3rem] [writing-mode:vertical-rl] h-[42vh] opacity-80 group-hover:opacity-100 transition-opacity">
                           {chapter.desc}
                        </p>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 mt-8">
                           <Quote size={20} className="text-accent-brown/30" />
                           <span className="font-serif text-sm italic text-stone-400 font-light border-l border-stone-200 pl-4">{chapter.content}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Decorative Seal (Stamp) - Red ink style */}
               <div className="absolute bottom-0 -right-12 w-20 h-20 border-[3px] border-red-800/40 rounded-sm flex items-center justify-center rotate-[15deg] group-hover:rotate-0 transition-all duration-1000 opacity-20 group-hover:opacity-80">
                  <div className="border border-red-800/20 w-16 h-16 flex items-center justify-center">
                     <span className="font-serif text-[11px] text-red-800 font-bold leading-tight text-center">见字<br/>如面</span>
                  </div>
               </div>
            </div>

          </section>
        ))}

        {/* Outro Section */}
        <div className="shrink-0 flex flex-col items-center justify-center px-60">
           <div className="space-y-16 text-center">
              <h3 className="font-hand text-7xl text-stone-400 leading-tight [writing-mode:vertical-rl]">
                 愿此生如诗，岁月静好。
              </h3>
              <div className="flex flex-col items-center gap-4 text-stone-300">
                 <Calendar size={24} strokeWidth={1} />
                 <span className="font-serif text-sm tracking-[0.5em] uppercase">乙巳年 记忆长卷</span>
              </div>
           </div>
           
           <button 
             onClick={() => window.location.hash = '#/'}
             className="mt-24 px-12 py-4 bg-ink text-white font-serif text-sm rounded-full hover:bg-accent-brown transition-all flex items-center gap-4 shadow-xl hover:-translate-y-1"
           >
              返回首页 <Bookmark size={16} />
           </button>
        </div>

      </div>

      {/* Interactive Custom Scrollbar / Slider at bottom */}
      <div className="fixed bottom-12 left-[15vw] right-[15vw] h-12 z-50 flex flex-col items-center gap-4">
         
         <div className="relative w-full h-px bg-stone-300/50">
            {/* The actual input range */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="0.1"
              value={scrollProgress}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            {/* Visual Track */}
            <div className="absolute top-1/2 left-0 h-[2px] bg-accent-brown transition-all duration-100" 
                 style={{ width: `${scrollProgress}%`, transform: 'translateY(-50%)' }} />
            
            {/* Visual Handle (Ink Drop) */}
            <div 
              className="absolute top-1/2 w-4 h-4 bg-ink rounded-full shadow-lg transition-all duration-100 pointer-events-none flex items-center justify-center"
              style={{ left: `${scrollProgress}%`, transform: 'translate(-50%, -50%)' }}
            >
               <div className="w-1.5 h-1.5 bg-white rounded-full opacity-40" />
            </div>

            {/* Chapter Markers */}
            <div className="absolute top-4 left-0 w-full flex justify-between px-1">
               {chapters.map((_, i) => (
                 <div key={i} className={`text-[9px] font-serif transition-colors ${Math.floor(scrollProgress/10) >= i ? 'text-ink' : 'text-stone-300'}`}>
                    0{i+1}
                 </div>
               ))}
            </div>
         </div>

         <div className="font-serif text-[10px] text-stone-400 uppercase tracking-[0.5em] mt-4 opacity-50">
            拖动墨滴 展开记忆长卷
         </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }

        /* Custom Range Reset */
        input[type=range]::-webkit-slider-thumb {
          pointer-events: auto;
          -webkit-appearance: none;
          height: 30px;
          width: 30px;
        }
      `}</style>
    </div>
  );
};
