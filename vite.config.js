import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    
    // Use esbuild for minification (default and faster)
    minify: 'esbuild',
    
    // CSS code splitting
    cssCodeSplit: false,
    
    // Rollup options for advanced configuration
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Asset file naming
        assetFileNames: (assetInfo) => {
          // Keep fonts in fonts directory
          if (assetInfo.name.endsWith('.ttf') || assetInfo.name.endsWith('.woff') || assetInfo.name.endsWith('.woff2')) {
            return 'fonts/[name][extname]';
          }
          // Keep images in assets/img directory
          if (/\.(png|jpe?g|svg|gif|webp|ico)$/.test(assetInfo.name)) {
            return 'assets/img/[name][extname]';
          }
          // Keep videos in assets/video directory
          if (/\.(mp4|webm|ogg)$/.test(assetInfo.name)) {
            return 'assets/video/[name][extname]';
          }
          // CSS files
          if (assetInfo.name.endsWith('.css')) {
            return 'style.min.css';
          }
          return 'assets/[name][extname]';
        },
        // JS file naming
        entryFileNames: 'script.min.js',
        chunkFileNames: 'chunks/[name]-[hash].js'
      }
    },
    
    // Source maps for debugging (optional)
    sourcemap: false
  },
  
  // Dev server configuration
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    open: true
  },
  
  // Public directory
  publicDir: 'public',
  
  // Optimize dependencies
  optimizeDeps: {
    include: []
  }
});

// Made with Bob
