# Diretrizes de Layout e Campos — Páginas de Exame

Documento de referência rápida para manter consistência visual e funcional entre páginas de exame (ex.: Abdome, Carótidas, etc.). Baseado nas correções aplicadas em `src/pages/CarotidExam.tsx` e `src/components/AbdomeTotalExam.tsx` e na padronização de coleta/exibição de campos específicos em `src/components/CarotidFindingDetails.tsx`.

---

## Objetivo
- Evitar distorções de layout (overflow, painéis comprimidos, centralizações rígidas) e garantir expansão vertical natural do conteúdo.
- Padronizar como campos específicos de cada exame são capturados, normalizados e enviados ao gerador de laudo/IA.

## Layout Padrão da Página
- Container raiz: `flex min-h-screen bg-background`.
- Sidebar: largura fixa (`w-64`), borda à direita (`border-r border-border/20`) e cabeçalho com fundo escuro `bg-sidebar-background` + `border-b`.
- Conteúdo principal: `flex-1 relative bg-gray-50` sem `overflow-y-auto` global; deixe a página crescer verticalmente.
- `ReportCanvas`: renderizar em fluxo normal (ex.: `p-6` + wrapper centralizado `max-w-[900px] mx-auto`), evitando wrappers `absolute inset-0` a menos que haja necessidade específica.
- Painel de órgão flutuante: bloco `absolute top-6 left-6 bg-card border border-border rounded-lg shadow-2xl backdrop-blur-sm transition-all duration-300` com largura responsiva alternando entre `w-12` (minimizado) e `w-80` (expandido). Altura máxima sugerida: `max-h-[calc(100vh-120px)]`.
- Coluna auxiliar fixa (quando usada): tornar `sticky top-4`, sem rolagem própria, deixando a página rolar.

### Componente `Sidebar`
- Prop opcional `showSummary?: boolean` para esconder o resumo quando a tela precisar de mais espaço (Carótidas usa `showSummary={false}`).
- Mantém navegação de órgãos, quick-toggle “Normal” e contadores.

### Painel “Achados Selecionados” (`SelectedFindingsPanel`)
- Prop `expandToContent` habilitada para crescer com o conteúdo e evitar scrollbar interno.
- Cabeçalho e rodapé com fundo escuro e cantos arredondados (`rounded-t-xl`, `rounded-b-xl`).

## Regras Específicas por Exame (Campos)
Quando um exame exigir campos especializados (ex.: Doppler de Carótidas), siga esta sequência para evitar perdas de dados:

1) Normalização de Medidas
- Crie/ajuste um helper `normalizeMeasurements(measurement)` no respectivo `FindingDetails` para espelhar nomes legados e novos. Exemplo (Carótidas):
  - `ratio` ⇄ `ratioICA_CCA` (e suporte a `ratio_aci_acc`)
  - `echogenicity` ⇄ `plaqueEchogenicity`
  - `composition` ⇄ `plaqueComposition`
  - `surface` ⇄ `plaqueSurface`
  - `risk` ⇄ `plaqueRisk`
  - `emiValue` ⇄ `emi` (+ `emi_classification` ⇄ `emiClassification`)
  - `flowPattern` ⇄ `vertebralFlowPattern`
  - `nascet` ⇄ `nascetGrade`

2) Tipagem
- Adicione campos novos em `src/types/report.ts` dentro de `FindingMeasurement` (sem remover os legados). Isso garante compatibilidade no restante do app.

3) UI de Captura
- No `FindingDetails` do exame, grave sempre o par (legado/novo) no `onValueChange` para que o dado chegue consistente.
- O botão “Salvar” deve habilitar se qualquer campo relevante estiver preenchido (não apenas dimensão/localização).

4) Exibição no Painel Lateral
- Em `SelectedFindingsPanel`, renderize explicitamente os campos relevantes por instância (VPS, VDF, razão ICA/CCA, NASCET, EMI e classificação, ecogenicidade, composição, superfície, risco, padrão de fluxo, roubo da subclávia, IR/velocidade, etc.).

5) Prompt Builders
- Incluir os campos no texto enviado à IA:
  - Streaming (Gemini): `src/services/geminiStreamService.ts` → método `buildPrompt(...)`.
  - Impressão (Gemini): `src/services/geminiClient.ts` → `buildPrompt(...)`.
  - Fallback local: `src/services/reportGenerator.ts` → concatena os campos no texto básico.
- Sempre considerar os nomes novos e, em fallback, os legados.

## Layout Responsivo e Container (28/10/2025)

### Container com Largura Máxima
- Wrapper externo: `max-width: 1800px` e `margin: 0 auto` para centralizar em telas grandes
- Padding lateral: `padding: 0 1rem` para margens em dispositivos menores
- Aplicar no componente raiz ou em `GridExamLayout.tsx`

### Grid Proporcional com fr units
```css
/* Substituir pixels fixos por proporções flexíveis */
grid-template-columns:
  minmax(200px, 1fr)    /* Sidebar: min 200px, expande até 1fr */
  minmax(600px, 3fr)    /* Main: min 600px, expande até 3fr */
  minmax(280px, 1.2fr); /* Panels: min 280px, expande até 1.2fr */
```

### Canvas A4 Fluido
```css
/* Canvas responsivo com clamp() */
.a4-container-v2 {
  width: 100%;
  max-width: clamp(600px, 75vw, 850px); /* Fluido entre 600-850px */
  aspect-ratio: 1 / 1.414; /* Proporção A4 real */
}
```

### Painéis Flutuantes Adjacentes
- Posicionamento fixo: `left-[272px]` para adjacência perfeita com sidebar de 256px
- Breakpoints: `lg:left-[256px] md:left-[240px]` para diferentes tamanhos de sidebar
- Evitar `left-6` ou outros valores que criem gap visual

## Correção de Dropdowns (28/10/2025)

### MutationObserver para Detecção Dinâmica
Substituir polling por observação eficiente de mudanças no DOM:

```javascript
useEffect(() => {
  const observer = new MutationObserver(() => {
    // Detectar novos dropdowns/selects/portais Radix
    const hasDropdowns = document.querySelector(
      'select, [role="listbox"], [data-radix-portal], ...'
    );
    setHasOpenDropdowns(!!hasDropdowns);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-state', 'aria-expanded', 'open']
  });

  return () => observer.disconnect();
}, []);
```

### Debounce no Click-Outside
Prevenir fechamento prematuro com delay de 50ms:

```javascript
const debounceRef = useRef<NodeJS.Timeout>();

const handleClickOutside = (e: MouseEvent) => {
  clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
    // Lógica de verificação após 50ms
    if (shouldClosePanel) {
      setIsMinimized(true);
    }
  }, 50);
};
```

### Lista Completa de Seletores Radix UI
```javascript
const radixSelectors = [
  '[data-radix-portal]',
  '[data-radix-popper-content-wrapper]',
  '[data-radix-menu-content]',
  '[data-radix-select-content]',
  '[data-radix-dropdown-menu-content]',
  '[data-radix-popover-content]',
  '[data-radix-dialog-content]',
  '[data-radix-tooltip-content]',
  '[data-radix-context-menu-content]',
  '[data-radix-hover-card-content]',
  '[data-radix-navigation-menu-content]',
  '[role="listbox"]',
  '[role="menu"]',
  '[role="dialog"]',
  '[data-state="open"]',
  '[data-custom-dropdown="open"]'
];
```

### Marcação de Dropdowns Customizados
Adicionar atributo em dropdowns próprios:
```jsx
<div
  className="dropdown-menu"
  data-custom-dropdown="open"
>
  {/* Opções do dropdown */}
</div>
```

## Checklist de Nova Seção de Exame
- Estrutura de página segue “Layout Padrão”.
- `Sidebar` com `showSummary` ajustado conforme necessidade.
- `SelectedFindingsPanel` com `expandToContent` quando for crescer sem scroll.
- `FindingDetails` do exame implementa `normalizeMeasurements` e grava campos novos+legados.
- `types/report.ts` atualizado.
- Prompt builders (stream e impressão) conhecem os campos do exame.
- Painel “Achados Selecionados” exibe os campos que foram capturados.
- Teste manual: marcar achados, conferir painel, gerar IA (stream) e fallback; verificar presença de todos os campos no texto.

## Snippets de Referência

### Sidebar com resumo opcional
```tsx
<Sidebar
  selectedOrgan={selectedOrgan}
  onOrganSelect={handleOrganSelect}
  onNormalChange={handleNormalChange}
  selectedFindings={selectedFindings}
  normalOrgans={normalOrgans}
  organsList={organs}
  showSummary={false}
/>
```

### Painel de achados sem scroll interno
```tsx
<SelectedFindingsPanel
  selectedFindings={selectedFindings}
  normalOrgans={normalOrgans}
  organsList={organs}
  onGenerateReport={handleGenerateReport}
  isGenerating={isGenerating}
  expandToContent
/>
```

### Wrapper do conteúdo principal
```tsx
<div className="flex min-h-screen bg-background">
  <aside className="w-64 border-r border-border/20">
    <header className="p-4 border-b border-border/20 bg-sidebar-background">...</header>
    <Sidebar ... />
  </aside>

  <main className="flex-1 relative bg-gray-50">
    <div className="w-full overflow-x-hidden p-6">
      <div className="max-w-[900px] mx-auto">
        <ReportCanvas ... />
      </div>
    </div>

    {/* Painel flutuante */}
    <div className="absolute top-6 left-6 ... {isMin ? 'w-12' : 'w-80'} ..." />
  </main>
</div>
```

---

Manter este arquivo atualizado sempre que um exame introduzir campos novos ou um padrão de layout diferenciado.

