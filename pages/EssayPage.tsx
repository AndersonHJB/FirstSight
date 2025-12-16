
import React, { useMemo, useState } from 'react';
import { ESSAY_DATA } from '../constants';
import { MapPin, Clock, User, ExternalLink, PlayCircle, Filter, X } from 'lucide-react';
import { ImmersiveLightbox } from '../components/ImmersiveLightbox';
import { Photo } from '../types';

export const EssayPage: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // Helper to construct a Photo object for the Lightbox
  const lightboxPhoto: Photo | null = selectedMedia ? {
    id: 'temp-lightbox',
    url: [selectedMedia.url],
    title: '',
    date: '',
    description: '',
    tags: [],
    albumType: 'GALLERY' as any,
    mediaType: selectedMedia.type,
  } : null;

  // Extract unique years from data
  const years = useMemo(() => {
    const allYears = ESSAY_DATA.map(e => e.date.substring(0, 4));
    return ['All', ...Array.from(new Set(allYears)).sort().reverse()];
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    if (selectedYear === 'All') return ESSAY_DATA;
    return ESSAY_DATA.filter(e => e.date.startsWith(selectedYear));
  }, [selectedYear]);

  return (
    <div className="min-h-screen bg-paper pt-24 animate-fade-in pb-24 px-4 md:px-8">
      
      {/* Header Area */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-baseline justify-between gap-6 border-b border-stone-200 pb-6">
        <div>
           <h1 className="font-hand text-5xl mb-2 text-ink">即刻短文</h1>
           <p className="font-serif text-stone-500">碎碎念，也是生活的一部分。</p>
        </div>
        
        {/* Time Filter - Horizontal on mobile, hidden on large screens (moved to sidebar) */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide lg:hidden">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-1.5 rounded-full text-sm font-sans whitespace-nowrap transition-colors
                ${selectedYear === year 
                  ? 'bg-ink text-white' 
                  : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-400'}`}
            >
              {year === 'All' ? '全部' : year}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Sticky Sidebar (Desktop Only) */}
        <div className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-28 space-y-8">
             <div className="flex items-center gap-2 text-accent-brown font-serif border-b border-accent-brown/20 pb-2">
                <Filter size={18} />
                <span>时间轴</span>
             </div>
             <div className="space-y-2 relative border-l border-stone-200 ml-2 pl-4">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`block w-full text-left font-serif text-lg transition-all duration-300 relative
                      ${selectedYear === year 
                        ? 'text-ink font-bold translate-x-2' 
                        : 'text-stone-400 hover:text-stone-600 hover:translate-x-1'}`}
                  >
                    {/* Active Indicator Dot */}
                    {selectedYear === year && (
                      <span className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-ink rounded-full" />
                    )}
                    {year === 'All' ? '全部回忆' : `${year} 年`}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Masonry Content Grid */}
        <div className="flex-1">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredData.map((essay, index) => (
              <div 
                key={essay.id} 
                className="break-inside-avoid bg-white p-5 rounded-sm shadow-sm border border-stone-100/60 hover:shadow-polaroid transition-all duration-300 group flex flex-col gap-3 relative overflow-hidden"
              >
                {/* Paper Texture/Style decoration (top tape) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-100/50 -mt-2 opacity-50 rotate-1"></div>

                {/* Header: User & Date */}
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                         <User size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-sm font-medium text-ink">{essay.from || 'Me'}</span>
                        <span className="text-[10px] text-stone-400 font-sans leading-none">{essay.date.split(' ')[0]}</span>
                      </div>
                   </div>
                </div>

                {/* Content Text */}
                <div className="font-serif text-stone-600 leading-relaxed text-sm whitespace-pre-line mt-1">
                  {essay.content.length > 150 ? (
                    <>
                      {essay.content.slice(0, 150)}...
                    </>
                  ) : essay.content}
                </div>

                {/* Media Grid (Compact) */}
                {essay.images && essay.images.length > 0 && (
                  <div className={`grid gap-1 mt-2 rounded-sm overflow-hidden ${
                    essay.images.length === 1 ? 'grid-cols-1' : 
                    essay.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                  }`}>
                    {essay.images.slice(0, 3).map((img, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square relative overflow-hidden cursor-pointer bg-stone-50"
                        onClick={() => setSelectedMedia({ url: img, type: 'image' })}
                      >
                        <img 
                          src={img} 
                          alt={`Essay media`}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        {/* Show count if more than 3 images */}
                        {idx === 2 && essay.images && essay.images.length > 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold">
                            +{essay.images.length - 3}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Video Preview */}
                {essay.video && essay.video.length > 0 && (
                  <div className="mt-2 relative aspect-video bg-black rounded-sm overflow-hidden group/vid cursor-pointer" onClick={() => setSelectedMedia({ url: essay.video![0], type: 'video' })}>
                      {/* If Bilibili, show placeholder or iframe thumbnail logic - simplifying to generic video here since we are in a grid */}
                       {essay.video[0].includes('bilibili') ? (
                          <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-500">
                             <span className="text-xs">Bilibili Video</span>
                          </div>
                       ) : (
                         <video src={essay.video[0]} className="w-full h-full object-cover opacity-80 group-hover/vid:opacity-100 transition-opacity" />
                       )}
                       <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle size={32} className="text-white/80" />
                       </div>
                  </div>
                )}

                {/* Footer Info */}
                <div className="mt-2 pt-2 border-t border-stone-50 flex items-center justify-between text-xs text-stone-400">
                   <div className="flex items-center gap-1 max-w-[70%] truncate">
                      {essay.location && (
                        <>
                          <MapPin size={10} />
                          <span className="truncate">
                             {Array.isArray(essay.location) ? essay.location[0] : essay.location}
                          </span>
                        </>
                      )}
                   </div>
                   {essay.link && (
                     <a href={essay.link} target="_blank" rel="noreferrer" className="hover:text-accent-brown">
                        <ExternalLink size={12} />
                     </a>
                   )}
                </div>

              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
             <div className="py-20 text-center text-stone-400 font-serif">
                在这个时间段，似乎没有记录下什么...
             </div>
          )}
        </div>
      </div>

      {/* Lightbox for Images/Videos */}
      {selectedMedia && lightboxPhoto && (
        <ImmersiveLightbox 
          photo={lightboxPhoto}
          onClose={() => setSelectedMedia(null)}
          hasNext={false}
          hasPrev={false}
          onNext={() => {}}
          onPrev={() => {}}
        />
      )}
    </div>
  );
};
