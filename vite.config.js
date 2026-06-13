import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    strictPort: true,
    open: false,
    hmr: {
      overlay: true,
    },
    watch: {
      // debounce FS events to avoid excessive reloads during batch edits
      usePolling: false,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
