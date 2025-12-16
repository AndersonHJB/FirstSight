
import React, { useState, useMemo, useEffect } from 'react';
import { Photo, AlbumType } from '../types';
import { PhotoGrid } from '../components/PhotoGrid';
import { Lightbox } from '../components/Lightbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryProps {
  title: string;
  subtitle: string;
  photos: Photo[];
  type: AlbumType;
  initialPhotoId?: string;
}

interface Slide {
  photo: Photo;
  urlIndex: number;
}

const ITEMS_PER_PAGE = 9;

export const Gallery: React.FC<GalleryProps> = ({ title, subtitle, photos, initialPhotoId }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(photos.length / ITEMS_PER_PAGE);
  
  // Create slides
  const slides: Slide[] = useMemo(() => {
    return photos.flatMap(photo => 
      photo.url.map((_, index) => ({ photo, urlIndex: index }))
    );
  }, [photos]);

  // Handle deep linking
  useEffect(() => {
    if (initialPhotoId) {
       // Find the index of the photo in the original photo array
       const photoIndex = photos.findIndex(p => p.id === initialPhotoId);
       if (photoIndex !== -1) {
          // Calculate page
          const targetPage = Math.ceil((photoIndex + 1) / ITEMS_PER_PAGE);
          setCurrentPage(targetPage);

          // Open Lightbox
          // Find corresponding slide index (assuming first image of photo)
          const slideIndex = slides.findIndex(s => s.photo.id === initialPhotoId && s.urlIndex === 0);
          if (slideIndex !== -1) {
             setCurrentSlideIndex(slideIndex);
          }
       }
    }
  }, [initialPhotoId, photos, slides]);


  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedPhotos = photos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeSlide = currentSlideIndex >= 0 ? slides[currentSlideIndex] : null;

  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
        <h1 className="font-hand text-5xl md:text-6xl text-ink mb-6">{title}</h1>
        <div className="w-12 h-1 bg-accent-brown/20 mx-auto mb-6 rounded-full" />
        <p className="font-serif text-lg text-stone-500 font-light italic">{subtitle}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[800px]">
         <PhotoGrid photos={displayedPhotos} onPhotoClick={handlePhotoClick} />
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-6 mt-16 flex justify-center items-center gap-6">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-3 rounded-full border border-stone-200 transition-all duration-300
              ${currentPage === 1 
                ? 'text-stone-300 cursor-not-allowed border-transparent' 
                : 'text-stone-600 hover:bg-stone-100 hover:border-stone-400'}`}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-baseline gap-2 font-serif text-stone-600">
             <span className="text-2xl font-medium text-ink">{currentPage}</span>
             <span className="text-stone-400 text-sm italic">/</span>
             <span className="text-stone-400">{totalPages}</span>
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-3 rounded-full border border-stone-200 transition-all duration-300
              ${currentPage === totalPages 
                ? 'text-stone-300 cursor-not-allowed border-transparent' 
                : 'text-stone-600 hover:bg-stone-100 hover:border-stone-400'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

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
