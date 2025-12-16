import React, { useState, useMemo } from 'react';
import { Photo, AlbumType } from '../types';
import { PhotoGrid } from '../components/PhotoGrid';
import { Lightbox } from '../components/Lightbox';

interface GalleryProps {
  title: string;
  subtitle: string;
  photos: Photo[];
  type: AlbumType;
}

// Helper structure for navigation
interface Slide {
  photo: Photo;
  urlIndex: number;
}

export const Gallery: React.FC<GalleryProps> = ({ title, subtitle, photos }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(-1);

  // Flatten all photos and their sub-images into a single linear "playlist" for the lightbox
  const slides: Slide[] = useMemo(() => {
    return photos.flatMap(photo => 
      photo.url.map((_, index) => ({ photo, urlIndex: index }))
    );
  }, [photos]);

  const handlePhotoClick = (photo: Photo) => {
    // Find the first slide that matches this photo
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

  // Get the current slide data to pass to Lightbox
  const activeSlide = currentSlideIndex >= 0 ? slides[currentSlideIndex] : null;

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
