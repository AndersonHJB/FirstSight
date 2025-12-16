
import React, { useState, useEffect } from 'react';
import { WEDDING_COLLECTIONS } from '../constants';
import { WeddingSeries } from '../types';
import { ArrowLeft, Camera, Heart, Flower2 } from 'lucide-react';
import { ImmersiveLightbox } from '../components/ImmersiveLightbox';

export const WeddingPage: React.FC = () => {
  const [selectedSeries, setSelectedSeries] = useState<WeddingSeries | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);

  // Reset scroll when switching views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedSeries]);

  const handleNext = () => {
    if (!selectedSeries) return;
    if (selectedPhotoIndex < selectedSeries.photos.length - 1) {
      setSelectedPhotoIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(prev => prev - 1);
    }
  };

  // --- SERIES LIST VIEW ---
  if (!selectedSeries) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <div className="inline-block p-3 rounded-full bg-rose-50 text-rose-300 mb-4">
             <Heart size={24} strokeWidth={1} fill="currentColor" />
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-stone-800 mb-4">甜蜜婚纱</h1>
          <p className="font-hand text-2xl text-stone-400">Our Love Story</p>
        </div>

        {/* Collections Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {WEDDING_COLLECTIONS.map((series, idx) => (
              <div 
                key={series.id}
                onClick={() => setSelectedSeries(series)}
                className="group cursor-pointer flex flex-col items-center"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Card / Book Cover Look */}
                <div className="relative w-full aspect-[3/4] mb-6 shadow-2xl transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] bg-white p-2">
                  <div className="w-full h-full relative overflow-hidden bg-stone-100">
                    <img 
                      src={series.cover} 
                      alt={series.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter saturate-[0.8] group-hover:saturate-100"
                    />
                    
                    {/* Overlay Text on Hover */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    
                    <div className="absolute bottom-6 left-0 right-0 text-center text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       <span className="uppercase tracking-[0.2em] text-xs border border-white/50 px-3 py-1 rounded-sm backdrop-blur-sm">
                         View Collection
                       </span>
                    </div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="text-center space-y-2">
                  <h3 className="font-serif text-2xl text-stone-800 group-hover:text-rose-900 transition-colors">
                    {series.title}
                  </h3>
                  <p className="text-xs font-sans tracking-widest text-stone-400 uppercase">
                    {series.subtitle}
                  </p>
                  <p className="text-sm font-serif text-stone-500 italic pt-2">
                    {series.photos.length} Photos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- SERIES DETAIL VIEW ---
  return (
    <div className="min-h-screen bg-[#fff] pt-24 pb-20 animate-fade-in">
      
      {/* Top Nav / Breadcrumb */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-stone-100 py-4 px-6 md:px-12 flex items-center justify-between">
         <button 
           onClick={() => setSelectedSeries(null)}
           className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors group"
         >
           <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
           <span className="font-serif text-sm uppercase tracking-wider">Back to Collections</span>
         </button>
         
         <div className="hidden md:block text-center">
            <h2 className="font-serif text-lg text-stone-800">{selectedSeries.title}</h2>
            <span className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">{selectedSeries.subtitle}</span>
         </div>

         <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Hero Header for Series */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-20 text-center">
         <div className="mb-6 flex justify-center text-rose-200">
           <Flower2 size={40} strokeWidth={1} />
         </div>
         <p className="font-serif text-lg md:text-xl text-stone-500 leading-relaxed max-w-2xl mx-auto italic">
           "{selectedSeries.description}"
         </p>
         <div className="mt-8 flex items-center justify-center gap-6 text-xs text-stone-400 uppercase tracking-widest font-sans">
            <span>{selectedSeries.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Camera size={12}/> {selectedSeries.photographer}</span>
         </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-[1600px] mx-auto px-2 md:px-6">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {selectedSeries.photos.map((photo, idx) => (
            <div 
              key={photo.id}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden bg-stone-100"
              onClick={() => setSelectedPhotoIndex(idx)}
            >
              <img 
                src={photo.url[0]} 
                alt={photo.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer for Detail Page */}
      <div className="text-center pt-24 pb-12">
        <div className="w-12 h-1px bg-stone-200 mx-auto mb-6" />
        <p className="font-hand text-2xl text-stone-300">Forever & Always</p>
      </div>

      {/* Lightbox */}
      {selectedPhotoIndex >= 0 && (
        <ImmersiveLightbox 
          photo={selectedSeries.photos[selectedPhotoIndex]}
          onClose={() => setSelectedPhotoIndex(-1)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedPhotoIndex < selectedSeries.photos.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}

    </div>
  );
};
