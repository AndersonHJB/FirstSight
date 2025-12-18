
import React, { useState, useEffect } from 'react';
import { LETTERS_DATA } from '../data';
import { Letter } from '../types';
import { Mail, ArrowLeft, Calendar, User, Tag, Clock, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LetterPageProps {
  initialLetterId?: string;
}

export const LetterPage: React.FC<LetterPageProps> = ({ initialLetterId }) => {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (initialLetterId) {
      const letter = LETTERS_DATA.find(l => l.id === initialLetterId);
      if (letter) setSelectedLetter(letter);
    }
  }, [initialLetterId]);

  const handleClose = () => {
    setIsClosing(true);
    // Allow animation to complete before resetting state
    setTimeout(() => {
      setSelectedLetter(null);
      setIsClosing(false);
    }, 800);
  };

  // Reset scroll when changing views
  useEffect(() => {
    if (!selectedLetter) {
        window.scrollTo(0, 0);
    }
  }, [selectedLetter]);

  // --- LIST VIEW ---
  if (!selectedLetter) {
    return (
      <div className="min-h-screen bg-paper pt-32 pb-24 px-6 animate-fade-in">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-white shadow-sm rounded-full text-accent-brown mb-6">
              <Mail size={24} strokeWidth={1.5} />
            </div>
            <h1 className="font-hand text-5xl md:text-6xl text-ink mb-4">见字如面</h1>
            <p className="font-serif text-stone-500 italic">在书信里，收藏时光的温度。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {LETTERS_DATA.map((letter, idx) => (
              <div 
                key={letter.id}
                onClick={() => setSelectedLetter(letter)}
                className="group cursor-pointer relative"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Envelope Effect Card */}
                <div className="bg-white p-6 md:p-8 shadow-polaroid group-hover:shadow-polaroid-hover transition-all duration-500 transform group-hover:-translate-y-2 border border-stone-100">
                  <div className="relative aspect-video mb-6 overflow-hidden rounded-sm bg-stone-50">
                    <img 
                      src={letter.cover || 'https://images.unsplash.com/photo-1516589174184-c6852667bafc?q=80&w=1200'} 
                      alt={letter.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-ink/5 group-hover:bg-transparent transition-colors" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-sans tracking-widest text-stone-400 uppercase">
                      <Calendar size={10} /> {letter.date}
                    </div>
                    <h3 className="font-hand text-3xl text-ink group-hover:text-accent-brown transition-colors">{letter.title}</h3>
                    <p className="font-serif text-sm text-stone-500 line-clamp-2 leading-relaxed">
                      {letter.content.replace(/[#*`>]/g, '').slice(0, 80)}...
                    </p>
                    <div className="pt-4 border-t border-stone-50 flex justify-between items-center text-[10px] text-stone-400 font-serif">
                      <span>To: {letter.to}</span>
                      <span>From: {letter.from}</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Stamp */}
                <div className="absolute -top-2 -right-2 w-12 h-12 rotate-12 opacity-20 group-hover:opacity-40 transition-opacity">
                   <div className="w-full h-full border-2 border-dashed border-accent-brown rounded-full flex items-center justify-center text-xs font-serif text-accent-brown font-bold">
                     POST
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- DETAIL VIEW ---
  return (
    <div className={`min-h-screen bg-stone-100/80 pt-32 pb-24 transition-opacity duration-500 ${isClosing ? 'pointer-events-none' : ''}`}>
      {/* Detail Navbar */}
      {!isClosing && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100 py-4 px-6 md:px-12 flex items-center justify-between animate-fade-in">
           <button 
             onClick={handleClose}
             className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors group"
           >
             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
             <span className="font-serif text-sm uppercase tracking-wider">合上信件</span>
           </button>
           <div className="flex items-center gap-4 text-xs font-serif text-stone-400">
              <span className="hidden sm:inline">From: {selectedLetter.from}</span>
              <span className="hidden sm:inline">•</span>
              <span>To: {selectedLetter.to}</span>
           </div>
        </div>
      )}

      <div className={`max-w-4xl mx-auto px-4 md:px-8 relative ${isClosing ? 'animate-envelope-close' : 'animate-slide-up'}`}>
        
        {/* Envelope Flap Decoration for Closing Animation */}
        {isClosing && (
           <div 
             className="absolute top-0 left-0 right-0 h-48 bg-paper-dark shadow-inner z-[60] animate-flap-fold border-b border-stone-200"
             style={{ perspective: '1000px', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
           />
        )}

        {/* The Letter "Paper" Container with Height Control */}
        <div className="bg-white shadow-2xl relative overflow-hidden transition-all duration-700">
          
          {/* Subtle Paper Texture Lines */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 3rem' }} />
          
          <div className="p-8 md:p-16 lg:p-20 flex flex-col max-h-[80vh]">
            
            {/* Header Area (Fixed at top of paper) */}
            <div className="relative z-10 mb-8 shrink-0">
                <div className="flex justify-between items-start mb-6">
                   <h1 className="font-hand text-4xl md:text-5xl text-ink leading-tight">{selectedLetter.title}</h1>
                   <div className="w-16 h-20 bg-stone-50 border border-stone-200 p-1 hidden sm:block rotate-3 grayscale contrast-125 shadow-sm">
                      <img src={selectedLetter.cover} className="w-full h-full object-cover" />
                   </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-stone-400 font-serif text-sm border-b border-stone-100 pb-6">
                  <div className="flex items-center gap-2"><Clock size={14}/> {selectedLetter.date}</div>
                  <div className="flex items-center gap-2"><User size={14}/> {selectedLetter.from}</div>
                  {selectedLetter.tags?.map(tag => (
                    <div key={tag} className="flex items-center gap-1"><Tag size={12}/> {tag}</div>
                  ))}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="relative flex-1 overflow-y-auto letter-scroll-container pr-2">
              <article className="relative z-10 prose prose-stone lg:prose-lg max-w-none prose-headings:font-hand prose-headings:text-accent-brown prose-p:font-serif prose-p:leading-[3rem] prose-p:mb-0 prose-blockquote:font-hand prose-blockquote:text-stone-400 prose-a:text-accent-brown prose-strong:text-ink">
                 <ReactMarkdown>{selectedLetter.content}</ReactMarkdown>
              </article>
              {/* Spacer for bottom fading */}
              <div className="h-20 w-full" />
            </div>

            {/* Fixed Footer Area (at bottom of paper) */}
            <div className="relative z-10 mt-4 pt-8 border-t border-stone-100 text-right shrink-0 bg-white/80 backdrop-blur-[2px]">
               <p className="font-hand text-4xl text-ink mb-2">{selectedLetter.from}</p>
               <p className="font-serif text-sm text-stone-400 italic">于 {selectedLetter.date}</p>
            </div>

            {/* Floating indicator to suggest more content below */}
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 animate-bounce opacity-20 pointer-events-none">
                <ChevronDown size={24} />
            </div>
          </div>

          {/* Fading Mask at the bottom of content */}
          <div className="absolute bottom-32 left-0 right-0 h-16 bg-gradient-to-t from-white/90 to-transparent pointer-events-none z-[5]" />
        </div>

        {/* Bottom Closing Button */}
        {!isClosing && (
          <div className="mt-12 text-center">
             <button 
               onClick={handleClose}
               className="px-10 py-3 bg-ink text-white font-serif rounded-sm hover:bg-accent-brown transition-all shadow-lg hover:scale-105 active:scale-95"
             >
               合上信封
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
