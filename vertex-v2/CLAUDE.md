# 📋 Documentação do Projeto - Vertex US V2
**Data de Criação:** 11 de Novembro de 2025
**Última Atualização:** 11 de Novembro de 2025
**Configurado por:** Claude + Vertex Team
**Projeto:** Sistema de Geração de Laudos Ultrassonográficos com IA
**Repositório GitHub:** https://github.com/Anderson-Barcellos/Vertex
**Versão Atual:** 2.0.0
**Status:** ✅ Sistema em Produção com Streaming em Tempo Real

---

## 🧹 Limpeza do Projeto (11/11/2025)

**Projeto otimizado e organizado!** Realizada limpeza completa removendo arquivos não utilizados:

### Arquivos Removidos
- **Documentação obsoleta:** 3 arquivos
  - `/root/PROJECT/SECURITY.md`
  - `/root/PROJECT/vertex-v2/README.md`
  - `/root/PROJECT/vertex-v2/RESUMO.md`

- **Páginas antigas:** 2 arquivos
  - `src/pages/Home.tsx` (rota `/old-home`)
  - `src/pages/modern/ExamTemplateModern.example.tsx`

- **Componentes UI não utilizados:** 39 arquivos
  - Redução de 46 → 7 componentes (84% de redução!)
  - **Mantidos:** badge, button, card, checkbox, input, select, switch
  - **Removidos:** accordion, alert, dialog, form, tooltip, table, etc.

### Benefícios
- ✅ **-44 arquivos** removidos (~35% do projeto)
- ✅ **Bundle menor** - Estimativa de redução de ~200-300KB
- ✅ **Build mais rápido** - Menos arquivos para processar
- ✅ **Código mais limpo** - Navegação e manutenção facilitadas
- ✅ **Menos confusão** - Apenas código em uso permanece

---

## 🎯 Visão Geral

Sistema profissional de geração de laudos ultrassonográficos com **streaming em tempo real** usando IA, interface moderna com glassmorphism, layout responsivo e conformidade total com as diretrizes do Colégio Brasileiro de Radiologia (CBR).

### Stack Tecnológica
- **Frontend:** React 19 + TypeScript 5.9
- **Build Tool:** Vite 7.1.5
- **Estilização:** Tailwind CSS v4 + Radix UI
- **Roteamento:** React Router DOM v7
- **Ícones:** Phosphor Icons + Lucide React + Heroicons
- **IA Integrada:**
  - Google Gemini AI (gemini-2.5-pro) com **streaming progressivo**
  - OpenAI GPT com **streaming progressivo**
  - Endpoint customizado: `https://ultrassom.ai:8177/geminiCall`
- **Markdown:** react-markdown + remark-gfm para renderização progressiva
- **Notificações:** Sonner (toast notifications)
- **Query Management:** TanStack Query v5
- **Domínio:** ultrassom.ai

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────┐
│   Cliente Web       │
│  (React 19 + TS)    │
└────────┬────────────┘
         │ HTTP/WS
         ▼
┌─────────────────────┐
│   Vite Dev Server   │ ← Porta 8200
│  (localhost:8200)   │ ← Hot Module Replacement
└────────┬────────────┘
         │ Proxy
         ▼
┌─────────────────────┐
│   Backend IA        │
│ (ultrassom.ai:8177) │ ← Gemini + OpenAI APIs
└─────────────────────┘
```

### Fluxo de Dados

```
[Usuário] → Seleciona Achados Clínicos
    ↓
[Sistema] → Constrói Prompt Estruturado
    ↓
[API Call] → POST /api/gemini ou /api/openai
    ↓
[Backend] → Processa com IA (Streaming)
    ↓
[Frontend] → Renderiza Markdown Progressivo
    ↓
[Canvas A4] → Exibe Laudo em Tempo Real
```

---

## 🚀 Funcionalidades Implementadas

### 1. Sistema de Streaming Progressivo
- **Endpoint Gemini:** `https://ultrassom.ai:8177/geminiCall`
- **Endpoint OpenAI:** `https://ultrassom.ai:8177/openaiCall`
- **Callbacks progressivos** para atualização em tempo real
- **Suporte a cancelamento** via AbortSignal
- **Renderização incremental** do markdown

### 2. Módulos de Exames
- ✅ **Abdome Total** - Todos os órgãos abdominais com achados CBR
- ✅ **Doppler de Carótidas** - Velocimetria, NASCET, EMI, Gray-Weale
- 🔜 Tireoide (em desenvolvimento)
- 🔜 Mama (planejado)
- 🔜 Pélvico (planejado)

### 3. Sistema de Achados Clínicos
- **Campos dinâmicos** baseados no tipo de achado
- **Múltiplas instâncias** por achado (várias lesões)
- **Localizações anatômicas** específicas por órgão
- **Severidade graduada** (leve/moderado/acentuado)
- **Medições precisas** em cm/mm

### 4. Campos Especializados Doppler Carótidas
```typescript
// Velocimetria
vps: string;              // Velocidade de Pico Sistólico
vdf: string;              // Velocidade Diastólica Final
ratioICA_CCA: string;     // Razão ICA/CCA
nascetGrade: string;      // Graduação NASCET

// Caracterização de Placas
plaqueEchogenicity: string;  // Gray-Weale (Tipos 1-5)
plaqueComposition: string;    // Composição
plaqueSurface: string;        // Superfície
plaqueRisk: string;           // Estratificação de risco

// EMI e Vertebrais
emi: string;                  // Espessamento Médio-Intimal
vertebralFlowPattern: string; // Padrão de fluxo
subclavianSteal: string;      // Roubo da subclávia
```

### 5. Interface Moderna (Glassmorphism)
- **Layout responsivo** com CSS Grid
- **Painéis flutuantes** com backdrop blur
- **Animações suaves** com Tailwind
- **Dark mode** na sidebar
- **Canvas A4** para visualização de laudo

---

## 📁 Estrutura de Diretórios

```
vertex-v2/
├── src/
│   ├── pages/
│   │   ├── v2/
│   │   │   └── LandingPageModern.tsx    # Landing page principal
│   │   └── modern/
│   │       ├── AbdomeTotalExamModern.tsx # Exame abdome total
│   │       └── CarotidExamModern.tsx     # Doppler carótidas
│   │
│   ├── components/
│   │   ├── ui/                          # 7 componentes Radix UI em uso
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── switch.tsx
│   │   │
│   │   ├── original/                    # Componentes do sistema
│   │   │   ├── Sidebar.tsx              # Navegação lateral
│   │   │   ├── OrganSection.tsx         # Seção de achados
│   │   │   ├── FindingDetailsEnhanced.tsx
│   │   │   ├── CarotidFindingDetails.tsx
│   │   │   ├── SelectedFindingsPanel.tsx
│   │   │   ├── ExamStatisticsPanel.tsx
│   │   │   └── ReportCanvas.tsx         # Canvas A4
│   │   │
│   │   └── shared/
│   │       └── FloatingOrganPanelModern.tsx # Painel flutuante
│   │
│   ├── services/
│   │   ├── geminiStreamService.ts       # Streaming Gemini
│   │   ├── openaiStreamService.ts       # Streaming OpenAI
│   │   ├── unifiedAIService.ts          # Serviço unificado
│   │   ├── promptBuilder.ts             # Construtor de prompts
│   │   ├── geminiClient.ts              # Cliente Gemini base
│   │   └── reportGenerator.ts           # Gerador fallback
│   │
│   ├── data/
│   │   ├── organs.ts                    # Órgãos abdominais
│   │   ├── carotidOrgans.ts             # Estruturas carotídeas
│   │   └── reportTemplates.ts           # Templates de laudos
│   │
│   ├── types/
│   │   └── report.ts                    # TypeScript definitions
│   │
│   ├── hooks/
│   │   ├── useDropdownGuard.ts          # Guarda para dropdowns
│   │   └── useOutsidePointerDismiss.ts  # Click outside handler
│   │
│   ├── layouts/
│   │   └── ModernExamLayout.tsx         # Layout base moderno
│   │
│   └── utils/
│       └── aiMetrics.ts                 # Métricas de IA
│
├── public/                              # Assets públicos
├── package.json                         # Dependências
├── vite.config.ts                       # Config Vite
├── tailwind.config.js                   # Config Tailwind
├── tsconfig.json                        # Config TypeScript
├── CLAUDE.md                            # Este arquivo
└── DIRETRIZES_EXAMES.md                 # Padrões de exames
```

---

## 🔧 Configurações e Portas

### Portas e Serviços

| Serviço | Porta | Protocolo | Acesso |
|---------|-------|-----------|---------|
| Vite Dev | 8200 | HTTP | http://localhost:8200 |
| Backend IA | 8177 | HTTPS | https://ultrassom.ai:8177 |
| Gemini API | 8177 | HTTPS | /geminiCall |
| OpenAI API | 8177 | HTTPS | /openaiCall |

### Configuração Vite (vite.config.ts)
```typescript
server: {
  port: 8200,
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
    }
  }
}
```

---

## 🚀 Comandos Úteis

### Desenvolvimento
```bash
# Navegar para o diretório do projeto
cd /root/PROJECT/vertex-v2

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint do código
npm run lint
```

### Testes de API
```bash
# Testar endpoint Gemini
curl -X POST https://ultrassom.ai:8177/geminiCall \
  -H "Content-Type: application/json" \
  -d '{"text":"teste de conexão"}'

# Testar endpoint OpenAI
curl -X POST https://ultrassom.ai:8177/openaiCall \
  -H "Content-Type: application/json" \
  -d '{"text":"teste de conexão"}'
```

### Verificação de Portas
```bash
# Ver o que está rodando na porta 8200
lsof -i :8200

# Matar processo na porta se necessário
fuser -k 8200/tcp

# Ver status do servidor
ps aux | grep vite
```

---

## 🐛 Correções Recentes (Outubro/Novembro 2025)

### 1. Dropdowns não fecham painéis flutuantes
- **Problema:** Dropdowns Radix UI fechavam painéis ao clicar
- **Solução:** MutationObserver + debounce de 50ms
- **Arquivos:** `useDropdownGuard.ts`, `FloatingOrganPanelModern.tsx`

### 2. Layout responsivo com CSS Grid
- **Container máximo:** 1800px para telas grandes
- **Grid proporcional:** Uso de `fr` units com `minmax()`
- **Canvas A4 fluido:** `clamp(600px, 75vw, 850px)`
- **Painéis adjacentes:** Posicionamento fixo em `left-[272px]`

### 3. Semântica HTML5 e Acessibilidade
- **Tags semânticas:** `<main>`, `<aside>`, `<article>`, `<section>`
- **ARIA labels:** Navegação assistiva completa
- **Score Lighthouse:** Acessibilidade 92/100, SEO 95/100
- **Layout A4:** Unificado em todas as páginas

### 4. Sistema de Streaming Implementado
- **Renderização progressiva:** Markdown em tempo real
- **Callbacks estruturados:** onChunk, onComplete, onError
- **Cancelamento:** Via AbortSignal
- **Tratamento de erros:** Robusto com fallbacks

---

## 📊 Métricas e Performance

### Estatísticas do Projeto
- **Linhas de código:** 20.000+ (otimizado após limpeza)
- **Arquivos TypeScript/TSX:** 60 (redução de 44 arquivos)
- **Componentes React:** 30+ (focado apenas no necessário)
- **Componentes Radix UI:** 7 (badge, button, card, checkbox, input, select, switch)
- **Serviços de IA:** 2 (Gemini + OpenAI)
- **Páginas de exame:** 2 (Abdome + Carótidas)

### Performance Metrics
- **Lighthouse Acessibilidade:** 92/100
- **Lighthouse SEO:** 95/100
- **Tempo de resposta IA:** ~3s (percebido com streaming)
- **Bundle size:** ~450KB (gzipped)

---

## 🎯 Roadmap e Próximos Passos

### Curto Prazo (Sprint Atual)
- [ ] Implementar exame de Tireoide
- [ ] Sistema de templates customizáveis
- [ ] Exportação PDF com assinatura digital
- [ ] Melhorar campos dinâmicos para mama

### Médio Prazo (Q1 2026)
- [ ] Histórico de pacientes
- [ ] Busca semântica em laudos anteriores
- [ ] Integração PACS/RIS
- [ ] Dashboard de métricas

### Longo Prazo (2026)
- [ ] Modo offline com sincronização
- [ ] App mobile companion
- [ ] Voice-to-text para ditado
- [ ] Multi-tenancy para clínicas

---

## 📚 Referências e Documentação

### Documentos Relacionados
- **DIRETRIZES_EXAMES.md** - Padrões de layout e campos para exames
- **PRD.md** - Product Requirements Document
- **package.json** - Dependências e scripts

### Diretrizes Médicas
- **CBR** - Colégio Brasileiro de Radiologia
- **NASCET** - Critérios de estenose carotídea
- **Gray-Weale** - Classificação de placas ateroscleróticas

### Links Úteis
- **Produção:** https://ultrassom.ai:8200
- **GitHub:** https://github.com/Anderson-Barcellos/Vertex
- **Radix UI:** https://www.radix-ui.com/
- **Tailwind CSS:** https://tailwindcss.com/

---

## 🤝 Suporte e Contato

Para questões sobre esta configuração, consulte este documento ou execute novos comandos com Claude.

**Configurado por:** Anderson (Anders) - Médico Neuropsiquiatra e Ultrassonografista
**Localização:** Santa Cruz do Sul, RS, Brasil
**Especialidades:** Neuropsiquiatria + Ultrassonografia Diagnóstica

---

**Última atualização:** 11 de Novembro de 2025
**Versão:** 2.0.0
**Status:** ✅ Sistema Operacional com Streaming Progressivo e Layout Moderno