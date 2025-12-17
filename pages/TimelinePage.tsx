
import React, { useState, useMemo } from 'react';
import { ChildTimeline, Photo } from '../types';
import { Lightbox } from '../components/Lightbox';
import { Sparkles, Layers, PlayCircle, Baby, Heart } from 'lucide-react';

interface TimelinePageProps {
  timelines: ChildTimeline[];
}

interface Slide {
  photo: Photo;
  urlIndex: number;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ timelines }) => {
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(-1);

  const activeChild = timelines[activeChildIndex];

  // Flatten all photos for current child
  const slides: Slide[] = useMemo(() => {
    return activeChild.events.flatMap(event => 
      event.photos.flatMap(photo => 
        photo.url.map((_, index) => ({ photo, urlIndex: index }))
      )
    );
  }, [activeChild]);

  const handlePhotoClick = (photo: Photo) => {
    const index = slides.findIndex(s => s.photo.id === photo.id && s.urlIndex === 0);
    setCurrentSlideIndex(index);
  };

  const handleClose = () => setCurrentSlideIndex(-1);
  
  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const activeSlide = currentSlideIndex >= 0 ? slides[currentSlideIndex] : null;

  // Render photo grid based on count
  const renderPhotoGrid = (photos: Photo[]) => {
    const count = photos.length;
    let gridClass = "grid gap-3";
    
    if (count === 1) gridClass += " grid-cols-1";
    else if (count === 2) gridClass += " grid-cols-2";
    else gridClass += " grid-cols-2 sm:grid-cols-3";

    return (
      <div className={gridClass}>
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className={`relative overflow-hidden bg-stone-100 cursor-pointer group/img rounded-sm ${count === 1 ? 'aspect-video' : 'aspect-square'}`}
            onClick={() => handlePhotoClick(photo)}
          >
            {photo.mediaType === 'video' ? (
              <div className="w-full h-full relative">
                <video 
                  src={photo.url[0]}
                  poster={photo.poster}
                  className="w-full h-full object-cover filter brightness-[0.9] group-hover/img:brightness-100 transition-all"
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/20 rounded-full p-2 backdrop-blur-sm">
                    <PlayCircle size={32} className="text-white opacity-90" />
                  </div>
                </div>
              </div>
            ) : (
              <img 
                src={photo.url[0]} 
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110 filter saturate-[0.8] group-hover/img:saturate-100"
              />
            )}

            {photo.mediaType !== 'video' && photo.url.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-sm flex items-center gap-1 font-sans tracking-widest z-10">
                <Layers size={10} />
                {photo.url.length}
              </div>
            )}
            
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 animate-fade-in">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 text-center mb-16">
         <div className="inline-flex items-center justify-center p-4 bg-stone-100 rounded-full text-accent-brown mb-6">
           <Sparkles size={20} strokeWidth={1.5} />
         </div>
         <h1 className="font-hand text-5xl md:text-6xl text-ink mb-4">成长足迹</h1>
         <p className="font-serif text-stone-500">所有的惊喜，都藏在长大的每一个瞬间里。</p>
      </div>

      {/* Child Switcher Tabs */}
      <div className="max-w-2xl mx-auto px-6 mb-16">
         <div className="flex justify-center gap-4 bg-white/50 p-2 rounded-full border border-stone-200 shadow-sm overflow-x-auto scrollbar-hide">
            {timelines.map((child, index) => (
               <button
                  key={child.name}
                  onClick={() => {
                    setActiveChildIndex(index);
                    setCurrentSlideIndex(-1);
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-500 whitespace-nowrap
                    ${activeChildIndex === index 
                      ? 'bg-ink text-white shadow-md scale-105' 
                      : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}
               >
                  <Baby size={18} strokeWidth={index === activeChildIndex ? 2 : 1.5} />
                  <span className="font-serif font-medium">{child.name}</span>
                  <span className="text-[10px] opacity-60 font-sans tracking-widest hidden sm:inline">{child.nickname}</span>
               </button>
            ))}
         </div>
      </div>

      {/* Timeline Content */}
      <div key={activeChild.name} className="max-w-4xl mx-auto px-4 md:px-12 animate-fade-in">
        
        {/* Born Card with Gender Aware Styling */}
        <div className={`mb-20 p-8 rounded-sm text-center relative overflow-hidden transition-colors duration-700
          ${activeChild.gender === 'girl' ? 'bg-rose-50/40 border border-rose-100' : 'bg-blue-50/40 border border-blue-100'}
        `}>
           <div className={`absolute top-0 right-0 p-4 opacity-5 ${activeChild.gender === 'girl' ? 'text-rose-900' : 'text-blue-900'}`}>
              <Heart size={80} fill="currentColor" />
           </div>
           <h2 className="font-hand text-4xl text-ink mb-2">出生档案</h2>
           <div className="flex justify-center gap-12 mt-6">
              <div className="flex flex-col">
                 <span className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">诞生日</span>
                 <span className="font-serif text-lg">{activeChild.birthday}</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">姓名</span>
                 <span className="font-serif text-lg">{activeChild.name}</span>
              </div>
           </div>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l border-dashed border-stone-300 ml-4 md:ml-0 space-y-24 pb-12">
          {activeChild.events.map((event) => (
            <div key={event.id} className="relative pl-12 md:pl-16 group">
               
               {/* Marker */}
               <div className={`absolute left-[-6px] top-2 w-3 h-3 rounded-full bg-paper border-2 transition-colors z-10
                 ${activeChild.gender === 'girl' ? 'border-rose-300 group-hover:bg-rose-300' : 'border-blue-300 group-hover:bg-blue-300'}
               `} />

               {/* Date Label (Desktop) */}
               <div className="absolute -left-20 top-1 hidden md:flex flex-col items-end pr-8 w-24">
                 <span className="font-hand text-xl text-ink">{event.date}</span>
                 {event.age && <span className="font-serif text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full mt-1 whitespace-nowrap">{event.age}</span>}
               </div>
               
               {/* Mobile Date */}
               <div className="md:hidden flex items-baseline gap-3 mb-3">
                  <span className="font-hand text-xl text-ink">{event.date}</span>
                  {event.age && <span className="font-serif text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{event.age}</span>}
               </div>

               {/* Content Card */}
               <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm border border-stone-100/50 hover:shadow-md transition-shadow">
                 <h3 className="font-serif text-2xl text-ink mb-4">{event.title}</h3>
                 <p className="font-serif text-stone-600 mb-8 leading-relaxed font-light">{event.description}</p>
                 
                 {/* Adaptive Grid Rendering */}
                 {renderPhotoGrid(event.photos)}
               </div>

            </div>
          ))}
        </div>
      </div>

      {activeSlide && (
        <Lightbox 
          photo={activeSlide.photo}
          currentUrlIndex={activeSlide.urlIndex}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};
