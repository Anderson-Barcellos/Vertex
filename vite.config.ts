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
    port: 8198,
    // Escutar em todas as interfaces para permitir acesso externo quando necessário
    host: '0.0.0.0',
    strictPort: true,
    // Proxy para evitar CORS com os endpoints de IA
    proxy: {
      '/api/gemini': {
        target: 'https://ultrassom.ai:8177',
        changeOrigin: true,
        secure: false, // Aceita certificados auto-assinados
        rewrite: (path) => path.replace(/^\/api\/gemini/, '/geminiCall'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[Proxy] Request:', req.method, req.url, '→', proxyReq.path);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[Proxy] Error:', err);
          });
        }
      },
      '/api/openai': {
        target: 'https://ultrassom.ai:8177',
        changeOrigin: true,
        secure: false, // Aceita certificados auto-assinados
        rewrite: (path) => path.replace(/^\/api\/openai/, '/openaiCall')
      }
    },
    // HMR: usar origem do navegador (auto)
    // Permitir requisições dos domínios configurados
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ultrassom.ai',
      'www.ultrassom.ai',
      '.ultrassom.ai' // Permite subdomínios
    ],
    // Configuração para confiar nos headers do proxy
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});
