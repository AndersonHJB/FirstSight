import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  base: './', // 保持相对路径设置，这对静态部署很重要
  plugins: [
    react(),
    ViteImageOptimizer({
      // 默认配置通常已经足够好，以下是一些自定义微调
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      tiff: {
        quality: 80,
      },
      // 这里的 includePublic 选项对于压缩 public 目录下的静态资源非常重要
      // 注意：某些版本的插件可能默认不处理 public，或者需要特定配置，
      // 但对于构建产物中引用的资源，它会自动处理。
    }),
  ],
})