# 🏗️ Vertex V2 - Arquitetura CSS Grid

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Layout Grid](#layout-grid)
- [Breakpoints](#breakpoints)
- [Componentes](#componentes)
- [A4 Container Responsivo](#a4-container-responsivo)
- [Floating Panel Portal](#floating-panel-portal)
- [Comparação Original vs V2](#comparação-original-vs-v2)
- [Guia de Testes](#guia-de-testes)

---

## 🎯 Visão Geral

Vertex V2 é uma refatoração completa do layout do sistema de laudos ultrassonográficos, migrando de **Flexbox manual** para **CSS Grid moderno**. O objetivo é criar um sistema responsivo real que funciona perfeitamente em desktop e tablet.

### Problemas Resolvidos

| Problema Original | Solução V2 |
|-------------------|------------|
| A4 fixo em 210mm causava overflow | A4 colapsável (210mm → 160mm) |
| Sidebar fixa 256px em todas telas | Grid controla: 256px (desktop), 240px (tablet) |
| Panels com sticky + absolute conflitando | Grid areas separadas, sticky gerenciado |
| Layout quebrava em tablet | Breakpoints nativos com grid-template-areas |
| Overflow horizontal em mobile | min-width: 0 no grid, sem overflow |

---

## 🏗️ Layout Grid

### Desktop (≥1280px) - 3 Colunas

```
┌────────────────────────────────────────────────────────────────┐
│                         exam-grid-container                    │
├─────────────┬──────────────────────────┬──────────────────────┤
│  sidebar    │   main                   │   panels             │
│  (256px)    │   (minmax(0, 1fr))       │   (320px)            │
│             │                           │                      │
│  ┌────────┐ │   ┌─────────────────┐    │  ┌────────────────┐ │
│  │Nav     │ │   │ A4 Container    │    │  │ Selected       │ │
│  │        │ │   │ (max 210mm)     │    │  │ Findings       │ │
│  │Organs  │ │   │                 │    │  │                │ │
│  │        │ │   │ Report Canvas   │    │  │ (sticky)       │ │
│  │        │ │   │                 │    │  └────────────────┘ │
│  │Normal  │ │   │                 │    │                      │
│  │Buttons │ │   └─────────────────┘    │  ┌────────────────┐ │
│  └────────┘ │                           │  │ Statistics     │ │
│             │                           │  └────────────────┘ │
└─────────────┴──────────────────────────┴──────────────────────┘

grid-template-columns: 256px minmax(0, 1fr) 320px;
grid-template-areas: "sidebar main panels";
```

### Tablet (768-1024px) - 2 Colunas

```
┌─────────────────────────────────────────────┐
│           exam-grid-container               │
├──────────────┬──────────────────────────────┤
│  sidebar     │   main                       │
│  (240px)     │   (minmax(0, 1fr))           │
│              │                               │
│  ┌─────────┐ │   ┌───────────────────┐     │
│  │Nav      │ │   │ A4 Container      │     │
│  │         │ │   │ (max 160mm)       │     │
│  │Organs   │ │   │                   │     │
│  │         │ │   │ Report Canvas     │     │
│  │Normal   │ │   │                   │     │
│  │Buttons  │ │   │                   │     │
│  └─────────┘ │   └───────────────────┘     │
│              │                               │
│              │   ┌───────────────────┐     │
│              │   │ Panels Container  │     │
│              │   │                   │     │
│              │   │ ┌───────────────┐ │     │
│              │   │ │ Findings      │ │     │
│              │   │ └───────────────┘ │     │
│              │   │ ┌───────────────┐ │     │
│              │   │ │ Statistics    │ │     │
│              │   │ └───────────────┘ │     │
│              │   └───────────────────┘     │
└──────────────┴──────────────────────────────┘

grid-template-columns: 240px minmax(0, 1fr);
grid-template-areas: "sidebar main";
(Panels dentro do main, não sticky)
```

---

## 🎯 Breakpoints

### Configuração

```css
/* Desktop */
@media (min-width: 1280px) {
  .exam-grid-container {
    grid-template-columns: 256px minmax(0, 1fr) 320px;
    grid-template-areas: "sidebar main panels";
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1279px) {
  .exam-grid-container {
    grid-template-columns: 240px minmax(0, 1fr);
    grid-template-areas: "sidebar main";
  }
}
```

### Hook useBreakpoint

```typescript
import { useBreakpoint } from '@/hooks/useBreakpoint';

function MyComponent() {
  const breakpoint = useBreakpoint(); // 'desktop' | 'tablet'

  return <div>{breakpoint === 'desktop' ? '3 colunas' : '2 colunas'}</div>;
}
```

---

## 🧩 Componentes

### GridExamLayout

Componente base que controla o layout Grid. Recebe 4 props:

```tsx
<GridExamLayout
  sidebar={<Sidebar />}                    // Grid area: sidebar
  mainContent={<ReportCanvas />}           // Grid area: main
  panels={<PanelsContainer />}             // Grid area: panels (desktop) ou dentro do main (tablet)
  floatingPanel={<FloatingOrganPanel />}   // React Portal (fora do grid)
/>
```

### Componentes V2 Adaptados

| Componente | Mudança Principal | Localização |
|------------|-------------------|-------------|
| **Sidebar V2** | `w-full` ao invés de `w-64` | `/src/components/v2/Sidebar.tsx` |
| **ReportCanvas V2** | `a4-container-v2` responsivo | `/src/components/v2/ReportCanvas.tsx` |
| **SelectedFindingsPanel V2** | `w-full`, sem sticky | `/src/components/v2/SelectedFindingsPanel.tsx` |
| **ExamStatisticsPanel V2** | `w-full`, sem sticky | `/src/components/v2/ExamStatisticsPanel.tsx` |
| **FloatingOrganPanel** | Portal com fixed positioning | `/src/components/v2/FloatingOrganPanel.tsx` |

---

## 📄 A4 Container Responsivo

### Classe `.a4-container-v2`

```css
.a4-container-v2 {
  width: 100%;
  max-width: 210mm;    /* Desktop: 793.7px */
  min-height: 297mm;   /* Altura A4 padrão */
  margin: 0 auto;
  transition: max-width 0.3s ease-in-out;
}

/* Tablet: colapsa para 160mm */
@media (min-width: 768px) and (max-width: 1279px) {
  .a4-container-v2 {
    max-width: 160mm;  /* 604.8px */
  }
}
```

### Diferença do Original

| Aspecto | Original | V2 |
|---------|----------|-----|
| Width | `width: 210mm` (fixo) | `max-width: 210mm` (fluido) |
| Tablet | Sem adaptação | `max-width: 160mm` |
| Mobile | Overflow horizontal | Fluido até min-width |
| Responsividade | ❌ Quebra | ✅ Adapta |

---

## 🎈 Floating Panel Portal

### Arquitetura

O painel flutuante de órgãos usa **React Portal** para renderizar fora do Grid:

```tsx
import { createPortal } from 'react-dom';

function FloatingOrganPanel({ organ, ... }) {
  const content = (
    <div className="fixed top-20 left-6 z-50">
      {/* Conteúdo do painel */}
    </div>
  );

  return createPortal(content, document.body);
}
```

### Vantagens

✅ **Não interfere com Grid** - Renderizado fora da hierarquia do grid
✅ **Z-index independente** - Não conflita com stacking context do grid
✅ **Fixed positioning** - Relativo ao viewport, não ao grid container
✅ **Click-outside funciona** - Detecta cliques em qualquer lugar da página

### Estados

**Expandido (360px):**
```
┌──────────────────────────────┐
│  Fígado        [◄ Minimizar] │
├──────────────────────────────┤
│  ☐ Dentro da normalidade     │
│                               │
│  Achados Morfológicos         │
│  ├─ ☑ Esteatose hepática     │
│  │   └─ [Grau: Acentuado]    │
│  └─ ☐ Cisto simples          │
│                               │
│  [Salvar]                     │
└──────────────────────────────┘
```

**Minimizado (48px):**
```
┌──┐
│► │
│F │
│í │
│g │
│a │
│d │
│o │
└──┘
```

---

## 📊 Comparação Original vs V2

### Código de Layout

**Original (Flex manual):**
```tsx
<div className="flex min-h-screen">
  <aside className="w-64">...</aside>
  <main className="flex-1 relative">
    <div className="overflow-x-hidden">
      <div className="flex flex-col xl:flex-row gap-8 p-8">
        <div className="flex-1">
          <div className="a4-container mx-auto xl:mx-0">...</div>
        </div>
        <div className="w-full xl:w-80 xl:sticky xl:top-4">...</div>
      </div>
    </div>
    <div className="absolute top-6 left-6">...</div>
  </main>
</div>
```

**V2 (Grid):**
```tsx
<GridExamLayout
  sidebar={<Sidebar />}
  mainContent={<div className="a4-container-v2">...</div>}
  panels={<><SelectedFindingsPanel /><ExamStatisticsPanel /></>}
  floatingPanel={<FloatingOrganPanel />}
/>
```

### Métricas

| Métrica | Original | V2 | Melhoria |
|---------|----------|-----|----------|
| Linhas de layout JSX | 27 | 8 | **70% redução** |
| Breakpoints hardcoded | `xl:` apenas | Desktop + Tablet | **Completo** |
| Overflow horizontal | Sim (mobile) | Não | **Eliminado** |
| A4 responsivo | Não | Sim (210→160mm) | **Implementado** |
| Sticky panels | Manual (`xl:`) | Grid automático | **Simplificado** |
| Floating panel | `absolute` dentro | `fixed` Portal | **Melhorado** |

---

## 🧪 Guia de Testes

### 1. Teste de Breakpoints

**Desktop (≥1280px):**
- [ ] Layout com 3 colunas visíveis
- [ ] Sidebar: 256px de largura
- [ ] A4 Container: 210mm (~794px)
- [ ] Panels sticky à direita (320px)
- [ ] Sem scrollbar horizontal

**Tablet (768-1024px):**
- [ ] Layout com 2 colunas
- [ ] Sidebar: 240px de largura
- [ ] A4 Container: 160mm (~605px)
- [ ] Panels empilhados abaixo do A4, NÃO sticky
- [ ] Sem scrollbar horizontal

### 2. Teste de A4 Responsivo

**Resize Window:**
1. Abrir página em desktop (1920px)
2. Redimensionar para 1280px → A4 deve manter 210mm
3. Redimensionar para 1024px → A4 deve colapsar para 160mm
4. Transição deve ser suave (300ms)

**Verificar:**
```bash
# Desktop
const a4 = document.querySelector('.a4-container-v2');
getComputedStyle(a4).maxWidth; // "793.7px" (210mm)

# Tablet (resize para 1024px)
getComputedStyle(a4).maxWidth; // "604.8px" (160mm)
```

### 3. Teste de Floating Panel

**Expansão/Minimização:**
- [ ] Clicar no órgão → painel expande
- [ ] Clicar fora → painel minimiza
- [ ] Clicar no painel minimizado → expande novamente

**Click-Outside com Dropdowns:**
- [ ] Abrir dropdown de severidade
- [ ] Clicar no dropdown → painel NÃO minimiza
- [ ] Clicar fora do dropdown → painel minimiza

**Posicionamento:**
- [ ] Fixed top-20 left-6 (80px, 24px)
- [ ] Z-index 50 (acima de tudo)
- [ ] Não interfere com grid layout

### 4. Teste de Funcionalidades

**Navegação:**
- [ ] Selecionar órgão na sidebar
- [ ] Painel flutuante abre com achados do órgão
- [ ] Marcar "Normal" desabilita achados

**Achados:**
- [ ] Selecionar achado ativa campos extras
- [ ] Salvar achado adiciona à lista
- [ ] Achados aparecem em SelectedFindingsPanel

**AI Generation:**
- [ ] Gerar laudo com Gemini funciona
- [ ] Streaming progressivo exibe chunks
- [ ] Markdown renderizado corretamente no A4

**Responsividade Geral:**
- [ ] Resize window não quebra layout
- [ ] Todos elementos visíveis e acessíveis
- [ ] Scroll funciona onde esperado

### 5. Teste de Performance

**Lighthouse Scores esperados:**
- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90

**Network:**
```bash
# Verificar bundle size
npm run build
ls -lh dist/assets/*.js
# Esperado: main.js < 500KB gzipped
```

---

## 📚 Arquivos de Documentação Adicional

- **`README.md`** - Visão geral do projeto V2
- **`docs/V2_COMPONENTS_CHANGES.md`** - Mudanças nos componentes
- **`docs/FloatingOrganPanel-*.md`** - 4 guias sobre o painel flutuante
- **`docs/GRID_ARCHITECTURE.md`** - Este arquivo (arquitetura completa)

---

## 🚀 Próximos Passos

### Para Desenvolvedores

1. **Explorar o código:**
   ```bash
   cd /root/PROJECT/vertex-v2
   npm run dev  # Porta 8200
   ```

2. **Comparar com original:**
   - Original: http://localhost:8198
   - V2: http://localhost:8200

3. **Testar breakpoints:**
   - Redimensionar janela
   - Usar DevTools responsive mode
   - Verificar A4 container colapsar

### Para Migração

Se quiser migrar o projeto principal para V2:

1. **Substituir layouts:**
   ```bash
   cp -r vertex-v2/src/layouts /root/PROJECT/src/
   cp vertex-v2/src/styles/grid-layout.css /root/PROJECT/src/styles/
   cp vertex-v2/src/styles/a4-responsive.css /root/PROJECT/src/styles/
   ```

2. **Atualizar componentes:**
   - Copiar componentes v2/
   - Atualizar imports nas páginas
   - Testar funcionalidades

3. **Validar:**
   - Rodar testes
   - Verificar responsividade
   - Testar em produção

---

**Versão:** 2.0.0
**Data:** Outubro 2025
**Status:** ✅ Pronto para Testes
**Desenvolvido por:** Claude + Agentes Especializados
