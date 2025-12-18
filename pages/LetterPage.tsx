
import React, { useState, useEffect } from 'react';
import { LETTERS_DATA } from '../data';
import { Letter } from '../types';
import { Mail, ArrowLeft, Calendar, User, Tag, Clock, ChevronDown, X } from 'lucide-react';
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
    // Sequence: 1. Paper slides down -> 2. Flap folds -> 3. Whole envelope fades
    setTimeout(() => {
      setSelectedLetter(null);
      setIsClosing(false);
    }, 1200);
  };

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
                <div className="bg-white p-6 md:p-8 shadow-polaroid group-hover:shadow-polaroid-hover transition-all duration-500 transform group-hover:-translate-y-2 border border-stone-100">
                  <div className="relative aspect-video mb-6 overflow-hidden rounded-sm bg-stone-50">
                    <img 
                      src={letter.cover || 'https://images.unsplash.com/photo-1516589174184-c6852667bafc?q=80&w=1200'} 
                      alt={letter.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
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
                <div className="absolute -top-2 -right-2 w-12 h-12 rotate-12 opacity-20 group-hover:opacity-40 transition-opacity">
                   <div className="w-full h-full border-2 border-dashed border-accent-brown rounded-full flex items-center justify-center text-xs font-serif text-accent-brown font-bold">POST</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-stone-900/10 backdrop-blur-sm transition-opacity duration-500 ${isClosing ? 'pointer-events-none' : 'animate-fade-in'}`}>
      
      {/* Detached Back Button (Floating outside paper) */}
      {!isClosing && (
        <button 
          onClick={handleClose}
          className="absolute top-8 right-8 z-[110] p-3 bg-white/80 hover:bg-white text-stone-400 hover:text-ink rounded-full shadow-lg transition-all hover:scale-110"
        >
          <X size={24} strokeWidth={1.5} />
        </button>
      )}

      {/* The Physical Letter Wrapper */}
      <div className={`relative w-full max-w-4xl h-[90vh] flex flex-col perspective-[2000px] ${isClosing ? 'animate-envelope-finish' : ''}`}>
        
        {/* Envelope Top Flap (Visible only when closing) */}
        <div 
          className={`absolute top-0 left-0 right-0 h-[45%] bg-paper-dark shadow-inner z-[110] border-b border-stone-200 pointer-events-none opacity-0 ${isClosing ? 'opacity-100 animate-flap-close' : ''}`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
        />

        {/* The Paper Component */}
        <div className={`relative flex-1 bg-white shadow-2xl overflow-hidden flex flex-col rounded-sm border border-stone-100/50 transition-all duration-700 ${isClosing ? 'animate-letter-out' : 'animate-slide-up'}`}>
          
          {/* Paper Texture Lines */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.8rem' }} />

          {/* Letter Head (Pinned at Top) */}
          <div className="relative z-10 px-8 pt-8 md:px-16 md:pt-12 shrink-0 bg-white/90 backdrop-blur-sm border-b border-stone-50">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h1 className="font-hand text-4xl md:text-5xl text-ink leading-tight mb-2">{selectedLetter.title}</h1>
                  <div className="flex items-center gap-4 text-stone-400 font-serif text-sm">
                    <span className="flex items-center gap-1.5"><Clock size={14}/> {selectedLetter.date}</span>
                    <span className="flex items-center gap-1.5"><User size={14}/> {selectedLetter.from}</span>
                  </div>
               </div>
               <div className="w-16 h-20 bg-stone-50 border border-stone-200 p-1 hidden sm:block rotate-3 grayscale contrast-125 shadow-sm shrink-0">
                  <img src={selectedLetter.cover} className="w-full h-full object-cover" alt="stamp" />
               </div>
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="relative flex-1 overflow-y-auto letter-scroll-container px-8 md:px-16 py-8">
            <article className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-hand prose-headings:text-accent-brown prose-p:font-serif prose-p:leading-[2.8rem] prose-p:mb-0 prose-blockquote:font-hand prose-blockquote:text-stone-400 prose-a:text-accent-brown prose-strong:text-ink">
               <ReactMarkdown>{selectedLetter.content}</ReactMarkdown>
            </article>
            {/* Scroll Indicator Spacer */}
            <div className="h-12" />
          </div>

          {/* Letter Footer (Pinned at Bottom) */}
          <div className="relative z-10 px-8 pb-8 md:px-16 md:pb-12 pt-6 shrink-0 bg-white/95 backdrop-blur-md border-t border-stone-100 flex flex-col items-end">
             {!isClosing && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20 pointer-events-none">
                  <ChevronDown size={24} />
                </div>
             )}
             <p className="font-hand text-4xl text-ink mb-1">{selectedLetter.from}</p>
             <p className="font-serif text-xs text-stone-400 italic">写于 {selectedLetter.date}</p>
             
             {/* Integrated Close Button */}
             <button 
               onClick={handleClose}
               className="mt-8 px-8 py-2.5 bg-ink text-white font-serif text-sm rounded-sm hover:bg-accent-brown transition-all shadow-md active:scale-95"
             >
               合上信封
             </button>
          </div>

          {/* Subtle bottom fade */}
          <div className="absolute bottom-40 left-0 right-0 h-16 bg-gradient-to-t from-white/80 to-transparent pointer-events-none z-[5]" />
        </div>

        {/* Envelope Base (Behind the paper) */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-paper-dark rounded-b-sm shadow-2xl -z-10 border-t border-stone-200/50" />
      </div>
    </div>
  );
};
