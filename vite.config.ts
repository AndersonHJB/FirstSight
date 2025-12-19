
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      logStats: true,
      ansiColors: true,
    }),
    {
      name: 'remove-tailwind-cdn',
      transformIndexHtml(html) {
        // 1. 移除引入 Tailwind CDN 的 script 标签 (支持带 plugins 参数的情况)
        let newHtml = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com\??.*?"><\/script>/, '');
        
        // 2. 移除配套的 Tailwind 配置 script 块
        newHtml = newHtml.replace(/<script>[\s\S]*?tailwind\.config\s*=[\s\S]*?<\/script>/, '');
        
        return newHtml;
      }
    }
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'lucide';
            }
            if (id.includes('react-markdown')) {
              return 'markdown';
            }
            if (id.includes('@waline')) {
              return 'waline';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
