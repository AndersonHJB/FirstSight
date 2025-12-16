import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  base: './', // 关键修改：设置基础路径为相对路径
  plugins: [
    react(),
    viteImagemin({
      // GIF 优化配置
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      // PNG 无损压缩配置
      optipng: {
        optimizationLevel: 7,
      },
      // JPEG 有损压缩配置 (保证高画质)
      mozjpeg: {
        quality: 90, // 设置为 90 以保证极佳的清晰度 (默认通常为 75)
      },
      // PNG 有损量化配置 (高画质区间)
      pngquant: {
        quality: [0.8, 0.9], // 质量区间保持在 0.8-0.9 之间，平衡体积与画质
        speed: 4,
      },
      // SVG 优化配置
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
      webp: {
        quality: 75,
      }
    }),
  ],
})