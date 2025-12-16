
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Image, FileText, Heart, Users, ArrowRight, Clock } from 'lucide-react';
import { ESSAY_DATA, FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, WEDDING_COLLECTIONS } from '../data';
import { createPortal } from 'react-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

interface SearchResult {
  id: string;
  type: 'essay' | 'photo' | 'album' | 'wedding';
  title: string;
  description: string;
  date: string;
  image?: string;
  path: string;
  matchType: string; // 'Title', 'Content', 'Tag', etc.
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      setQuery(''); // Reset query on close
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search Logic
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    const res: SearchResult[] = [];

    // 1. Search Essays
    ESSAY_DATA.forEach(essay => {
      if (essay.content.toLowerCase().includes(lowerQuery) || essay.location?.toString().toLowerCase().includes(lowerQuery)) {
        res.push({
          id: essay.id,
          type: 'essay',
          title: essay.from || '即刻短文',
          description: essay.content,
          date: essay.date,
          path: `/essay?id=${essay.id}`,
          matchType: '短文内容',
          image: essay.images?.[0]
        });
      }
    });

    // 2. Search Artistic Gallery
    GALLERY_PHOTOS.forEach(photo => {
      if (
        photo.title.toLowerCase().includes(lowerQuery) || 
        photo.description.toLowerCase().includes(lowerQuery) ||
        photo.tags.some(t => t.toLowerCase().includes(lowerQuery))
      ) {
        res.push({
          id: photo.id,
          type: 'photo',
          title: photo.title,
          description: photo.description,
          date: photo.date,
          path: `/gallery?id=${photo.id}`,
          matchType: '艺术画廊',
          image: photo.url[0]
        });
      }
    });

    // 3. Search Family Photos
    FAMILY_PHOTOS.forEach(photo => {
      if (
        photo.title.toLowerCase().includes(lowerQuery) || 
        photo.description.toLowerCase().includes(lowerQuery) ||
        photo.tags.some(t => t.toLowerCase().includes(lowerQuery))
      ) {
        res.push({
          id: photo.id,
          type: 'photo',
          title: photo.title,
          description: photo.description,
          date: photo.date,
          path: `/family?id=${photo.id}`,
          matchType: '家庭影像',
          image: photo.url[0]
        });
      }
    });

    // 4. Search Wedding Albums
    WEDDING_COLLECTIONS.forEach(album => {
      if (
        album.title.toLowerCase().includes(lowerQuery) || 
        album.subtitle.toLowerCase().includes(lowerQuery) || 
        album.description.toLowerCase().includes(lowerQuery)
      ) {
        res.push({
          id: album.id,
          type: 'wedding',
          title: album.title,
          description: album.subtitle,
          date: album.date,
          path: `/wedding?id=${album.id}`,
          matchType: '婚纱摄影',
          image: album.cover
        });
      }
    });
    
    // 5. Search Baby Photos (Simple integration)
    BABY_PHOTOS.forEach(photo => {
      if (photo.title.toLowerCase().includes(lowerQuery) || photo.description.toLowerCase().includes(lowerQuery)) {
         res.push({
            id: photo.id,
            type: 'photo',
            title: photo.title,
            description: photo.description,
            date: photo.date,
            path: `/baby`, // Timeline page doesn't support deep linking to photo easily yet, just go to page
            matchType: '成长足迹',
            image: photo.url[0]
         })
      }
    })

    return res;
  }, [query]);

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
  };

  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 px-4 sm:pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-paper rounded-lg shadow-2xl flex flex-col overflow-hidden animate-slide-up max-h-[80vh]">
        
        {/* Input Header */}
        <div className="flex items-center gap-4 p-4 border-b border-stone-200 bg-white/50">
          <Search className="text-stone-400" size={24} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-xl text-ink placeholder-stone-300 outline-none font-serif"
            placeholder="搜索回忆、短文、照片..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-stone-400">
               <p className="font-serif">输入关键词，寻找遗落在时光里的碎片...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
               <p className="font-serif">没有找到相关内容</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => (
                <div 
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item.path)}
                  className="group flex items-start gap-4 p-3 rounded-md hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-stone-100"
                >
                  {/* Icon or Thumbnail */}
                  <div className="w-16 h-16 shrink-0 rounded-sm bg-stone-100 overflow-hidden border border-stone-200/50">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                         {item.type === 'essay' && <FileText size={24} />}
                         {item.type === 'photo' && <Image size={24} />}
                      </div>
                    )}
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-ink truncate pr-2 font-serif text-lg group-hover:text-accent-brown transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.matchType}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 line-clamp-1 font-serif mt-0.5">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-stone-400 font-sans">
                       <Clock size={12} />
                       <span>{item.date}</span>
                    </div>
                  </div>

                  <div className="self-center text-stone-300 group-hover:text-accent-brown transition-colors">
                     <ArrowRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Hint */}
        <div className="bg-stone-50 p-2 text-center text-[10px] text-stone-400 font-sans border-t border-stone-100">
           ESC 关闭 · Enter 选择 · 输入即可搜索
        </div>

      </div>
    </div>
  );

  const root = document.getElementById('root') || document.body;
  return createPortal(content, root);
};
