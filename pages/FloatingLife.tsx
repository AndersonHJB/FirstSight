
import React, { useRef, useEffect, useState } from 'react';
import { FLOATING_LIFE_RECORDS } from '../data';
import { Scroll, Quote, Calendar, Bookmark, MoveRight } from 'lucide-react';

export const FloatingLife: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse wheel horizontal scroll handler & Progress calculation
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 3,
          behavior: 'auto'
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
             <span className="h-px w-8 bg-stone-200" />
             The Ten Chapters of Soul
             <span className="h-px w-8 bg-stone-200" />
           </p>
           <div className="mt-12 flex flex-col items-center gap-3 text-stone-300">
              <span className="text-[10px] uppercase tracking-[0.4em]">Horizontal Scroll</span>
              <MoveRight size={24} strokeWidth={1} className="animate-pulse" />
           </div>
        </div>

        {/* Chapters Sections */}
        {FLOATING_LIFE_RECORDS.map((chapter, idx) => (
          <section key={idx} className="shrink-0 flex items-center gap-24 mr-[20vw] group">
            
            {/* Image Box */}
            <div className="relative w-[32vw] h-[65vh] transition-all duration-1000">
               <div className="absolute -inset-4 border border-stone-200/50 -rotate-1 group-hover:rotate-0 transition-transform duration-700" />
               <div className="relative w-full h-full overflow-hidden bg-stone-100 shadow-[20px_20px_60px_rgba(0,0,0,0.05)] border-[15px] border-white">
                  <img 
                    src={chapter.image} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out" 
                    alt={chapter.title}
                  />
                  <div className="absolute inset-0 bg-orange-950/5 mix-blend-overlay" />
                  <div className="absolute bottom-6 right-6 opacity-30 group-hover:opacity-60 transition-opacity">
                     <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center text-[8px] text-white">时光</div>
                  </div>
               </div>
               
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
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="0.1"
              value={scrollProgress}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            <div className="absolute top-1/2 left-0 h-[2px] bg-accent-brown transition-all duration-100" 
                 style={{ width: `${scrollProgress}%`, transform: 'translateY(-50%)' }} />
            
            <div 
              className="absolute top-1/2 w-4 h-4 bg-ink rounded-full shadow-lg transition-all duration-100 pointer-events-none flex items-center justify-center"
              style={{ left: `${scrollProgress}%`, transform: 'translate(-50%, -50%)' }}
            >
               <div className="w-1.5 h-1.5 bg-white rounded-full opacity-40" />
            </div>

            <div className="absolute top-4 left-0 w-full flex justify-between px-1">
               {FLOATING_LIFE_RECORDS.map((_, i) => (
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
