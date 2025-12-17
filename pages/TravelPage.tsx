
import React, { useState, useMemo, useEffect } from 'react';
import { TRAVEL_TRIPS } from '../data';
import { TravelTrip } from '../types';
import { Map, ArrowLeft, Calendar, Camera, PlayCircle, MapPin } from 'lucide-react';
import { ImmersiveLightbox } from '../components/ImmersiveLightbox';

interface TravelPageProps {
  initialTripId?: string;
}

export const TravelPage: React.FC<TravelPageProps> = ({ initialTripId }) => {
  const [activeTab, setActiveTab] = useState<string>('全部');
  const [selectedTrip, setSelectedTrip] = useState<TravelTrip | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);

  // Extract unique countries
  const countries = useMemo(() => {
    const allCountries = TRAVEL_TRIPS.map(t => t.country);
    return ['全部', ...Array.from(new Set(allCountries))];
  }, []);

  // Filter trips based on active tab
  const displayedTrips = useMemo(() => {
    if (activeTab === '全部') return TRAVEL_TRIPS;
    return TRAVEL_TRIPS.filter(t => t.country === activeTab);
  }, [activeTab]);

  // Handle Deep Linking
  useEffect(() => {
    if (initialTripId) {
      const trip = TRAVEL_TRIPS.find(t => t.id === initialTripId);
      if (trip) {
        setSelectedTrip(trip);
      }
    }
  }, [initialTripId]);

  // Reset scroll when viewing details
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedTrip]);

  // Lightbox Navigation
  const handleNext = () => {
    if (!selectedTrip) return;
    if (selectedPhotoIndex < selectedTrip.photos.length - 1) {
      setSelectedPhotoIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(prev => prev - 1);
    }
  };

  // --- TRIP DETAIL VIEW ---
  if (selectedTrip) {
    return (
      <div className="min-h-screen bg-[#fff] pt-40 pb-20 animate-fade-in">
        
        {/* Navigation Bar for Detail */}
        <div className="fixed top-20 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-stone-100 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
           <button 
             onClick={() => setSelectedTrip(null)}
             className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors group"
           >
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
             <span className="font-serif text-sm uppercase tracking-wider">返回旅程</span>
           </button>
           
           <div className="hidden md:block text-center">
              <h2 className="font-serif text-lg text-stone-800">{selectedTrip.title}</h2>
              <span className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">{selectedTrip.place}</span>
           </div>
  
           <div className="w-20" /> 
        </div>
  
        {/* Hero Header */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
           {/* Cover Banner */}
           <div className="w-full h-[300px] md:h-[400px] relative rounded-sm overflow-hidden mb-12 shadow-lg">
              <img 
                src={selectedTrip.cover} 
                alt={selectedTrip.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 text-white">
                 <div className="flex items-center gap-2 text-xs font-sans tracking-widest uppercase opacity-90 mb-2">
                    <MapPin size={12} /> {selectedTrip.place} · {selectedTrip.country}
                 </div>
              </div>
           </div>

           <div className="text-center max-w-3xl mx-auto">
             <div className="mb-6 flex justify-center text-blue-300">
               <MapPin size={32} strokeWidth={1.5} />
             </div>
             <h1 className="font-hand text-5xl md:text-6xl text-ink mb-6">{selectedTrip.title}</h1>
             <p className="font-serif text-lg md:text-xl text-stone-500 leading-relaxed italic">
               "{selectedTrip.description}"
             </p>
             <div className="mt-8 flex items-center justify-center gap-6 text-xs text-stone-400 uppercase tracking-widest font-sans border-t border-stone-100 pt-6 inline-block w-full">
                <span className="flex items-center justify-center gap-1"><Calendar size={12}/> {selectedTrip.date}</span>
             </div>
           </div>
        </div>
  
        {/* Masonry Grid */}
        <div className="max-w-[1600px] mx-auto px-2 md:px-6">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {selectedTrip.photos.map((photo, idx) => (
              <div 
                key={photo.id}
                className="break-inside-avoid mb-4 relative group cursor-pointer overflow-hidden bg-stone-100 rounded-sm"
                onClick={() => setSelectedPhotoIndex(idx)}
              >
                <div style={{ aspectRatio: photo.width && photo.height ? `${photo.width} / ${photo.height}` : 'auto' }}>
                  {photo.mediaType === 'video' ? (
                    <div className="w-full h-full relative">
                      <video 
                        src={photo.url[0]} 
                        poster={photo.poster}
                        muted 
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        onMouseOver={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <PlayCircle size={32} className="text-white/90" strokeWidth={1} />
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
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {selectedPhotoIndex >= 0 && (
          <ImmersiveLightbox 
            photo={selectedTrip.photos[selectedPhotoIndex]}
            onClose={() => setSelectedPhotoIndex(-1)}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={selectedPhotoIndex < selectedTrip.photos.length - 1}
            hasPrev={selectedPhotoIndex > 0}
          />
        )}
      </div>
    );
  }

  // --- TRIP LIST VIEW ---
  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 animate-fade-in">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
        <h1 className="font-hand text-5xl md:text-6xl text-ink mb-6">行万里路</h1>
        <p className="font-serif text-lg text-stone-500 font-light italic">看世界，看众生，最后看自己。</p>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {countries.map(country => (
            <button
              key={country}
              onClick={() => setActiveTab(country)}
              className={`px-6 py-2 rounded-full font-serif text-sm transition-all duration-300 border
                ${activeTab === country 
                  ? 'bg-ink text-white border-ink shadow-md' 
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700'}`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayedTrips.map((trip, idx) => (
            <div 
              key={trip.id}
              onClick={() => setSelectedTrip(trip)}
              className="group cursor-pointer"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Card Container - using flex column to ensure text area is distinct and below image */}
              <div className="flex flex-col bg-white p-3 shadow-polaroid hover:shadow-polaroid-hover transition-all duration-500 transform group-hover:-translate-y-2 rounded-[2px]">
                 {/* Image Area */}
                 <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <img 
                      src={trip.cover} 
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter saturate-[0.9] group-hover:saturate-100"
                    />
                    {/* Location Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-sans tracking-widest text-ink rounded-sm shadow-sm flex items-center gap-1">
                       <MapPin size={10} />
                       {trip.place}
                    </div>
                 </div>
                 
                 {/* Text Area */}
                 <div className="pt-6 pb-4 text-center">
                    <h3 className="font-hand text-3xl text-ink leading-none mb-2">{trip.title}</h3>
                    <p className="font-serif text-[10px] text-stone-400 uppercase tracking-widest">{trip.date.split('.')[0]}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {displayedTrips.length === 0 && (
           <div className="py-20 text-center text-stone-400 font-serif">
              这里还没有足迹，准备出发吧...
           </div>
        )}
      </div>

    </div>
  );
};
