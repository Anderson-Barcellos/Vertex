# Vertex V2 - Documentação Unificada

**Versão:** 2.0.0
**Data:** Novembro 2025
**Porta:** 8201
**Reverse Proxy:** vertex.ultrassom.ai
**Status:** ✅ Em Produção

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Arquitetura](#arquitetura)
5. [Guia de Desenvolvimento](#guia-de-desenvolvimento)
6. [Componentes Principais](#componentes-principais)
7. [Troubleshooting](#troubleshooting)
8. [Execução e Deploy](#execução-e-deploy)
9. [Changelog](#changelog)
10. [Referências](#referências)

---

## 🎯 Visão Geral

O **Vertex V2** é uma refatoração completa do sistema de laudos ultrassonográficos, focando em **design moderno**, **layout responsivo** e **experiência de usuário premium**.

### Objetivos Alcançados

- ✅ **Layout Moderno** com glassmorphism e gradientes suaves
- ✅ **Floating Panels Inteligentes** com fundo branco e abertura automática
- ✅ **Painéis Laterais Otimizados** sem bordas duplicadas
- ✅ **Botões Verdes** para copiar laudos (sempre visíveis)
- ✅ **Arquitetura Modular** com componentes compartilhados
- ✅ **Hooks Utilitários** para gestão de dropdowns e click-outside

### Rotas Ativas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | `LandingPageModern` | Página inicial moderna |
| `/old-home` | `Home` | Página legada (manutenção) |
| `/abdome-modern` | `AbdomeTotalExamModern` | Exame de abdome total |
| `/carotid-modern` | `CarotidExamModern` | Exame de carótidas |

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 19 | Framework UI |
| TypeScript | 5.x | Type Safety |
| Vite | 7.1.5 | Build Tool (porta 8200) |
| Tailwind CSS | v4 | Estilização utilitária |
| React Router | v7 | Roteamento SPA |
| Radix UI | Latest | Componentes base acessíveis |
| Phosphor Icons | Latest | Ícones modernos |
| Sonner | Latest | Notificações toast |

### Dependências Principais

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router-dom": "^7.9.1",
  "@radix-ui/react-select": "^2.1.6",
  "@radix-ui/react-dropdown-menu": "^2.1.6",
  "@radix-ui/react-dialog": "^1.1.6",
  "@tailwindcss/vite": "^4.1.11",
  "react-markdown": "^10.1.0",
  "sonner": "^2.0.1"
}
```

---

## 📁 Estrutura de Arquivos

```
vertex-v2/
├── src/
│   ├── pages/
│   │   ├── v2/
│   │   │   └── LandingPageModern.tsx      # Landing moderna
│   │   ├── modern/
│   │   │   ├── AbdomeTotalExamModern.tsx  # Exame abdome
│   │   │   ├── CarotidExamModern.tsx       # Exame carótidas
│   │   │   └── ExamTemplateModern.example.tsx  # Template de referência
│   │   └── Home.tsx                        # Página legada
│   ├── components/
│   │   ├── original/                       # Componentes herdados
│   │   │   ├── ReportCanvas.tsx          # Canvas do laudo
│   │   │   ├── Sidebar.tsx               # Navegação lateral
│   │   │   ├── SelectedFindingsPanel.tsx # Achados selecionados
│   │   │   ├── ExamStatisticsPanel.tsx    # Estatísticas do exame
│   │   │   ├── OrganSection.tsx           # Seção de órgão
│   │   │   ├── CarotidFindingDetails.tsx  # Detalhes carótidas
│   │   │   └── FindingDetailsEnhanced.tsx # Detalhes achados
│   │   ├── shared/                        # Componentes compartilhados
│   │   │   └── FloatingOrganPanelModern.tsx # Painel flutuante moderno
│   │   ├── MarkdownRenderer.tsx           # Renderizador markdown
│   │   └── ResolutionGuard.tsx            # Guarda de resolução
│   ├── layouts/
│   │   └── ModernExamLayout.tsx          # Layout moderno compartilhado
│   ├── hooks/
│   │   ├── useDropdownGuard.ts            # Hook para detectar dropdowns
│   │   └── useOutsidePointerDismiss.ts   # Hook para click-outside
│   ├── services/
│   │   ├── geminiStreamService.ts         # Serviço Gemini streaming
│   │   ├── openaiStreamService.ts         # Serviço OpenAI streaming
│   │   ├── unifiedAIService.ts           # Serviço unificado IA
│   │   ├── reportGenerator.ts             # Gerador de laudos
│   │   └── geminiClient.ts               # Cliente Gemini
│   ├── data/
│   │   ├── organs.ts                     # Definições de órgãos CBR
│   │   ├── carotidOrgans.ts              # Órgãos carótidas
│   │   └── reportTemplates.ts            # Templates de laudo
│   ├── types/
│   │   └── report.ts                     # TypeScript types
│   ├── styles/
│   │   ├── modern-design.css             # Design system moderno
│   │   ├── theme.css                     # Tema base
│   │   ├── layout.css                    # Layouts responsivos
│   │   └── grid-layout.css               # CSS Grid e utilitários
│   ├── App.tsx                           # Rotas principais
│   └── main.tsx                           # Entry point
├── public/
│   ├── logo-vertex.svg                   # Logo principal
│   └── favicon.svg                       # Favicon
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🏗️ Arquitetura

### Layout Moderno Compartilhado

**Arquivo:** `src/layouts/ModernExamLayout.tsx`

Shell com 5 slots: `header`, `sidebar`, `main`, `panels` e `floatingPanel`.

#### Estrutura do Grid

- **Grid:** 12 colunas com 3 regiões (sidebar | conteúdo | painéis)
- **Sidebar:** `col-span-12 lg:col-span-3` (3 colunas no desktop)
- **Main:** `col-span-12 lg:col-span-6` (6 colunas no desktop)
- **Panels:** `col-span-12 lg:col-span-3` (3 colunas no desktop)
- **Responsividade:** Breakpoints via Tailwind (`lg:` = 1024px+)

#### Características

- Container centralizado com `max-w-[1800px]`
- Header com glassmorphism (`glass-panel`)
- Sidebar sticky com scroll condicional (`max-h-[calc(100vh-120px)]`)
- Painéis laterais sticky no desktop
- Painel flutuante renderizado via Portal (fora do grid)

#### Exemplo de Uso

```tsx
<ModernExamLayout
  header={<HeaderContent />}
  sidebar={<Sidebar />}
  main={<ReportCanvas />}
  panels={
    <>
      <SelectedFindingsPanel />
      <ExamStatisticsPanel />
    </>
  }
  floatingPanel={
    <FloatingOrganPanelModern {...props} />
  }
/>
```

### Painel Flutuante Unificado

**Arquivo:** `src/components/shared/FloatingOrganPanelModern.tsx`

#### Recursos

- Renderização via portal no `document.body`
- Classe `organ-section-panel` (camada controlada por token `--z-floating`)
- Cresce até `maxHeight` e só então exibe scrollbar roxa (classe `modern-scrollbar`)
- Minimiza/expande com botão e texto vertical quando minimizado
- Proteções de clique-fora que ignoram Radix Portals e triggers (via hooks)

#### API Configurável

```typescript
type FloatingOrganPanelModernProps = {
  organ: Organ;
  selectedFindings: SelectedFinding[];
  isNormal: boolean;
  isMinimized: boolean;
  onToggleMinimized: (minimized: boolean) => void;
  onFindingChange: (...);
  onNormalChange: (...);
  leftCss?: string;              // ex.: 'calc(25% + 1.5rem)'
  widthExpanded?: string;         // default '24rem'
  maxHeight?: string;            // default '80vh'
  FindingDetailsComponent?: React.ComponentType<any>;
  // Novo — ancoragem precisa na sidebar:
  followSidebar?: boolean;       // default true; quando true, ignora leftCss e ancora no .glass-sidebar
  followGapPx?: number;          // espaçamento a partir da borda direita da sidebar (default 8–24)
  followNudgePx?: number;        // “empurra” para a esquerda para criar overlap (ex.: 24 para metade do tab)
};
```

#### Posicionamento

- **Fixed:** `position: fixed` relativo à viewport
- **Top:** `top-24` (96px do topo)
- **Left:**
  - Por padrão via `leftCss` (padrão: `calc(25% + 1.5rem)`).
  - Quando `followSidebar` está ativo (default): o `left` é calculado em tempo real com base no retângulo do
    container `.glass-sidebar` (não a coluna do grid), usando:
    - `left = right(.glass-sidebar) + followGapPx - followNudgePx`.
    - `followNudgePx` só é aplicado quando o painel está minimizado (para sobrepor parcialmente a sidebar).
  - Eventos observados: `resize`, `scroll` e `ResizeObserver` no `.glass-sidebar` e grid ancestral.

#### Exemplos práticos

```tsx
<FloatingOrganPanelModern
  organ={currentOrgan}
  selectedFindings={...}
  isNormal={...}
  isMinimized={isPanelMinimized}
  onToggleMinimized={setIsPanelMinimized}
  onFindingChange={handleFindingChange}
  onNormalChange={handleNormalChange}
  // Ancorado na sidebar, com overlap de metade do tab quando minimizado
  followSidebar
  followGapPx={0}
  followNudgePx={24}
  widthExpanded={'24rem'}
  maxHeight={'80vh'}
/>
```
- **Z-index:** Controlado por token `--z-floating` via classe `organ-section-panel`

### Hooks Compartilhados

#### useDropdownGuard

**Arquivo:** `src/hooks/useDropdownGuard.ts`

Observa o DOM por dropdowns abertos (Radix, aria-expanded) e expõe `isAnyDropdownOpen`.

```typescript
const { isAnyDropdownOpen, isDropdownRelated } = useDropdownGuard([ref]);
```

**Detecção:**
- Portais Radix UI (`[data-radix-portal]`)
- Estados abertos (`[data-state="open"]`, `[aria-expanded="true"]`)
- Roles específicos (`role="listbox"`, `role="combobox"`)
- Dropdowns customizados (`[data-custom-dropdown="open"]`)

**Implementação:**
- Usa `MutationObserver` para detectar mudanças no DOM
- Observa `document.body` e refs fornecidos
- Atualiza estado quando dropdowns abrem/fecham

#### useOutsidePointerDismiss

**Arquivo:** `src/hooks/useOutsidePointerDismiss.ts`

Captura `pointerdown` fora do container e dispara `onDismiss`, ignorando elementos de dropdown/portal e seletores extras.

```typescript
useOutsidePointerDismiss({
  containerRef: ref,
  isDisabled: isMinimized,
  isDropdownOpen: isAnyDropdownOpen,
  onDismiss: () => onToggleMinimized(true)
});
```

**Características:**
- Usa `pointerdown` com `capture: true` para evitar race conditions
- Verifica `composedPath()` para detectar elementos de dropdown
- Ignora cliques em portais Radix e seletores extras
- Desabilitável via `isDisabled`

### Camadas (Z-Index)

Tokens definidos em `src/styles/layout.css`:

```css
--z-base: 1;
--z-content: 10;
--z-floating: 100;
--z-dropdown: 200;
--z-modal: 300;
```

**Uso:**
- Painel flutuante: `organ-section-panel` → `--z-floating`
- Portais Radix: `--z-dropdown` (com `!important` em `animations.css`)
- Modais: `--z-modal`

### Scrollbar Moderna

Definida em `src/styles/modern-design.css` como `.modern-scrollbar` com thumb roxa.

**Regra:** O elemento que possui `max-height` deve receber `overflow-y-auto modern-scrollbar` para comportamento correto (crescer até o limite e só então exibir a barra).

```css
.modern-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.modern-scrollbar::-webkit-scrollbar-thumb {
  background: #6366f1; /* Indigo */
  border-radius: 4px;
}
```

### Roteamento

**Arquivo:** `src/App.tsx`

```typescript
<Routes>
  <Route path="/" element={<LandingPageModern />} />
  <Route path="/old-home" element={<Home />} />
  <Route path="/abdome-modern" element={<AbdomeTotalExamModern />} />
  <Route path="/carotid-modern" element={<CarotidExamModern />} />
</Routes>
```

### Serviços de IA

- `src/services/geminiStreamService.ts` - Streaming Gemini
- `src/services/openaiStreamService.ts` - Streaming OpenAI
- `src/services/unifiedAIService.ts` - Serviço unificado com fallback
- `src/services/reportGenerator.ts` - Geração de laudos com templates

**ReportCanvas** expõe controles de geração, auto‑geração e estado da IA. O painel “Estatísticas da IA” mostra
modelo usado, tokens estimados (entrada/saída), custo estimado, duração, número de chunks e tamanho do output.

#### Endpoints e Proxy

- OpenAI frontend: `VITE_OPENAI_API_URL || '/api/openai'` → no dev, Vite proxy reescreve para `https://ultrassom.ai:8177/openaiCall`.
- Gemini frontend: `VITE_GEMINI_API_URL || '/api/gemini'` → no dev, Vite proxy reescreve para `https://ultrassom.ai:8177/geminiCall`.

#### Seleção de Modelo (persistência)

- A seleção de modelo feita no painel direito é persistida em `sessionStorage` na chave `selectedAIModel`.
- Os serviços usam esta chave como prioridade; se ausente, caem no default do `.env`.
  - OpenAI default: `VITE_OPENAI_MODEL` (fallback para `'gpt-5'`).
  - Gemini default: `VITE_GEMINI_MODEL` (fallback para `'gemini-2.5-pro'`).

#### Streaming e onChunk (acumulado)

- O `openaiStreamService` decodifica SSE/NDJSON e emite `onChunk(fullTextAcumulado)`, alinhado ao Gemini.
- Consumidores devem simplesmente fazer `setState(conteudoAcumulado)` — evitar concatenar manualmente.
- OpenAI: usa `max_completion_tokens` (não `max_tokens`).

#### Métricas e custo

- Estrutura `AIGenerationStats` em `src/types/report.ts` agrega:
  - `provider`, `model`, `promptTokens`, `completionTokens`, `durationMs`, `chunkCount`, `inputChars`, `outputChars`, `estimatedCostUsd`.
- Utilitários em `src/utils/aiMetrics.ts`:
  - `estimateTokensFromText`, `estimateCostUsd`, `formatDuration`, `formatCost`.
- Variáveis de ambiente para custo por 1k tokens (opcionais):
  - `VITE_OPENAI_INPUT_COST_PER_1K`, `VITE_OPENAI_OUTPUT_COST_PER_1K` (defaults 0.005/0.015)
  - `VITE_GEMINI_INPUT_COST_PER_1K`, `VITE_GEMINI_OUTPUT_COST_PER_1K` (defaults 0.007/0.021)

#### Prompt Builder Unificado

- `src/services/promptBuilder.ts` centraliza a montagem do prompt, reutilizado por Gemini e OpenAI.

---

## 📚 Guia de Desenvolvimento

### Como Criar um Novo Exame

#### 1. Criar a Página

Copiar `src/pages/modern/ExamTemplateModern.example.tsx` e adaptar.

#### 2. Estrutura Básica

```tsx
import ModernExamLayout from '@/layouts/ModernExamLayout';
import FloatingOrganPanelModern from '@/components/shared/FloatingOrganPanelModern';
import Sidebar from '@/components/original/Sidebar';
import ReportCanvas from '@/components/original/ReportCanvas';
import SelectedFindingsPanel from '@/components/original/SelectedFindingsPanel';
import ExamStatisticsPanel from '@/components/original/ExamStatisticsPanel';

export default function NovoExameModern() {
  // Estados
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
  // ... outros estados

  // Handlers
  const handleOrganSelect = (organId: string) => {
    setSelectedOrgan(organId);
    setIsPanelMinimized(false);
  };

  const handleFindingChange = (...) => {
    // Lógica de mudança de achados
  };

  // Renderizar
  return (
    <ModernExamLayout
      header={<HeaderContent />}
      sidebar={<Sidebar {...props} />}
      main={<ReportCanvas {...props} />}
      panels={
        <>
          <SelectedFindingsPanel {...props} />
          <ExamStatisticsPanel {...props} />
        </>
      }
      floatingPanel={
        currentOrgan ? (
          <FloatingOrganPanelModern
            organ={currentOrgan}
            selectedFindings={currentOrganFindings}
            isNormal={isCurrentOrganNormal}
            isMinimized={isPanelMinimized}
            onToggleMinimized={setIsPanelMinimized}
            onFindingChange={handleFindingChange}
            onNormalChange={handleNormalChange}
            FindingDetailsComponent={CustomFindingDetails} // Opcional
          />
        ) : null
      }
    />
  );
}
```

#### 3. Checklist de Criação

- [ ] Criar página a partir de `ExamTemplateModern.example.tsx`
- [ ] Passar `organsList`, rótulos de exame e `FindingDetailsComponent` quando necessário
- [ ] Garantir `FloatingOrganPanelModern` com `organ-section-panel` e `maxHeight` adequado
- [ ] Verificar dropdowns Radix sobrepondo o painel
- [ ] Validar minimizar/expandir do painel com dropdown aberto (não deve minimizar)
- [ ] Conferir scrollbar roxa visível somente após atingir o limite de altura
- [ ] Adicionar rota em `App.tsx`

#### 4. Componente Customizado de Detalhes (Opcional)

Para exames específicos (ex.: Carótidas), criar componente customizado:

```tsx
// src/components/original/CustomFindingDetails.tsx
export default function CustomFindingDetails({
  finding,
  organId,
  severity,
  instances,
  onSeverityChange,
  onInstancesChange
}: FindingDetailsComponentProps) {
  // Implementação específica
}
```

Passar como prop `FindingDetailsComponent` para `FloatingOrganPanelModern`.

### Convenções de Estilo

- Evitar `z-50`/`z-[NN]` no JSX. Preferir tokens via classes/arquivos CSS.
- Usar `organ-section-panel` para painéis flutuantes.
- Manter dropdowns Radix com seus Portals padrão; não "forçar" `position: absolute` local.

### Boas Práticas de Interação

- Nunca minimizar painel se um dropdown/combobox/menu estiver aberto.
- Usar `pointerdown` com `capture: true` no hook para evitar race com Radix.
- Evitar observers redundantes na página; os hooks já cobrem os casos de dropdown.

---

## 🧩 Componentes Principais

### ModernExamLayout

**Localização:** `src/layouts/ModernExamLayout.tsx`

Layout base compartilhado por todas as páginas de exame modernas.

**Props:**
```typescript
{
  header: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
  panels: React.ReactNode;
  floatingPanel?: React.ReactNode;
}
```

**Características:**
- Grid responsivo de 12 colunas
- Header com glassmorphism
- Sidebar sticky com scroll condicional
- Painéis laterais sticky no desktop
- Suporte a painel flutuante via Portal

### FloatingOrganPanelModern

**Localização:** `src/components/shared/FloatingOrganPanelModern.tsx`

Painel flutuante que renderiza `OrganSection` via React Portal.

**Características:**
- Portal React para renderização fora do grid
- Posicionamento fixo configurável
- Estados minimizado/expandido
- Click-outside inteligente (ignora dropdowns)
- Scrollbar condicional (só aparece quando necessário)

**Estados:**

**Expandido:**
- Largura: `24rem` (configurável)
- Altura máxima: `80vh` (configurável)
- Renderiza `OrganSection` completo
- Botão minimizar no canto superior direito

**Minimizado:**
- Largura: `48px` (`w-12`)
- Exibe nome do órgão em texto vertical
- Ícone `CaretRight` no topo
- Clique em qualquer lugar expande

### Sidebar

**Localização:** `src/components/original/Sidebar.tsx`

Navegação lateral com lista de órgãos e botões rápidos.

**Props principais:**
- `selectedOrgan` - ID do órgão selecionado
- `onOrganSelect` - Callback ao selecionar órgão
- `selectedFindings` - Achados selecionados
- `normalOrgans` - IDs de órgãos normais
- `organsList` - Lista de órgãos do exame
- `showSummary` - Mostrar seção de resumo (opcional)

### ReportCanvas

**Localização:** `src/components/original/ReportCanvas.tsx`

Canvas A4 centralizado que renderiza o laudo gerado.

**Props principais:**
- `selectedFindings` - Achados selecionados
- `normalOrgans` - Órgãos normais
- `generatedReport` - Laudo gerado (markdown)
- `isGenerating` - Estado de geração
- `aiImpression` - Impressão da IA
- `aiStatus` - Status da IA

**Funcionalidades:**
- Renderização de markdown
- Botões de copiar (sempre verdes)
- Streaming de IA progressivo
- Auto-geração opcional

### SelectedFindingsPanel

**Localização:** `src/components/original/SelectedFindingsPanel.tsx`

Painel lateral que lista achados selecionados e permite gerar laudo.

**Props principais:**
- `selectedFindings` - Achados selecionados
- `normalOrgans` - Órgãos normais
- `organsList` - Lista de órgãos
- `onGenerateReport` - Callback para gerar laudo
- `isGenerating` - Estado de geração
- `expandToContent` - Expandir conforme conteúdo

**Funcionalidades:**
- Lista de achados por órgão
- Seleção de modelo de IA
- Botão de gerar laudo
- Estatísticas básicas

### ExamStatisticsPanel

**Localização:** `src/components/original/ExamStatisticsPanel.tsx`

Painel lateral com estatísticas do exame.

**Props principais:**
- `selectedFindings` - Achados selecionados
- `normalOrgans` - Órgãos normais
- `organsList` - Lista de órgãos

**Estatísticas exibidas:**
- Total de achados
- Órgãos com achados
- Órgãos normais
- Distribuição por categoria

---

## 🔧 Troubleshooting

### Erros Comuns

#### Identifier 'X' has already been declared

**Causa:** Import duplicado do mesmo símbolo em um módulo.

**Solução:** Remover a linha duplicada e fazer hard refresh (Ctrl/Cmd+Shift+R).

#### Dropdown/Select atrás do painel flutuante

**Causa:** Painel com z-index alto ou ausência de `organ-section-panel`.

**Solução:**
- Usar `organ-section-panel` no painel
- Deixar portais Radix com z-index `--z-dropdown` (já padronizado em `animations.css`)

#### Scrollbar não aparece quando o conteúdo cresce

**Causa:** `overflow` aplicado no elemento errado.

**Solução:** Colocar `overflow-y-auto modern-scrollbar` no MESMO elemento que tem `max-height`.

#### Favicon 404

**Causa:** Navegador solicitando `/favicon.ico` quando não há link explícito.

**Solução:** Garantir `<link rel="icon" href="/favicon.svg" />` no `index.html` (já aplicado).

#### HMR não reflete mudança

**Causa:** Grafo do Vite com estado sujo após erro de módulo.

**Solução:** Hard refresh; se persistir, parar e subir `npm run dev` novamente.

#### Painel flutuante não abre ao clicar no órgão

**Causa:** Click-outside handler capturando o mesmo clique que abre o painel.

**Solução:** Verificar que `useOutsidePointerDismiss` está com `isDisabled` quando `isMinimized` está `true`.

#### Painel fecha ao clicar em dropdown

**Causa:** Dropdown não detectado como portal Radix UI.

**Solução:** Verificar que `useDropdownGuard` está sendo usado e `isAnyDropdownOpen` está sendo passado para `useOutsidePointerDismiss`.

### Portas/Serviço

- **Dev server:** 8200. Verificar com `ss -ltnp | grep :8200`
- **Logs** (quando rodando com nohup): `/tmp/vertex-v2.dev.log`

### Backup

Snapshots em `backups/`. Exemplo: `backups/vertex-v2-20251104-153836.tar.gz`

---

## 🚀 Execução e Deploy

### Desenvolvimento Local

```bash
# Instalar dependências
cd /root/PROJECT/vertex-v2
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar aplicação
# http://localhost:8200
```

### Build de Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

### Variáveis de Ambiente

Configurar no `.env` ou no servidor:

```bash
# Endpoints (opcionais; se não definidos, usam proxy do Vite)
VITE_GEMINI_API_URL=/api/gemini
VITE_OPENAI_API_URL=/api/openai

# Modelos default (sobrepostos pelo selection do usuário via sessionStorage)
VITE_GEMINI_MODEL=gemini-2.5-pro
VITE_OPENAI_MODEL=gpt-4o

# Custos estimados por 1k tokens (opcional)
VITE_OPENAI_INPUT_COST_PER_1K=0.005
VITE_OPENAI_OUTPUT_COST_PER_1K=0.015
VITE_GEMINI_INPUT_COST_PER_1K=0.007
VITE_GEMINI_OUTPUT_COST_PER_1K=0.021

# Chaves (se backend não fizer proxy de autenticação)
VITE_GEMINI_API_KEY=your_api_key
VITE_OPENAI_API_KEY=your_api_key

# Ambiente
NODE_ENV=development
```

### Proxy de API (Vite)

`vite.config.ts` define `/api/gemini` e `/api/openai` com rewrite para `ultrassom.ai:8177`. Ajuste as chaves/endpoint conforme necessário.

### Systemd Service (Opcional)

**Arquivo:** `/etc/systemd/system/vertex-v2.service`

**Status:** Criado mas requer ajuste no PATH do npm.

**Configuração sugerida:**
```ini
[Unit]
Description=Vertex V2 Vite Dev Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/PROJECT/vertex-v2
ExecStart=/usr/local/bin/npx vite --host 0.0.0.0 --port 8200
Restart=always
RestartSec=10
StandardOutput=append:/var/log/vertex-v2/vertex.log
StandardError=append:/var/log/vertex-v2/error.log
Environment="NODE_ENV=development"
Environment="PATH=/usr/bin:/bin:/usr/local/bin:/usr/local/lib/node_modules"

[Install]
WantedBy=multi-user.target
```

**Comandos:**
```bash
# Recarregar daemon
sudo systemctl daemon-reload

# Iniciar serviço
sudo systemctl start vertex-v2

# Habilitar inicialização automática
sudo systemctl enable vertex-v2

# Ver status
sudo systemctl status vertex-v2

# Ver logs
journalctl -u vertex-v2.service -n 50
```

---

## 📝 Changelog

### [10/11/2025] - IA e UX

- OpenAI: corrigido payload para `max_completion_tokens`; streaming agora emite `onChunk` com texto acumulado.
- Seleção de modelo: persistência via `sessionStorage.selectedAIModel` e uso nos serviços.
- Painel “Estatísticas da IA”: tokens (estimados), custo, duração, chunks e tamanho de saída.
- FloatingOrganPanelModern: ancoragem precisa no `.glass-sidebar` com props `followSidebar`, `followGapPx`, `followNudgePx` e overlap ao minimizar.
- Sidebar: removidas micro‑descrições sob cada item para reduzir ruído visual.
- Layout: `ReportCanvas` header `p-6 → p-5`; `.report-content` com padding superior reduzido.

### [28/10/2025] - Correções de Dropdowns e Layout Responsivo

#### Problema de Dropdowns Fechando Painéis Flutuantes
- **Problema identificado:** Dropdowns (nativos e Radix UI) estavam fechando incorretamente os painéis flutuantes ao serem clicados
- **Causa raiz:** Handler de click-outside não detectava corretamente todos os elementos de dropdown
- **Solução implementada:**
  - Substituído polling (setInterval 100ms) por MutationObserver para detecção eficiente
  - Adicionado debounce de 50ms no handler click-outside
  - Lista completa de seletores Radix UI para detecção de portais
  - Marcação de dropdowns customizados com `data-custom-dropdown="open"`

#### Melhorias de Layout
- **Container com largura máxima:** Adicionado wrapper `max-width: 1800px` para telas grandes
- **Grid proporcional:** Migrado de pixels fixos para unidades `fr` com `minmax()`
- **Canvas A4 fluido:** Implementado `clamp(600px, 75vw, 850px)` para adaptação suave
- **Aspect ratio preservado:** Mantido `1 / 1.414` (proporção A4 real)

#### Correção de Posicionamento dos Painéis Flutuantes
- **Problema:** Painéis flutuantes não estavam adjacentes à sidebar (left-6 = 24px)
- **Correção:** Posicionamento fixo em `left-[272px]` para adjacência perfeita
- **Breakpoints responsivos:** `lg:left-[256px] md:left-[240px]`

### [22/10/2025] - Layout Centralizado + Diretrizes de Exames

- Wrapper centralizado com `max-w-screen-2xl`
- Sidebar fixa com `w-64 flex-shrink-0`
- Painéis auxiliares com `expandToContent`

### [22/10/2025] - Aperfeiçoamentos Doppler Carótidas

- Helper `normalizeMeasurements` para compatibilidade
- Novos campos: `plaqueRisk`, `emi`, `emiClassification`
- Input EMI como texto livre

### [21/10/2025] - Refatoração Semântica HTML5

- Substituição de divs genéricas por tags HTML5
- Atributos ARIA completos
- Score de acessibilidade: 92/100 (Lighthouse)

### [05/11/2025] - Correções de Imports e Limpeza

- Correção de 7 problemas de imports em diferentes arquivos
- Remoção de arquivos não utilizados (15 arquivos)
- Consolidação de imports duplicados
- Template base `ModernExamLayout` verificado e funcional

---

## 📚 Referências

### Documentação Externa

- [React Portals](https://react.dev/reference/react-dom/createPortal)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Vite Documentation](https://vite.dev)
- [React Router v7](https://reactrouter.com)

### Documentação Interna

- `docs/ARCHITECTURE.md` - Arquitetura detalhada (legado)
- `docs/EXAM_MODERN_GUIDE.md` - Guia de criação de exames (legado)
- `docs/TROUBLESHOOTING.md` - Troubleshooting detalhado (legado)
- `src/pages/modern/ExamTemplateModern.example.tsx` - Template de referência

### Arquivos de Configuração

- `vite.config.ts` - Configuração do Vite
- `tailwind.config.js` - Configuração do Tailwind
- `tsconfig.json` - Configuração do TypeScript
- `package.json` - Dependências e scripts

---

## 🎯 Próximos Passos

- [ ] Implementar novos exames com mesmo layout moderno
- [ ] Adicionar animações de transição entre páginas
- [ ] Criar sistema de temas (dark/light toggle)
- [ ] Implementar modo de impressão otimizado
- [ ] Adicionar testes E2E com Playwright
- [ ] Documentar componentes com Storybook
- [ ] Melhorar acessibilidade (A11y audit)
- [ ] Otimizar bundle size (code splitting)

---

## 👨‍💻 Desenvolvido por

**Anders + Claude**
Data: Outubro-Novembro 2025
Versão: 2.0.0

---

**🧉 Bah, ficou tri legal esse projeto tchê!**
