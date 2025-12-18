
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { TimelinePage } from './pages/TimelinePage';
import { ArtisticGallery } from './pages/ArtisticGallery';
import { WeddingPage } from './pages/WeddingPage'; 
import { EssayPage } from './pages/EssayPage'; 
import { TravelPage } from './pages/TravelPage';
import { BabyAlbum } from './pages/BabyAlbum';
import { AlbumType } from './types';
import { FAMILY_PHOTOS, MULTI_CHILD_TIMELINES } from './data';

const App: React.FC = () => {
  // Router State
  const [currentPath, setCurrentPath] = useState('/');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle router changes
  useEffect(() => {
    const handlePopState = () => {
      const fullHash = window.location.hash.replace('#', '') || '/';
      const [path, search] = fullHash.split('?');
      
      const params: Record<string, string> = {};
      if (search) {
        new URLSearchParams(search).forEach((value, key) => {
          params[key] = value;
        });
      }

      setCurrentPath(path);
      setQueryParams(params);
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (fullPath: string) => {
    window.location.hash = fullPath;
    const [path, search] = fullPath.split('?');
    const params: Record<string, string> = {};
    if (search) {
       new URLSearchParams(search).forEach((value, key) => {
          params[key] = value;
       });
    }
    setCurrentPath(path);
    setQueryParams(params);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home onNavigate={navigate} />;
      case '/essay':
        return <EssayPage initialEssayId={queryParams.id} />; 
      case '/gallery':
        return <ArtisticGallery initialPhotoId={queryParams.id} />; 
      case '/travel':
        return <TravelPage initialTripId={queryParams.id} />;
      case '/wedding':
        return <WeddingPage initialAlbumId={queryParams.id} />; 
      case '/baby-album':
        return <BabyAlbum />;
      case '/family':
        return (
          <Gallery 
            title="家庭相册" 
            subtitle="那些年，我们一起走过的路，一起看过的风景。"
            photos={FAMILY_PHOTOS}
            type={AlbumType.FAMILY}
            initialPhotoId={queryParams.id}
          />
        );
      case '/baby':
        return <TimelinePage timelines={MULTI_CHILD_TIMELINES} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-orange-100 selection:text-orange-900">
      <Navbar 
        activeTab={currentPath} 
        onNavigate={navigate} 
        onSearchClick={() => setIsSearchOpen(true)}
      />
      
      <main>
        {renderPage()}
      </main>
      
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={navigate}
      />

      {currentPath !== '/gallery' && currentPath !== '/wedding' && currentPath !== '/travel' && currentPath !== '/baby-album' && (
        <footer className="bg-white border-t border-stone-100 py-12 text-center">
          <p className="font-serif text-stone-400 text-sm">© 2025 时光 · 家书 Family Album. All memories preserved.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
