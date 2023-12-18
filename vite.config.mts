import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconifgPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconifgPaths(),
    viteStaticCopy({
      targets: [
        {
          src: 'package.json',
          dest: ''
        },
        {
          src: 'icon.png',
          dest: ''
        }
      ]
    })
  ],
  base: '',
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
});