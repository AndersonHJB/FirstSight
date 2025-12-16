import React from 'react';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="w-full animate-fade-in pb-20">
      
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-paper">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl animate-float" />
           <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-stone-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-4xl px-6 text-center">
           <div className="mb-8 inline-block">
             <span className="font-hand text-3xl md:text-4xl text-accent-brown writing-vertical-rl md:writing-horizontal-tb opacity-80">
               岁月 · 静好
             </span>
           </div>
           
           <h1 className="font-serif text-5xl md:text-7xl text-ink font-light mb-8 tracking-tight leading-tight">
             把时间<br/>
             <span className="font-hand text-6xl md:text-8xl text-ink ml-4">写成诗</span>
           </h1>
           
           <p className="font-serif text-lg md:text-xl text-stone-500 mb-16 max-w-lg mx-auto leading-relaxed">
             我们无法留住时间，<br/>但我们可以留住时间里的爱与感动。
           </p>
           
           <div className="flex flex-col md:flex-row gap-6 justify-center">
             <button 
               onClick={() => onNavigate('/family')}
               className="group relative px-10 py-4 bg-ink text-paper font-serif text-lg overflow-hidden transition-all hover:bg-accent-brown hover:scale-105 duration-500 rounded-[2px]"
             >
               <span className="relative z-10 flex items-center gap-3">
                 翻阅家庭相册 <BookOpen size={18} />
               </span>
             </button>
             
             <button 
               onClick={() => onNavigate('/baby')}
               className="group px-10 py-4 bg-transparent border border-ink text-ink font-serif text-lg transition-all hover:bg-stone-100 hover:border-stone-400 rounded-[2px]"
             >
               <span className="flex items-center gap-3">
                 见证成长足迹 <Clock size={18} />
               </span>
             </button>
           </div>
        </div>
      </div>

      {/* Teaser Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
         <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
            
            {/* Left Image */}
            <div className="relative group cursor-pointer" onClick={() => onNavigate('/family')}>
               <div className="absolute -inset-4 bg-stone-200/50 rotate-2 transition-transform group-hover:rotate-1" />
               <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-2xl p-4">
                  <div className="w-full h-full relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200"
                      alt="Family"
                      className="w-full h-full object-cover filter sepia-[0.2] group-hover:sepia-0 transition-all duration-700" 
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-gradient-to-t from-black/60 to-transparent">
                     <p className="font-hand text-3xl text-white">家庭影像</p>
                  </div>
               </div>
            </div>

            {/* Right Text */}
            <div className="text-center md:text-left space-y-6">
               <h2 className="font-serif text-3xl text-ink">有些瞬间，<br/>值得被反复咀嚼。</h2>
               <p className="font-sans text-stone-500 leading-loose font-light">
                 无论是假日的野餐，还是平日的晚餐。<br/>
                 那些看似平淡的日常，<br/>
                 回过头看，<br/>
                 都是生命中闪闪发光的钻石。
               </p>
               <div className="pt-4">
                 <button onClick={() => onNavigate('/family')} className="text-accent-brown hover:text-ink transition-colors font-serif italic flex items-center gap-2 mx-auto md:mx-0">
                   去看看回忆 <ArrowRight size={16} />
                 </button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};
