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
    port: 8134,
    host: '127.0.0.1', // Apenas localhost (mais seguro para proxy interno)
    strictPort: true, // Força usar exatamente a porta 8134
    proxy: {}, // Habilita detecção de proxy
    hmr: {
      protocol: 'ws', // WebSocket normal para desenvolvimento local
      host: 'localhost',
      port: 8134 // Porta do HMR (mesma do servidor)
    },
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
