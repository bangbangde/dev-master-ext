// @ts-nocheck
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { glob } from 'glob'
import path from 'node:path'

const entries = {}
glob.sync(['src/main/**/*.js', 'pages/*.html']).forEach((filePath) => {
  const inputFileName = path.basename(filePath, path.extname(filePath))
  const inputFilePath = fileURLToPath(new URL(filePath, import.meta.url))
  entries[inputFileName] = inputFilePath
})

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: entries,
      output: {
        entryFileNames: 'assets/[name].js'
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
