# Auditoria Técnica – Vertex V2 (22 jan 2026)

## 1. Sumário Executivo
- Arquitetura moderna (React 19 + Vite + Tailwind) com catálogos clínicos ricos e automações (BI-RADS, TI-RADS, NASCET).
- Fluxo centralizado via `BaseExamPage` e catálogos por exame; UX com painel flutuante facilita múltiplos achados.
- Pontos fortes: profundidade clínica em carótidas/mama/tireoide; calculadoras embutidas; layout consistente.
- Achados críticos: tipagem quebrada (tsc falha), `FindingMeasurement` inflado/inconsistente, cancelamento de IA inefetivo, autenticação client-side com credenciais no bundle, dependências de UI faltantes.
- Recomendação geral: estabilizar tipagem/segurança primeiro, depois ampliar automações Doppler e padronizar léxicos.

## 2. Análise Arquitetural
- Padrão: SPA com roteamento protegido; dados médicos em `src/data/*`, serviços IA separados, `BaseExamPage` + configs por modalidade.
- Modularização: boa separação data/serviços/UI; porém campos/lexicons duplicados em vários exames apesar de `data/shared`.
- Escalabilidade: adicionar exames é simples, mas a tipagem frágil pode gerar regressões.
- Acoplamento: componentes dependem fortemente do tipo genérico `FindingMeasurement`; falta camada de domínio por exame.
- Layout: `ModernExamLayout` responsivo desktop; `ResolutionGuard` bloqueia <1230px (sem fallback mobile).

## 3. Análise por Módulo de Exame
- CarotidExam — Completude ⭐⭐⭐⭐⭐; Terminologia ⭐⭐⭐⭐⭐; Fluxo bom; Doppler muito detalhado; Automação ⭐⭐⭐⭐☆ (NASCET, risco de placa); Consistência alta, poderia importar mais de `shared`.
- ThyroidExam — Completude ⭐⭐⭐⭐☆; Terminologia ⭐⭐⭐⭐⭐ (ACR); Fluxo claro com TI-RADS panel; Doppler básico; Automação ⭐⭐⭐⭐☆ (TI-RADS, volume); Consistência boa.
- BreastExam — Completude ⭐⭐⭐⭐☆; Terminologia ⭐⭐⭐⭐⭐ (BI-RADS); Fluxo com calculadora e validação; Doppler presente; Automação ⭐⭐⭐⭐☆; Consistência boa mas tipagem quebrada.
- ArterialExam — Completude ⭐⭐⭐☆; Terminologia ⭐⭐⭐⭐☆ (Fontaine/WIfI); Fluxo manual; Doppler limitado; Automação ⭐⭐☆☆☆ (nenhuma); Consistência média.
- VenousExam — Completude ⭐⭐⭐☆; Terminologia ⭐⭐⭐☆ (CEAP/VCSS duplicados); Fluxo manual; Doppler superficial; Automação ⭐⭐☆☆☆; Consistência baixa (não usa `shared`).
- Abdome — Completude ⭐⭐⭐☆; Terminologia ⭐⭐⭐⭐☆; Doppler ausente; Automação ⭐⭐☆☆☆.

## 4. Achados Críticos (ALTA)
1. Tipagem quebrada: `FindingMeasurement` carece de campos usados em mama/tireoide; tsc falha com dezenas de erros. Locais: `src/types/report.ts`, `BreastUltrasoundFindingDetails.tsx`, `ThyroidFindingDetails.tsx`.
2. Dependências/tipos de UI ausentes e `AIModelSelector` sem provider Claude na config → tsc falha. Locais: `src/components/shared/AIModelSelector.tsx`, `src/components/ui/*.tsx`.
3. Cancelamento de IA inefetivo: AbortController não é passado aos fetches de streaming. Locais: `src/services/unifiedAIService.ts`, `geminiStreamService.ts`, `openaiStreamService.ts`, `claudeStreamService.ts`.
4. Autenticação insegura: credenciais em bundle, sem backend. Local: `src/contexts/AuthContext.tsx`.
5. Default de modelo IA inconsistente: inicia em 'claude' (nem sempre configurado), risco de erro silencioso. Local: `src/components/original/SelectedFindingsPanel.tsx`.

## 5. Oportunidades de Melhoria
- Alta: Refatorar `FindingMeasurement` em uniões discriminadas por domínio; remover campos deprecated; alinhar componentes.  
− Alta: Unificar léxicos/observações via `data/shared` (CEAP, WIfI, refluxo, localização mama/tireoide).  
− Alta: Calculadoras automáticas ITB/IDB/WIfI e estenose periférica por PSV/VR.  
- Média: Validar ranges numéricos em tempo real; especializar prompts por exame; memoizar/virtualizar listas.  
- Baixa: Resolver warnings de container queries na build; manualChunks para reduzir bundle >500 kB.

## 6. Considerações Técnicas
- TypeScript: `npx tsc --noEmit` falhou (campos faltantes, deps não instaladas, readonly arrays).  
- Estado/persistência: `useAutoSave` em localStorage (1h) — dados sensíveis podem permanecer.  
- Performance: bundle 929 kB gz 259 kB; sem code splitting por rota.  
- Segurança: CORS amplo no dev proxy; auth fraca; sem criptografia de dados em repouso.  
- Testes: `npm test -- --run` ok (27 tests BI-RADS); `npm run build` ok com 3 warnings CSS.

## 7. Integração com IA
- Arquitetura: camada unificada, mas sem retry/backoff e cancelamento efetivo.  
- Prompts: especializados só para Abdome, Carótidas, Mamária; demais usam prompt genérico.  
- Custos: estimativa aproximada (chars/4); sem rate limiting/quota.  
- Fallbacks: apenas fallback básico de laudo; erro genérico ao usuário.

## 8. Experiência do Usuário
- Interface: glassmorphism consistente; painel flutuante com clique-fora guardado.  
- Fluxo: múltiplas lesões fácil em carótidas/mama; ITB/WIfI manuais.  
- Acessibilidade: poucos aria-labels; sem foco-trap; mobile bloqueado.  
- Feedback: toasts e streaming visíveis; erros pouco específicos.

## 9. Roadmap de Refatoração
- Quick Wins: alinhar default de IA, propagar AbortSignal, deduplicar léxicos para shared, corrigir `AIModelSelector`.  
- Melhorias Estruturais: reescrever `FindingMeasurement`, instalar/limpar deps UI, prompts por exame, validação de ranges.  
- Grandes Refatorações: backend de auth seguro; componente reutilizável de Doppler (VPS/VDF/IR/VR).  
- Incrementais: code splitting, virtualização, mensagens de erro mais ricas, acessibilidade.

## 10. Conclusão
Prioridade imediata: sanear tipagem/tsc e segurança de autenticação; em seguida, automatizar Doppler periférico e padronizar dados compartilhados. Esses passos reduzem risco clínico, controlam custos de IA e preparam terreno para novos exames.
