
import React, { useState, useEffect } from 'react';
import { Photo } from '../types';
import { GALLERY_PHOTOS } from '../data';
import { ImmersiveLightbox } from '../components/ImmersiveLightbox';
import { Image, PlayCircle } from 'lucide-react';

interface ArtisticGalleryProps {
  initialPhotoId?: string;
}

export const ArtisticGallery: React.FC<ArtisticGalleryProps> = ({ initialPhotoId }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);

  // Deep linking
  useEffect(() => {
    if (initialPhotoId) {
      const index = GALLERY_PHOTOS.findIndex(p => p.id === initialPhotoId);
      if (index !== -1) {
        setSelectedPhotoIndex(index);
      }
    }
  }, [initialPhotoId]);

  const handleNext = () => {
    if (selectedPhotoIndex < GALLERY_PHOTOS.length - 1) {
      setSelectedPhotoIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(prev => prev - 1);
    }
  };

  const getTagColor = (tag: string) => {
    if (tag === '旅行日记') return 'bg-[#5c8cba]'; // Muted Blue from screenshot
    if (tag === '生活点滴') return 'bg-[#8c7b75]'; // Warm Brown
    if (tag === '视频') return 'bg-rose-400';
    return 'bg-stone-500';
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-20 animate-fade-in">
      
      {/* Grid container: Tight gap to simulate the masonry feel */}
      <div className="p-1 md:p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-2">
          {GALLERY_PHOTOS.map((photo, index) => (
            <div 
              key={photo.id}
              className="relative aspect-square md:aspect-[4/3] group overflow-hidden cursor-pointer bg-stone-200"
              onClick={() => setSelectedPhotoIndex(index)}
            >
              {/* Image or Video Thumbnail */}
              {photo.mediaType === 'video' ? (
                <div className="w-full h-full relative">
                  <video 
                    src={photo.url[0]}
                    poster={photo.poster}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseOver={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <PlayCircle size={40} className="text-white/80 group-hover:scale-110 transition-transform" strokeWidth={1} />
                  </div>
                </div>
              ) : (
                <img 
                  src={photo.url[0]} 
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

              {/* Top Left Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`${getTagColor(photo.tags[0])} text-white text-[10px] md:text-xs px-2 py-1 rounded-sm shadow-sm backdrop-blur-sm opacity-90 tracking-wide font-sans`}>
                  {photo.tags[0]}
                </span>
              </div>

              {/* Bottom Text Content */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                 <h3 className="font-bold text-lg md:text-xl leading-tight mb-1 drop-shadow-md">{photo.title}</h3>
                 {/* Optional: Show camera icon on hover */}
                 <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                    <div className="flex items-center gap-2 text-xs text-white/80 pt-1">
                       <Image size={12} />
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">查看详情</span>
                    </div>
                 </div>
              </div>

              {/* Right Bottom Icon (Watermark-ish) */}
              <div className="absolute bottom-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
                 <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[8px] text-white">
                    黄家蓉宝
                 </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Immersive Lightbox */}
      {selectedPhotoIndex >= 0 && (
        <ImmersiveLightbox 
          photo={GALLERY_PHOTOS[selectedPhotoIndex]}
          onClose={() => setSelectedPhotoIndex(-1)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedPhotoIndex < GALLERY_PHOTOS.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}

      <footer className="py-8 text-center text-stone-400 text-xs">
         <p>Photography Gallery © 2025</p>
      </footer>
    </div>
  );
};
