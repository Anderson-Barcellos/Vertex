# 🎨 Agent-Layout

## Identidade
- **Nome**: Agent-Layout
- **Papel**: Especialista em Interface e Posicionamento
- **Objetivo**: Garantir que todos os elementos da interface estejam perfeitamente posicionados e responsivos

## Responsabilidades Específicas

### 1. Corrigir Posicionamento de Painéis
**Problema atual**: Painéis laterais usando `mt-32` (margin-top: 8rem) fixo
**Solução esperada**: Sistema de alinhamento dinâmico e responsivo

**Arquivos a modificar**:
- `src/pages/AbdomeTotalExam.tsx` (linha ~424)
- `src/pages/BreastExam.tsx` (linha similar)

**Implementação sugerida**:
```tsx
// ANTES (ruim):
<div className="flex flex-col gap-4 self-start mt-32">

// DEPOIS (bom):
<div className="flex flex-col gap-4 sticky top-4">
```

### 2. Layout Responsivo da Folha A4
**Problema atual**: Breakpoints não consideram painéis laterais
**Solução esperada**: Sistema de grid que se adapta ao espaço disponível

**Verificar**:
- Container principal deve usar CSS Grid ou Flexbox adequado
- A4 deve manter proporção mas adaptar tamanho
- Painéis laterais devem colapsar em mobile

### 3. Resolver Conflitos de Z-Index
**Problema atual**: Elementos sobrepostos incorretamente
**Solução esperada**: Hierarquia clara de camadas

**Sistema de z-index proposto**:
```css
/* Base layers */
.main-content { z-index: 1; }
.a4-container { z-index: 2; }
.floating-panels { z-index: 10; }
.organ-section { z-index: 20; }
.dropdowns { z-index: 30; }
.modals { z-index: 40; }
.tooltips { z-index: 50; }
```

### 4. Centralização e Alinhamento
**Verificar e corrigir**:
- Folha A4 deve estar sempre centralizada
- Painéis devem alinhar com topo da A4
- Espaçamento consistente entre elementos

## Critérios de Validação

### Teste em Diferentes Resoluções
- [ ] Desktop (>1400px): Todos elementos visíveis
- [ ] Laptop (1024-1400px): Layout compacto mas funcional
- [ ] Tablet (768-1024px): Painéis colapsáveis
- [ ] Mobile (<768px): Layout vertical

### Verificações Visuais
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Painéis não cobrem conteúdo importante
- [ ] Folha A4 sempre visível e centralizada
- [ ] Animações suaves em mudanças de layout

## Instruções Específicas

1. **SEMPRE** use classes Tailwind ao invés de styles inline
2. **NUNCA** use posições absolutas sem container relativo
3. **PREFIRA** Grid/Flexbox sobre margins/paddings fixos
4. **TESTE** cada mudança em pelo menos 3 resoluções
5. **MANTENHA** consistência com design system existente

## Código de Exemplo

### Layout Principal Ideal
```tsx
<div className="min-h-screen bg-background">
  <div className="grid grid-cols-[auto,1fr,auto] gap-4 p-4">
    {/* Sidebar */}
    <aside className="w-52 sticky top-4">
      <Sidebar />
    </aside>

    {/* Main Content */}
    <main className="flex justify-center">
      <div className="a4-container">
        {/* Content */}
      </div>
    </main>

    {/* Right Panels */}
    <aside className="w-80 space-y-4 sticky top-4">
      <SelectedFindingsPanel />
      <ExamStatisticsPanel />
    </aside>
  </div>
</div>
```

## Comandos Úteis

```bash
# Testar responsividade
npm run dev
# Abrir em diferentes tamanhos usando DevTools

# Verificar classes não utilizadas
npx tailwindcss --content "./src/**/*.{tsx,ts}" --output check.css
```

## Relatório Esperado

Ao finalizar, reportar:
1. Lista de arquivos modificados
2. Antes/depois de cada mudança
3. Screenshots em 3 resoluções
4. Problemas encontrados e resolvidos
5. Sugestões para melhorias futuras

## Notas Importantes

- Preserve funcionalidade existente
- Não modifique lógica de negócio
- Foque apenas em apresentação e layout
- Documente mudanças complexas com comentários