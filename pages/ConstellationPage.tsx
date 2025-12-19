
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, TRAVEL_TRIPS } from '../data';
import { Photo } from '../types';
import { ImmersiveLightbox } from '../components/ImmersiveLightbox';
import { Star, Navigation2, Compass, Play, Pause, Info, Wind } from 'lucide-react';

interface StarNode extends Photo {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export const ConstellationPage: React.FC = () => {
  const [nodes, setNodes] = useState<StarNode[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);
  const [isRoaming, setIsRoaming] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 聚合所有照片并按日期排序
  const allPhotosSorted = useMemo(() => {
    const travelPhotos = TRAVEL_TRIPS.flatMap(t => t.photos);
    const combined = [...FAMILY_PHOTOS, ...BABY_PHOTOS, ...GALLERY_PHOTOS, ...travelPhotos];
    return combined.sort((a, b) => new Date(a.date.replace(/\./g, '-')).getTime() - new Date(b.date.replace(/\./g, '-')).getTime());
  }, []);

  // 生成星座布局
  useEffect(() => {
    const generatedNodes = allPhotosSorted.map((photo, index) => ({
      ...photo,
      // 沿着正弦波路径分布，模拟银河
      x: index * 300 + (Math.random() - 0.5) * 150 + 400,
      y: 400 + Math.sin(index * 0.8) * 200 + (Math.random() - 0.5) * 100,
      size: 4 + Math.random() * 6,
      opacity: 0.4 + Math.random() * 0.6
    }));
    setNodes(generatedNodes);
  }, [allPhotosSorted]);

  // 漫游逻辑
  useEffect(() => {
    let interval: number;
    if (isRoaming && scrollRef.current) {
      interval = window.setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += 1.5;
          // 如果到头了就停止
          if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - window.innerWidth) {
            setIsRoaming(false);
          }
        }
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isRoaming]);

  const handleNodeClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsRoaming(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] overflow-hidden relative selection:bg-blue-900/30">
      {/* 墨蓝纸张纹理叠加 */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
      
      {/* 动态背景星尘 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 页面标题 */}
      <div className="fixed top-28 left-0 right-0 z-20 px-8 flex justify-between items-end pointer-events-none">
        <div className="animate-fade-in">
           <div className="flex items-center gap-3 text-blue-400 mb-2">
              <Compass size={18} className="animate-spin" style={{ animationDuration: '10s' }} />
              <span className="font-serif text-[10px] tracking-[0.4em] uppercase opacity-60 text-white">Coordinate: Time & Love</span>
           </div>
           <h1 className="font-hand text-5xl md:text-6xl text-white/90">时光星图</h1>
        </div>
        <div className="hidden md:block text-right animate-fade-in opacity-40">
           <p className="font-serif text-sm text-white italic">“散落在岁月里的，不是尘埃，是星光。”</p>
        </div>
      </div>

      {/* 主画布容器 */}
      <div 
        ref={scrollRef}
        className="relative w-full h-screen overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        <div 
          className="relative h-full transition-transform duration-1000 ease-out"
          style={{ width: `${nodes.length * 300 + 1000}px` }}
        >
          {/* 连接线 - SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <path 
              d={`M ${nodes.map(n => `${n.x} ${n.y}`).join(' L ')}`}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="4 8"
              className="animate-float"
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
          </svg>

          {/* 星点/照片节点 */}
          {nodes.map((node, idx) => (
            <div
              key={node.id}
              className="absolute group transition-all duration-700"
              style={{ 
                left: `${node.x}px`, 
                top: `${node.y}px`,
                zIndex: hoveredNode === node.id ? 50 : 10
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(idx)}
            >
              {/* 核心光点 */}
              <div 
                className={`rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]
                  ${hoveredNode === node.id ? 'bg-white scale-[2.5]' : 'bg-blue-400 scale-100'}`}
                style={{ width: `${node.size}px`, height: `${node.size}px`, opacity: node.opacity }}
              />

              {/* 悬浮预览照片 */}
              <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-40 transition-all duration-500 pointer-events-none
                ${hoveredNode === node.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}`}>
                <div className="bg-white/10 backdrop-blur-xl p-1.5 rounded-full border border-white/20 shadow-2xl rotate-3">
                   <div className="aspect-square rounded-full overflow-hidden border border-white/30">
                      <img src={node.url[0]} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="" />
                   </div>
                </div>
                <div className="mt-4 text-center">
                   <p className="text-white text-[10px] font-hand tracking-widest whitespace-nowrap mb-1">{node.title}</p>
                   <p className="text-blue-300/60 text-[8px] font-sans">{node.date}</p>
                </div>
              </div>

              {/* 节点名称（常显） */}
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${hoveredNode ? 'opacity-0' : 'opacity-20'}`}>
                 <span className="text-[8px] text-white font-serif tracking-tighter whitespace-nowrap uppercase rotate-90 origin-left">{node.date.split('.')[1] || '01'}-STATION</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部控制栏 */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
         <button 
           onClick={() => setIsRoaming(!isRoaming)}
           className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif transition-all
             ${isRoaming ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-white/60 hover:text-white'}`}
         >
           {isRoaming ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
           <span>{isRoaming ? '漫游中...' : '开启漫游'}</span>
         </button>
         
         <div className="w-px h-4 bg-white/10" />
         
         <div className="flex items-center gap-2 text-white/40 text-[10px] font-sans tracking-widest uppercase">
            <Wind size={12} className="animate-pulse" />
            <span>左右滑动探索星河</span>
         </div>
      </div>

      {/* 侧边信息指示 */}
      <div className="fixed bottom-10 left-10 hidden lg:flex flex-col gap-1 text-white/20 font-serif italic text-xs">
         <span>Total Stars: {nodes.length}</span>
         <span>Path: Chronological Galaxy</span>
      </div>

      {/* 灯箱集成 */}
      {selectedPhotoIndex >= 0 && (
        <ImmersiveLightbox 
          photo={allPhotosSorted[selectedPhotoIndex]}
          onClose={() => setSelectedPhotoIndex(-1)}
          onNext={() => selectedPhotoIndex < nodes.length - 1 && setSelectedPhotoIndex(selectedPhotoIndex + 1)}
          onPrev={() => selectedPhotoIndex > 0 && setSelectedPhotoIndex(selectedPhotoIndex - 1)}
          hasNext={selectedPhotoIndex < nodes.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}
    </div>
  );
};
