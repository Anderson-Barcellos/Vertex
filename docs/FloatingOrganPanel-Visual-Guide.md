# FloatingOrganPanel - Guia Visual

## 🎨 Estados Visuais

### Estado Expandido (360px)

```
┌──────────────────────────────────────────┐
│  Fígado                    [◄ Minimizar] │ ← Header com botão
├──────────────────────────────────────────┤
│                                          │
│  ☐ Dentro da normalidade                │ ← Checkbox normal
│                                          │
│  Achados Morfológicos                   │ ← Categoria
│  ├─ ☑ Esteatose hepática                │ ← Finding selecionado
│  │   └─ [Grau: Acentuado]               │ ← Severity badge
│  ├─ ☐ Cisto simples                     │
│  └─ ☐ Hemangioma                        │
│                                          │
│  Achados Vasculares                     │ ← Outra categoria
│  ├─ ☐ Trombose portal                   │
│  └─ ☐ Esplenomegalia                    │
│                                          │
│  [Scrollable content...]                │
│                                          │
└──────────────────────────────────────────┘
```

### Estado Minimizado (48px)

```
┌──┐
│►│ ← Ícone CaretRight
│ │
│F│
│í│
│g│ ← Nome vertical
│a│
│d│
│o│
│ │
└──┘
```

## 🏗️ Hierarquia de Componentes

```
document.body (via React Portal)
└── div.fixed.top-20.left-6.z-50
    └── [Conditional Render]
        ├── [if isMinimized === true]
        │   └── Vertical Bar (48px)
        │       ├── div.p-3 (clickable)
        │       ├── CaretRight icon
        │       └── div.writing-mode-vertical
        │           └── {organ.name}
        │
        └── [if isMinimized === false]
            └── Expanded Panel (360px)
                ├── button (minimizar)
                │   └── CaretLeft icon
                └── OrganSection
                    ├── Header
                    ├── Normal checkbox
                    └── Categories
                        └── Findings
                            └── FindingDetails (if applicable)
```

## 📐 Posicionamento e Layout

### Viewport Reference

```
┌────────────────────────────────────────────────────────────┐
│ [Header - 64px]                                           │
│                                                            │
├──────┬─────────────────────────────────────────┬──────────┤
│      │  20px gap ↓                             │          │
│      │  ┌──────────────────────┐              │          │
│ Side │  │ FloatingOrganPanel   │              │ Panels   │
│ bar  │  │ (via Portal)         │              │          │
│      │  │                      │              │          │
│ 256px│  │ Fixed position:      │              │ 320px    │
│      │  │ top: 80px (5rem)     │   Main       │          │
│      │  │ left: 24px (1.5rem)  │   Content    │          │
│      │  │ z-index: 50          │              │          │
│      │  │                      │              │          │
│      │  │ Max height:          │              │          │
│      │  │ calc(100vh - 120px)  │              │          │
│      │  └──────────────────────┘              │          │
│      │                                         │          │
│      │  ← 24px from left edge                 │          │
│      │                                         │          │
└──────┴─────────────────────────────────────────┴──────────┘
```

### Measurements

```
┌─────── 360px (expandido) ───────┐
│                                 │
│  ┌─── 320px conteúdo ────┐     │
│  │                        │     │ ← 20px padding each side
│  │  OrganSection          │     │
│  │                        │     │
│  └────────────────────────┘     │
│                                 │
└─────────────────────────────────┘
     ↑
     48px (minimizado)
```

## 🎯 Click-Outside Detection Zones

```
┌──────────────────────────────────────────────────────────────┐
│  ZONE 1: Outside Panel (minimiza)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ZONE 2: FloatingOrganPanel (não minimiza)           │ │
│  │  ┌──────────────────────────────────────────────┐    │ │
│  │  │  ZONE 3: Dropdown Radix (não minimiza)      │    │ │
│  │  │  [data-radix-portal]                        │    │ │
│  │  └──────────────────────────────────────────────┘    │ │
│  │                                                        │ │
│  │  ☐ Finding 1                                          │ │
│  │  ☑ Finding 2                                          │ │
│  │    └─ [Severity: ▼] ← Quando aberto, não minimiza   │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Clique aqui minimiza ↑                                     │
└──────────────────────────────────────────────────────────────┘
```

### Lógica de Detecção

```typescript
handleClickOutside(event) {
  // 1. Clicou dentro do painel? → NÃO faz nada
  if (panelRef.contains(event.target)) return;

  // 2. Painel já minimizado? → NÃO faz nada
  if (isMinimized) return;

  // 3. Clicou em portal Radix? → NÃO minimiza
  if (event.target.closest('[data-radix-portal]')) return;

  // 4. Senão → Minimiza
  onToggleMinimized(true);
}
```

## 🎭 Estados de Transição

### Minimizar (Expandido → Minimizado)

```
Tempo: 0ms
┌──────────────────────┐
│ Fígado      [◄]     │
│                     │
│ ☐ Normal            │
│                     │
│ Achados...          │
└──────────────────────┘
Width: 360px
Opacity: 1

        ↓ transition-all duration-300

Tempo: 150ms (meio)
┌──────────┐
│ Fígad[◄] │
│          │
│ ☐ Norm   │
└──────────┘
Width: 204px
Opacity: 0.5

        ↓

Tempo: 300ms
┌──┐
│►│
│F│
│í│
│g│
│a│
│d│
│o│
└──┘
Width: 48px
Opacity: 1
```

### Expandir (Minimizado → Expandido)

```
Tempo: 0ms
┌──┐
│►│
│F│
│í│
└──┘
Width: 48px

        ↓ transition-all duration-300

Tempo: 300ms
┌──────────────────────┐
│ Fígado      [◄]     │
│                     │
│ ☐ Normal            │
│                     │
│ Achados...          │
└──────────────────────┘
Width: 360px
```

## 🌈 Tema e Cores

### Light Mode

```
┌──────────────────────────────────┐
│  Fígado              [◄]        │ ← bg-card (white)
├──────────────────────────────────┤   border-border (gray-200)
│                                  │
│  ☐ Dentro da normalidade        │ ← bg-muted/30 (gray-100)
│                                  │
│  Achados Morfológicos            │ ← border-b border-border
│  ├─ ☑ Esteatose                 │
│  │   [Acentuado]                │ ← Badge: bg-secondary
│                                  │
└──────────────────────────────────┘
```

### Dark Mode

```
┌──────────────────────────────────┐
│  Fígado              [◄]        │ ← bg-card (gray-950)
├──────────────────────────────────┤   border-border (gray-800)
│                                  │
│  ☐ Dentro da normalidade        │ ← bg-muted/30 (gray-900)
│                                  │
│  Achados Morfológicos            │ ← border-b border-border
│  ├─ ☑ Esteatose                 │
│  │   [Acentuado]                │ ← Badge: bg-secondary
│                                  │
└──────────────────────────────────┘
```

## 🔄 Fluxo de Interação

### Fluxo Completo

```
[Usuário clica em órgão na Sidebar]
          ↓
[Página chama setSelectedOrganId('figado')]
          ↓
[currentOrgan = organs.find(o => o.id === 'figado')]
          ↓
[FloatingOrganPanel recebe organ={currentOrgan}]
          ↓
[if (!organ) return null] → Não renderiza
[else] → Renderiza via Portal
          ↓
[createPortal(panelContent, document.body)]
          ↓
[Painel aparece fixo em top-left]
          ↓
[Usuário seleciona checkbox de achado]
          ↓
[OrganSection.handleFindingToggle()]
          ↓
[onFindingChange(organId, categoryId, findingId, ...)]
          ↓
[Página atualiza selectedFindings state]
          ↓
[FloatingOrganPanel re-renderiza com novos selectedFindings]
          ↓
[Usuário clica fora do painel]
          ↓
[handleClickOutside detecta clique]
          ↓
[onToggleMinimized(true)]
          ↓
[Página atualiza isPanelMinimized = true]
          ↓
[Painel transiciona para estado minimizado]
          ↓
[Usuário clica na barra minimizada]
          ↓
[onClick={() => onToggleMinimized(false)}]
          ↓
[Painel expande novamente]
```

## 📱 Responsividade (Futuro)

### Desktop (≥1280px)
```
┌────┬──────────────────┬────┐
│    │ ┌──────┐        │    │
│Side│ │Float │  Main  │Pan │
│bar │ │Panel │        │els │
│    │ └──────┘        │    │
└────┴──────────────────┴────┘
     ↑ Fixed position
```

### Tablet (768-1279px)
```
┌────┬───────────────────────┐
│    │ ┌──────┐             │
│Side│ │Float │   Main      │
│bar │ │Panel │   + Panels  │
│    │ └──────┘   (stacked) │
└────┴───────────────────────┘
     ↑ Still fixed position
```

### Mobile (<768px) - Não implementado
```
Sugestão: Converter para drawer/modal full-screen
```

## 🎬 Animações CSS

### Transição Principal

```css
.floating-panel {
  transition: all 300ms ease-in-out;
  /* Anima: width, height, opacity, transform */
}
```

### Hover States

```css
/* Minimizado: hover no ícone */
.minimized-icon:hover {
  background: rgba(primary, 0.1);
  transition: background 150ms;
}

/* Expandido: hover no botão minimizar */
.minimize-button:hover {
  background: muted;
  transition: background 150ms;
}
```

## 🧩 Integração com Outros Componentes

### Com Sidebar

```
Sidebar                   FloatingOrganPanel
┌─────────┐              ┌──────────────┐
│ Fígado  │ ← click →    │  Fígado      │
│ Rins    │              │  ☐ Normal    │
│ Pâncreas│              │  Achados...  │
└─────────┘              └──────────────┘
```

### Com ReportCanvas

```
FloatingOrganPanel       ReportCanvas
┌──────────────┐        ┌──────────────┐
│  Fígado      │        │ LAUDO        │
│  ☑ Esteatose │ → → →  │              │
│    Acentuado │        │ Fígado com   │
└──────────────┘        │ esteatose... │
                        └──────────────┘
```

### Com SelectedFindingsPanel

```
FloatingOrganPanel       SelectedFindingsPanel
┌──────────────┐        ┌──────────────┐
│  Fígado      │        │ Achados      │
│  ☑ Esteatose │ → → →  │              │
│    Acentuado │        │ • Fígado     │
└──────────────┘        │   Esteatose  │
                        │   (Acentuado)│
                        └──────────────┘
```

## 🎓 Padrões de Design

### Compound Component Pattern
```tsx
// Não usado (OrganSection é monolítico)
// Mas poderia ser:
<FloatingPanel>
  <FloatingPanel.Header />
  <FloatingPanel.Body />
  <FloatingPanel.Footer />
</FloatingPanel>
```

### Render Props Pattern
```tsx
// Não usado
// Mas poderia ser:
<FloatingOrganPanel
  render={(organ, isMinimized) => (
    <CustomOrganView organ={organ} minimized={isMinimized} />
  )}
/>
```

### Portal Pattern ✅ (USADO)
```tsx
// Padrão principal usado
return createPortal(content, document.body);
```

## 🔍 Debugging Visual

### Debug Borders

Adicionar temporariamente para debug:

```tsx
<div className="border-2 border-red-500"> {/* FloatingPanel */}
  <div className="border-2 border-blue-500"> {/* OrganSection */}
    <div className="border-2 border-green-500"> {/* Content */}
      ...
    </div>
  </div>
</div>
```

### Console Logs

```tsx
useEffect(() => {
  console.log('FloatingOrganPanel rendered:', {
    organId: organ?.id,
    isMinimized,
    findingsCount: selectedFindings.length
  });
}, [organ, isMinimized, selectedFindings]);
```

## 📚 Glossário Visual

| Termo | Visual | Significado |
|-------|--------|-------------|
| Portal | `Portal → body` | Renderiza fora do DOM pai |
| Fixed | `position: fixed` | Relativo à viewport |
| Z-index | `z-50` | Camada de empilhamento |
| Backdrop blur | `backdrop-blur-sm` | Efeito vidro fosco |
| Writing mode | `writing-mode: vertical-rl` | Texto vertical |
| Transition | `transition-all duration-300` | Animação suave |

---

**Legenda dos Símbolos:**
- `☐` - Checkbox desmarcado
- `☑` - Checkbox marcado
- `[◄]` - Botão minimizar (CaretLeft)
- `[►]` - Indicador expansão (CaretRight)
- `→` - Fluxo de dados
- `↓` - Progressão temporal
- `├─` - Hierarquia/aninhamento
- `└─` - Último item da hierarquia
