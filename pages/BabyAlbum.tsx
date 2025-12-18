
import React, { useState, useMemo } from 'react';
import { MULTI_CHILD_TIMELINES } from '../data';
import { Photo, ChildTimeline } from '../types';
import { ImmersiveLightbox } from '../components/ImmersiveLightbox';
import { ArrowLeft, BookOpen, PlayCircle, Heart, Star, Sparkles } from 'lucide-react';

export const BabyAlbum: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState<ChildTimeline | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);

  // 提取该孩子的所有照片
  const childPhotos = useMemo(() => {
    if (!selectedChild) return [];
    return selectedChild.events.flatMap(event => event.photos);
  }, [selectedChild]);

  const handleNext = () => {
    if (selectedPhotoIndex < childPhotos.length - 1) {
      setSelectedPhotoIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(prev => prev - 1);
    }
  };

  // --- 宝贝列表选择视图 ---
  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-paper pt-32 pb-24 px-6 animate-fade-in">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
             <div className="inline-flex items-center justify-center p-3 bg-white shadow-sm rounded-full text-accent-brown mb-4">
                <Star size={24} fill="currentColor" className="opacity-20" />
             </div>
             <h1 className="font-hand text-5xl md:text-6xl text-ink mb-4">宝贝影集</h1>
             <p className="font-serif text-stone-500 italic tracking-widest uppercase text-sm">Treasured Moments of Our Little Ones</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {MULTI_CHILD_TIMELINES.map((child, idx) => {
              const photoCount = child.events.reduce((acc, ev) => acc + ev.photos.length, 0);
              return (
                <div 
                  key={child.name}
                  onClick={() => setSelectedChild(child)}
                  className="group cursor-pointer"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="relative aspect-[3/4] bg-white p-3 shadow-polaroid group-hover:shadow-polaroid-hover transition-all duration-500 transform group-hover:-translate-y-2 rounded-sm overflow-hidden">
                    {/* 封面图片 */}
                    <div className="w-full h-full relative overflow-hidden bg-stone-100 rounded-sm">
                      <img 
                        src={child.avatar || child.events[0]?.photos[0]?.url[0]} 
                        alt={child.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter saturate-[0.8] group-hover:saturate-100"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                      
                      {/* 装饰文本 */}
                      <div className="absolute top-4 left-4">
                         <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-serif text-ink tracking-widest shadow-sm uppercase">
                            {child.nickname}
                         </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white bg-gradient-to-t from-black/60 to-transparent">
                         <p className="font-hand text-3xl mb-1">{child.name}</p>
                         <p className="text-[10px] font-sans tracking-[0.2em] uppercase opacity-70">The {idx === 0 ? 'First' : idx === 1 ? 'Second' : 'Third'} Child</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="font-serif text-stone-400 text-xs italic tracking-widest mb-1">{photoCount} 张珍藏照片</p>
                    <div className="flex items-center justify-center gap-2 text-accent-brown font-serif text-sm group-hover:text-ink transition-colors">
                       <span>点击翻阅</span>
                       <BookOpen size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- 单个宝贝照片列表视图 ---
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 animate-fade-in">
      {/* 顶部悬浮导航 */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
         <button 
           onClick={() => setSelectedChild(null)}
           className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors group"
         >
           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
           <span className="font-serif text-sm uppercase tracking-wider">返回列表</span>
         </button>
         
         <div className="text-center">
            <h2 className="font-serif text-lg text-ink">{selectedChild.name} 的相册</h2>
            <span className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">{selectedChild.nickname} · 专属时光</span>
         </div>

         <div className="flex gap-2">
            {MULTI_CHILD_TIMELINES.map(c => (
              <button 
                key={c.name}
                onClick={() => setSelectedChild(c)}
                className={`w-2 h-2 rounded-full transition-all ${c.name === selectedChild.name ? 'bg-accent-brown scale-125' : 'bg-stone-200 hover:bg-stone-300'}`}
                title={c.name}
              />
            ))}
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        {/* Header Info */}
        <div className="max-w-3xl mx-auto text-center mb-16">
           <div className="flex justify-center mb-6 text-rose-200">
              <Heart size={32} strokeWidth={1} fill="currentColor" className="opacity-20" />
           </div>
           <p className="font-serif text-lg md:text-xl text-stone-500 italic leading-relaxed">
             “所有的惊喜，都藏在长大的每一个瞬间里。愿这些影像能成为你未来最珍贵的礼物。”
           </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4">
          {childPhotos.map((photo, idx) => (
            <div 
              key={photo.id}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm bg-stone-100 shadow-sm hover:shadow-md transition-all duration-500"
              onClick={() => setSelectedPhotoIndex(idx)}
            >
              {/* Media Rendering */}
              {photo.mediaType === 'video' ? (
                <div className="relative">
                  <video 
                    src={photo.url[0]} 
                    poster={photo.poster}
                    muted 
                    loop
                    playsInline
                    className="w-full h-auto object-cover"
                    onMouseOver={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 group-hover:bg-transparent transition-colors">
                     <PlayCircle size={32} className="text-white/80 drop-shadow-lg" />
                  </div>
                </div>
              ) : (
                <img 
                  src={photo.url[0]} 
                  alt={photo.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 filter saturate-[0.9] group-hover:saturate-100"
                  loading="lazy"
                />
              )}

              {/* Hover Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                 <h3 className="text-white font-serif text-sm font-medium mb-1">{photo.title}</h3>
                 <p className="text-white/70 text-[10px] font-sans tracking-widest uppercase">{photo.date}</p>
              </div>
            </div>
          ))}
        </div>

        {childPhotos.length === 0 && (
           <div className="py-32 text-center text-stone-300 font-serif">
              还没有上传照片，去记录第一个瞬间吧。
           </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="mt-24 text-center">
         <div className="inline-flex items-center gap-4">
            <div className="h-px w-12 bg-stone-100" />
            <Sparkles size={16} className="text-stone-200" />
            <div className="h-px w-12 bg-stone-100" />
         </div>
      </div>

      {/* Lightbox */}
      {selectedPhotoIndex >= 0 && (
        <ImmersiveLightbox 
          photo={childPhotos[selectedPhotoIndex]}
          onClose={() => setSelectedPhotoIndex(-1)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedPhotoIndex < childPhotos.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}
    </div>
  );
};
