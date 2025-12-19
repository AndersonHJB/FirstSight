
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FAMILY_PHOTOS, BABY_PHOTOS, GALLERY_PHOTOS, TRAVEL_TRIPS, ESSAY_DATA, LETTERS_DATA } from '../data';
import { Photo, Essay, Letter } from '../types';
import { Sparkles, Mail, FileText, Camera, Play, Pause, X, MapPin, Clock, ExternalLink, Globe, PlayCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// 统一的星图节点接口
interface ConstellationNode {
  id: string;
  type: 'photo' | 'essay' | 'letter' | 'video'; // 增加 video 类型
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

interface ConstellationGroup {
  year: string;
  nodes: ConstellationNode[];
  centerX: number;
  centerY: number;
  bgStars: {x: number, y: number, size: number, opacity: number}[]; 
}

export const ConstellationPage: React.FC = () => {
  const [constellations, setConstellations] = useState<ConstellationGroup[]>([]);
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [isRoaming, setIsRoaming] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 自动聚合全站记忆：智能识别图片、视频、短文、家书
  const allMemories = useMemo(() => {
    const travelPhotos = TRAVEL_TRIPS.flatMap(t => t.photos);
    const photoAndVideoNodes = [...FAMILY_PHOTOS, ...BABY_PHOTOS, ...GALLERY_PHOTOS, ...travelPhotos].map(p => ({
      id: p.id, 
      // 核心：自动根据 mediaType 分类
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

  // 2. 生成年份星座星系
  useEffect(() => {
    const groups: Record<string, ConstellationNode[]> = {};
    allMemories.forEach(node => {
      if (!groups[node.year]) groups[node.year] = [];
      groups[node.year].push(node);
    });

    const sortedYears = Object.keys(groups).sort();
    const finalGroups: ConstellationGroup[] = sortedYears.map((year, yearIdx) => {
      const centerX = yearIdx * 1500 + 750;
      const centerY = 500;
      
      const bgStars = Array.from({length: 35}).map(() => ({
        x: centerX + (Math.random() - 0.5) * 1300,
        y: centerY + (Math.random() - 0.5) * 850,
        size: Math.random() * 1.5,
        opacity: 0.05 + Math.random() * 0.15
      }));

      const nodes = groups[year].map((node, nodeIdx) => {
        const angle = (nodeIdx / groups[year].length) * Math.PI * 2 + (yearIdx * 0.4);
        const radius = 220 + Math.random() * 280;
        
        let glow = '#60a5fa'; // 默认影像蓝
        if (node.type === 'essay') glow = '#fbbf24'; // 念想金
        if (node.type === 'letter') glow = '#f472b6'; // 家书粉
        if (node.type === 'video') glow = '#a855f7'; // 视频紫 (新增)

        return {
          ...node,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          size: node.type === 'letter' ? 12 : (node.type === 'video' ? 10 : 7),
          glowColor: glow
        };
      });
      return { year, nodes, centerX, centerY, bgStars };
    });

    setConstellations(finalGroups);
  }, [allMemories]);

  // 3. 漫游逻辑：鼠标悬浮时静止，移开后恢复
  useEffect(() => {
    let frame: number;
    const move = () => {
      if (isRoaming && !hoveredNodeId && !selectedNode && scrollRef.current) {
        scrollRef.current.scrollLeft += 1.3;
        // 到达终点自动停止
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - window.innerWidth) {
          setIsRoaming(false);
        }
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [isRoaming, hoveredNodeId, selectedNode]);

  return (
    <div className="min-h-screen bg-[#010206] overflow-hidden relative select-none">
      
      {/* 宇宙背景视差层 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
         <div className="absolute inset-[-5%] bg-gradient-to-tr from-blue-950/20 via-transparent to-purple-950/20 animate-pulse" style={{ animationDuration: '12s' }} />
         {[...Array(5)].map((_, i) => (
           <div key={i} className="shooting-star" style={{ top: `${Math.random() * 60}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 25}s` }} />
         ))}
      </div>

      {/* 左上角标题与分类图例 */}
      <div className="fixed top-28 left-10 z-20 pointer-events-none">
         <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Globe size={16} className="animate-spin-slow" />
            <span className="font-serif text-[10px] tracking-[0.6em] uppercase text-white/30 font-bold italic">Memory Universe 5.0</span>
         </div>
         <h1 className="font-hand text-6xl text-white/90 drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]">时光星图</h1>
         
         {/* 自动生成的图例 */}
         <div className="mt-5 flex flex-col gap-3 text-[9px] font-sans tracking-[0.3em] text-white/30 uppercase font-bold">
            <span className="flex items-center gap-3 group/leg"><div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa]" /> 影像 Photo</span>
            <span className="flex items-center gap-3 group/leg"><div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_12px_#a855f7] animate-pulse" /> 视频 Video</span>
            <span className="flex items-center gap-3 group/leg"><div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24]" /> 念想 Essay</span>
            <span className="flex items-center gap-3 group/leg"><div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_12px_#f472b6]" /> 家书 Letter</span>
         </div>
      </div>

      {/* 滚动画布容器 */}
      <div ref={scrollRef} className="relative w-full h-screen overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing z-10">
        <div className="relative h-full" style={{ width: `${constellations.length * 1500 + 800}px` }}>
          
          {constellations.map((group) => (
            <div key={group.year} className="absolute inset-y-0 h-full w-full">
              
              {/* 背景装饰层 (Deep Background) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]">
                 {group.bgStars.map((s, i) => (
                   <circle key={i} cx={s.x} cy={s.y} r={s.size} fill="white" opacity={s.opacity} />
                 ))}
                 {/* 淡淡的背景连线 */}
                 {group.bgStars.slice(0, 12).map((s, i) => {
                   const next = group.bgStars[i+1] || group.bgStars[0];
                   return <line key={i} x1={s.x} y1={s.y} x2={next.x} y2={next.y} stroke="white" strokeWidth="0.15" strokeDasharray="10 20" />
                 })}
              </svg>

              {/* 年份母星 (Galaxy Core) */}
              <div className="absolute flex flex-col items-center justify-center group"
                   style={{ left: group.centerX, top: group.centerY, transform: 'translate(-50%, -50%)' }}>
                 <div className="w-40 h-40 rounded-full bg-white/[0.01] border border-white/5 flex items-center justify-center backdrop-blur-2xl transition-all duration-1000 group-hover:border-blue-500/20 relative">
                    <div className="absolute inset-0 rounded-full bg-blue-600/5 scale-100 group-hover:scale-125 transition-transform duration-1000 blur-2xl" />
                    <span className="font-serif text-4xl text-white/40 group-hover:text-blue-400/80 transition-colors font-bold tracking-tighter relative z-10">{group.year}</span>
                 </div>
                 <div className="mt-6 text-white/10 font-serif italic text-[11px] tracking-[0.5em] group-hover:text-blue-500/30 transition-colors uppercase">Chronicle Core</div>
              </div>

              {/* 前景星座主骨架 (Subtle Constellation) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {group.nodes.length > 1 && group.nodes.map((node, i) => {
                  const nextNode = group.nodes[i + 1] || group.nodes[0];
                  return (
                    <line key={i} x1={node.x} y1={node.y} x2={nextNode.x} y2={nextNode.y} 
                          stroke="url(#constellationGrad)" strokeWidth="0.3" strokeDasharray="8 16" className="opacity-[0.15] animate-pulse" />
                  );
                })}
                <defs>
                  <linearGradient id="constellationGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 记忆星点 (带磁吸区域) */}
              {group.nodes.map((node) => (
                <div key={node.id} className="absolute flex items-center justify-center"
                     style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)', zIndex: hoveredNodeId === node.id ? 100 : 10 }}>
                  
                  {/* 超大透明感应区 - 解决“点不着” */}
                  <div className="w-24 h-24 bg-transparent flex items-center justify-center cursor-pointer group/star"
                       onMouseEnter={() => setHoveredNodeId(node.id)}
                       onMouseLeave={() => setHoveredNodeId(null)}
                       onClick={() => { setSelectedNode(node); setIsRoaming(false); }}>
                    
                    {/* 星点本体 */}
                    <div className={`rounded-full transition-all duration-700 shadow-2xl group-hover/star:scale-[2.8] relative
                        ${node.type === 'video' ? 'animate-star-glow' : ''}`}
                         style={{ 
                           width: `${node.size}px`, 
                           height: `${node.size}px`, 
                           backgroundColor: node.glowColor, 
                           boxShadow: `0 0 30px ${node.glowColor}`
                         }}>
                       {/* 呼吸光环 */}
                       <div className="absolute inset-[-6px] border border-white/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                    </div>

                    {/* 悬浮即时预览气泡 */}
                    <div className={`absolute bottom-full mb-8 left-1/2 -translate-x-1/2 transition-all duration-700 pointer-events-none
                      ${hoveredNodeId === node.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-50'}`}>
                      <div className="bg-[#0f172a]/80 backdrop-blur-3xl px-5 py-3 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center gap-2 min-w-[140px]">
                         {node.url && (
                           <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 mb-1 relative">
                              <img src={node.url} className="w-full h-full object-cover" />
                              {node.type === 'video' && <PlayCircle className="absolute inset-0 m-auto text-white" size={24} />}
                           </div>
                         )}
                         <span className="text-[11px] text-white/90 font-serif tracking-widest whitespace-nowrap">{node.title}</span>
                         <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full`} style={{backgroundColor: node.glowColor}} />
                            <span className="text-[8px] text-white/30 font-mono uppercase tracking-tighter">{node.date}</span>
                         </div>
                      </div>
                      <div className="w-3 h-3 bg-[#0f172a]/80 rotate-45 mx-auto -mt-1.5 border-r border-b border-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 控制台面板 */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 bg-white/[0.03] backdrop-blur-3xl px-12 py-5 rounded-full border border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.8)]">
         <button onClick={() => setIsRoaming(!isRoaming)}
                 className={`group flex items-center gap-4 px-10 py-3 rounded-full text-[11px] font-bold tracking-[0.4em] uppercase transition-all duration-700
                 ${isRoaming ? 'bg-purple-600 text-white shadow-[0_0_40px_rgba(168,85,247,0.5)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
           {isRoaming ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
           <span>{isRoaming ? (hoveredNodeId ? '捕捉锁定...' : '漫游巡航中') : '开启漫游回忆'}</span>
         </button>
         
         <div className="w-px h-8 bg-white/10" />
         
         <div className="flex flex-col items-start">
            <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold mb-1">Navigation System</span>
            <span className="text-xs text-white/60 font-serif italic">Deep Space Chronicle</span>
         </div>
      </div>

      {/* 沉浸式星际面板 (预览) */}
      {selectedNode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-fade-in">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setSelectedNode(null)} />
           
           <div className="relative w-full max-w-6xl max-h-[85vh] bg-gradient-to-b from-[#111827]/80 to-[#030712]/95 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row animate-scale-in">
              <button onClick={() => setSelectedNode(null)} className="absolute top-10 right-10 p-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-20 border border-white/5 shadow-xl">
                <X size={32} strokeWidth={1} />
              </button>

              {/* 左侧：宇宙媒体区 */}
              <div className="flex-[1.3] bg-black/40 flex items-center justify-center p-12 md:p-20 border-r border-white/5 relative">
                 <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                    <Globe size={400} strokeWidth={0.5} className="text-blue-400 animate-spin-slow" />
                 </div>
                 
                 {selectedNode.type === 'photo' || selectedNode.type === 'video' ? (
                    <div className="relative w-full h-full flex items-center justify-center group/media">
                       {selectedNode.type === 'video' ? (
                          <video src={selectedNode.url} controls autoPlay className="max-h-full max-w-full rounded-3xl shadow-2xl border border-white/10" />
                       ) : (
                          <img src={selectedNode.url} className="max-h-full max-w-full object-contain rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/10" alt="" />
                       )}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center text-center relative z-10">
                       <div className={`w-36 h-36 rounded-full mb-10 flex items-center justify-center border border-white/10 bg-white/5 shadow-2xl
                         ${selectedNode.type === 'essay' ? 'text-amber-400 shadow-amber-500/10' : 'text-pink-400 shadow-pink-500/10'}`}>
                          {selectedNode.type === 'essay' ? <FileText size={64} strokeWidth={1} /> : <Mail size={64} strokeWidth={1} />}
                       </div>
                       <h3 className="text-white/90 font-hand text-3xl mb-3 tracking-widest">{selectedNode.type === 'essay' ? '一瞬之念' : '见字如面'}</h3>
                       <div className="flex items-center gap-3 text-white/20 text-[10px] font-mono tracking-[0.4em] uppercase">
                          <span className="w-10 h-px bg-white/10" /> Records <span className="w-10 h-px bg-white/10" />
                       </div>
                    </div>
                 )}
              </div>

              {/* 右侧：叙事内容区 */}
              <div className="flex-1 p-12 md:p-20 overflow-y-auto custom-scrollbar bg-white/[0.01]">
                 <div className="mb-14">
                    <div className="flex items-center gap-4 text-blue-400 font-mono text-[10px] tracking-[0.5em] uppercase mb-8 opacity-70">
                       <Clock size={16} /> {selectedNode.date}
                    </div>
                    <h2 className="text-5xl md:text-6xl font-serif text-white/90 mb-10 leading-tight tracking-tight drop-shadow-2xl">{selectedNode.title}</h2>
                    <div className="h-[2px] w-24 bg-gradient-to-r from-blue-500/60 to-purple-500/60 rounded-full" />
                 </div>

                 <div className="prose prose-invert prose-stone max-w-none 
                   prose-p:font-serif prose-p:leading-[2.4] prose-p:text-white/60 prose-p:text-xl prose-p:mb-8
                   prose-headings:text-white/90 prose-strong:text-blue-400 prose-blockquote:border-blue-500/30 prose-blockquote:bg-blue-500/5 prose-blockquote:rounded-r-xl">
                    <ReactMarkdown>{selectedNode.description}</ReactMarkdown>
                 </div>

                 {(selectedNode.originalData as any).link && (
                    <a href={(selectedNode.originalData as any).link} target="_blank" rel="noreferrer" 
                       className="mt-20 inline-flex items-center gap-4 text-blue-400 hover:text-white transition-all text-sm font-bold tracking-[0.3em] uppercase border border-blue-400/30 px-10 py-4 rounded-full hover:bg-blue-400/10 hover:border-blue-400 shadow-xl">
                       <ExternalLink size={20} /> Launch Link
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
          animation: anim-shoot 7s linear infinite; opacity: 0;
        }
        .shooting-star::before {
          content: ''; position: absolute; top: 50%; transform: translateY(-50%);
          width: 500px; height: 1px; background: linear-gradient(90deg, #fff, transparent);
        }
        @keyframes anim-shoot {
          0% { transform: rotate(315deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(315deg) translateX(-1800px); opacity: 0; }
        }
        @keyframes star-pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.6); opacity: 1; filter: brightness(1.5); } }
        .animate-star-glow { animation: star-pulse 2s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 20px; }
        .animate-spin-slow { animation: spin 80s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
