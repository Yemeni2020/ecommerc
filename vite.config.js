import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/ecommerc/',
  plugins: [
    react(), // ✅ just the basic React plugin
  ],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ use @ for src/
    },
  },
});
