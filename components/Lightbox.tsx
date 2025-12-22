import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Photo } from '../types';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Camera, Play, Share2 } from 'lucide-react';
import { ShareModal } from './ShareModal';

interface LightboxProps {
  photo: Photo;
  currentUrlIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ photo, currentUrlIndex, onClose, onNext, onPrev }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isShareOpen) setIsShareOpen(false);
        else onClose();
      }
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, isShareOpen]);

  // 禁止背景滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const isVideo = photo.mediaType === 'video';

  const lightboxContent = (
    <div 
      className="fixed inset-0 z-[150] bg-paper/95 backdrop-blur-md flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      
      {/* Controls: 在手机端增加 top 间距以避开导航栏 */}
      <div className="absolute top-24 md:top-6 right-6 flex items-center gap-4 z-[160]">
         {!isVideo && (
           <button 
             onClick={(e) => { e.stopPropagation(); setIsShareOpen(true); }} 
             className="p-2.5 rounded-full hover:bg-stone-200/50 text-ink transition-colors bg-white/20 backdrop-blur-sm shadow-sm md:shadow-none"
             title="分享明信片"
           >
             <Share2 size={24} strokeWidth={1.5} />
           </button>
         )}
         <button 
           onClick={(e) => { e.stopPropagation(); onClose(); }} 
           className="p-2.5 rounded-full hover:bg-stone-200/50 transition-colors text-ink bg-white/20 backdrop-blur-sm shadow-sm md:shadow-none"
         >
           <X size={28} strokeWidth={1.5} />
         </button>
      </div>

      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="pointer-events-auto p-4 hover:text-accent-brown text-stone-300 transition-colors hidden md:block"
        >
          <ChevronLeft size={48} strokeWidth={1} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="pointer-events-auto p-4 hover:text-accent-brown text-stone-300 transition-colors hidden md:block"
        >
          <ChevronRight size={48} strokeWidth={1} />
        </button>
      </div>

      {/* Book / Album Layout */}
      <div 
        className="w-full h-full md:h-auto md:max-h-[85vh] md:max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-[4px] bg-[#fdfbf7]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Photo/Video Side */}
        <div className="flex-1 md:flex-[3] bg-stone-100/50 relative flex items-center justify-center p-4 md:p-12">
           {isVideo ? (
             <video
               key={`${photo.id}-${currentUrlIndex}`}
               src={photo.url[currentUrlIndex]}
               controls
               autoPlay
               className="max-h-full max-w-full object-contain shadow-lg border-[8px] border-white animate-fade-in"
               poster={photo.poster}
             />
           ) : (
             <img 
               key={`${photo.id}-${currentUrlIndex}`} 
               src={photo.url[currentUrlIndex]} 
               alt={photo.title} 
               className="max-h-full max-w-full object-contain shadow-lg border-[8px] border-white animate-fade-in"
             />
           )}
           
           {!isVideo && photo.url.length > 1 && (
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-mono tracking-widest">
                {currentUrlIndex + 1} / {photo.url.length}
             </div>
           )}
        </div>

        {/* Story Side */}
        <div className="flex-1 md:flex-[1.5] bg-paper relative p-8 md:p-12 overflow-y-auto flex flex-col justify-center border-l border-stone-100">
           
           <div className="flex flex-col gap-1 mb-8 border-b border-stone-200 pb-6">
              <div className="flex items-center gap-3 text-accent-brown font-serif text-sm">
                <span className="flex items-center gap-1.5"><Calendar size={14}/> {photo.date}</span>
                {photo.location && <span className="flex items-center gap-1.5"><MapPin size={14}/> {photo.location}</span>}
              </div>
              <h2 className="font-hand text-4xl text-ink mt-2">{photo.title}</h2>
           </div>

           <div className="flex-1">
             <p className="font-serif text-lg text-stone-600 leading-8 whitespace-pre-line first-letter:text-4xl first-letter:font-hand first-letter:text-accent-brown first-letter:mr-1">
               {photo.description}
             </p>
           </div>

           <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap gap-2">
              {photo.tags.map(tag => (
                <span key={tag} className="text-xs font-sans tracking-wide text-stone-400 uppercase">
                  #{tag}
                </span>
              ))}
           </div>
           
           <div className="mt-8 flex items-center justify-center opacity-30">
              {isVideo ? <Play size={24} className="text-stone-400" /> : <Camera size={24} className="text-stone-400" />}
           </div>
        </div>
      </div>

      {/* Share Modal Integration */}
      {isShareOpen && (
        <ShareModal 
          photo={photo} 
          onClose={() => setIsShareOpen(false)} 
        />
      )}
    </div>
  );

  const root = document.getElementById('root') || document.body;
  return createPortal(lightboxContent, root);
};