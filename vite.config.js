import { defineConfig } from 'vite'
import { resolve } from 'path'

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
    rollupOptions: {
      // Multiple HTML entry points so Vite emits each page (not just index.html)
      input: {
        main: resolve(__dirname, 'index.html'),
        apps: resolve(__dirname, 'apps.html'),
        agentCoding: resolve(__dirname, 'agent-coding.html'),
        impressum: resolve(__dirname, 'impressum.html'),
        datenschutz: resolve(__dirname, 'datenschutz.html'),
        tos: resolve(__dirname, 'tos.html'),
      },
    },
  },
})
