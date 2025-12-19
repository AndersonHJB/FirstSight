
import React, { useRef, useEffect } from 'react';
import { FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, TRAVEL_TRIPS } from '../data';
import { Scroll, Quote, Calendar, Bookmark } from 'lucide-react';

export const FloatingLife: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Chapters inspired by "Six Records of a Floating Life"
  const chapters = [
    {
      title: "晨曦 · 日记",
      subtitle: "Joy of Daily Life",
      desc: "余生平素喜静，晨间之光，最是动人。记录下这岁月的平淡与真实。",
      image: FAMILY_PHOTOS[0]?.url[0] || "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200",
      content: "生活不需要惊天动地，清晨的一碗粥，窗台的一盆花，足矣。"
    },
    {
      title: "童稚 · 记趣",
      subtitle: "Leisurely Pleasures",
      desc: "见藐小之物必细察其纹理，故时有物外之趣。见证生命的每一个奇迹。",
      image: BABY_PHOTOS[0]?.url[0] || "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200",
      content: "宝贝的小脚丫，第一次发出的笑声，都是这世界上最美的诗。"
    },
    {
      title: "行旅 · 记情",
      subtitle: "Glimpses of the World",
      desc: "山川异域，风月同天。与所爱之人，共览世间繁华与寂寥。",
      image: TRAVEL_TRIPS[0]?.photos[0]?.url[0] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200",
      content: "走过的路，看过的云，都刻在了我们的呼吸里。"
    },
    {
      title: "烟火 · 食谱",
      subtitle: "A Table for Two",
      desc: "饮食男女，人之大欲存焉。一餐一饭，皆是温情的流淌。",
      image: GALLERY_PHOTOS[2]?.url[0] || "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1200",
      content: "最暖的灯火，莫过于厨房那一抹氤氲的蒸汽。"
    },
    {
      title: "华年 · 往事",
      subtitle: "Eternal Promises",
      desc: "往事如烟，唯爱永存。回首向来萧瑟处，也无风雨也无晴。",
      image: GALLERY_PHOTOS[1]?.url[0] || "https://images.unsplash.com/photo-1511285560982-1356c11d4606?q=80&w=1200",
      content: "记忆会泛黄，但誓言依旧清晰如初。"
    },
    {
      title: "归心 · 静好",
      subtitle: "Quiet Reflections",
      desc: "心之所向，便是吾乡。在时光的尽头，寻一份内心的安宁。",
      image: FAMILY_PHOTOS[3]?.url[0] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200",
      content: "世界很喧嚣，但只要家人在侧，心便是安静的。"
    }
  ];

  // Mouse wheel horizontal scroll handler
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 3,
          behavior: 'smooth'
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  return (
    <div className="h-screen w-full bg-[#f2ede4] overflow-hidden select-none animate-fade-in">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
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
        className="flex h-full items-center overflow-x-auto overflow-y-hidden scrollbar-hide px-[10vw]"
      >
        
        {/* Intro Section */}
        <div className="shrink-0 flex flex-col items-center justify-center mr-[15vw]">
           <div className="relative mb-12">
              <Scroll size={80} className="text-stone-300 animate-float" strokeWidth={0.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="font-serif text-xs text-stone-500 font-bold">壹</span>
              </div>
           </div>
           <h1 className="font-hand text-8xl text-ink leading-tight [writing-mode:vertical-rl] tracking-tighter">
              浮生六记
           </h1>
           <p className="mt-8 font-serif text-stone-400 italic text-sm tracking-widest uppercase">The Six Chapters of Memories</p>
           <div className="mt-12 flex items-center gap-3 text-stone-300 animate-pulse">
              <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to Open</span>
              <div className="h-px w-20 bg-stone-200" />
           </div>
        </div>

        {/* Chapters Sections */}
        {chapters.map((chapter, idx) => (
          <section key={idx} className="shrink-0 flex items-center gap-20 mr-[15vw] group">
            
            {/* Image Box */}
            <div className="relative w-[30vw] h-[60vh] overflow-hidden bg-stone-100 shadow-2xl transition-all duration-1000 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]">
               <img 
                 src={chapter.image} 
                 className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                 alt={chapter.title}
               />
               <div className="absolute inset-0 bg-orange-950/5 mix-blend-overlay" />
               <div className="absolute inset-0 border-[20px] border-[#f2ede4] opacity-80 pointer-events-none" />
               
               {/* Chapter Number Badge */}
               <div className="absolute top-8 left-8 w-10 h-10 border border-white/40 flex items-center justify-center text-white/60 font-serif text-xs">
                  0{idx + 1}
               </div>
            </div>

            {/* Text Box */}
            <div className="w-[18vw] flex flex-col items-start pt-12 relative">
               <div className="flex items-start gap-8">
                  <h2 className="font-hand text-6xl text-ink leading-none [writing-mode:vertical-rl] tracking-tighter group-hover:text-accent-brown transition-colors">
                    {chapter.title}
                  </h2>
                  <div className="pt-2">
                     <p className="font-serif text-[10px] tracking-[0.4em] text-stone-400 uppercase mb-8 whitespace-nowrap">
                        {chapter.subtitle}
                     </p>
                     <div className="space-y-6">
                        <p className="font-serif text-lg text-stone-600 leading-[2.5rem] [writing-mode:vertical-rl] h-[40vh]">
                           {chapter.desc}
                        </p>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                           <Quote size={16} className="text-accent-brown/40" />
                           <span className="font-serif text-sm italic text-stone-400 font-light">{chapter.content}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Decorative Seal (Stamp) */}
               <div className="absolute -bottom-10 right-0 w-16 h-16 border-2 border-red-800/40 rounded-sm flex items-center justify-center rotate-[15deg] group-hover:rotate-0 transition-transform duration-700">
                  <div className="border border-red-800/20 w-12 h-12 flex items-center justify-center">
                     <span className="font-serif text-[10px] text-red-800 font-bold leading-none text-center">时光<br/>永恒</span>
                  </div>
               </div>
            </div>

          </section>
        ))}

        {/* Outro Section */}
        <div className="shrink-0 flex flex-col items-end justify-center px-40">
           <div className="space-y-12">
              <h3 className="font-hand text-5xl text-stone-300 leading-tight [writing-mode:vertical-rl]">
                 愿此生如诗，岁月静好。
              </h3>
              <div className="flex flex-col items-end gap-2 text-stone-300">
                 <Calendar size={18} />
                 <span className="font-serif text-xs tracking-widest">乙巳年 春</span>
              </div>
           </div>
           
           <button 
             onClick={() => window.location.hash = '#/'}
             className="mt-20 px-8 py-3 bg-transparent border border-stone-300 text-stone-400 font-serif text-sm rounded-full hover:bg-ink hover:text-white transition-all flex items-center gap-4"
           >
              返回首页 <Bookmark size={14} />
           </button>
        </div>

      </div>

      {/* Progress Line */}
      <div className="fixed bottom-12 left-[10vw] right-[10vw] h-px bg-stone-200 z-10">
         <div className="h-full bg-accent-brown transition-all duration-300" style={{ width: '16.6%' }} />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
