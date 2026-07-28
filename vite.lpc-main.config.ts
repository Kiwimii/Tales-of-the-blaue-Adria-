import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'lpc-main',
  base: '/Tales-of-the-blaue-Adria-/lpc-main/',
  publicDir: false,
  server: {
    fs: { allow: [resolve(process.cwd())] },
  },
  build: {
    outDir: '../docs/lpc-main',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    assetsDir: 'assets',
  },
});
