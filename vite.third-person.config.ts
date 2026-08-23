import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'third-person',
  base: '/Tales-of-the-blaue-Adria-/third-person/',
  publicDir: false,
  server: {
    fs: { allow: [resolve(process.cwd())] },
  },
  build: {
    outDir: '../docs/third-person',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    assetsDir: 'assets',
  },
});
