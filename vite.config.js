import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Native Tailwind v4 compiler for Vite
  ],
  base: '/journal/',
  root: process.cwd(),
});