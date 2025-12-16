import React, { useState } from 'react';
import { Photo, AlbumType } from '../types';
import { PhotoGrid } from '../components/PhotoGrid';
import { Lightbox } from '../components/Lightbox';

interface GalleryProps {
  title: string;
  subtitle: string;
  photos: Photo[];
  type: AlbumType;
}

export const Gallery: React.FC<GalleryProps> = ({ title, subtitle, photos }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);

  const handlePhotoClick = (photo: Photo) => {
    const index = photos.findIndex(p => p.id === photo.id);
    setSelectedPhotoIndex(index);
  };

  const handleClose = () => setSelectedPhotoIndex(-1);
  const handleNext = () => setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  const handlePrev = () => setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 mb-20 text-center">
        <h1 className="font-hand text-5xl md:text-6xl text-ink mb-6">{title}</h1>
        <div className="w-12 h-1 bg-accent-brown/20 mx-auto mb-6 rounded-full" />
        <p className="font-serif text-lg text-stone-500 font-light italic">{subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
         <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
      </div>

      {selectedPhotoIndex >= 0 && (
        <Lightbox 
          photo={photos[selectedPhotoIndex]}
          photos={photos}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};
