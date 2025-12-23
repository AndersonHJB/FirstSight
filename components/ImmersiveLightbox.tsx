import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Photo } from '../types';
import { X, ChevronLeft, ChevronRight, MapPin, Aperture, Clock, Camera, PlayCircle, Share2 } from 'lucide-react';
import { ShareModal } from './ShareModal';

interface ImmersiveLightboxProps {
  photo: Photo;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const ImmersiveLightbox: React.FC<ImmersiveLightboxProps> = ({ 
  photo, 
  onClose, 
  onNext, 
  onPrev,
  hasNext,
  hasPrev
}) => {
  const [showControls, setShowControls] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isShareOpen) setIsShareOpen(false);
        else onClose();
      }
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev, isShareOpen]);

  // --- 移动端特化 Body 锁定逻辑 ---
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const scrollY = window.scrollY;
    const originalStyle = document.body.style.cssText;

    if (isMobile) {
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (isMobile) {
        document.body.style.cssText = originalStyle;
        window.scrollTo(0, scrollY);
      } else {
        document.body.style.overflow = '';
      }
    };
  }, []);

  // --- 移动端触摸切换逻辑 ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && hasNext) onNext(); 
      else if (diff < 0 && hasPrev) onPrev();
    }
    touchStartX.current = null;
  };

  const isVideo = photo.mediaType === 'video';

  const content = (
    <div 
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in select-none group/lightbox touch-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center blur-3xl"
        style={{ backgroundImage: `url(${photo.poster || photo.url[0]})` }}
      />

      <div className={`absolute top-6 right-6 flex items-center gap-4 z-[10000] transition-all ${showControls ? 'opacity-100' : 'opacity-0'}`}>
         {!isVideo && (
           <button onClick={(e) => { e.stopPropagation(); setIsShareOpen(true); }} className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer pointer-events-auto">
             <Share2 size={24} strokeWidth={1.5} />
           </button>
         )}
         <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer pointer-events-auto">
           <X size={32} strokeWidth={1} />
         </button>
      </div>

      <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-[9999]">
         {hasPrev ? (
           <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className={`pointer-events-auto h-full px-4 md:px-8 text-white/30 hover:text-white transition-colors flex items-center outline-none ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
             <ChevronLeft size={64} strokeWidth={0.5} />
           </button>
         ) : <div />}
         {hasNext ? (
           <button onClick={(e) => { e.stopPropagation(); onNext(); }} className={`pointer-events-auto h-full px-4 md:px-8 text-white/30 hover:text-white transition-colors flex items-center outline-none ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
             <ChevronRight size={64} strokeWidth={0.5} />
           </button>
         ) : <div />}
      </div>

      <div className="relative w-full h-full p-0 md:p-12 flex items-center justify-center overflow-hidden z-[50] touch-none">
        {isVideo ? (
           <video src={photo.url[0]} poster={photo.poster} controls autoPlay className="max-h-full max-w-full object-contain shadow-2xl animate-scale-in" onClick={(e) => { e.stopPropagation(); setShowControls(!showControls); }} />
        ) : (
           <img src={photo.url[0]} alt={photo.title} className="max-h-full max-w-full object-contain shadow-2xl animate-scale-in transition-transform duration-500" onClick={(e) => { e.stopPropagation(); setShowControls(!showControls); }} />
        )}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent pt-32 pb-10 px-6 md:px-12 transition-opacity duration-300 pointer-events-none z-[60] ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-auto touch-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex-1 text-white">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{photo.title}</h2>
            <div className="flex items-center gap-4 mb-2">
               {photo.tags.map(tag => <span key={tag} className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs font-light">{tag}</span>)}
            </div>
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl font-light mb-4 hidden md:block">{photo.description}</p>
            <div className="flex wrap items-center gap-4 md:gap-8 text-xs md:text-sm text-white/60 font-mono tracking-wide">
              {photo.exif?.device && <div className="flex items-center gap-2"><Camera size={16} /><span>{photo.exif.device}</span></div>}
              {photo.exif?.params && <div className="flex items-center gap-2"><Aperture size={16} /><span>{photo.exif.params}</span></div>}
              <div className="flex items-center gap-2"><MapPin size={16} /><span>{photo.location || 'Unknown Location'}</span></div>
              <div className="flex items-center gap-2"><Clock size={16} /><span>{photo.date}</span></div>
            </div>
          </div>
          <div className="text-white/40 flex items-center gap-2 font-serif italic text-sm">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">黄</div>
            <span>Bornforthis</span>
          </div>
        </div>
      </div>

      {isShareOpen && <ShareModal photo={photo} onClose={() => setIsShareOpen(false)} />}
    </div>
  );

  const root = document.getElementById('root') || document.body;
  return createPortal(content, root);
};