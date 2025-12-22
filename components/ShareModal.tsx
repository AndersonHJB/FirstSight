
import React, { useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Photo } from '../types';
import { X, Download, Share2, MapPin, Calendar, Heart, Loader2, Globe } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ShareModalProps {
  photo: Photo;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ photo, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
      });
      setGeneratedImg(dataUrl);
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImg) return;
    const link = document.createElement('a');
    link.download = `时光家书_${photo.title}_${photo.date}.png`;
    link.href = generatedImg;
    link.click();
  };

  const shareQuotes = [
    "有些瞬间，注定要被反复咀嚼。",
    "我们捡起时光的碎片，拼凑出爱的模样。",
    "把时间写成诗，藏进这一纸家书。",
    "慢慢长大，也是一种浪漫。",
    "愿此生如诗，岁月静好。",
    "每一个像素，都是爱的证据。"
  ];
  
  const randomQuote = useMemo(() => {
    const index = photo.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % shareQuotes.length;
    return shareQuotes[index];
  }, [photo.id]);

  const modalContent = (
    <div className="fixed inset-0 z-[100005] bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-in backdrop-blur-md">
      
      {/* Top Bar Actions - Using Fixed and generous top margin */}
      <div 
        className="fixed inset-x-0 top-0 flex justify-between items-center px-6 py-4 text-white z-[100010]"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2rem)' }}
      >
         <button onClick={onClose} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md border border-white/10 shadow-lg">
           <X size={24} />
         </button>
         
         <div className="flex gap-4">
            {!generatedImg ? (
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-accent-brown px-6 py-2.5 rounded-full text-sm font-medium hover:bg-accent-brown/80 transition-all shadow-lg active:scale-95"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
                {isGenerating ? '正在绘制...' : '生成明信片'}
              </button>
            ) : (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-blue-600 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-blue-500 transition-all shadow-lg active:scale-95"
              >
                <Download size={18} /> 下载保存
              </button>
            )}
         </div>
      </div>

      {/* Card Preview - Moved down to avoid top bar overlap */}
      <div className="relative mt-24 md:mt-0 w-full max-w-[340px] md:max-w-[360px] aspect-[9/16] shadow-2xl rounded-sm overflow-hidden flex flex-col scale-[0.9] md:scale-100">
        {generatedImg && (
          <img src={generatedImg} className="absolute inset-0 z-50 w-full h-full object-contain bg-white" alt="Share Card" />
        )}

        <div 
          ref={cardRef}
          className="absolute inset-0 w-full h-full bg-paper flex flex-col z-0"
          style={{ width: '360px', height: '640px' }} 
        >
          {/* Card Content ... (Same as before) */}
          <div className="pt-8 px-6 flex justify-between items-start shrink-0">
             <div className="flex flex-col">
               <span className="font-serif text-xl tracking-widest text-ink/80">时光 · 家书</span>
               <span className="text-[7px] font-sans tracking-[0.3em] uppercase text-stone-400">Timeless Family Album</span>
             </div>
             <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-[10px] text-stone-400 font-serif rotate-12">珍</div>
          </div>

          <div className="flex-1 px-6 pt-6 pb-4 overflow-hidden">
             <div className="w-full h-full relative overflow-hidden bg-stone-100 shadow-sm border-[4px] border-white">
                <img src={photo.url[0]} className="w-full h-full object-cover" alt="" />
             </div>
          </div>

          <div className="h-[220px] px-8 pt-2 pb-8 flex flex-col justify-between bg-white/40">
             <div className="space-y-2.5">
                <h3 className="font-hand text-4xl text-ink leading-tight">{photo.title}</h3>
                <div className="flex items-center gap-3 text-[10px] text-stone-400 font-serif tracking-widest">
                   <span className="flex items-center gap-1"><Calendar size={10} /> {photo.date}</span>
                   {photo.location && <span className="flex items-center gap-1"><MapPin size={10} /> {photo.location}</span>}
                </div>
                <div className="h-px w-8 bg-stone-200 mt-3" />
                <p className="font-serif text-xs text-stone-500 italic leading-relaxed pt-1 max-w-[200px]">
                  {randomQuote}
                </p>
             </div>
             <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col gap-1.5">
                   <div className="flex items-center gap-2 opacity-40">
                      <Heart size={12} fill="currentColor" className="text-accent-brown" />
                      <span className="text-[8px] font-serif text-stone-500 tracking-[0.2em] uppercase">Memories Preserved</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-accent-brown/60">
                      <Globe size={10} />
                      <span className="text-[9px] font-sans font-medium tracking-wider">https://bornforthis.cn/</span>
                   </div>
                </div>
                <div className="w-16 h-16 p-1 bg-white border border-stone-100 shadow-sm rounded-sm">
                   <img src="https://ai.bornforthis.cn/images/P03-2.svg" alt="QR" className="w-full h-full object-contain" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Hint */}
      {generatedImg && (
        <div className="mt-6 text-center space-y-2" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)' }}>
           <p className="text-white/80 text-sm font-serif tracking-widest animate-pulse">已生成明信片</p>
           <p className="text-white/40 text-[10px]">手机端请长按图片保存，或点击右上角下载</p>
        </div>
      )}
    </div>
  );

  const root = document.getElementById('root') || document.body;
  return createPortal(modalContent, root);
};
