# Troubleshooting — Vertex V2

## Erros comuns

### Identifier 'X' has already been declared
Causa: import duplicado do mesmo símbolo em um módulo.
Ação: remova a linha duplicada e faça hard refresh (Ctrl/Cmd+Shift+R).

### Dropdown/Select atrás do painel flutuante
Causa: painel com z-index alto (ex.: `z-50`) ou ausência de `organ-section-panel`.
Ação: use `organ-section-panel` no painel e deixe portais Radix com z-index `--z-dropdown` (padronizado em `animations.css`).

### Scrollbar não aparece quando o conteúdo cresce
Causa: `overflow` aplicado no elemento errado.
Ação: coloque `overflow-y-auto modern-scrollbar` no MESMO elemento que tem `max-height`.

### Favicon 404
Causa: navegador solicitando `/favicon.ico` quando não há link explícito.
Ação: garanta `<link rel="icon" href="/favicon.svg" />` no `index.html` (já aplicado).

### HMR não reflete mudança
Causa: grafo do Vite com estado sujo após erro de módulo.
Ação: hard refresh; se persistir, pare e suba `npm run dev` novamente.

## Portas/Serviço
- Dev server: 8200. Verifica com `ss -ltnp | grep :8200`.
- Logs (quando rodando com nohup): `/tmp/vertex-v2.dev.log`.

## Backup
Snapshots em `backups/`. Exemplo: `backups/vertex-v2-20251104-153836.tar.gz`.

