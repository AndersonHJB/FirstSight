
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
        // On some trackpads deltaX is also available, but for traditional scroll we map Y to X
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY * 2;
        }
      };
      
      const onScroll = () => {
        const total = el.scrollWidth - el.clientWidth;
        const current = el.scrollLeft;
        setScrollProgress(total > 0 ? (current / total) * 100 : 0);
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
      
      {/* Top Bar Label - Desktop Only */}
      <div className="absolute top-28 right-12 z-20 hidden xl:block">
         <div className="flex flex-col items-center">
            <div className="h-24 w-px bg-stone-300 mb-4" />
            <span className="font-serif text-[10px] tracking-[0.8em] text-stone-400 uppercase [writing-mode:vertical-rl]">Records of Floating Life</span>
         </div>
      </div>

      {/* Main Horizontal Container */}
      <div 
        ref={containerRef}
        className="flex h-full items-center overflow-x-auto overflow-y-hidden scrollbar-hide px-[5vw] md:px-[10vw] relative z-10"
      >
        
        {/* Intro Section */}
        <div className="shrink-0 flex flex-col items-center justify-center mr-[10vw] md:mr-[15vw]">
           <div className="relative mb-6 md:mb-12">
              <Scroll size={80} className="text-stone-300 animate-float md:w-[100px] md:h-[100px]" strokeWidth={0.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="font-serif text-[10px] md:text-xs text-stone-500 font-bold">卷</span>
              </div>
           </div>
           <h1 className="font-hand text-[6rem] md:text-[10rem] text-ink leading-tight [writing-mode:vertical-rl] tracking-tighter drop-shadow-sm">
              浮生六记
           </h1>
           <p className="mt-4 md:mt-8 font-serif text-stone-400 italic text-[10px] md:text-sm tracking-widest uppercase flex items-center gap-2 md:gap-4">
             <span className="h-px w-4 md:w-8 bg-stone-200" />
             The Ten Chapters of Soul
             <span className="h-px w-4 md:w-8 bg-stone-200" />
           </p>
           <div className="mt-8 md:mt-12 flex flex-col items-center gap-2 md:gap-3 text-stone-300">
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em]">Slide to Explore</span>
              <MoveRight size={20} strokeWidth={1} className="animate-pulse" />
           </div>
        </div>

        {/* Chapters Sections */}
        {FLOATING_LIFE_RECORDS.map((chapter, idx) => (
          <section key={idx} className="shrink-0 flex flex-col md:flex-row items-center gap-10 md:gap-24 mr-[15vw] md:mr-[20vw] group py-20 md:py-0">
            
            {/* Image Box */}
            <div className="relative w-[70vw] md:w-[32vw] h-[40vh] md:h-[65vh] transition-all duration-1000 shrink-0">
               <div className="absolute -inset-2 md:-inset-4 border border-stone-200/50 -rotate-1 group-hover:rotate-0 transition-transform duration-700" />
               <div className="relative w-full h-full overflow-hidden bg-stone-100 shadow-[20px_20px_60px_rgba(0,0,0,0.05)] border-[8px] md:border-[15px] border-white">
                  <img 
                    src={chapter.image} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out" 
                    alt={chapter.title}
                  />
                  <div className="absolute inset-0 bg-orange-950/5 mix-blend-overlay" />
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 opacity-30 group-hover:opacity-60 transition-opacity">
                     <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white flex items-center justify-center text-[6px] md:text-[8px] text-white">时光</div>
                  </div>
               </div>
               
               <div className="absolute -top-3 -left-3 md:-top-6 md:-left-6 w-10 h-10 md:w-14 md:h-14 bg-ink text-white flex items-center justify-center font-hand text-xl md:text-2xl shadow-xl z-20">
                  {idx + 1}
               </div>
            </div>

            {/* Text Box */}
            <div className="w-[70vw] md:w-[22vw] flex flex-col items-start relative max-h-[80vh]">
               <div className="flex items-start gap-6 md:gap-10 h-full">
                  {/* Vertical Title */}
                  <h2 className="font-hand text-5xl md:text-7xl text-ink leading-none [writing-mode:vertical-rl] tracking-tighter group-hover:text-accent-brown transition-colors duration-500 shrink-0">
                    {chapter.title}
                  </h2>

                  <div className="flex flex-col h-full">
                     {/* Subtitle with border bottom */}
                     <p className="font-serif text-[9px] md:text-[11px] tracking-[0.3em] md:tracking-[0.5em] text-stone-400 uppercase mb-6 md:mb-12 whitespace-nowrap border-b border-stone-200 pb-4">
                        {chapter.subtitle}
                     </p>

                     {/* Content wrapper with relative positioning for the stamp */}
                     <div className="relative flex-1">
                        {/* Description - Vertical Text */}
                        <p className="font-serif text-lg md:text-xl text-stone-600 leading-[2.5rem] md:leading-[3rem] [writing-mode:vertical-rl] min-h-[30vh] max-h-[50vh] opacity-80 group-hover:opacity-100 transition-opacity pr-4">
                           {chapter.desc}
                        </p>

                        {/* Red Seal Stamp - Better positioning to avoid overlapping long text */}
                        <div className="absolute -bottom-8 -right-4 md:-right-12 w-16 h-16 md:w-20 md:h-20 border-[2px] md:border-[3px] border-red-800/20 rounded-sm flex items-center justify-center rotate-[15deg] group-hover:rotate-0 group-hover:border-red-800/40 transition-all duration-1000 opacity-20 group-hover:opacity-60 z-0">
                           <div className="border border-red-800/10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                              <span className="font-serif text-[9px] md:text-[11px] text-red-800 font-bold leading-tight text-center">见字<br/>如面</span>
                           </div>
                        </div>
                     </div>

                     {/* Horizontal Quote - Pushed down and separated */}
                     <div className="flex items-start gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 mt-8 md:mt-12 relative z-10 bg-[#f2ede4]/80 backdrop-blur-sm p-2 rounded-sm">
                        <Quote size={16} className="text-accent-brown/40 shrink-0 mt-1" />
                        <span className="font-serif text-xs md:text-sm italic text-stone-400 font-light border-l border-stone-200 pl-4 leading-relaxed">
                          {chapter.content}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

          </section>
        ))}

        {/* Outro Section */}
        <div className="shrink-0 flex flex-col items-center justify-center px-40 md:px-60">
           <div className="space-y-10 md:space-y-16 text-center">
              <h3 className="font-hand text-5xl md:text-7xl text-stone-400 leading-tight [writing-mode:vertical-rl]">
                 愿此生如诗，岁月静好。
              </h3>
              <div className="flex flex-col items-center gap-3 md:gap-4 text-stone-300">
                 {/* Fixed: Replaced md:size with Tailwind classes as Lucide icons do not support md: prefixed props */}
                 <Calendar size={20} className="md:w-6 md:h-6" strokeWidth={1} />
                 <span className="font-serif text-[10px] md:text-sm tracking-[0.5em] uppercase">乙巳年 记忆长卷</span>
              </div>
           </div>
           
           <button 
             onClick={() => window.location.hash = '#/'}
             className="mt-16 md:mt-24 px-8 md:px-12 py-3 md:py-4 bg-ink text-white font-serif text-xs md:text-sm rounded-full hover:bg-accent-brown transition-all flex items-center gap-3 md:gap-4 shadow-xl hover:-translate-y-1"
           >
              {/* Fixed: Replaced md:size with Tailwind classes as Lucide icons do not support md: prefixed props */}
              返回首页 <Bookmark size={14} className="md:w-4 md:h-4" />
           </button>
        </div>

      </div>

      {/* Interactive Custom Scrollbar / Slider at bottom */}
      <div className="fixed bottom-6 md:bottom-12 left-[10vw] right-[10vw] md:left-[15vw] md:right-[15vw] h-10 md:h-12 z-50 flex flex-col items-center gap-2 md:gap-4 bg-white/10 backdrop-blur-md rounded-full px-8 py-2 border border-white/5 shadow-sm">
         
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
              className="absolute top-1/2 w-3 h-3 md:w-4 md:h-4 bg-ink rounded-full shadow-lg transition-all duration-100 pointer-events-none flex items-center justify-center"
              style={{ left: `${scrollProgress}%`, transform: 'translate(-50%, -50%)' }}
            >
               <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-40" />
            </div>

            {/* Chapter Markers - Hidden on mobile */}
            <div className="absolute top-4 left-0 w-full hidden md:flex justify-between px-1">
               {FLOATING_LIFE_RECORDS.map((_, i) => (
                 <div key={i} className={`text-[8px] md:text-[9px] font-serif transition-colors ${Math.floor(scrollProgress/10) >= i ? 'text-ink' : 'text-stone-300'}`}>
                    {i < 9 ? `0${i+1}` : i+1}
                 </div>
               ))}
            </div>
         </div>

         <div className="font-serif text-[8px] md:text-[10px] text-stone-400 uppercase tracking-[0.3em] md:tracking-[0.5em] mt-2 opacity-50">
            {window.innerWidth < 768 ? '滑动屏幕浏览' : '拖动墨滴 展开记忆长卷'}
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
