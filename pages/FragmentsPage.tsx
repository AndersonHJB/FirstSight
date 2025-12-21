
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, TRAVEL_TRIPS } from '../data';
import { Photo } from '../types';
import { ImmersiveLightbox } from '../components/ImmersiveLightbox';
import { RefreshCw, ZoomIn, Info, Grab } from 'lucide-react';

interface Fragment extends Photo {
  x: number;
  y: number;
  rotate: number;
  zIndex: number;
}

export const FragmentsPage: React.FC = () => {
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(100);
  
  // Dragging State
  const [dragInfo, setDragInfo] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allPhotos = useMemo(() => {
    const travelPhotos = TRAVEL_TRIPS.flatMap(t => t.photos);
    return [...FAMILY_PHOTOS, ...BABY_PHOTOS, ...GALLERY_PHOTOS, ...travelPhotos];
  }, []);

  const generateFragments = () => {
    setIsRefreshing(true);
    const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, window.innerWidth < 768 ? 8 : 15);

    // 碎片的 zIndex 从 10 开始，避免与背景层冲突
    const newFragments = picked.map((photo, index) => ({
      ...photo,
      x: 15 + Math.random() * 70,
      y: 20 + Math.random() * 60,
      rotate: (Math.random() - 0.5) * 30,
      zIndex: 10 + index
    }));

    setFragments(newFragments);
    setMaxZIndex(10 + newFragments.length);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    generateFragments();
  }, []);

  // --- Unified Dragging Initiation ---
  const startDragging = (id: string, clientX: number, clientY: number) => {
    const target = fragments.find(f => f.id === id);
    if (!target) return;

    // Bring to front
    const newMaxZ = maxZIndex + 1;
    setMaxZIndex(newMaxZ);
    setFragments(prev => prev.map(f => f.id === id ? { ...f, zIndex: newMaxZ } : f));

    setDragInfo({
      id,
      startX: clientX,
      startY: clientY,
      origX: target.x,
      origY: target.y
    });
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return;
    startDragging(id, e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const touch = e.touches[0];
    startDragging(id, touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number, e?: MouseEvent | TouchEvent) => {
      if (!dragInfo || !containerRef.current) return;

      const dx = ((clientX - dragInfo.startX) / containerRef.current.clientWidth) * 100;
      const dy = ((clientY - dragInfo.startY) / containerRef.current.clientHeight) * 100;

      setFragments(prev => prev.map(f => 
        f.id === dragInfo.id 
          ? { ...f, x: dragInfo.origX + dx, y: dragInfo.origY + dy } 
          : f
      ));

      if (e && e.cancelable) e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY, e);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    };

    const stopDragging = () => setDragInfo(null);

    if (dragInfo) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', stopDragging);
      window.addEventListener('touchcancel', stopDragging);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
      window.removeEventListener('touchcancel', stopDragging);
    };
  }, [dragInfo]);

  const handleNext = () => {
    if (selectedPhotoIndex < fragments.length - 1) {
      setSelectedPhotoIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(prev => prev - 1);
    }
  };

  const quotes = [
    "时间是一封没有回信的家书。",
    "有些瞬间，注定要被反复咀嚼。",
    "我们捡起时光的碎片，拼凑出爱的模样。",
    "记忆是唯一的行囊。",
    "慢慢长大，也是一种浪漫。"
  ];
  
  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], [isRefreshing]);

  return (
    <div className="min-h-screen bg-paper overflow-hidden relative pt-20">
      {/* Background Subtle Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#8c7b75 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Header Info - Set to z-10 */}
      <div className="absolute top-28 left-0 right-0 z-10 px-6 text-center pointer-events-none">
         <h1 className="font-hand text-5xl text-ink/60 mb-2">时光碎片</h1>
         <p className="font-serif text-[10px] text-stone-300 italic tracking-[0.3em] uppercase">Drag to rearrange and find memories</p>
      </div>

      {/* Background Quote - Changed from z-[-1] to z-0 to avoid being hidden by bg-paper */}
      <div className="fixed inset-0 flex items-center justify-center z-0 opacity-[0.15] select-none px-6 pointer-events-none">
         <p className="font-hand text-3xl md:text-5xl lg:text-6xl text-stone-600 italic text-center max-w-4xl leading-relaxed">
           “ {randomQuote} ”
         </p>
      </div>

      {/* The Canvas */}
      <div ref={containerRef} className="relative w-full h-[85vh] touch-none z-20">
        {fragments.map((frag, idx) => {
          const isDragging = dragInfo?.id === frag.id;
          return (
            <div 
              key={`${frag.id}-${idx}`}
              className={`absolute group 
                ${isRefreshing ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'} 
                ${isDragging ? 'z-[1000]' : 'transition-all duration-1000 ease-out'}`}
              style={{ 
                left: `${frag.x}%`, 
                top: `${frag.y}%`, 
                transform: `translate(-50%, -50%) rotate(${frag.rotate}deg)`,
                zIndex: frag.zIndex
              }}
              onMouseDown={(e) => handleMouseDown(e, frag.id)}
              onTouchStart={(e) => handleTouchStart(e, frag.id)}
            >
              {/* Polaroid Frame */}
              <div className={`bg-white p-2 pb-6 shadow-polaroid border border-stone-100/50 w-32 md:w-48 lg:w-56 select-none
                ${isDragging ? 'shadow-2xl scale-[1.02] cursor-grabbing' : 'cursor-grab group-hover:shadow-polaroid-hover group-hover:-translate-y-2 transition-all duration-500'}`}>
                 <div className="aspect-square overflow-hidden bg-stone-50 relative pointer-events-none">
                    <img src={frag.url[0]} alt="" className="w-full h-full object-cover filter saturate-[0.8] contrast-[1.1]" draggable={false} />
                    <div className="absolute inset-0 bg-orange-950/5 mix-blend-overlay" />
                 </div>
                 
                 <div className="mt-3 px-1 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-hand text-xs md:text-sm text-stone-500 truncate">{frag.title}</p>
                      <p className="text-[8px] font-sans text-stone-300 uppercase tracking-tighter mt-0.5">{frag.date}</p>
                    </div>
                    <button 
                      onMouseDown={(e) => e.stopPropagation()} 
                      onTouchStart={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(idx); }}
                      className="p-1.5 rounded-full bg-stone-50 text-stone-300 hover:text-accent-brown hover:bg-stone-100 transition-colors"
                      title="放大查看"
                    >
                      <ZoomIn size={14} />
                    </button>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Controls */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
         <button 
           onClick={generateFragments}
           disabled={isRefreshing}
           className="group flex items-center gap-3 px-8 py-3 bg-ink text-white rounded-full shadow-2xl hover:bg-accent-brown transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
         >
           <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
           <span className="font-serif text-sm tracking-widest">打乱记忆</span>
         </button>
      </div>

      {/* Hint for Users */}
      <div className="fixed bottom-6 left-6 hidden md:flex items-center gap-3 text-stone-300/60 pointer-events-none z-30">
         <div className="flex items-center gap-1.5">
           <Grab size={12} />
           <span className="text-[9px] font-serif uppercase tracking-widest">拖拽或触摸翻找</span>
         </div>
         <div className="w-1 h-1 rounded-full bg-stone-200" />
         <div className="flex items-center gap-1.5">
           <Info size={12} />
           <span className="text-[9px] font-serif uppercase tracking-widest">每一张碎片，都是一个曾经</span>
         </div>
      </div>

      {/* Lightbox Integration */}
      {selectedPhotoIndex >= 0 && (
        <ImmersiveLightbox 
          photo={fragments[selectedPhotoIndex]}
          onClose={() => setSelectedPhotoIndex(-1)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedPhotoIndex < fragments.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}
    </div>
  );
};
