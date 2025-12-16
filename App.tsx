import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { TimelinePage } from './pages/TimelinePage';
import { ArtisticGallery } from './pages/ArtisticGallery'; // New Import
import { AlbumType } from './types';
import { FAMILY_PHOTOS, TIMELINE_EVENTS } from './constants';

const App: React.FC = () => {
  // Simple custom router using generic state
  const [currentPath, setCurrentPath] = useState('/');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };

    // Initialize
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <Home onNavigate={navigate} />;
      case '/gallery':
        return <ArtisticGallery />; // New Route
      case '/family':
        return (
          <Gallery 
            title="家庭相册" 
            subtitle="那些年，我们一起走过的路，一起看过的风景。"
            photos={FAMILY_PHOTOS}
            type={AlbumType.FAMILY}
          />
        );
      case '/baby':
        // For baby, we use the special TimelinePage
        return <TimelinePage events={TIMELINE_EVENTS} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-orange-100 selection:text-orange-900">
      <Navbar activeTab={currentPath} onNavigate={navigate} />
      <main>
        {renderPage()}
      </main>
      
      {/* Hide default footer for Gallery page to keep the immersive feel or use the custom one in component */}
      {currentPath !== '/gallery' && (
        <footer className="bg-white border-t border-stone-100 py-12 text-center">
          <p className="font-serif text-stone-400 text-sm">© 2025 时光 · 家书 Family Album. All memories preserved.</p>
        </footer>
      )}
    </div>
  );
};

export default App;