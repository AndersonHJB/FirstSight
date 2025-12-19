
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, TRAVEL_TRIPS, ESSAY_DATA, LETTERS_DATA } from '../data';
import { Photo, Essay, Letter } from '../types';
import { Sparkles, Mail, FileText, Camera, Play, Pause, X, Clock, ExternalLink, Globe, PlayCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ConstellationNode {
  id: string;
  type: 'photo' | 'essay' | 'letter' | 'video';
  title: string;
  date: string;
  year: string;
  description: string;
  url: string;
  originalData: Photo | Essay | Letter;
  x: number;
  y: number;
  size: number;
  glowColor: string;
}

interface Planet {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'earth' | 'gas' | 'moon' | 'mars';
  rotation: number;
  opacity: number;
}

interface ConstellationGroup {
  year: string;
  nodes: ConstellationNode[];
  centerX: number;
  centerY: number;
  bgStars: {x: number, y: number, size: number, opacity: number}[];
  planets: Planet[];
}

export const ConstellationPage: React.FC = () => {
  const [constellations, setConstellations] = useState<ConstellationGroup[]>([]);
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [isRoaming, setIsRoaming] = useState(false);
  const [roamDirection, setRoamDirection] = useState<'forward' | 'backward'>('forward');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allMemories = useMemo(() => {
    const travelPhotos = TRAVEL_TRIPS.flatMap(t => t.photos);
    const photoAndVideoNodes = [...FAMILY_PHOTOS, ...BABY_PHOTOS, ...GALLERY_PHOTOS, ...travelPhotos].map(p => ({
      id: p.id, 
      type: (p.mediaType === 'video' ? 'video' : 'photo') as any, 
      title: p.title, 
      date: p.date, 
      year: p.date.substring(0, 4),
      description: p.description, 
      url: p.url[0], 
      originalData: p
    }));

    const essayNodes = ESSAY_DATA.map(e => ({
      id: e.id, type: 'essay' as const, title: e.from || '随感', date: e.date.split(' ')[0], year: e.date.substring(0, 4),
      description: e.content, url: e.images?.[0] || '', originalData: e
    }));

    const letterNodes = LETTERS_DATA.map(l => ({
      id: l.id, type: 'letter' as const, title: l.title, date: l.date, year: l.date.substring(0, 4),
      description: l.content, url: l.cover || '', originalData: l
    }));

    return [...photoAndVideoNodes, ...essayNodes, ...letterNodes].sort((a, b) => 
      new Date(a.date.replace(/\./g, '-')).getTime() - new Date(b.date.replace(/\./g, '-')).getTime()
    );
  }, []);

  useEffect(() => {
    const groups: Record<string, ConstellationNode[]> = {};
    allMemories.forEach(node => {
      if (!groups[node.year]) groups[node.year] = [];
      groups[node.year].push(node);
    });

    const sortedYears = Object.keys(groups).sort();
    const finalGroups: ConstellationGroup[] = sortedYears.map((year, yearIdx) => {
      const centerX = yearIdx * 1800 + 900;
      const centerY = 500;
      
      const bgStars = Array.from({length: 60}).map(() => ({
        x: centerX + (Math.random() - 0.5) * 1800,
        y: centerY + (Math.random() - 0.5) * 1000,
        size: Math.random() * 1.8,
        opacity: 0.1 + Math.random() * 0.4
      }));

      const planetTypes: Planet['type'][] = ['earth', 'gas', 'moon', 'mars'];
      const planets: Planet[] = Array.from({length: 4}).map((_, i) => ({
        id: i,
        x: centerX + (Math.random() - 0.5) * 1400,
        y: centerY + (Math.random() - 0.5) * 900,
        size: 80 + Math.random() * 150,
        type: planetTypes[i % planetTypes.length],
        rotation: Math.random() * 360,
        opacity: 0.6 + Math.random() * 0.4
      }));

      const nodes = groups[year].map((node, nodeIdx) => {
        const angle = (nodeIdx / groups[year].length) * Math.PI * 2 + (yearIdx * 0.4);
        const radius = 280 + Math.random() * 320;
        let glow = '#60a5fa'; 
        if (node.type === 'essay') glow = '#fbbf24';
        if (node.type === 'letter') glow = '#f472b6';
        if (node.type === 'video') glow = '#a855f7';

        return {
          ...node,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          size: node.type === 'letter' ? 14 : (node.type === 'video' ? 11 : 8),
          glowColor: glow
        };
      });
      return { year, nodes, centerX, centerY, bgStars, planets };
    });

    setConstellations(finalGroups);
  }, [allMemories]);

  useEffect(() => {
    let frame: number;
    const move = () => {
      if (isRoaming && !hoveredNodeId && !selectedNode && scrollRef.current) {
        const speed = roamDirection === 'forward' ? 1.2 : -1.2;
        scrollRef.current.scrollLeft += speed;
        
        if (scrollRef.current.scrollLeft <= 0 && roamDirection === 'backward') setIsRoaming(false);
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - window.innerWidth && roamDirection === 'forward') setIsRoaming(false);
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [isRoaming, roamDirection, hoveredNodeId, selectedNode]);

  // 星球渲染逻辑组件
  const PlanetRenderer: React.FC<{ planet: Planet }> = ({ planet }) => {
    const renderContent = () => {
      switch (planet.type) {
        case 'earth':
          return (
            <div className="relative w-full h-full rounded-full overflow-hidden animate-spin-slow" 
                 style={{ 
                   background: 'radial-gradient(circle at 30% 30%, #4b91f7 0%, #1a2a6c 70%)',
                   boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(75,145,247,0.2)'
                 }}>
              {/* 大陆纹理模拟 */}
              <div className="absolute inset-0 opacity-40 blur-[1px]" 
                   style={{ background: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")' }} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_#2ecc71_0%,_transparent_60%)] opacity-30" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_#27ae60_0%,_transparent_50%)] opacity-30" />
              {/* 大气层云层 */}
              <div className="absolute inset-0 animate-cloud-move opacity-20" 
                   style={{ background: 'radial-gradient(ellipse at center, #fff 0%, transparent 70%)', transform: 'scale(2)' }} />
            </div>
          );
        case 'gas': // 木星/土星风格
          return (
            <div className="relative w-full h-full">
              <div className="w-full h-full rounded-full overflow-hidden"
                   style={{ 
                     background: 'linear-gradient(180deg, #5d4037 0%, #d7ccc8 20%, #a1887f 40%, #d7ccc8 60%, #5d4037 80%, #3e2723 100%)',
                     boxShadow: 'inset -30px -10px 60px rgba(0,0,0,0.7), 0 0 30px rgba(161,136,127,0.1)',
                     transform: `rotate(${planet.rotation}deg)`
                   }}>
                <div className="absolute inset-0 opacity-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 3px)' }} />
              </div>
              {/* 土星环 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] h-[15%] rounded-full border-[10px] border-white/10 opacity-30 rotate-[20deg]"
                   style={{ boxShadow: '0 0 20px rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.1)' }} />
            </div>
          );
        case 'moon':
          return (
            <div className="w-full h-full rounded-full relative overflow-hidden"
                 style={{ 
                   background: 'radial-gradient(circle at 30% 30%, #e0e0e0 0%, #757575 80%)',
                   boxShadow: 'inset -15px -15px 40px rgba(0,0,0,0.6)'
                 }}>
              {/* 陨石坑效果 */}
              <div className="absolute top-[20%] left-[30%] w-[15%] h-[15%] rounded-full bg-black/10 shadow-inner" />
              <div className="absolute top-[50%] left-[60%] w-[10%] h-[10%] rounded-full bg-black/10 shadow-inner" />
              <div className="absolute top-[70%] left-[25%] w-[20%] h-[20%] rounded-full bg-black/10 shadow-inner" />
              <div className="absolute inset-0 opacity-20" style={{ background: 'url("https://www.transparenttextures.com/patterns/p6-polka.png")' }} />
            </div>
          );
        case 'mars':
          return (
            <div className="w-full h-full rounded-full overflow-hidden relative"
                 style={{ 
                   background: 'radial-gradient(circle at 30% 30%, #ff7043 0%, #bf360c 80%)',
                   boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255,112,67,0.1)'
                 }}>
              <div className="absolute inset-0 opacity-30 blur-[2px]" 
                   style={{ background: 'url("https://www.transparenttextures.com/patterns/rocky-wall.png")' }} />
            </div>
          );
      }
    };

    return (
      <div className="absolute pointer-events-none transition-all duration-[3000ms] animate-float-slow"
           style={{ left: planet.x, top: planet.y, width: planet.size, height: planet.size, transform: 'translate(-50%, -50%)', opacity: planet.opacity }}>
        {/* 大气辉光层 */}
        <div className="absolute inset-[-10%] rounded-full blur-2xl opacity-20" 
             style={{ background: planet.type === 'earth' ? '#4b91f7' : (planet.type === 'mars' ? '#ff7043' : '#fff') }} />
        {renderContent()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#02040a] overflow-hidden relative select-none">
      
      {/* 远景背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className={`absolute inset-0 bg-gradient-to-tr transition-colors duration-1000 opacity-30
           ${roamDirection === 'forward' ? 'from-indigo-950/50 to-blue-900/10' : 'from-purple-900/50 to-rose-900/10'}`} />
         {[...Array(8)].map((_, i) => (
           <div key={i} className="shooting-star" style={{ top: `${Math.random() * 60}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 15}s` }} />
         ))}
      </div>

      {/* 标题面板 */}
      <div className="fixed top-28 left-10 z-20 pointer-events-none">
         <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Globe size={18} className="animate-spin-slow text-blue-500/60" />
            <span className="font-serif text-[10px] tracking-[0.6em] uppercase text-white/30 font-bold italic">Deep Space Chronicles</span>
         </div>
         <h1 className="font-hand text-7xl text-white/95 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">时光星图</h1>
         
         <div className="mt-6 flex flex-col gap-4 text-[9px] font-sans tracking-[0.3em] text-white/20 uppercase font-bold">
            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa]" /> 影像 Photo</span>
            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_15px_#a855f7] animate-pulse" /> 视频 Video</span>
            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_15px_#fbbf24]" /> 念想 Essay</span>
            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_15px_#f472b6]" /> 家书 Letter</span>
         </div>
      </div>

      {/* 核心滚动画布 */}
      <div ref={scrollRef} className="relative w-full h-screen overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing z-10">
        <div className="relative h-full" style={{ width: `${constellations.length * 1800 + 1000}px` }}>
          
          {constellations.map((group) => (
            <div key={group.year} className="absolute inset-y-0 h-full w-full">
              
              {/* 背景繁星 */}
              {group.bgStars.map((star, i) => (
                <div key={i} className="absolute bg-white rounded-full" 
                     style={{ left: star.x, top: star.y, width: star.size, height: star.size, opacity: star.opacity }} />
              ))}

              {/* 真实质感星球 */}
              {group.planets.map(planet => <PlanetRenderer key={planet.id} planet={planet} />)}

              {/* 年份核心 */}
              <div className="absolute flex flex-col items-center justify-center group"
                   style={{ left: group.centerX, top: group.centerY, transform: 'translate(-50%, -50%)' }}>
                 <div className="w-56 h-56 rounded-full bg-white/[0.01] border border-white/5 flex items-center justify-center backdrop-blur-3xl transition-all duration-1000 group-hover:border-blue-500/30 relative">
                    <div className="absolute inset-0 rounded-full bg-blue-600/5 scale-100 group-hover:scale-125 transition-transform duration-1000 blur-3xl" />
                    <span className="font-serif text-6xl text-white/20 group-hover:text-blue-400/90 transition-colors font-bold tracking-tighter relative z-10">{group.year}</span>
                 </div>
                 <div className="mt-8 text-white/5 font-serif italic text-xs tracking-[1em] group-hover:text-blue-500/40 transition-colors uppercase">Memory Epoch</div>
              </div>

              {/* 记忆星点 */}
              {group.nodes.map((node) => (
                <div key={node.id} className="absolute flex items-center justify-center"
                     style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)', zIndex: hoveredNodeId === node.id ? 100 : 10 }}>
                  
                  <div className="w-32 h-32 bg-transparent flex items-center justify-center cursor-pointer group/star"
                       onMouseEnter={() => setHoveredNodeId(node.id)}
                       onMouseLeave={() => setHoveredNodeId(null)}
                       onClick={() => { setSelectedNode(node); setIsRoaming(false); }}>
                    
                    <div className={`rounded-full transition-all duration-700 shadow-2xl group-hover/star:scale-[3.5] relative
                        ${node.type === 'video' ? 'animate-star-glow' : ''}`}
                         style={{ 
                           width: `${node.size}px`, 
                           height: `${node.size}px`, 
                           backgroundColor: node.glowColor, 
                           boxShadow: `0 0 35px ${node.glowColor}`
                         }}>
                       <div className="absolute inset-[-10px] border border-white/10 rounded-full animate-pulse opacity-20" />
                    </div>

                    {/* 预览卡片 */}
                    <div className={`absolute bottom-full mb-12 left-1/2 -translate-x-1/2 transition-all duration-700 pointer-events-none
                      ${hoveredNodeId === node.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-50'}`}>
                      <div className="bg-[#05070a]/95 backdrop-blur-3xl px-6 py-5 rounded-[28px] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.9)] flex flex-col items-center gap-4 min-w-[180px]">
                         {node.url && (
                           <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 relative shadow-2xl">
                              <img src={node.url} className="w-full h-full object-cover" />
                              {node.type === 'video' && <PlayCircle className="absolute inset-0 m-auto text-white" size={32} />}
                           </div>
                         )}
                         <div className="text-center">
                            <span className="text-[13px] text-white font-serif tracking-widest block mb-1">{node.title}</span>
                            <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest opacity-60">{node.date}</span>
                         </div>
                      </div>
                      <div className="w-5 h-5 bg-[#05070a]/95 rotate-45 mx-auto -mt-2.5 border-r border-b border-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 控制台 */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-black/60 backdrop-blur-3xl px-8 py-4 rounded-[32px] border border-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.9)]">
         <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
            <button onClick={() => setRoamDirection('backward')} 
                    className={`p-2.5 rounded-full transition-all ${roamDirection === 'backward' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>
               <ChevronLeft size={18} />
            </button>
            <button onClick={() => setRoamDirection('forward')} 
                    className={`p-2.5 rounded-full transition-all ${roamDirection === 'forward' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>
               <ChevronRight size={18} />
            </button>
         </div>

         <div className="w-px h-8 bg-white/10" />

         <button onClick={() => setIsRoaming(!isRoaming)}
                 className={`group flex items-center gap-4 px-10 py-2.5 rounded-full text-[11px] font-bold tracking-[0.4em] uppercase transition-all duration-700
                 ${isRoaming ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)]'}`}>
           {isRoaming ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
           <span>{isRoaming ? (hoveredNodeId ? '漫游锁定' : (roamDirection === 'forward' ? '漫游中' : '逆流中')) : '开启星际漫游'}</span>
         </button>

         <button onClick={() => { scrollRef.current?.scrollTo({left: 0, behavior: 'smooth'}); setIsRoaming(false); }}
                 className="p-2.5 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all">
            <RotateCcw size={18} />
         </button>
      </div>

      {/* 详情面板 */}
      {selectedNode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-fade-in">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setSelectedNode(null)} />
           
           <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-b from-[#0a0f1d]/90 to-[#02040a]/98 backdrop-blur-3xl rounded-[48px] border border-white/10 shadow-[0_0_200px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row animate-scale-in">
              <button onClick={() => setSelectedNode(null)} className="absolute top-10 right-10 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-20 border border-white/5">
                <X size={32} strokeWidth={1} />
              </button>

              <div className="flex-[1.3] bg-black/40 flex items-center justify-center p-12 md:p-20 border-r border-white/5 relative">
                 <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                    <Globe size={450} strokeWidth={0.2} className="text-blue-500 animate-spin-slow" />
                 </div>
                 
                 {selectedNode.type === 'photo' || selectedNode.type === 'video' ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                       {selectedNode.type === 'video' ? (
                          <video src={selectedNode.url} controls autoPlay className="max-h-full max-w-full rounded-[32px] shadow-2xl" />
                       ) : (
                          <img src={selectedNode.url} className="max-h-full max-w-full object-contain rounded-[32px] shadow-[0_0_120px_rgba(59,130,246,0.3)]" alt="" />
                       )}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center text-center relative z-10">
                       <div className={`w-48 h-48 rounded-full mb-12 flex items-center justify-center border border-white/10 bg-white/5 shadow-[0_0_60px_rgba(255,255,255,0.05)]
                         ${selectedNode.type === 'essay' ? 'text-amber-400' : 'text-pink-400'}`}>
                          {selectedNode.type === 'essay' ? <FileText size={80} strokeWidth={1} /> : <Mail size={80} strokeWidth={1} />}
                       </div>
                       <h3 className="text-white font-hand text-5xl mb-4 tracking-widest">{selectedNode.type === 'essay' ? '岁月碎念' : '见字如面'}</h3>
                    </div>
                 )}
              </div>

              <div className="flex-1 p-12 md:p-20 overflow-y-auto custom-scrollbar">
                 <div className="mb-16">
                    <div className="flex items-center gap-4 text-blue-500 font-mono text-[11px] tracking-[0.6em] uppercase mb-10 opacity-80">
                       <Clock size={16} /> {selectedNode.date}
                    </div>
                    <h2 className="text-5xl md:text-6xl font-serif text-white/95 mb-12 leading-tight tracking-tight drop-shadow-2xl">{selectedNode.title}</h2>
                    <div className="h-px w-32 bg-gradient-to-r from-blue-600/80 to-transparent" />
                 </div>

                 <div className="prose prose-invert prose-stone max-w-none 
                   prose-p:font-serif prose-p:leading-[2.6] prose-p:text-white/60 prose-p:text-xl prose-p:mb-10
                   prose-headings:text-white/90 prose-strong:text-blue-400 prose-blockquote:border-blue-600/40 prose-blockquote:bg-blue-600/5">
                    <ReactMarkdown>{selectedNode.description}</ReactMarkdown>
                 </div>

                 {(selectedNode.originalData as any).link && (
                    <a href={(selectedNode.originalData as any).link} target="_blank" rel="noreferrer" 
                       className="mt-24 inline-flex items-center gap-4 text-blue-500 hover:text-white transition-all text-sm font-bold tracking-[0.4em] uppercase border border-blue-500/20 px-12 py-4 rounded-full hover:bg-blue-500/10 shadow-2xl">
                       <ExternalLink size={20} /> 查看原文 Bridge
                    </a>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .shooting-star {
          position: absolute; width: 2px; height: 2px; background: #fff; border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(255,255,255,0.05), 0 0 20px rgba(255,255,255,1);
          animation: anim-shoot 8s linear infinite; opacity: 0;
        }
        .shooting-star::before {
          content: ''; position: absolute; top: 50%; transform: translateY(-50%);
          width: 500px; height: 1px; background: linear-gradient(90deg, #fff, transparent);
        }
        @keyframes anim-shoot {
          0% { transform: rotate(320deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(320deg) translateX(-2200px); opacity: 0; }
        }
        @keyframes constellation-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; filter: brightness(1); }
          50% { transform: scale(1.6); opacity: 1; filter: brightness(1.8); }
        }
        @keyframes cloud-move {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-20px); }
        }
        .animate-cloud-move { animation: cloud-move 60s linear infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-star-glow { animation: constellation-pulse 3s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 20px; }
        .animate-spin-slow { animation: spin 120s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
