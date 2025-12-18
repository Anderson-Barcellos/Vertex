import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  server: {
    port: 8201, // Porta alternativa (8199 estava em uso)
    host: '0.0.0.0',
    strictPort: true,
    proxy: {
      '/api/gemini': {
        target: 'https://ultrassom.ai:8177',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/gemini/, '/geminiCall')
      },
      '/api/openai': {
        target: 'https://ultrassom.ai:8177',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/openai/, '/openaiCall')
      },
      '/api/claude': {
        target: 'https://ultrassom.ai:8177',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/claude/, '/claudeCall')
      }
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ultrassom.ai',
      'www.ultrassom.ai',
      '.ultrassom.ai'
    ],
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});
