import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'redesign',
  base: '/Tales-of-the-blaue-Adria-/redesign/',
  publicDir: false,
  server: {
    fs: { allow: [resolve(process.cwd())] },
  },
  build: {
    outDir: '../docs/redesign',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    assetsDir: 'assets',
  },
});
