import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'lpc-main',
  base: '/Tales-of-the-blaue-Adria-/lpc-main/',
  publicDir: false,
  plugins: [
    {
      name: 'lpc-main-bootstrap-entry',
      transformIndexHtml(html) {
        return html.replace('../src/lpc-main/main.ts', '../src/lpc-main/bootstrap.ts');
      },
    },
  ],
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
