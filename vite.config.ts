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
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Framework principal
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          
          // Bibliotecas UI (Radix)
          if (id.includes('@radix-ui') || id.includes('ui/')) {
            return 'ui-components';
          }
          
          // Gráficos e visualização
          if (id.includes('recharts') || id.includes('d3')) {
            return 'charts';
          }
          
          // Utilitários
          if (id.includes('clsx') || id.includes('class-variance') || id.includes('tailwind-merge')) {
            return 'utils';
          }
          
          // Ícones
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          
          // Markdown
          if (id.includes('react-markdown') || id.includes('remark')) {
            return 'markdown';
          }
          
          // Módulos de exame - cada um em seu chunk
          if (id.includes('pages/exams/modules/')) {
            const examName = id.split('modules/')[1]?.split('.')[0];
            if (examName) {
              return `exam-${examName.toLowerCase()}`;
            }
          }
          
          // Catálogos de dados médicos
          if (id.includes('/data/') && id.includes('Organs.ts')) {
            return 'medical-data';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : '';
          if (chunkInfo.name.startsWith('exam-')) {
            return 'assets/exams/[name]-[hash].js';
          }
          if (['react-vendor', 'ui-components', 'charts', 'utils', 'icons'].includes(chunkInfo.name)) {
            return 'assets/vendor/[name]-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        }
      }
    },
    chunkSizeWarningLimit: 200, // Reduzir limite de warning para 200KB
    reportCompressedSize: true
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
