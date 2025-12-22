
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const isVideo = photo.mediaType === 'video';

  const content = (
    <div 
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in select-none group/lightbox"
      onClick={onClose} 
    >
      {/* Background Effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center blur-3xl"
        style={{ backgroundImage: `url(${photo.poster || photo.url[0]})` }}
      />

      {/* Top Controls - Significantly increased offset for mobile */}
      <div 
        className={`fixed right-4 md:right-8 flex items-center gap-3 md:gap-4 z-[100001] transition-all ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 2rem)' }}
      >
         {!isVideo && (
           <button 
             onClick={(e) => { e.stopPropagation(); setIsShareOpen(true); }}
             className="p-2.5 md:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md border border-white/10 shadow-lg"
           >
             <Share2 size={24} strokeWidth={1.5} />
           </button>
         )}
         
         <button 
           onClick={(e) => { e.stopPropagation(); onClose(); }}
           className="p-2.5 md:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md border border-white/10 shadow-lg"
         >
           <X size={32} strokeWidth={1} />
         </button>
      </div>

      {/* Navigation */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-[9999]">
         {hasPrev ? (
           <button 
             onClick={(e) => { e.stopPropagation(); onPrev(); }}
             className={`pointer-events-auto h-full px-4 md:px-8 text-white/30 hover:text-white transition-colors flex items-center outline-none ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
           >
             <ChevronLeft size={64} strokeWidth={0.5} />
           </button>
         ) : <div />}
         
         {hasNext ? (
           <button 
             onClick={(e) => { e.stopPropagation(); onNext(); }}
             className={`pointer-events-auto h-full px-4 md:px-8 text-white/30 hover:text-white transition-colors flex items-center outline-none ${showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
           >
             <ChevronRight size={64} strokeWidth={0.5} />
           </button>
         ) : <div />}
      </div>

      {/* Main Content Area - Added top padding for mobile */}
      <div className="relative w-full h-full p-4 md:p-12 pt-32 md:pt-12 flex items-center justify-center overflow-hidden z-[50]">
        {isVideo ? (
           <video 
             src={photo.url[0]} 
             poster={photo.poster}
             controls
             autoPlay
             className="max-h-full max-w-full object-contain shadow-2xl animate-scale-in"
             onClick={(e) => { e.stopPropagation(); setShowControls(!showControls); }}
           />
        ) : (
           <img 
             src={photo.url[0]} 
             alt={photo.title} 
             className="max-h-full max-w-full object-contain shadow-2xl animate-scale-in"
             onClick={(e) => { e.stopPropagation(); setShowControls(!showControls); }}
           />
        )}
      </div>

      {/* Bottom Info Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-32 pb-10 px-6 md:px-12 transition-opacity duration-300 pointer-events-none z-[60] ${showControls ? 'opacity-100' : 'opacity-0'}`}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-auto">
          <div className="flex-1 text-white">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{photo.title}</h2>
            <div className="flex wrap items-center gap-4 text-xs text-white/60 font-mono">
              <div className="flex items-center gap-2"><MapPin size={14} /><span>{photo.location || 'Unknown'}</span></div>
              <div className="flex items-center gap-2"><Clock size={14} /><span>{photo.date}</span></div>
            </div>
          </div>
        </div>
      </div>

      {isShareOpen && (
        <ShareModal 
          photo={photo} 
          onClose={() => setIsShareOpen(false)} 
        />
      )}
    </div>
  );

  const root = document.getElementById('root') || document.body;
  return createPortal(content, root);
};
