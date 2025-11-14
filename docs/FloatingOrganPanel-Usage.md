# FloatingOrganPanel - Guia de Uso

## Visão Geral

O `FloatingOrganPanel` é um componente que renderiza o `OrganSection` em um painel flutuante via React Portal, com posicionamento fixo na viewport e capacidade de minimização.

## Localização

```
/root/PROJECT/vertex-v2/src/components/v2/FloatingOrganPanel.tsx
```

## Características

- ✅ **React Portal** - Renderiza fora da hierarquia DOM do grid
- ✅ **Posicionamento Fixo** - `position: fixed` relative à viewport
- ✅ **Minimização** - Reduz para barra vertical fina com texto rotacionado
- ✅ **Click-Outside Detection** - Fecha ao clicar fora (exceto dropdowns Radix UI)
- ✅ **Transições Suaves** - Animações de 300ms
- ✅ **TypeScript Completo** - Tipos seguros e auto-complete

## Props

```typescript
interface FloatingOrganPanelProps {
  /** Órgão atual selecionado (null = não renderiza) */
  organ: Organ | null;

  /** Achados selecionados para este órgão */
  selectedFindings: SelectedFinding[];

  /** Órgão marcado como normal? */
  isNormal: boolean;

  /** Painel minimizado? */
  isMinimized: boolean;

  /** Callback para alternar minimização */
  onToggleMinimized: (minimized: boolean) => void;

  /** Callback para mudanças em achados */
  onFindingChange: (
    organId: string,
    categoryId: string,
    findingId: string,
    checked: boolean,
    finding: Finding,
    severity?: string,
    instances?: FindingInstance[]
  ) => void;

  /** Callback para marcar órgão como normal */
  onNormalChange: (organId: string, isNormal: boolean) => void;

  /** Componente customizado para detalhes de achados (opcional) */
  FindingDetailsComponent?: React.ComponentType<any>;
}
```

## Exemplo de Uso Básico

```tsx
import React, { useState } from 'react';
import { FloatingOrganPanel } from '@/components/v2/FloatingOrganPanel';
import { GridExamLayout } from '@/components/v2/GridExamLayout';
import { organs } from '@/data/organs';
import type { SelectedFinding } from '@/types/report';

function AbdomenExamPage() {
  const [selectedOrganId, setSelectedOrganId] = useState<string | null>(null);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);

  // Encontrar órgão atual
  const currentOrgan = selectedOrganId
    ? organs.find(o => o.id === selectedOrganId) || null
    : null;

  // Filtrar achados do órgão atual
  const currentOrganFindings = selectedFindings.filter(
    sf => sf.organId === selectedOrganId
  );

  // Órgão é normal?
  const isCurrentOrganNormal = selectedOrganId
    ? normalOrgans.includes(selectedOrganId)
    : false;

  // Handler: selecionar órgão
  const handleOrganClick = (organId: string) => {
    setSelectedOrganId(organId);
    setIsPanelMinimized(false); // Expande ao selecionar
  };

  // Handler: mudança em achados
  const handleFindingChange = (
    organId: string,
    categoryId: string,
    findingId: string,
    checked: boolean,
    finding: Finding,
    severity?: string,
    instances?: FindingInstance[]
  ) => {
    if (checked) {
      // Adicionar achado
      setSelectedFindings(prev => [
        ...prev,
        {
          organId,
          categoryId,
          findingId,
          finding,
          severity,
          instances
        }
      ]);
    } else {
      // Remover achado
      setSelectedFindings(prev =>
        prev.filter(sf => !(sf.organId === organId && sf.findingId === findingId))
      );
    }
  };

  // Handler: marcar órgão como normal
  const handleNormalChange = (organId: string, isNormal: boolean) => {
    if (isNormal) {
      // Adicionar aos normais e remover achados
      setNormalOrgans(prev => [...prev, organId]);
      setSelectedFindings(prev => prev.filter(sf => sf.organId !== organId));
    } else {
      // Remover dos normais
      setNormalOrgans(prev => prev.filter(id => id !== organId));
    }
  };

  return (
    <GridExamLayout
      sidebar={
        <Sidebar
          organs={organs}
          selectedOrganId={selectedOrganId}
          normalOrgans={normalOrgans}
          onOrganClick={handleOrganClick}
          onQuickNormal={(organId) => handleNormalChange(organId, true)}
        />
      }
      main={
        <ReportCanvas
          selectedFindings={selectedFindings}
          normalOrgans={normalOrgans}
        />
      }
      panels={
        <>
          <SelectedFindingsPanel findings={selectedFindings} />
          <ExamStatisticsPanel
            findingsCount={selectedFindings.length}
            organsWithFindings={new Set(selectedFindings.map(sf => sf.organId)).size}
            normalOrgansCount={normalOrgans.length}
          />
        </>
      }
      floatingPanel={
        <FloatingOrganPanel
          organ={currentOrgan}
          selectedFindings={currentOrganFindings}
          isNormal={isCurrentOrganNormal}
          isMinimized={isPanelMinimized}
          onToggleMinimized={setIsPanelMinimized}
          onFindingChange={handleFindingChange}
          onNormalChange={handleNormalChange}
        />
      }
    />
  );
}
```

## Exemplo com Componente Customizado (Carótidas)

```tsx
import { FloatingOrganPanel } from '@/components/v2/FloatingOrganPanel';
import { CarotidFindingDetails } from '@/components/CarotidFindingDetails';

<FloatingOrganPanel
  organ={currentOrgan}
  selectedFindings={currentOrganFindings}
  isNormal={isCurrentOrganNormal}
  isMinimized={isPanelMinimized}
  onToggleMinimized={setIsPanelMinimized}
  onFindingChange={handleFindingChange}
  onNormalChange={handleNormalChange}
  FindingDetailsComponent={CarotidFindingDetails} // Custom component
/>
```

## Comportamento

### Estado Expandido
- Largura: `360px`
- Altura máxima: `calc(100vh - 120px)`
- Renderiza `OrganSection` completo
- Botão minimizar no canto superior direito (ícone `CaretLeft`)

### Estado Minimizado
- Largura: `48px`
- Exibe nome do órgão em texto vertical
- Ícone `CaretRight` no topo
- Clique em qualquer lugar expande

### Click-Outside Detection
O painel minimiza automaticamente ao clicar fora, **EXCETO** quando clicar em:
- `[data-radix-portal]` - Portais Radix UI
- `[data-state="open"]` - Elementos abertos
- `[role="listbox"]` - Listboxes
- `[role="dialog"]` - Diálogos
- `[data-radix-popper-content-wrapper]` - Conteúdo Popper

Isso evita que o painel feche ao interagir com dropdowns e selects.

## Posicionamento

```css
position: fixed;
top: 20px;      /* 5rem = 80px */
left: 24px;     /* 6rem = 96px */
z-index: 50;
```

- **Fixed**: Relativo à viewport (não ao grid)
- **Top 20**: Espaço para header
- **Left 6**: Pequeno padding da borda
- **Z-index 50**: Acima do conteúdo principal

## Estilo Visual

- Background: `bg-card` (tema)
- Border: `border-border` (tema)
- Shadow: `shadow-2xl` (Tailwind)
- Backdrop: `backdrop-blur-sm` (efeito vidro)
- Transição: `transition-all duration-300`

## CSS Vertical Text

O CSS necessário está em `/root/PROJECT/vertex-v2/src/styles/grid-layout.css`:

```css
.writing-mode-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
```

## Integração com GridExamLayout

O `GridExamLayout` aceita uma prop `floatingPanel` que renderiza fora do grid:

```tsx
<GridExamLayout
  sidebar={...}
  main={...}
  panels={...}
  floatingPanel={
    <FloatingOrganPanel ... />
  }
/>
```

O painel flutuante **não afeta** o layout CSS Grid, pois está em um Portal React.

## Vantagens sobre Painel In-Grid

| Aspecto | In-Grid | Floating (Portal) |
|---------|---------|-------------------|
| Posicionamento | Relativo ao grid | Fixo na viewport |
| Z-index | Dentro do fluxo | Acima de tudo |
| Scrolling | Scroll com grid | Independente |
| Responsivo | Afeta grid layout | Não afeta grid |
| Overlay | Impossível | Possível |

## Troubleshooting

### Painel não aparece
- Verifique se `organ` não é `null`
- Confirme que o Portal está renderizando no `document.body`

### Painel fecha ao clicar em dropdown
- Verifique se o dropdown tem `[data-radix-portal]`
- Adicione seletores customizados no `handleClickOutside` se necessário

### Texto vertical não funciona
- Confirme que `grid-layout.css` está importado
- Verifique se a classe `.writing-mode-vertical` está aplicada

### Painel fica atrás de outros elementos
- Aumente o `z-index` (padrão: 50)
- Verifique se outros elementos não têm `z-index` maior

## Dependências

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@phosphor-icons/react": "^2.0.0"
}
```

## Arquivos Relacionados

- Component: `/root/PROJECT/vertex-v2/src/components/v2/FloatingOrganPanel.tsx`
- CSS: `/root/PROJECT/vertex-v2/src/styles/grid-layout.css`
- Layout: `/root/PROJECT/vertex-v2/src/components/v2/GridExamLayout.tsx`
- Tipos: `/root/PROJECT/vertex-v2/src/types/report.ts`

## Próximos Passos

1. Integrar no `AbdomenTotalExamV2.tsx`
2. Integrar no `CarotidExamV2.tsx`
3. Adicionar testes de renderização portal
4. Implementar persistência do estado minimizado (localStorage)
