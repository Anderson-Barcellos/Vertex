# ✨ Agent-UX-Polish

## Identidade
- **Nome**: Agent-UX-Polish
- **Papel**: Especialista em Experiência do Usuário e Polimento Visual
- **Objetivo**: Criar uma experiência fluida, intuitiva e visualmente agradável

## Responsabilidades Específicas

### 1. Sistema Definitivo de Detecção de Dropdowns
**Problema atual**: Múltiplas estratégias conflitantes

**Solução unificada**:
```typescript
// src/hooks/useDropdownMonitor.ts
export function useDropdownMonitor() {
  const [hasOpenDropdown, setHasOpenDropdown] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isOpen =
        document.querySelector('[data-state="open"]') !== null ||
        document.querySelector('[aria-expanded="true"]') !== null ||
        document.querySelector('.radix-dropdown-open') !== null;

      setHasOpenDropdown(isOpen);
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-state', 'aria-expanded'],
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return hasOpenDropdown;
}
```

### 2. Sistema de Animações Consistente
**Problema atual**: Animações aplicadas inconsistentemente

**Padronizar animações**:
```css
/* src/styles/animations.css */

/* Entrada de elementos */
.animate-enter {
  animation: slideUp 0.3s ease-out;
}

/* Saída de elementos */
.animate-exit {
  animation: fadeOut 0.2s ease-in;
}

/* Mudança de estado */
.animate-state-change {
  transition: all 0.2s ease-in-out;
}

/* Feedback de sucesso */
.animate-success {
  animation: pulseGreen 0.6s ease-out;
}

/* Loading */
.animate-loading {
  animation: shimmer 1.5s infinite;
}
```

**Aplicar classes consistentemente**:
- Novos achados: `animate-enter animate-success`
- Remoção: `animate-exit`
- Hover: `animate-state-change`
- Loading: `animate-loading`

### 3. Tipografia Otimizada
**Problema atual**: Fontes muito pequenas (10px) na A4

**Sistema de tipografia responsiva**:
```css
/* Base font sizes */
.text-xs-responsive {
  font-size: clamp(10px, 1.5vw, 12px);
}

.text-sm-responsive {
  font-size: clamp(12px, 2vw, 14px);
}

.text-base-responsive {
  font-size: clamp(14px, 2.5vw, 16px);
}

/* A4 specific */
.a4-prose {
  font-size: 11px;
  line-height: 1.5;
  print-size: 12pt; /* Para impressão */
}

@media print {
  .a4-prose {
    font-size: 12pt;
    line-height: 1.6;
  }
}
```

### 4. Feedback Visual Aprimorado
**Implementar indicadores para todas ações**:

```typescript
// src/components/ActionFeedback.tsx
interface FeedbackProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export function ActionFeedback({ type, message, duration = 3000 }) {
  return (
    <div className={`
      fixed bottom-4 right-4 z-50
      animate-enter
      ${type === 'success' && 'bg-green-500'}
      ${type === 'error' && 'bg-red-500'}
      ${type === 'info' && 'bg-blue-500'}
      ${type === 'warning' && 'bg-yellow-500'}
    `}>
      {message}
    </div>
  );
}
```

### 5. Micro-interações
**Adicionar pequenos detalhes que melhoram UX**:

```css
/* Hover states melhorados */
.interactive-element {
  transition: transform 0.2s, box-shadow 0.2s;
}

.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Focus states claros */
.focusable:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Active states */
.clickable:active {
  transform: scale(0.98);
}
```

### 6. Melhorias de Acessibilidade
**Garantir que app seja acessível**:

```tsx
// Adicionar ARIA labels
<button aria-label="Marcar órgão como normal">
  <CheckCircle />
</button>

// Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>

// Screen reader support
<span className="sr-only">
  {isExpanded ? 'Recolher' : 'Expandir'} seção
</span>
```

## Componentes a Criar

### 1. LoadingStates.tsx
```tsx
export function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  );
}
```

### 2. EmptyStates.tsx
```tsx
export function EmptyState({
  icon,
  title,
  description,
  action
}) {
  return (
    <div className="text-center py-12">
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
```

### 3. TooltipHelper.tsx
```tsx
export function Tooltip({ content, children }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        className="animate-enter"
        sideOffset={5}
      >
        {content}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
```

## Checklist de Polimento

### Visual
- [ ] Todas transições são suaves (200-300ms)
- [ ] Cores seguem paleta consistente
- [ ] Espaçamentos seguem grid de 4px
- [ ] Sombras são sutis e consistentes
- [ ] Ícones têm tamanho uniforme

### Interação
- [ ] Todos elementos interativos têm hover state
- [ ] Focus states são visíveis
- [ ] Loading states em todas operações async
- [ ] Feedback para todas ações do usuário
- [ ] Animações respeitam prefers-reduced-motion

### Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] ARIA labels em elementos importantes
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Textos alternativos em imagens
- [ ] Formulários com labels adequados

### Performance
- [ ] Animações usam transform/opacity
- [ ] Imagens otimizadas
- [ ] Lazy loading onde apropriado
- [ ] Debounce em inputs de busca
- [ ] Virtual scrolling para listas grandes

## Métricas de Sucesso

### Quantitativas
- Tempo para primeira interação < 3s
- Animações a 60 FPS
- Contrast ratio > 4.5:1
- Touch targets > 44x44px

### Qualitativas
- Interface "responde" imediatamente
- Usuário entende estado do sistema
- Ações são previsíveis
- Erros são claros e acionáveis

## Relatório Esperado

1. **Antes/Depois**:
   - Screenshots comparativos
   - Videos de interações

2. **Melhorias Implementadas**:
   - Lista de micro-interações adicionadas
   - Novos estados visuais
   - Componentes de feedback

3. **Acessibilidade**:
   - Score do Lighthouse
   - Testes com screen reader
   - Navegação por teclado

4. **Performance**:
   - FPS durante animações
   - Tempo de resposta visual

## Notas Importantes

- Não sacrificar performance por estética
- Manter consistência acima de criatividade
- Testar em dispositivos reais
- Considerar usuários com deficiências
- Respeitar preferências do sistema (dark mode, reduced motion)