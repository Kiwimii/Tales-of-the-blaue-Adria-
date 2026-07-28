import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'lpc-test',
  base: '/Tales-of-the-blaue-Adria-/lpc-test/',
  publicDir: false,
  server: {
    fs: { allow: [resolve(process.cwd())] },
  },
  build: {
    outDir: '../docs/lpc-test',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    assetsDir: 'assets',
  },
});
