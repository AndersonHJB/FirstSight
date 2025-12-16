import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // 保持相对路径设置，这对静态部署很重要
  plugins: [
    react()
  ],
})