
import React, { useState, useMemo, useEffect } from 'react';
import { FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, TRAVEL_TRIPS } from '../data';
import { Photo } from '../types';
import { ImmersiveLightbox } from '../components/ImmersiveLightbox';
import { Dices, Sparkles, RefreshCw, ZoomIn, Info } from 'lucide-react';

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

  // Collect all photos from all modules
  const allPhotos = useMemo(() => {
    const travelPhotos = TRAVEL_TRIPS.flatMap(t => t.photos);
    return [...FAMILY_PHOTOS, ...BABY_PHOTOS, ...GALLERY_PHOTOS, ...travelPhotos];
  }, []);

  const generateFragments = () => {
    setIsRefreshing(true);
    // Pick 12-15 random photos
    const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, window.innerWidth < 768 ? 8 : 15);

    const newFragments = picked.map((photo, index) => ({
      ...photo,
      // Random position within safe bounds (percentage)
      x: 10 + Math.random() * 70,
      y: 15 + Math.random() * 65,
      // Random rotation between -15 and 15 degrees
      rotate: (Math.random() - 0.5) * 30,
      zIndex: index
    }));

    setFragments(newFragments);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    generateFragments();
  }, []);

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
  
  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], [fragments]);

  return (
    <div className="min-h-screen bg-paper overflow-hidden relative pt-20">
      {/* Background Subtle Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#8c7b75 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Header Info */}
      <div className="absolute top-28 left-0 right-0 z-10 px-6 text-center pointer-events-none">
         <h1 className="font-hand text-5xl text-ink/80 mb-2">时光碎片</h1>
         <p className="font-serif text-sm text-stone-400 italic tracking-widest uppercase">Random Echoes of Memories</p>
      </div>

      {/* The Canvas */}
      <div className="relative w-full h-[85vh]">
        {fragments.map((frag, idx) => (
          <div 
            key={`${frag.id}-${idx}`}
            className={`absolute transition-all duration-1000 ease-out group cursor-pointer
              ${isRefreshing ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
            style={{ 
              left: `${frag.x}%`, 
              top: `${frag.y}%`, 
              transform: `translate(-50%, -50%) rotate(${frag.rotate}deg)`,
              zIndex: frag.zIndex
            }}
            onClick={() => setSelectedPhotoIndex(idx)}
          >
            {/* Polaroid Frame */}
            <div className="bg-white p-2 pb-6 shadow-polaroid group-hover:shadow-polaroid-hover group-hover:-translate-y-4 group-hover:rotate-0 transition-all duration-500 w-32 md:w-48 lg:w-56 border border-stone-100/50">
               <div className="aspect-square overflow-hidden bg-stone-50 relative">
                  <img src={frag.url[0]} alt="" className="w-full h-full object-cover filter saturate-[0.8] contrast-[1.1]" />
                  <div className="absolute inset-0 bg-orange-900/5 mix-blend-overlay" />
                  
                  {/* Quick Look Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                     <ZoomIn size={24} className="text-white" />
                  </div>
               </div>
               <div className="mt-3 px-1">
                  <p className="font-hand text-xs md:text-sm text-stone-500 truncate">{frag.title}</p>
                  <p className="text-[8px] font-sans text-stone-300 uppercase tracking-tighter mt-0.5">{frag.date}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Controls */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
         <button 
           onClick={generateFragments}
           disabled={isRefreshing}
           className="group flex items-center gap-3 px-8 py-3 bg-ink text-white rounded-full shadow-2xl hover:bg-accent-brown transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
         >
           <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
           <span className="font-serif text-sm tracking-widest">打乱回忆</span>
         </button>
      </div>

      {/* Background Quote */}
      <div className="fixed bottom-32 left-0 right-0 text-center z-0 opacity-30 select-none px-6">
         <p className="font-hand text-2xl md:text-3xl text-stone-400">“ {randomQuote} ”</p>
      </div>

      {/* Hint for Users */}
      <div className="fixed bottom-6 left-6 hidden md:flex items-center gap-2 text-stone-300">
         <Info size={14} />
         <span className="text-[10px] font-serif uppercase tracking-widest">每一张碎片，都是一个曾经。</span>
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
