# Vertex V2 — Arquitetura e Convenções

Este documento descreve a arquitetura atual do Vertex V2, cobrindo layout moderno, componentes compartilhados, hooks utilitários, camadas de z-index, padrão de scrollbars, roteamento e como criar novos módulos de exame com segurança e consistência.

## Visão Geral
- Bundler: Vite 7.
- UI: React 19 + Tailwind v4 inline (via `@tailwindcss/vite`) e utilitários próprios.
- Headless UI: Radix (select, dropdown, tooltip, etc.).
- Estilos base: `src/main.css`, `src/styles/*.css`.
- Rotas: `src/App.tsx`.
- Landing: `src/pages/v2/LandingPageModern.tsx`.
- Exames modernos: `src/pages/modern/*.tsx`.
- Serviços IA: `src/services/*StreamService.ts`, `src/services/reportGenerator.ts`.

## Layout Moderno Compartilhado
Arquivo: `src/layouts/ModernExamLayout.tsx`

Shell com 5 slots: `header`, `sidebar`, `main`, `panels` e `floatingPanel`.
- Grid: 12 colunas com 3 regiões (sidebar | conteúdo | painéis).
- Responsividade e animações vêm de `src/styles/modern-design.css`.
- O que entra nos slots é de responsabilidade da página do exame.

## Painel Flutuante Unificado
Arquivo: `src/components/shared/FloatingOrganPanelModern.tsx`

Recursos:
- Renderização via portal no `document.body`.
- Classe `organ-section-panel` (camada controlada por token `--z-floating`).
- Cresce até `maxHeight` e só então exibe scrollbar roxa (classe `modern-scrollbar`).
- Minimiza/expande com botão e texto vertical quando minimizado.
- Proteções de clique‐fora que ignoram Radix Portals e triggers (via hooks).
- API configurável: `leftCss`, `widthExpanded`, `maxHeight`, e `FindingDetailsComponent`.

## Hooks Compartilhados
Arquivos:
- `src/hooks/useDropdownGuard.ts`: observa o DOM por dropdowns abertos (Radix, aria-expanded) e expõe `isAnyDropdownOpen`.
- `src/hooks/useOutsidePointerDismiss.ts`: captura `pointerdown` fora do container e dispara `onDismiss`, ignorando elementos de dropdown/portal e seletores extras.

## Camadas (Z-Index)
Tokens definidos em `src/styles/layout.css`:
- `--z-base`, `--z-content`, `--z-floating`, `--z-dropdown`, `--z-modal`.
As regras de `src/styles/animations.css` usam esses tokens; portais Radix sobem para `--z-dropdown` com `!important` para garantir sobreposição sobre o painel.

## Scrollbar Moderna
Definida em `src/styles/modern-design.css` como `.modern-scrollbar` com thumb roxa. O elemento que possui `max-height` deve receber `overflow-y-auto modern-scrollbar` para comportamento correto (crescer até o limite e só então exibir a barra).

## Roteamento
Arquivo: `src/App.tsx`.
- `/abdome-modern` → `AbdomeTotalExamModern` (layout moderno + painel unificado).
- `/carotid-modern` → `CarotidExamModern` (idem).
- `/exam/*` → páginas “v2” (legado), mantidas por compatibilidade.

## Páginas de Exame Moderno
Exemplos:
- `src/pages/modern/AbdomeTotalExamModern.tsx`
- `src/pages/modern/CarotidExamModern.tsx`

Ambas plugam o `ModernExamLayout` e o `FloatingOrganPanelModern`. O conteúdo do A4 é rendido por `components/original/ReportCanvas` para preservar a lógica de laudo/IA.

## Template para Novos Exames
Arquivo de exemplo: `src/pages/modern/ExamTemplateModern.example.tsx`.

Parâmetros a fornecer:
- `organsList` do exame.
- Rótulos do header.
- `FindingDetailsComponent` específico, se houver.

## Serviços de IA
- `src/services/geminiStreamService.ts`, `src/services/openaiStreamService.ts`, `src/services/unifiedAIService.ts`.
- `ReportCanvas` expõe controles de geração, auto‐geração e estado da IA.
- Configuração via variáveis de ambiente (ver README).

## Assets e Favicon
- Logo principal: `public/logo-vertex.svg` (usado no header das páginas modernas e na landing).
- Favicon: `public/favicon.svg` referenciado no `index.html`.

## Portal Root
`index.html` possui `<div id="portal-root"></div>` para futuros portais; o Radix já porta para `document.body` e recebe camada via tokens de z-index.

## Convenções de Estilo
- Evitar `z-50`/`z-[NN]` no JSX. Preferir tokens via classes/arquivos CSS.
- Usar `organ-section-panel` para painéis flutuantes.
- Manter dropdowns Radix com seus Portals padrão; não “forçar” `position: absolute` local.

## Boas Práticas de Interação
- Nunca minimizar painel se um dropdown/combobox/menu estiver aberto.
- Usar `pointerdown` com `capture: true` no hook para evitar race com Radix.
- Evitar observers redundantes na página; os hooks já cobrem os casos de dropdown.

## Build e Dev
- Dev: `npm run dev` (porta 8200). Arquivo de log em `/tmp/vertex-v2.dev.log` quando iniciado via nohup.
- Build: `npm run build`.
- Preview: `npm run preview`.

## Proxy de API (Vite)
`vite.config.ts` define `/api/gemini` e `/api/openai` com rewrite para `ultrassom.ai:8177`. Ajuste as chaves/endpoint conforme necessário.

## Troubleshooting Rápido
- “Identifier 'X' has already been declared”: módulo com import duplicado. Remover linha de import repetida e hard refresh.
- Dropdown atrás do painel: garantir que o painel use `organ-section-panel` e os portais Radix `--z-dropdown` (já padronizado).
- Scrollbar não aparece: assegurar `overflow-y-auto modern-scrollbar` no mesmo elemento com `max-height`.
- Favicon 404: manter `<link rel="icon" href="/favicon.svg" />` no `index.html`.

## Backup
Snapshot criado em `backups/vertex-v2-YYYYMMDD-hhmmss.tar.gz`. Exemplo recente: ver `backups/vertex-v2-20251104-153836.tar.gz`.

---

Qualquer ajuste fino de tokens, layout ou comportamento dos hooks pode ser centralizado nos arquivos acima para refletir em todas as páginas modernas.

