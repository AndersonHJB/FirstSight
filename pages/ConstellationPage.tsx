
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
  type: 'earth' | 'gas' | 'moon' | 'mars' | 'ice' | 'lava' | 'emerald';
  speed: number;
  opacity: number;
  tilt: number;
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
    // FIX: Using any[] for the temporary grouping object because elements from allMemories 
    // do not yet have the x, y, size, and glowColor properties required by ConstellationNode.
    const groups: Record<string, any[]> = {};
    allMemories.forEach(node => {
      if (!groups[node.year]) groups[node.year] = [];
      groups[node.year].push(node);
    });

    const sortedYears = Object.keys(groups).sort();
    const finalGroups: ConstellationGroup[] = sortedYears.map((year, yearIdx) => {
      const centerX = yearIdx * 2200 + 1100;
      const centerY = 500;
      
      const bgStars = Array.from({length: 80}).map(() => ({
        x: centerX + (Math.random() - 0.5) * 2200,
        y: centerY + (Math.random() - 0.5) * 1000,
        size: Math.random() * 2.5,
        opacity: 0.1 + Math.random() * 0.6
      }));

      const planetTypes: Planet['type'][] = ['earth', 'gas', 'moon', 'mars', 'ice', 'lava', 'emerald'];
      // 每个年份生成的星球数量增加到 8-10 个
      const planetCount = 8 + Math.floor(Math.random() * 3);
      const planets: Planet[] = Array.from({length: planetCount}).map((_, i) => ({
        id: i,
        x: centerX + (Math.random() - 0.5) * 2000,
        y: centerY + (Math.random() - 0.5) * 900,
        size: 50 + Math.random() * 180,
        type: planetTypes[i % planetTypes.length],
        speed: 15 + Math.random() * 45, // 自转周期
        opacity: 0.5 + Math.random() * 0.5,
        tilt: (Math.random() - 0.5) * 40
      }));

      const nodes = groups[year].map((node, nodeIdx) => {
        const angle = (nodeIdx / groups[year].length) * Math.PI * 2 + (yearIdx * 0.4);
        const radius = 350 + Math.random() * 350;
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
        const speed = roamDirection === 'forward' ? 1.5 : -1.5;
        scrollRef.current.scrollLeft += speed;
        
        if (scrollRef.current.scrollLeft <= 0 && roamDirection === 'backward') setIsRoaming(false);
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - window.innerWidth && roamDirection === 'forward') setIsRoaming(false);
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [isRoaming, roamDirection, hoveredNodeId, selectedNode]);

  // 高级星球渲染器
  const PlanetRenderer: React.FC<{ planet: Planet }> = ({ planet }) => {
    const textureBase = "https://www.transparenttextures.com/patterns/";
    
    const getPlanetStyle = () => {
      switch (planet.type) {
        case 'earth':
          return {
            background: 'radial-gradient(circle at 30% 30%, #4b91f7 0%, #1a2a6c 70%)',
            boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.9), 0 0 40px rgba(75,145,247,0.3)',
            texture: 'dark-matter.png',
            glow: '#4b91f7'
          };
        case 'gas':
          return {
            background: 'linear-gradient(180deg, #5d4037 0%, #d7ccc8 20%, #a1887f 40%, #d7ccc8 60%, #5d4037 80%, #3e2723 100%)',
            boxShadow: 'inset -30px -10px 60px rgba(0,0,0,0.8), 0 0 30px rgba(161,136,127,0.2)',
            texture: 'stardust.png',
            glow: '#a1887f',
            hasRing: true
          };
        case 'lava':
          return {
            background: 'radial-gradient(circle at 30% 30%, #ff5722 0%, #3e1204 80%)',
            boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.9), 0 0 50px rgba(255,87,34,0.4)',
            texture: 'rocky-wall.png',
            glow: '#ff5722'
          };
        case 'ice':
          return {
            background: 'radial-gradient(circle at 30% 30%, #81d4fa 0%, #01579b 80%)',
            boxShadow: 'inset -15px -15px 40px rgba(0,0,0,0.7), 0 0 30px rgba(129,212,250,0.3)',
            texture: 'conrete-wall.png',
            glow: '#81d4fa'
          };
        case 'emerald':
          return {
            background: 'radial-gradient(circle at 30% 30%, #69f0ae 0%, #1b5e20 80%)',
            boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(105,240,174,0.2)',
            texture: 'carbon-fibre.png',
            glow: '#69f0ae'
          };
        case 'mars':
          return {
            background: 'radial-gradient(circle at 30% 30%, #ff7043 0%, #bf360c 80%)',
            boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(255,112,67,0.2)',
            texture: 'crissXcross.png',
            glow: '#ff7043'
          };
        default: // moon
          return {
            background: 'radial-gradient(circle at 30% 30%, #e0e0e0 0%, #424242 80%)',
            boxShadow: 'inset -15px -15px 40px rgba(0,0,0,0.6)',
            texture: 'p6-polka.png',
            glow: '#fff'
          };
      }
    };

    const style = getPlanetStyle();

    return (
      <div className="absolute pointer-events-none transition-all duration-[3000ms] animate-float-slow"
           style={{ left: planet.x, top: planet.y, width: planet.size, height: planet.size, transform: `translate(-50%, -50%) rotate(${planet.tilt}deg)`, opacity: planet.opacity }}>
        
        {/* 外围大气层辉光 */}
        <div className="absolute inset-[-15%] rounded-full blur-2xl opacity-20 animate-pulse" 
             style={{ background: style.glow }} />

        {/* 主球体 */}
        <div className="relative w-full h-full rounded-full overflow-hidden" 
             style={{ background: style.background, boxShadow: style.boxShadow }}>
          
          {/* 地表旋转纹理层 */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay" 
               style={{ 
                 backgroundImage: `url("${textureBase}${style.texture}")`,
                 backgroundSize: '200% 100%',
                 animation: `planet-rotate ${planet.speed}s linear infinite`
               }} />

          {/* 只有地球有流动的云层 */}
          {planet.type === 'earth' && (
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ 
                   backgroundImage: `url("${textureBase}cloudy-day.png")`,
                   backgroundSize: '200% 100%',
                   animation: `planet-rotate ${planet.speed * 0.7}s linear infinite reverse`
                 }} />
          )}

          {/* 表面阴影罩 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_transparent_20%,_rgba(0,0,0,0.8)_80%)]" />
        </div>

        {/* 行星环 */}
        {style.hasRing && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240%] h-[12%] rounded-full border-[12px] border-white/5 opacity-40 rotate-[15deg]"
               style={{ boxShadow: '0 0 25px rgba(255,255,255,0.05), inset 0 0 25px rgba(255,255,255,0.05)' }}>
            <div className="absolute inset-0 border border-white/10 rounded-full scale-[0.8]" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#010206] overflow-hidden relative select-none">
      
      {/* 远景星空 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className={`absolute inset-0 bg-gradient-to-tr transition-colors duration-1000 opacity-20
           ${roamDirection === 'forward' ? 'from-indigo-950 to-blue-900' : 'from-purple-900 to-rose-950'}`} />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
         {[...Array(12)].map((_, i) => (
           <div key={i} className="shooting-star" style={{ top: `${Math.random() * 70}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 20}s` }} />
         ))}
      </div>

      {/* 标题面板 */}
      <div className="fixed top-28 left-10 z-20 pointer-events-none">
         <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Globe size={18} className="animate-spin-slow text-blue-500/40" />
            <span className="font-serif text-[10px] tracking-[0.7em] uppercase text-white/30 font-bold">Chronicles of Time</span>
         </div>
         <h1 className="font-hand text-7xl text-white/95 drop-shadow-[0_0_40px_rgba(59,130,246,0.5)]">时光星图</h1>
         
         <div className="mt-8 flex flex-col gap-5 text-[9px] font-sans tracking-[0.3em] text-white/20 uppercase font-bold">
            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa]" /> 影像 Photo</span>
            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_15px_#a855f7] animate-pulse" /> 视频 Video</span>
            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_15px_#fbbf24]" /> 念想 Essay</span>
            <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_15px_#f472b6]" /> 家书 Letter</span>
         </div>
      </div>

      {/* 核心滚动画布 */}
      <div ref={scrollRef} className="relative w-full h-screen overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing z-10">
        <div className="relative h-full" style={{ width: `${constellations.length * 2200 + 1000}px` }}>
          
          {constellations.map((group) => (
            <div key={group.year} className="absolute inset-y-0 h-full w-full">
              
              {/* 背景繁星 */}
              {group.bgStars.map((star, i) => (
                <div key={i} className="absolute bg-white rounded-full animate-pulse" 
                     style={{ left: star.x, top: star.y, width: star.size, height: star.size, opacity: star.opacity, animationDelay: `${Math.random() * 5}s` }} />
              ))}

              {/* 动态星球 */}
              {group.planets.map(planet => <PlanetRenderer key={planet.id} planet={planet} />)}

              {/* 年份核心 */}
              <div className="absolute flex flex-col items-center justify-center group"
                   style={{ left: group.centerX, top: group.centerY, transform: 'translate(-50%, -50%)' }}>
                 <div className="w-64 h-64 rounded-full bg-white/[0.01] border border-white/5 flex items-center justify-center backdrop-blur-3xl transition-all duration-1000 group-hover:border-blue-500/30 relative">
                    <div className="absolute inset-0 rounded-full bg-blue-600/5 scale-100 group-hover:scale-125 transition-transform duration-1000 blur-[80px]" />
                    <span className="font-serif text-7xl text-white/10 group-hover:text-blue-400/80 transition-all duration-700 font-bold tracking-tighter relative z-10">{group.year}</span>
                 </div>
                 <div className="mt-8 text-white/5 font-serif italic text-xs tracking-[1.2em] group-hover:text-blue-500/30 transition-colors uppercase">Spatial Timeline</div>
              </div>

              {/* 记忆星点 */}
              {group.nodes.map((node) => (
                <div key={node.id} className="absolute flex items-center justify-center"
                     style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)', zIndex: hoveredNodeId === node.id ? 100 : 10 }}>
                  
                  <div className="w-40 h-40 bg-transparent flex items-center justify-center cursor-pointer group/star"
                       onMouseEnter={() => setHoveredNodeId(node.id)}
                       onMouseLeave={() => setHoveredNodeId(null)}
                       onClick={() => { setSelectedNode(node); setIsRoaming(false); }}>
                    
                    <div className={`rounded-full transition-all duration-700 shadow-2xl group-hover/star:scale-[4] relative
                        ${node.type === 'video' ? 'animate-star-glow' : ''}`}
                         style={{ 
                           width: `${node.size}px`, 
                           height: `${node.size}px`, 
                           backgroundColor: node.glowColor, 
                           boxShadow: `0 0 40px ${node.glowColor}`
                         }}>
                       <div className="absolute inset-[-12px] border border-white/10 rounded-full animate-pulse opacity-10" />
                    </div>

                    {/* 预览卡片 */}
                    <div className={`absolute bottom-full mb-12 left-1/2 -translate-x-1/2 transition-all duration-700 pointer-events-none
                      ${hoveredNodeId === node.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-50'}`}>
                      <div className="bg-[#030508]/98 backdrop-blur-3xl px-8 py-6 rounded-[32px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,1)] flex flex-col items-center gap-5 min-w-[220px]">
                         {node.url && (
                           <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 relative shadow-2xl">
                              <img src={node.url} className="w-full h-full object-cover" />
                              {node.type === 'video' && <PlayCircle className="absolute inset-0 m-auto text-white/90" size={36} />}
                           </div>
                         )}
                         <div className="text-center">
                            <span className="text-[15px] text-white font-serif tracking-[0.1em] block mb-1.5">{node.title}</span>
                            <span className="text-[11px] text-blue-400 font-mono uppercase tracking-[0.2em] opacity-70">{node.date}</span>
                         </div>
                      </div>
                      <div className="w-6 h-6 bg-[#030508]/98 rotate-45 mx-auto -mt-3 border-r border-b border-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 底部控制台 */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 bg-black/70 backdrop-blur-3xl px-10 py-5 rounded-[40px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
         <div className="flex bg-white/5 p-1.5 rounded-full border border-white/5">
            <button onClick={() => setRoamDirection('backward')} 
                    className={`p-3 rounded-full transition-all ${roamDirection === 'backward' ? 'bg-blue-600 text-white' : 'text-white/30 hover:text-white'}`}>
               <ChevronLeft size={20} />
            </button>
            <button onClick={() => setRoamDirection('forward')} 
                    className={`p-3 rounded-full transition-all ${roamDirection === 'forward' ? 'bg-blue-600 text-white' : 'text-white/30 hover:text-white'}`}>
               <ChevronRight size={20} />
            </button>
         </div>

         <div className="w-px h-10 bg-white/10" />

         <button onClick={() => setIsRoaming(!isRoaming)}
                 className={`group flex items-center gap-5 px-12 py-3 rounded-full text-xs font-bold tracking-[0.5em] uppercase transition-all duration-700
                 ${isRoaming ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-[0_0_50px_rgba(37,99,235,0.4)]'}`}>
           {isRoaming ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
           <span>{isRoaming ? (hoveredNodeId ? '星锁' : (roamDirection === 'forward' ? '光速漫游' : '逆向航行')) : '启动深度探索'}</span>
         </button>

         <button onClick={() => { scrollRef.current?.scrollTo({left: 0, behavior: 'smooth'}); setIsRoaming(false); }}
                 className="p-3 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all" title="重返原点">
            <RotateCcw size={20} />
         </button>
      </div>

      {/* 详情视窗 */}
      {selectedNode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-fade-in">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setSelectedNode(null)} />
           
           <div className="relative w-full max-w-6xl max-h-[92vh] bg-gradient-to-b from-[#080d1a] to-[#010206] backdrop-blur-3xl rounded-[56px] border border-white/10 shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row animate-scale-in">
              <button onClick={() => setSelectedNode(null)} className="absolute top-12 right-12 p-5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-20 border border-white/5">
                <X size={36} strokeWidth={1} />
              </button>

              <div className="flex-[1.4] bg-black/50 flex items-center justify-center p-12 md:p-24 border-r border-white/5 relative">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
                    <Globe size={600} strokeWidth={0.1} className="text-blue-500 animate-spin-slow" />
                 </div>
                 
                 {selectedNode.type === 'photo' || selectedNode.type === 'video' ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                       {selectedNode.type === 'video' ? (
                          <video src={selectedNode.url} controls autoPlay className="max-h-full max-w-full rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)]" />
                       ) : (
                          <img src={selectedNode.url} className="max-h-full max-w-full object-contain rounded-[40px] shadow-[0_0_150px_rgba(59,130,246,0.25)]" alt="" />
                       )}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center text-center relative z-10">
                       <div className={`w-56 h-56 rounded-full mb-16 flex items-center justify-center border border-white/10 bg-white/5 shadow-[0_0_80px_rgba(255,255,255,0.03)]
                         ${selectedNode.type === 'essay' ? 'text-amber-400' : 'text-pink-400'}`}>
                          {selectedNode.type === 'essay' ? <FileText size={100} strokeWidth={0.8} /> : <Mail size={100} strokeWidth={0.8} />}
                       </div>
                       <h3 className="text-white font-hand text-6xl mb-6 tracking-[0.2em]">{selectedNode.type === 'essay' ? '岁月碎念' : '见字如面'}</h3>
                    </div>
                 )}
              </div>

              <div className="flex-1 p-12 md:p-24 overflow-y-auto custom-scrollbar">
                 <div className="mb-20">
                    <div className="flex items-center gap-5 text-blue-500 font-mono text-[12px] tracking-[0.7em] uppercase mb-12 opacity-80">
                       <Clock size={18} /> {selectedNode.date}
                    </div>
                    <h2 className="text-5xl md:text-6xl font-serif text-white/95 mb-14 leading-tight tracking-tight drop-shadow-2xl">{selectedNode.title}</h2>
                    <div className="h-px w-40 bg-gradient-to-r from-blue-600/60 to-transparent" />
                 </div>

                 <div className="prose prose-invert prose-stone max-w-none 
                   prose-p:font-serif prose-p:leading-[2.8] prose-p:text-white/60 prose-p:text-xl prose-p:mb-12
                   prose-headings:text-white/90 prose-strong:text-blue-400 prose-blockquote:border-blue-600/40 prose-blockquote:bg-blue-600/5">
                    <ReactMarkdown>{selectedNode.description}</ReactMarkdown>
                 </div>

                 {(selectedNode.originalData as any).link && (
                    <a href={(selectedNode.originalData as any).link} target="_blank" rel="noreferrer" 
                       className="mt-28 inline-flex items-center gap-5 text-blue-500 hover:text-white transition-all text-sm font-bold tracking-[0.5em] uppercase border border-blue-500/20 px-16 py-5 rounded-full hover:bg-blue-500/10 shadow-2xl">
                       <ExternalLink size={24} /> 查看原文 ORIGIN
                    </a>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes planet-rotate {
          from { background-position: 0% center; }
          to { background-position: 200% center; }
        }
        .shooting-star {
          position: absolute; width: 2px; height: 2px; background: #fff; border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(255,255,255,0.05), 0 0 20px rgba(255,255,255,1);
          animation: anim-shoot 12s linear infinite; opacity: 0;
        }
        .shooting-star::before {
          content: ''; position: absolute; top: 50%; transform: translateY(-50%);
          width: 600px; height: 1px; background: linear-gradient(90deg, #fff, transparent);
        }
        @keyframes anim-shoot {
          0% { transform: rotate(325deg) translateX(0); opacity: 1; }
          60% { opacity: 1; }
          100% { transform: rotate(325deg) translateX(-2500px); opacity: 0; }
        }
        @keyframes constellation-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; filter: brightness(1); }
          50% { transform: scale(1.8); opacity: 1; filter: brightness(2); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-30px); }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-star-glow { animation: constellation-pulse 4s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 20px; }
        .animate-spin-slow { animation: spin 160s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
