import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // 遇到 /api 路径时，将其替换为 target 的值
        target: 'http://api.chennick.wang/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 将/api开头的路径替换为空
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      utils: path.resolve(__dirname, 'src/utils'),
    },
  },
});
