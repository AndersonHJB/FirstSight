
import React, { useEffect, useRef } from 'react';
import { init } from '@waline/client';
import { MessageSquare, Quote, Sparkles, PenTool } from 'lucide-react';

export const MessageBoard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const walineInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      walineInstanceRef.current = init({
        el: containerRef.current,
        serverURL: 'https://comment.bornforthis.cn/',
        path: '/message-board',
        reaction: [
          'https://bornforthis.cn/Waline/tieba/tieba_agree.png',
          'https://bornforthis.cn/Waline/tieba/tieba_sunglasses.png',
          'https://bornforthis.cn/Waline/tieba/tieba_pick_nose.png',
          'https://bornforthis.cn/Waline/tieba/tieba_awkward.png',
          'https://bornforthis.cn/Waline/tieba/1f613.png',
          'https://bornforthis.cn/Waline/tieba/1f60f.png',
        ],
        comment: true,
        pageview: true,
        noCopyright: true,
        dark: 'false',
        lang: 'zh-CN',
        // Use 'locale' object to specify the placeholder as per WalineInitOptions specification
        locale: {
          placeholder: '在此提笔，书写那些关于爱与时光的碎碎念...',
        },
        emoji: [
          '//unpkg.com/@waline/emojis@1.2.0/weibo',
          '//unpkg.com/@waline/emojis@1.2.0/alus',
        ],
      });
    }

    return () => {
      if (walineInstanceRef.current) {
        walineInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 px-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-10 text-accent-brown">
             <Quote size={120} fill="currentColor" />
          </div>
          
          <div className="inline-flex items-center justify-center p-4 bg-white shadow-sm rounded-full text-accent-brown mb-6 relative z-10">
            <MessageSquare size={24} strokeWidth={1.5} />
          </div>
          
          <h1 className="font-hand text-5xl md:text-6xl text-ink mb-4 relative z-10">时光留言簿</h1>
          <p className="font-serif text-stone-500 italic mb-8">留下一句话，寄给未来的我们。</p>
          
          <div className="flex justify-center gap-2">
            <div className="h-px w-12 bg-stone-200 self-center" />
            <Sparkles size={16} className="text-accent-gold/40" />
            <div className="h-px w-12 bg-stone-200 self-center" />
          </div>
        </div>

        {/* Guestbook Container */}
        <div className="bg-white p-6 md:p-12 shadow-polaroid border border-stone-100 rounded-sm relative overflow-hidden">
          {/* Decorative Tape */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/60 backdrop-blur-sm shadow-sm border-x border-stone-100 rotate-1 z-20" />
          
          <div className="mb-10 flex items-center gap-3 text-stone-400 font-serif text-sm border-b border-stone-50 pb-6">
             <PenTool size={16} />
             <span>这里记录着每一份被温柔以待的回忆...</span>
          </div>

          {/* Waline Entry Point */}
          <div ref={containerRef} className="font-sans waline-custom-container" />
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 text-center">
           <p className="font-hand text-2xl text-stone-300">每一个字，都是时光的呼吸。</p>
        </div>
      </div>
    </div>
  );
};
