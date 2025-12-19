
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, TRAVEL_TRIPS, ESSAY_DATA, LETTERS_DATA } from '../data';
import { Photo, Essay, Letter, AlbumType } from '../types';
import { ImmersiveLightbox } from '../components/ImmersiveLightbox';
import { Star, Navigation2, Compass, Play, Pause, Info, Wind, Sparkles, Mail, FileText, Camera } from 'lucide-react';

// 统一的星图节点接口
interface ConstellationNode {
  id: string;
  type: 'photo' | 'essay' | 'letter';
  title: string;
  date: string;
  description: string;
  url: string;
  originalData: Photo | Essay | Letter;
  // 视觉属性
  x: number;
  y: number;
  size: number;
  glowColor: string;
  pulseDelay: string;
}

export const ConstellationPage: React.FC = () => {
  const [nodes, setNodes] = useState<ConstellationNode[]>([]);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(-1);
  const [isRoaming, setIsRoaming] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 聚合并归一化所有数据
  const allMemories = useMemo(() => {
    const travelPhotos = TRAVEL_TRIPS.flatMap(t => t.photos);
    
    // 归一化照片
    const photoNodes = [...FAMILY_PHOTOS, ...BABY_PHOTOS, ...GALLERY_PHOTOS, ...travelPhotos].map(p => ({
      id: p.id,
      type: 'photo' as const,
      title: p.title,
      date: p.date,
      description: p.description,
      url: p.url[0],
      originalData: p
    }));

    // 归一化短文
    const essayNodes = ESSAY_DATA.map(e => ({
      id: e.id,
      type: 'essay' as const,
      title: e.from || '随感',
      date: e.date.split(' ')[0],
      description: e.content,
      url: e.images?.[0] || '', // 可能没图
      originalData: e
    }));

    // 归一化家书
    const letterNodes = LETTERS_DATA.map(l => ({
      id: l.id,
      type: 'letter' as const,
      title: l.title,
      date: l.date,
      description: l.content,
      url: l.cover || '',
      originalData: l
    }));

    // 按日期排序
    return [...photoNodes, ...essayNodes, ...letterNodes].sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, '-')).getTime();
      const dateB = new Date(b.date.replace(/\./g, '-')).getTime();
      return dateA - dateB;
    });
  }, []);

  // 2. 计算星系布局
  useEffect(() => {
    const generated = allMemories.map((item, index) => {
      // 颜色映射
      let glow = '#60a5fa'; // 默认蓝色 (照片)
      if (item.type === 'essay') glow = '#fbbf24'; // 琥珀色 (短文)
      if (item.type === 'letter') glow = '#f472b6'; // 粉色 (家书)

      return {
        ...item,
        // 银河螺旋分布公式
        x: index * 280 + Math.cos(index * 0.3) * 150 + 500,
        y: 450 + Math.sin(index * 0.3) * 200 + (Math.random() - 0.5) * 100,
        size: item.type === 'letter' ? 12 : (item.type === 'essay' ? 8 : 6),
        glowColor: glow,
        pulseDelay: `${Math.random() * 4}s`
      };
    });
    setNodes(generated);
  }, [allMemories]);

  // 3. 漫游逻辑
  useEffect(() => {
    let frame: number;
    const move = () => {
      if (isRoaming && scrollRef.current) {
        scrollRef.current.scrollLeft += 1.2;
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - window.innerWidth) {
          setIsRoaming(false);
        }
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [isRoaming]);

  const handleNodeClick = (index: number) => {
    const node = nodes[index];
    if (node.type === 'photo') {
      setSelectedNodeIndex(index);
    } else {
      // 短文或家书直接跳转页面（模拟真实业务逻辑）
      const path = node.type === 'essay' ? `/essay?id=${node.id}` : `/letters?id=${node.id}`;
      window.location.hash = path;
    }
    setIsRoaming(false);
  };

  return (
    <div className="min-h-screen bg-[#02040a] overflow-hidden relative select-none">
      
      {/* 极深空背景与动态星云 */}
      <div className="absolute inset-0 z-0">
         {/* 星云 1 */}
         <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-20 mix-blend-screen animate-float pointer-events-none"
              style={{ background: 'radial-gradient(circle at 30% 40%, #1e1b4b 0%, transparent 50%), radial-gradient(circle at 70% 60%, #312e81 0%, transparent 50%)' }} />
         {/* 星云 2 */}
         <div className="absolute inset-0 opacity-10 mix-blend-color-dodge animate-pulse pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 50%, #4338ca 0%, transparent 70%)', animationDuration: '8s' }} />
         
         {/* 随机流星 */}
         {[...Array(5)].map((_, i) => (
           <div key={i} className="shooting-star" style={{ top: `${Math.random() * 50}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s` }} />
         ))}

         {/* 动态尘埃光点 */}
         <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => (
              <div key={i} 
                   className="absolute bg-white rounded-full animate-twinkle" 
                   style={{ 
                     width: '1px', height: '1px', 
                     top: `${Math.random() * 100}%`, 
                     left: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 5}s`
                   }} />
            ))}
         </div>
      </div>

      {/* 头部信息 */}
      <div className="fixed top-28 left-0 right-0 z-20 px-10 flex justify-between items-start pointer-events-none">
        <div className="animate-fade-in group pointer-events-auto">
           <div className="flex items-center gap-3 text-blue-400 mb-2">
              <Sparkles size={16} className="animate-pulse" />
              <span className="font-serif text-[10px] tracking-[0.5em] uppercase text-white/50">Universal Memory Constellation</span>
           </div>
           <h1 className="font-hand text-6xl text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">时光星图</h1>
           <div className="mt-4 flex gap-4 text-[9px] font-sans tracking-widest text-white/30 uppercase">
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_#60a5fa]" /> 影像</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_#fbbf24]" /> 短文</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_5px_#f472b6]" /> 家书</span>
           </div>
        </div>
      </div>

      {/* 滚动画布 */}
      <div 
        ref={scrollRef}
        className="relative w-full h-screen overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing z-10"
      >
        <div 
          className="relative h-full"
          style={{ width: `${nodes.length * 280 + 1200}px` }}
        >
          {/* 路径连接线 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <path 
              d={`M ${nodes.map(n => `${n.x} ${n.y}`).join(' L ')}`}
              fill="none"
              stroke="url(#galaxyGradient)"
              strokeWidth="0.5"
              strokeDasharray="2 6"
            />
            <defs>
              <linearGradient id="galaxyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
          </svg>

          {/* 节点渲染 */}
          {nodes.map((node, idx) => (
            <div
              key={`${node.id}-${idx}`}
              className="absolute group transition-all duration-1000 ease-out"
              style={{ 
                left: `${node.x}px`, 
                top: `${node.y}px`,
                zIndex: hoveredNodeId === node.id ? 100 : 10
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              onClick={() => handleNodeClick(idx)}
            >
              {/* 星点本体 */}
              <div 
                className="rounded-full cursor-pointer transition-all duration-500 relative"
                style={{ 
                  width: `${node.size}px`, 
                  height: `${node.size}px`, 
                  backgroundColor: node.glowColor,
                  boxShadow: `0 0 ${hoveredNodeId === node.id ? '30px' : '15px'} ${node.glowColor}`,
                  animation: `constellation-pulse 4s ease-in-out infinite ${node.pulseDelay}`
                }}
              >
                {/* 悬浮时的扩散光圈 */}
                <div className={`absolute inset-[-10px] border border-white/10 rounded-full transition-transform duration-1000 
                  ${hoveredNodeId === node.id ? 'scale-150 opacity-0' : 'scale-0 opacity-0'}`} />
              </div>

              {/* 悬浮详情面板 */}
              <div className={`absolute bottom-full mb-8 left-1/2 -translate-x-1/2 w-56 transition-all duration-500 pointer-events-none
                ${hoveredNodeId === node.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                
                <div className="bg-[#0f172a]/80 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                   {/* 预览媒体/图标 */}
                   <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-white/5 relative flex items-center justify-center">
                      {node.url ? (
                        <img src={node.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                      ) : (
                        <div className="text-white/20">
                           {node.type === 'essay' ? <FileText size={32} /> : <Mail size={32} />}
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                         {node.type === 'photo' && <Camera size={12} className="text-white/50" />}
                         {node.type === 'essay' && <FileText size={12} className="text-amber-400" />}
                         {node.type === 'letter' && <Mail size={12} className="text-pink-400" />}
                      </div>
                   </div>
                   
                   {/* 文本内容 */}
                   <div className="px-1">
                      <p className="text-white text-xs font-serif truncate mb-1">{node.title}</p>
                      <p className="text-white/40 text-[9px] line-clamp-2 font-serif leading-relaxed mb-2 italic">
                         {node.description.substring(0, 50)}...
                      </p>
                      <div className="flex justify-between items-center border-t border-white/5 pt-2">
                         <span className="text-[8px] text-white/30 font-sans tracking-widest uppercase">{node.date}</span>
                         <span className="text-[8px] text-blue-400 font-sans tracking-widest uppercase">Click to open</span>
                      </div>
                   </div>
                </div>

                {/* 连接线装饰 */}
                <div className="h-8 w-px bg-gradient-to-t from-white/20 to-transparent mx-auto mt-0" />
              </div>

              {/* 装饰性文字标签 (常显) */}
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 transition-all duration-700 pointer-events-none
                ${hoveredNodeId ? 'opacity-0 scale-75' : 'opacity-20 scale-100'}`}>
                 <span className="text-[7px] text-white font-serif tracking-[0.3em] whitespace-nowrap uppercase rotate-90 origin-left">
                   {node.type.toUpperCase()}-{node.date.split('.')[1] || 'XX'}
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 控制中心 */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/60 backdrop-blur-2xl px-8 py-4 rounded-full border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
         <button 
           onClick={() => setIsRoaming(!isRoaming)}
           className={`flex items-center gap-3 px-5 py-2 rounded-full text-xs font-serif transition-all duration-500
             ${isRoaming ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
         >
           {isRoaming ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
           <span className="tracking-widest">{isRoaming ? '星际漫游中' : '开启时光巡航'}</span>
         </button>
         
         <div className="w-px h-5 bg-white/10 mx-2" />
         
         <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
               <span className="text-[10px] text-white/30 font-sans uppercase tracking-tighter">Memories</span>
               <span className="text-xs text-white/80 font-serif font-bold">{allMemories.length}</span>
            </div>
            <div className="w-px h-4 bg-white/5" />
            <div className="flex flex-col items-center">
               <span className="text-[10px] text-white/30 font-sans uppercase tracking-tighter">Eras</span>
               <span className="text-xs text-white/80 font-serif font-bold">{new Set(allMemories.map(m => m.date.substring(0,4))).size}</span>
            </div>
         </div>
      </div>

      {/* 深度提示 */}
      <div className="fixed bottom-10 left-10 hidden lg:flex flex-col gap-1 text-white/10 font-serif italic text-[10px] tracking-widest uppercase">
         <span>Galactic Coordinate: Love_Core_01</span>
         <span>Observatory: Bornforthis Timeless</span>
      </div>

      {/* 灯箱 */}
      {selectedNodeIndex >= 0 && (
        <ImmersiveLightbox 
          photo={nodes[selectedNodeIndex].originalData as Photo}
          onClose={() => setSelectedNodeIndex(-1)}
          onNext={() => selectedNodeIndex < nodes.length - 1 && setSelectedNodeIndex(selectedNodeIndex + 1)}
          onPrev={() => selectedNodeIndex > 0 && setSelectedNodeIndex(selectedNodeIndex - 1)}
          hasNext={selectedNodeIndex < nodes.length - 1}
          hasPrev={selectedNodeIndex > 0}
        />
      )}

      {/* 响应式样式注入 */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .shooting-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(255,255,255,0.1), 0 0 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,1);
          animation: animate-shooting-star 3s linear infinite;
          opacity: 0;
        }
        .shooting-star::before {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 300px;
          height: 1px;
          background: linear-gradient(90deg, #fff, transparent);
        }
        @keyframes animate-shooting-star {
          0% { transform: rotate(315deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(315deg) translateX(-1000px); opacity: 0; }
        }
        .animate-twinkle { animation: twinkle linear infinite; }
      `}</style>
    </div>
  );
};
