import React from 'react';
import { Photo } from '../types';
import { MapPin, Layers } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 p-4 md:p-0">
      {photos.map((photo, idx) => (
        <div 
          key={photo.id}
          className="break-inside-avoid group cursor-pointer"
          onClick={() => onPhotoClick(photo)}
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Card Container */}
          <div className="relative bg-white p-3 pb-8 shadow-polaroid hover:shadow-polaroid-hover transition-all duration-500 transform hover:-translate-y-1 rounded-[2px] hover:rotate-[0.5deg]">
             
             {/* Image */}
             <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 mb-4">
               <img 
                 src={photo.url[0]} 
                 alt={photo.title}
                 loading="lazy"
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter saturate-[0.85] group-hover:saturate-100 contrast-[0.95] group-hover:contrast-100"
               />
               <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
               
               {/* Multi-photo indicator */}
               {photo.url.length > 1 && (
                 <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-sm flex items-center gap-1 font-sans tracking-widest z-10">
                   <Layers size={10} />
                   {photo.url.length}
                 </div>
               )}
             </div>

             {/* Handwritten Note Style Content */}
             <div className="px-2">
                <div className="flex justify-between items-baseline mb-2 border-b border-stone-100 pb-2">
                  <h3 className="font-hand text-2xl text-ink tracking-wide">{photo.title}</h3>
                  <span className="font-serif text-xs text-stone-400 italic">{photo.date}</span>
                </div>
                
                <p className="font-serif text-sm text-stone-600 leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  {photo.description}
                </p>

                {photo.location && (
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-stone-400 font-sans tracking-wider uppercase">
                    <MapPin size={10} />
                    {photo.location}
                  </div>
                )}
             </div>

             {/* Tape Effect (Purely Visual) */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-[1px] shadow-sm transform -rotate-2 border-l border-r border-white/60 opacity-60 z-10" />
          </div>
        </div>
      ))}
    </div>
  );
};
