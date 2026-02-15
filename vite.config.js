import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Stillness/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
