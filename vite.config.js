import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  base: '/ecommer/',
  plugins: [
    react(), // ✅ just the basic React plugin
    {
      name: 'copy-404',
      writeBundle() {
        const source = path.resolve(__dirname, 'public/404.html');
        const dest = path.resolve(__dirname, 'dist/404.html');
        if (fs.existsSync(source)) {
          fs.copyFileSync(source, dest);
        }
      }
    }
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
