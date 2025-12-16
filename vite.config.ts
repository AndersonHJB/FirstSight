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
      // 添加 WebP 配置
      webp: {
        quality: 80,
      },
      // 确保在控制台打印压缩统计信息
      logStats: true,
      ansiColors: true,
    }),
  ],
})