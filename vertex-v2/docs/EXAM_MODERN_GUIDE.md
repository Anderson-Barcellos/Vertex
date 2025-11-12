# Guia Rápido — Modern Exam Layout

Este guia mostra como criar novas páginas de exame usando o layout moderno compartilhado, garantindo consistência visual e evitando que dropdowns fiquem atrás do painel flutuante.

## Componentes

- `src/layouts/ModernExamLayout.tsx`: Shell com slots `header`, `sidebar`, `main`, `panels`, `floatingPanel`.
- `src/components/shared/FloatingOrganPanelModern.tsx`: Painel flutuante com portal, `organ-section-panel`, guarda de dropdown e dismiss por clique externo.
- Hooks: `useDropdownGuard`, `useOutsidePointerDismiss`.

## Z-Index

Tokens em `src/styles/layout.css`:
- `--z-base`, `--z-content`, `--z-floating`, `--z-dropdown`, `--z-modal`.
As regras em `src/styles/animations.css` usam estes tokens. Portais Radix ficam com `--z-dropdown` (com `!important`).

## Scrollbar

Classe `modern-scrollbar` em `src/styles/modern-design.css` aplica thumb roxa e cantos arredondados. O scroll deve estar no mesmo elemento que tem `max-height` para crescer até o limite e só então mostrar a barra.

## Checklist de criação

1. Criar a página a partir de `src/pages/modern/ExamTemplateModern.example.tsx`.
2. Passar `organsList`, rótulos de exame e `FindingDetailsComponent` quando necessário.
3. Garantir `FloatingOrganPanelModern` com `organ-section-panel` e `maxHeight` adequado.
4. Verificar dropdowns Radix sobrepondo o painel.
5. Validar minimizar/expandir do painel com dropdown aberto (não deve minimizar).
6. Conferir scrollbar roxa visível somente após atingir o limite de altura.

