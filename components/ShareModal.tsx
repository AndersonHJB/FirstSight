
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Photo } from '../types';
import { X, Download, Share2, MapPin, Calendar, Heart, Loader2 } from 'lucide-react';
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
      // Small delay to ensure images are loaded
      await new Promise(r => setTimeout(r, 500));
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
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
    link.download = `Timeless_Memory_${photo.id}.png`;
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
  const randomQuote = shareQuotes[Math.floor(Math.random() * shareQuotes.length)];

  const modalContent = (
    <div className="fixed inset-0 z-[100000] bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      
      {/* Top Bar Actions */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6 text-white px-2">
         <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
         <div className="flex gap-4">
            {!generatedImg ? (
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-accent-brown px-4 py-2 rounded-full text-sm font-medium hover:bg-accent-brown/80 transition-all disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
                {isGenerating ? '生成中...' : '生成明信片'}
              </button>
            ) : (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500 transition-all"
              >
                <Download size={18} /> 保存图片
              </button>
            )}
         </div>
      </div>

      {/* Viewport for PC / Preview */}
      <div className="relative w-full max-w-[360px] aspect-[9/16] shadow-2xl rounded-sm overflow-hidden flex flex-col">
        
        {/* Render Result (High Res Display) */}
        {generatedImg && (
          <img src={generatedImg} className="absolute inset-0 z-50 w-full h-full object-contain bg-white" alt="Share Card" />
        )}

        {/* The Card to be Captured */}
        <div 
          ref={cardRef}
          className="absolute inset-0 w-full h-full bg-paper flex flex-col z-0"
          style={{ width: '360px', height: '640px' }} // Fixed size for consistent capture
        >
          {/* Header Branding */}
          <div className="pt-8 px-6 flex justify-between items-start">
             <div className="flex flex-col">
               <span className="font-serif text-xl tracking-widest text-ink/80">时光 · 家书</span>
               <span className="text-[7px] font-sans tracking-[0.3em] uppercase text-stone-400">Timeless Family Album</span>
             </div>
             <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-[10px] text-stone-400 font-serif rotate-12">
               黄
             </div>
          </div>

          {/* Main Photo Section */}
          <div className="flex-1 px-6 pt-6 pb-4">
             <div className="w-full h-full relative overflow-hidden bg-stone-100 shadow-lg">
                <img 
                  src={photo.url[0]} 
                  className="w-full h-full object-cover cross-origin-anonymous" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
             </div>
          </div>

          {/* Text Content Section */}
          <div className="h-[200px] px-8 pt-2 pb-10 flex flex-col justify-between bg-white/40">
             <div className="space-y-3">
                <h3 className="font-hand text-4xl text-ink leading-tight">{photo.title}</h3>
                <div className="flex items-center gap-3 text-[10px] text-stone-400 font-serif tracking-widest">
                   <span className="flex items-center gap-1"><Calendar size={10} /> {photo.date}</span>
                   {photo.location && <span className="flex items-center gap-1"><MapPin size={10} /> {photo.location}</span>}
                </div>
                <div className="h-px w-8 bg-stone-200 mt-4" />
                <p className="font-serif text-sm text-stone-500 italic leading-relaxed pt-2">
                  {randomQuote}
                </p>
             </div>

             {/* Footer QR/Link Placeholder */}
             <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 opacity-30">
                   <Heart size={14} fill="currentColor" className="text-accent-brown" />
                   <span className="text-[9px] font-serif text-stone-400 tracking-[0.2em] uppercase">Memories Preserved</span>
                </div>
                <div className="w-12 h-12 border border-stone-100 p-1 opacity-60">
                   <div className="w-full h-full bg-stone-50 flex items-center justify-center text-[6px] text-stone-300 text-center font-sans">
                      SCAN<br/>MEMORY
                   </div>
                </div>
             </div>
          </div>

          {/* Side Stamp Effect */}
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 rotate-90 origin-center text-[8px] font-sans tracking-[0.8em] text-stone-300 uppercase pointer-events-none">
             Authentic Records
          </div>
        </div>

      </div>

      {/* Hint for mobile */}
      {generatedImg && (
        <p className="mt-6 text-white/50 text-xs font-serif tracking-widest animate-pulse">
          手机端请长按图片保存分享
        </p>
      )}

    </div>
  );

  const root = document.getElementById('root') || document.body;
  return createPortal(modalContent, root);
};
