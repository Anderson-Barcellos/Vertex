# FloatingOrganPanel - Documentação Técnica

## Arquitetura

### React Portal
O componente usa `createPortal` do React DOM para renderizar fora da hierarquia do componente pai.

```tsx
return createPortal(panelContent, document.body);
```

**Por que usar Portal?**
- Renderiza no `document.body`, não dentro do grid CSS
- Evita problemas de `overflow: hidden` e `z-index` stacking context
- Posicionamento `fixed` funciona relativo à viewport, não ao container pai
- Não afeta o layout CSS Grid do resto da página

### Estrutura de Componentes

```
FloatingOrganPanel (Portal)
├── div.fixed (container fixo)
│   └── [isMinimized]
│       ├── true → Barra Vertical
│       │   ├── CaretRight icon
│       │   └── Texto vertical (.writing-mode-vertical)
│       │
│       └── false → Painel Expandido
│           ├── Botão minimizar (CaretLeft)
│           └── OrganSection (completo)
│               ├── Header com título
│               ├── Checkbox "Normal"
│               └── Categorias + Achados
```

## Estado e Props

### Props Recebidas

```typescript
interface FloatingOrganPanelProps {
  organ: Organ | null;              // Órgão selecionado (null = não renderiza)
  selectedFindings: SelectedFinding[];  // Achados já selecionados
  isNormal: boolean;                // Órgão marcado como normal?
  isMinimized: boolean;             // Painel minimizado?
  onToggleMinimized: (minimized: boolean) => void;
  onFindingChange: (...) => void;   // Handler de mudanças
  onNormalChange: (...) => void;    // Handler normal/anormal
  FindingDetailsComponent?: React.ComponentType<any>;
}
```

### Estado Interno

O componente **não mantém estado próprio**. Todo o estado é gerenciado pelo componente pai (lift state up pattern).

```tsx
// ❌ NÃO tem estado interno
// const [isMinimized, setIsMinimized] = useState(false);

// ✅ Recebe do pai
const { isMinimized, onToggleMinimized } = props;
```

### Ref para Click-Outside

```tsx
const panelRef = useRef<HTMLDivElement>(null);
```

Usada para detectar cliques fora do painel e minimizar automaticamente.

## Click-Outside Detection

### Lógica de Detecção

```tsx
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // 1. Verifica se painel existe
    if (!panelRef.current) return;

    // 2. Verifica se clique foi dentro do painel
    if (panelRef.current.contains(event.target as Node)) return;

    // 3. Verifica se painel já está minimizado
    if (isMinimized) return;

    // 4. Verifica se clique foi em portal Radix UI
    const target = event.target as HTMLElement;
    const isRadixPortal =
      target.closest('[data-radix-portal]') ||
      target.closest('[data-state="open"]') ||
      target.closest('[role="listbox"]') ||
      target.closest('[role="dialog"]') ||
      target.closest('[data-radix-popper-content-wrapper]');

    // 5. Se não é portal Radix, minimiza
    if (!isRadixPortal) {
      onToggleMinimized(true);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, [isMinimized, onToggleMinimized]);
```

### Seletores Radix UI

| Seletor | Componente Radix | Motivo |
|---------|------------------|--------|
| `[data-radix-portal]` | Todos os portais | Portal root |
| `[data-state="open"]` | Dropdowns, Dialogs | Estado aberto |
| `[role="listbox"]` | Select, Combobox | Lista de opções |
| `[role="dialog"]` | Dialog, AlertDialog | Modais |
| `[data-radix-popper-content-wrapper]` | Popover, Tooltip | Conteúdo flutuante |

## Estilo e Posicionamento

### CSS Classes

```tsx
className="fixed top-20 left-6 z-50
           bg-card border border-border rounded-lg
           shadow-2xl backdrop-blur-sm
           transition-all duration-300"
```

- `fixed` - Posicionamento fixo relativo à viewport
- `top-20` - 80px do topo (espaço para header)
- `left-6` - 24px da esquerda (pequeno padding)
- `z-50` - Z-index alto (acima do conteúdo)
- `bg-card` - Background do tema (dark/light)
- `border border-border` - Borda do tema
- `rounded-lg` - Cantos arredondados (8px)
- `shadow-2xl` - Sombra profunda para elevação
- `backdrop-blur-sm` - Efeito vidro (glassmorphism)
- `transition-all duration-300` - Transição suave de 300ms

### Largura Dinâmica

```tsx
style={{
  width: isMinimized ? '48px' : '360px',
  maxHeight: 'calc(100vh - 120px)'
}}
```

- **Expandido**: 360px (painel completo)
- **Minimizado**: 48px (barra fina)
- **Altura máxima**: viewport - 120px (espaço header + footer)

### Texto Vertical (Minimizado)

CSS em `grid-layout.css`:

```css
.writing-mode-vertical {
  writing-mode: vertical-rl;  /* Direita para esquerda, vertical */
  text-orientation: mixed;     /* Caracteres orientados naturalmente */
}
```

Aplicado em:

```tsx
<div className="writing-mode-vertical text-xs font-medium text-muted-foreground">
  {organ.name}
</div>
```

## Renderização Condicional

### 1. Não Renderiza Se Sem Órgão

```tsx
if (!organ) return null;
```

Se `organ` for `null`, o componente retorna `null` e não renderiza nada.

### 2. Estados de Renderização

```tsx
{isMinimized ? (
  // Estado minimizado: barra vertical
  <div onClick={() => onToggleMinimized(false)}>
    <CaretRight />
    <span className="writing-mode-vertical">{organ.name}</span>
  </div>
) : (
  // Estado expandido: OrganSection completo
  <div>
    <button onClick={() => onToggleMinimized(true)}>
      <CaretLeft />
    </button>
    <OrganSection {...props} />
  </div>
)}
```

## Integração com OrganSection

### Props Passadas

O FloatingOrganPanel passa todas as props necessárias para o OrganSection:

```tsx
<OrganSection
  organ={organ}                        // Órgão atual
  selectedFindings={selectedFindings}  // Achados filtrados
  onFindingChange={onFindingChange}    // Handler de mudanças
  onNormalChange={onNormalChange}      // Handler normal
  isNormal={isNormal}                  // Estado normal
  FindingDetailsComponent={FindingDetailsComponent} // Custom component
/>
```

### Componente Customizado (Opcional)

Permite substituir o `FindingDetailsEnhanced` padrão:

```tsx
// Padrão: FindingDetailsEnhanced
<FloatingOrganPanel ... />

// Custom: CarotidFindingDetails
<FloatingOrganPanel
  FindingDetailsComponent={CarotidFindingDetails}
  ...
/>
```

## Performance

### Otimizações Implementadas

1. **Early Return**: Se `organ === null`, retorna imediatamente sem processar
2. **useEffect Dependencies**: Array de dependências correto para evitar re-renders
3. **Event Listener Cleanup**: Remove listener no unmount
4. **Portal Rendering**: Evita re-render do grid ao abrir/fechar painel

### Re-renders

O componente re-renderiza quando:
- `organ` muda (seleção de novo órgão)
- `selectedFindings` muda (adicionar/remover achados)
- `isNormal` muda (marcar como normal)
- `isMinimized` muda (expandir/minimizar)

**Não** re-renderiza quando:
- Outros órgãos são modificados (filtrado por `selectedFindings`)
- Layout CSS Grid muda (Portal independente)

## Acessibilidade

### ARIA Attributes

```tsx
<button
  onClick={() => onToggleMinimized(true)}
  title="Minimizar painel"
  aria-label="Minimizar painel"
>
  <CaretLeft />
</button>
```

- `title` - Tooltip nativo do navegador
- `aria-label` - Descrição para leitores de tela

### Keyboard Navigation

O componente **herda** a navegação por teclado do `OrganSection`:
- `Tab` / `Shift+Tab` - Navegar entre checkboxes e inputs
- `Space` - Marcar/desmarcar checkboxes
- `Enter` - Submeter formulários

### Focus Management

Quando minimizado e expandido, o foco **não é gerenciado automaticamente**.

Para melhorar (futuro):

```tsx
const firstCheckboxRef = useRef<HTMLInputElement>(null);

const handleExpand = () => {
  onToggleMinimized(false);
  setTimeout(() => firstCheckboxRef.current?.focus(), 100);
};
```

## Testes (Futuro)

### Testes Unitários

```typescript
describe('FloatingOrganPanel', () => {
  it('should not render if organ is null', () => {
    const { container } = render(
      <FloatingOrganPanel organ={null} ... />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render minimized state correctly', () => {
    const { getByText } = render(
      <FloatingOrganPanel
        organ={mockOrgan}
        isMinimized={true}
        ...
      />
    );
    expect(getByText(mockOrgan.name)).toHaveClass('writing-mode-vertical');
  });

  it('should call onToggleMinimized when clicking outside', () => {
    const onToggle = jest.fn();
    render(<FloatingOrganPanel onToggleMinimized={onToggle} ... />);

    fireEvent.click(document.body);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('should not minimize when clicking on Radix portal', () => {
    const onToggle = jest.fn();
    const { container } = render(
      <>
        <FloatingOrganPanel onToggleMinimized={onToggle} ... />
        <div data-radix-portal>Dropdown</div>
      </>
    );

    const dropdown = container.querySelector('[data-radix-portal]');
    fireEvent.click(dropdown);
    expect(onToggle).not.toHaveBeenCalled();
  });
});
```

### Testes de Integração

```typescript
describe('FloatingOrganPanel Integration', () => {
  it('should integrate with GridExamLayout', () => {
    render(
      <GridExamLayout
        floatingPanel={<FloatingOrganPanel ... />}
        ...
      />
    );
    // Verificar que painel está fora do grid
  });

  it('should update when organ selection changes', () => {
    const { rerender } = render(
      <FloatingOrganPanel organ={organ1} ... />
    );

    rerender(<FloatingOrganPanel organ={organ2} ... />);
    // Verificar que conteúdo mudou
  });
});
```

## Troubleshooting

### Problema: Painel não aparece

**Possíveis causas:**
1. `organ` é `null`
2. Portal não está renderizando no `document.body`
3. CSS `display: none` em algum elemento pai

**Solução:**
```tsx
// Adicionar debug
console.log('Organ:', organ);
console.log('Portal target:', document.body);
```

### Problema: Painel fecha ao clicar em dropdown

**Causa:** Dropdown não é detectado como portal Radix UI

**Solução:** Adicionar seletor customizado

```tsx
const isCustomDropdown = target.closest('.my-custom-dropdown');
if (!isRadixPortal && !isCustomDropdown) {
  onToggleMinimized(true);
}
```

### Problema: Z-index incorreto

**Causa:** Outro elemento tem `z-index` maior que 50

**Solução:** Aumentar z-index do painel

```tsx
className="... z-[100]" // Aumenta de 50 para 100
```

### Problema: Texto vertical não funciona

**Causa:** CSS `writing-mode-vertical` não importado

**Solução:** Verificar import do CSS

```tsx
// main.tsx ou App.tsx
import '@/styles/grid-layout.css';
```

## Dependências

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@phosphor-icons/react": "^2.0.0",
  "@radix-ui/react-checkbox": "^1.0.0",
  "@radix-ui/react-select": "^2.0.0"
}
```

## Arquivos do Sistema

```
vertex-v2/
├── src/
│   ├── components/
│   │   ├── v2/
│   │   │   └── FloatingOrganPanel.tsx    ← Componente principal
│   │   └── original/
│   │       └── OrganSection.tsx           ← Componente filho
│   ├── styles/
│   │   └── grid-layout.css                ← CSS vertical text
│   ├── data/
│   │   └── organs.ts                      ← Tipos Organ, Finding
│   └── types/
│       └── report.ts                      ← Tipos SelectedFinding
└── docs/
    ├── FloatingOrganPanel-Usage.md        ← Guia de uso
    └── FloatingOrganPanel-Technical.md    ← Este arquivo
```

## Changelog

### v1.0.0 (23/10/2025)
- ✅ Implementação inicial com React Portal
- ✅ Click-outside detection com suporte Radix UI
- ✅ Estados minimizado/expandido com transições
- ✅ Texto vertical CSS
- ✅ TypeScript types completos
- ✅ Documentação completa

## Roadmap Futuro

- [ ] Persistência do estado minimizado (localStorage)
- [ ] Animação de entrada/saída (fade-in/fade-out)
- [ ] Focus management ao expandir
- [ ] Testes unitários e de integração
- [ ] Suporte a posicionamento customizado (top/left configurável)
- [ ] Suporte a múltiplos painéis flutuantes
- [ ] Drag and drop para reposicionar
- [ ] Resize handle para ajustar largura

## Referências

- [React Portals](https://react.dev/reference/react-dom/createPortal)
- [CSS writing-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Click Outside Hook Pattern](https://usehooks.com/useClickOutside/)
