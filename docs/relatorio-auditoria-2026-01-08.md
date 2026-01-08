# Relatório de Auditoria — Vertex V2

**Data:** 2026-01-08  
**Repositório:** `/root/PROJECT/vertex-v2`  
**Base git (HEAD):** `17962f01`  
**Estado auditado:** working tree com **24 arquivos modificados** e **4 arquivos/diretórios não rastreados**.  

**Objetivo:** auditoria técnica do frontend (React/Vite) e da documentação, com foco em:
- segurança/privacidade (contexto clínico/LGPD),
- confiabilidade da geração por IA (streaming, prompts, fallback),
- qualidade (lint, typecheck, testes, build),
- alinhamento do roadmap do `CLAUDE.md` com o que está implementado.

**Nota importante:** o arquivo `docs/auditoria-exames-base.md` **não existe** no repositório atual (não localizado em `docs/`, `docs/archives/` ou `docs/estruturas-exames/`).

---

## 0) Sumário executivo (o que mais importa)

### Prioridade máxima (P0) — recomendações imediatas
1) **Credenciais hardcoded no frontend** (`anders / vertex2025`)  
   Evidência: `src/contexts/AuthContext.tsx:22-24`  
   Risco: acesso indevido (o “login” é client-side e a senha está no bundle/repo).  

2) **Exposição potencial de dados sensíveis via logs no browser** (payload e chunks de streaming)  
   Evidência: `src/services/openaiStreamService.ts:100-145` e `src/services/openaiStreamService.ts:195-230`  
   Risco: vazamento de dados clínicos (console, prints, suporte remoto, logs persistidos).  

3) **Qualidade quebrada no pipeline local** (lint e typecheck falhando)  
   Evidência: `npm run lint` falha por ausência de `eslint.config.*` e `npx tsc -p tsconfig.json --noEmit` falha com erros relevantes.  
   Risco: regressões silenciosas, “funciona por acaso” e inconsistências difíceis de rastrear.  

4) **Bug provável no streaming da Impressão Diagnóstica** (duplicação por acumulação dupla)  
   Evidência: `src/pages/modern/BaseExamPage.tsx:301-308` combinado com streamers que enviam texto acumulado (ex.: `src/services/openaiStreamService.ts:221-224`).  
   Risco: UI exibindo texto duplicado, piora de UX e aumento de custo/tempo (se prompts/fluxos forem afetados).  

5) **Estado do repo com “drift” perigoso** (arquivos não rastreados usados por imports do código)  
   Evidência: `git status` indica `?? src/data/examConfigs.ts`, e módulos modernos importam esse arquivo (ex.: `src/pages/modern/exams/AbdomeTotalExam.tsx:2`).  
   Risco: clone limpo pode quebrar, CI/reprodutibilidade comprometidos.  

### Prioridade alta (P1) — próxima leva com alto ROI
6) **Doc/setup inconsistente e inseguro**  
   - README pede `.env.example` que não existe: `README.md:186-189`  
   - README recomenda `VITE_*_API_KEY` (exposição no bundle): `README.md:220-228`  
   Risco: onboarding quebrado e risco de vazar chaves acidentalmente.  

7) **Mismatch de prompts**: `BaseExamPage` calcula métricas com `buildSpecializedPrompt`, mas os stream services usam `buildReportPrompt`.  
   Evidência: `src/pages/modern/BaseExamPage.tsx:185-193` vs `src/services/openaiStreamService.ts:51-52`.  
   Risco: resultados clínicos menos aderentes ao “template especializado” e métricas de custo/tokens erradas.  

8) **Build com warnings de CSS** (Tailwind screens `raw` interferindo na geração do `.container`).  
   Evidência: `tailwind.config.js:21-25` + warnings no `npm run build`.  

---

## 1) Estado do repositório (risco de “drift”)

### 1.1 Working tree divergente do HEAD
- Total de mudanças locais: 28 entradas no `git status` (24 modificadas + 4 não rastreadas).
- Isso afeta a confiabilidade da auditoria: parte do que “parece implementado” depende de arquivos ainda fora do git.

### 1.2 Arquivos/diretórios não rastreados (impacto alto)
Itens em `??` no `git status` e que aparentam ser parte do funcionamento:
- `src/data/examConfigs.ts` (config central)  
- `src/data/shared/` (camada “shared” de dados)  
- `src/components/shared/PlaqueRiskCalculatorPanel.tsx`  
- `docs/relatorio-auditoria-2026-01-08.md` (este arquivo)  

Risco prático: um clone/checkout limpo pode quebrar por imports não resolvidos.

### 1.3 Backups versionados em git
O diretório `backups/` contém `.tar.gz` versionados (ver `git ls-files`).

Risco: repo cresce, histórico fica pesado e aumenta chance de versionar dados sensíveis por acidente.

Recomendação: mover para storage externo (ou Git LFS) e manter no git apenas manifestos e hashes.

---

## 2) Qualidade: lint, typecheck, testes e build

### 2.1 Lint (falha)
Resultado: `npm run lint` falha porque não existe `eslint.config.(js|mjs|cjs)` e também não existe `.eslintrc.*`.

Impacto: hoje não há “gate” automático de estilo/qualidade.

Recomendação base:
- Opção A: criar `eslint.config.js` (ESLint v9 / flat config).
- Opção B: fixar ESLint em v8 e usar `.eslintrc.cjs`.

### 2.2 TypeScript (`tsc --noEmit`) falha
Resultado: `npx tsc -p tsconfig.json --noEmit` retorna erros em áreas clínicas e de UI. Principais grupos:

1) `FindingMeasurement` incompleto vs UI de mama  
   Evidência: `src/components/original/BreastUltrasoundFindingDetails.tsx:68-74` (echoPattern, calcifications, SWE, etc).

2) Readonly vs mutable arrays (options)  
   Evidência: TS4104 em `src/data/arterialOrgans.ts` (uso de `as const` vindo de `src/data/shared/commonFields.ts`).

3) Tipos NodeJS em código browser  
   Evidência: `src/hooks/useAutoSave.ts:21` e `src/hooks/useOutsidePointerDismiss.ts:27`.

4) Provider `claude` não encaixa no contrato do `ReportCanvas`  
   Evidência: `src/components/original/ReportCanvas.tsx:25-26` vs `src/pages/modern/BaseExamPage.tsx:47-48`.

5) Contrato de props dos FindingDetails inconsistente  
   Evidência: erros do `tsc` apontando para `src/pages/modern/BaseExamPage.tsx` e `src/data/examConfigs.ts` (no estado atual).

### 2.3 Testes (passam, mas cobertura mínima)
Resultado: `npm test -- --run` passa.

Cobertura atual: 1 arquivo (`src/services/__tests__/biradsCalculator.test.ts`) com 27 testes.

Recomendação: adicionar testes para `tiradsCalculator`, `promptBuilder` e utilitários de lateralidade/CEAP/WIfI.

### 2.4 Build (passa com avisos)
Resultado: `npm run build` passa, porém com warnings do otimizador de CSS relacionados a `.container` e `@media`.

Causa provável: screens `raw` no Tailwind interferindo na geração do container (`tailwind.config.js:21-25`).

Observação: bundle JS final está grande (warning de chunk > 500kb) — recomenda-se code splitting por rotas.

---

## 3) Segurança e privacidade (contexto clínico / LGPD)

### 3.1 Crítico — autenticação hardcoded no frontend
Evidência: `src/contexts/AuthContext.tsx:22-24`.

Risco: senha no bundle/repo e “login” apenas client-side (sem segurança real).

Recomendação base:
- Se for “proteção local”: trocar por PIN local não versionado e deixar explícito que não é segurança real.
- Se for segurança real: mover autenticação para backend e remover senha do frontend.

### 3.2 Alto — logs com payload clínico / streaming no console
Evidência: `src/services/openaiStreamService.ts:100-145` (payload) e `src/services/openaiStreamService.ts:195-230` (chunks).

Recomendação base:
- Remover logs sensíveis, ou
- Proteger por `import.meta.env.DEV` e mascarar dados clínicos.

### 3.3 Alto — README sugere colocar chaves no `VITE_*` (exposição no bundle)
Evidência: `README.md:220-228`.

Situação do código: os serviços usam endpoints (proxy) e não leem as chaves hoje (ex.: `src/services/geminiClient.ts:6-10`).

Recomendação base:
- README deve orientar “chaves no backend; frontend só chama o proxy”.

### 3.4 Médio — `isConfigured()` sempre verdadeiro (fallback não funciona quando backend cai)
Evidência:
- `src/services/openaiStreamService.ts:34-36`
- `src/services/geminiStreamService.ts:25-27`
- `src/services/claudeStreamService.ts:25-27`

Como os endpoints têm default `/api/*`, `Boolean(endpoint)` é sempre `true`.

### 3.5 Médio — CORS e proxy do Vite muito permissivos (dev)
Evidência: `vite.config.ts:23-52`:
- `Access-Control-Allow-Origin: *`
- `secure: false` nos proxies

Risco: se o dev server for exposto, pode virar ponte de chamadas indevidas ao backend.

### 3.6 Dependências — `npm audit` encontrou 1 vulnerabilidade moderada
Resultado: `mdast-util-to-hast` (moderate).

Contexto: vocês usam `react-markdown` (`src/components/MarkdownRenderer.tsx:2-3`).

Mitigação parcial: não foi encontrado `rehypeRaw`, então HTML bruto não parece habilitado (reduz superfície).

### 3.7 Baixo — `dangerouslySetInnerHTML`
Evidência: `src/components/ui/chart.tsx:80-99`.

Risco baixo se `ChartConfig` for interno/const; aumenta se valores vierem de entrada do usuário.

---

## 4) Confiabilidade da IA: prompts, streaming, cancelamento

### 4.1 Prompt especializado não está sendo usado nos streamers
Evidência:
- Métrica usa `buildSpecializedPrompt`: `src/pages/modern/BaseExamPage.tsx:185-193`
- Streamers usam `buildReportPrompt`: `src/services/openaiStreamService.ts:51-52`, `src/services/claudeStreamService.ts:39-40`

Impacto: custos/tokens estimados errados e templates especializados possivelmente não aplicados na geração real.

### 4.2 Bug provável: duplicação na acumulação do streaming de Impressão Diagnóstica
Evidência:
- `unifiedAIService` repassa texto sem normalizar: `src/services/unifiedAIService.ts:82-90`
- Streamers passam texto acumulado: `src/services/openaiStreamService.ts:221-224`
- `BaseExamPage` acumula novamente: `src/pages/modern/BaseExamPage.tsx:301-308`

### 4.3 Cancelamento não efetivo
`UnifiedAIService` cria `AbortController` (`src/services/unifiedAIService.ts:74-80`), mas os streamers não aceitam `signal` e os `fetch()` não são abortados.

Recomendação base: suportar `signal` nos streamers e plugar no `fetch`.

### 4.4 Provider `claude` não está consistente na camada de UI
`ReportCanvas` limita `currentAiModel` a `'gemini' | 'openai'` (`src/components/original/ReportCanvas.tsx:25-26`), enquanto `BaseExamPage` trabalha com `'claude'` também.

---

## 5) Roadmap do `CLAUDE.md` vs implementação

### 5.1 Sobre o `CLAUDE.md`
Existe divergência entre:
- `CLAUDE.md` no HEAD (versão 2.0.0 e roadmap antigo), e
- `CLAUDE.md` no working tree (alterado localmente, com itens marcados como concluídos).

Recomendação: estabilizar o `CLAUDE.md` como “fonte da verdade”, mas apenas quando o código correspondente estiver versionado (evitar drift).

### 5.2 Tabela de alinhamento (observado no working tree)

| Item do Roadmap (CLAUDE.md) | Status observado | Evidência / Nota |
|---|---|---|
| Arquitetura modular (BaseExamPage + ExamConfig) | Implementado | `src/pages/modern/BaseExamPage.tsx` e `src/types/exam.ts` |
| Migração de 8 exames | Implementado (com drift) | Rotas em `src/App.tsx:29-36` |
| Configs centralizadas (`examConfigs.ts`) | Parcial (não rastreado) | `?? src/data/examConfigs.ts` |
| Dados compartilhados (`data/shared/`) | Parcial (não rastreado) | `?? src/data/shared/` |
| TI-RADS Calculator | Implementado | `src/components/shared/TiradsCalculatorPanel.tsx` |
| BI-RADS Calculator | Implementado (com type issues) | Testes em `src/services/__tests__/biradsCalculator.test.ts` |
| NASCET / ESVS | Implementado | Carótidas em `src/data/carotidOrgans.ts` |
| Plaque Risk (Gray-Weale) | Parcial (não rastreado) | `?? src/components/shared/PlaqueRiskCalculatorPanel.tsx` |
| CEAP/VCSS (Venoso) | Parcial (dados existem) | Campos em `src/data/venousOrgans.ts`, falta painel/score dedicado |
| WIfI/Fontaine (Arterial) | Parcial (dados existem) | Campos em `src/data/arterialOrgans.ts`, falta painel/score dedicado |
| findingFormatter / promptCustomizer | Não implementado | Tipado em `src/types/exam.ts:37-38`, não usado |
| Sidebar bilateral | Não implementado | Sidebar linear: `src/components/original/Sidebar.tsx:128-193` |

### 5.3 Bug de navegação (extra)
`Home.tsx` tem `navigate('/landing')` (`src/pages/Home.tsx:122-127`), mas `App.tsx` não define rota `/landing` (`src/App.tsx:25-37`).

---

## 6) Instruções/documentação não funcionantes (com substitutos recomendados)

### 6.1 README pede `.env.example`, mas o arquivo não existe
Evidência: `README.md:186-189`.

Substituto recomendado (base):
1) usar defaults do próprio código (proxy `/api/*`) quando estiver com `vite.config.ts` configurado;
2) se precisar apontar para backend específico, documentar apenas `VITE_*_API_URL` e `VITE_*_MODEL` (sem chaves no `VITE_*`).

### 6.2 README recomenda `VITE_*_API_KEY` (não condiz com o código e é inseguro)
Evidência: `README.md:220-228`.

Substituto recomendado: chaves no backend; frontend só conhece proxy.

### 6.3 Lint não roda
Evidência: script existe em `package.json`, mas não há config ESLint no repo.

### 6.4 Porta do dev server tem dupla fonte de verdade
Evidência:
- `package.json` define `--port 8200`
- `vite.config.ts` define `port: 8201`

Substituto recomendado: escolher uma única fonte (script ou config) para evitar drift.

---

## 7) Plano de ação sugerido (priorizado)

### P0 — Segurança + confiabilidade básica (primeiro)
1) Remover credenciais hardcoded (AuthContext) e definir estratégia mínima de autenticação.
2) Remover/gatear logs sensíveis (principalmente OpenAI streaming).
3) Corrigir bug de acumulação do streaming em `generateAIImpression`.
4) Tornar `isConfigured()` real (e/ou implementar fallback robusto).

### P1 — Qualidade e consistência técnica (logo em seguida)
5) Restaurar lint (ESLint config) e adicionar `npm run typecheck`.
6) Corrigir erros críticos de TypeScript (FindingMeasurement, options readonly, provider unions).
7) Unificar prompt real com prompt “estimado”.
8) Ajustar Tailwind screens `raw` para não quebrar `.container`.

### P2 — Roadmap clínico/UX
9) Implementar score/painel de CEAP/VCSS e WIfI/Fontaine (há dados; falta automatização/sumarização).
10) Sidebar com agrupamento bilateral e UX mais seguro para lateralidade.
11) Aumentar cobertura de testes (calculadores e prompt builder).

---

## 8) Comandos executados (registro)
- `npm run lint` (falhou — sem config)
- `npx tsc -p tsconfig.json --noEmit` (falhou — erros de tipo)
- `npm test -- --run` (passou)
- `npm run build` (passou com warnings de CSS/chunk)
- `npm audit --omit=dev` (1 vulnerabilidade moderada)

---

## 9) Limitações desta auditoria
- Auditoria baseada no estado atual do working tree (há mudanças não versionadas).
- Não inclui revisão clínica de conteúdo (somente arquitetura/implementação).
- Sem execução manual no browser para confirmar sintomas (duplicação de streaming, rotas, etc.).
