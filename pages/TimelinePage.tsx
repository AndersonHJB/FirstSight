import React, { useState } from 'react';
import { TimelineEvent, Photo } from '../types';
import { Lightbox } from '../components/Lightbox';
import { Sparkles } from 'lucide-react';

interface TimelinePageProps {
  events: TimelineEvent[];
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ events }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{photo: Photo, allPhotos: Photo[], index: number} | null>(null);

  const getAllPhotos = () => events.flatMap(e => e.photos);

  const handlePhotoClick = (photo: Photo) => {
    const all = getAllPhotos();
    const index = all.findIndex(p => p.id === photo.id);
    setSelectedPhoto({ photo, allPhotos: all, index });
  };

  const handleClose = () => setSelectedPhoto(null);
  
  const handleNext = () => {
    if (!selectedPhoto) return;
    const nextIndex = (selectedPhoto.index + 1) % selectedPhoto.allPhotos.length;
    setSelectedPhoto({ ...selectedPhoto, photo: selectedPhoto.allPhotos[nextIndex], index: nextIndex });
  };

  const handlePrev = () => {
    if (!selectedPhoto) return;
    const prevIndex = (selectedPhoto.index - 1 + selectedPhoto.allPhotos.length) % selectedPhoto.allPhotos.length;
    setSelectedPhoto({ ...selectedPhoto, photo: selectedPhoto.allPhotos[prevIndex], index: prevIndex });
  };

  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 animate-fade-in">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 text-center mb-24">
         <div className="inline-flex items-center justify-center p-4 bg-stone-100 rounded-full text-accent-brown mb-6">
           <Sparkles size={20} strokeWidth={1.5} />
         </div>
         <h1 className="font-hand text-5xl md:text-6xl text-ink mb-4">成长日记</h1>
         <p className="font-serif text-stone-500">所有的惊喜，都藏在长大的每一个瞬间里。</p>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 md:px-12">
        <div className="relative border-l border-dashed border-stone-300 ml-4 md:ml-0 space-y-24 pb-12">
          {events.map((event, idx) => (
            <div key={event.id} className="relative pl-12 md:pl-16 group">
               
               {/* Marker */}
               <div className="absolute left-[-6px] top-2 w-3 h-3 rounded-full bg-paper border-2 border-accent-brown group-hover:bg-accent-brown transition-colors z-10" />

               {/* Date Label */}
               <div className="absolute -left-20 top-1 hidden md:flex flex-col items-end pr-8 w-24">
                 <span className="font-hand text-xl text-ink">{event.date}</span>
                 <span className="font-serif text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full mt-1">{event.age}</span>
               </div>
               
               {/* Mobile Date */}
               <div className="md:hidden flex items-baseline gap-3 mb-3">
                  <span className="font-hand text-xl text-ink">{event.date}</span>
                  <span className="font-serif text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{event.age}</span>
               </div>

               {/* Content */}
               <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm border border-stone-100/50 hover:shadow-md transition-shadow">
                 <h3 className="font-serif text-2xl text-ink mb-4">{event.title}</h3>
                 <p className="font-serif text-stone-600 mb-8 leading-relaxed font-light">{event.description}</p>
                 
                 {/* Photos */}
                 <div className="grid grid-cols-2 gap-4">
                    {event.photos.map((photo) => (
                      <div 
                        key={photo.id} 
                        className="aspect-square relative overflow-hidden bg-stone-100 cursor-pointer group/img"
                        onClick={() => handlePhotoClick(photo)}
                      >
                         <img 
                           src={photo.url} 
                           alt={photo.title}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110 filter hover:contrast-105"
                         />
                      </div>
                    ))}
                 </div>
               </div>

            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <Lightbox 
          photo={selectedPhoto.photo}
          photos={selectedPhoto.allPhotos}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};
