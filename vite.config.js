import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  base: '/journal/',
  // Explicitly set the project root to the directory containing index.html
  root: process.cwd(), 
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});