import React, { useEffect, useState, useRef } from 'react';
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
  const touchStartX = useRef<number | null>(null);

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

  // --- 移动端特化 Body 锁定逻辑 ---
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const scrollY = window.scrollY;
    const originalStyle = document.body.style.cssText;

    if (isMobile) {
      // 移动端采用 fixed 锁定法
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // 电脑端采用标准 overflow 隐藏
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (isMobile) {
        document.body.style.cssText = originalStyle;
        window.scrollTo(0, scrollY);
      } else {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  // --- 触摸滑动手势 ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) onNext(); 
      else onPrev();
    }
    touchStartX.current = null;
  };

  const isVideo = photo.mediaType === 'video';

  const lightboxContent = (
    <div 
      className="fixed inset-0 z-[2000] bg-paper md:bg-paper/95 backdrop-blur-md flex items-center justify-center animate-fade-in touch-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-[2010]">
         {!isVideo && (
           <button 
             onClick={(e) => { e.stopPropagation(); setIsShareOpen(true); }} 
             className="p-2.5 rounded-full hover:bg-stone-200/50 text-ink transition-colors bg-white/20 backdrop-blur-sm shadow-sm md:shadow-none pointer-events-auto"
             title="分享明信片"
           >
             <Share2 size={24} strokeWidth={1.5} />
           </button>
         )}
         <button 
           onClick={(e) => { e.stopPropagation(); onClose(); }} 
           className="p-2.5 rounded-full hover:bg-stone-200/50 transition-colors text-ink bg-white/20 backdrop-blur-sm shadow-sm md:shadow-none pointer-events-auto"
         >
           <X size={28} strokeWidth={1.5} />
         </button>
      </div>

      {/* Desktop Navigation */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="pointer-events-auto p-4 hover:text-accent-brown text-stone-300 transition-colors hidden md:block">
          <ChevronLeft size={48} strokeWidth={1} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="pointer-events-auto p-4 hover:text-accent-brown text-stone-300 transition-colors hidden md:block">
          <ChevronRight size={48} strokeWidth={1} />
        </button>
      </div>

      {/* Album Layout */}
      <div 
        className="w-full h-full md:h-auto md:max-h-[85vh] md:max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-[4px] bg-[#fdfbf7] touch-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 md:flex-[3] bg-stone-100/50 relative flex items-center justify-center p-4 md:p-12 touch-none">
           {isVideo ? (
             <video key={`${photo.id}-${currentUrlIndex}`} src={photo.url[currentUrlIndex]} controls autoPlay className="max-h-full max-w-full object-contain shadow-lg border-[4px] md:border-[8px] border-white animate-fade-in" poster={photo.poster} />
           ) : (
             <img key={`${photo.id}-${currentUrlIndex}`} src={photo.url[currentUrlIndex]} alt={photo.title} className="max-h-full max-w-full object-contain shadow-lg border-[4px] md:border-[8px] border-white animate-fade-in" />
           )}
           {!isVideo && photo.url.length > 1 && (
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-mono tracking-widest">{currentUrlIndex + 1} / {photo.url.length}</div>
           )}
        </div>

        <div className="flex-1 md:flex-[1.5] bg-paper relative p-8 md:p-12 overflow-y-auto flex flex-col justify-center border-t md:border-t-0 md:border-l border-stone-100 touch-auto">
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
              {photo.tags.map(tag => <span key={tag} className="text-xs font-sans tracking-wide text-stone-400 uppercase">#{tag}</span>)}
           </div>
           <div className="mt-8 flex items-center justify-center opacity-30">
              {isVideo ? <Play size={24} className="text-stone-400" /> : <Camera size={24} className="text-stone-400" />}
           </div>
        </div>
      </div>

      {isShareOpen && <ShareModal photo={photo} onClose={() => setIsShareOpen(false)} />}
    </div>
  );

  return createPortal(lightboxContent, document.body);
};