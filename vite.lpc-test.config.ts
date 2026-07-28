import { defineConfig } from 'vite';

export default defineConfig({
  root: 'lpc-test',
  base: '/Tales-of-the-blaue-Adria-/lpc-test/',
  publicDir: false,
  build: {
    outDir: '../docs/lpc-test',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      input: 'lpc-test/index.html',
    },
  },
});
