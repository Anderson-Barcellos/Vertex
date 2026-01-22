# Relatorio de Analise e Otimizacao - Vertex V2 (Ultrassom)

**Nota de escopo e limitacoes:** a camada de dados `src/data/**` (configuracoes de exames, orgaos, lexicos) esta excluida pela `.cursorignore` (`data/` em `/root/PROJECT/vertex-v2/.cursorignore:L22-L35`). Portanto, a avaliacao clinica detalhada de cada achado foi inferida a partir da UI e dos tipos/servicos disponiveis. Recomendo liberar leitura desses arquivos para auditoria clinica completa.

---

## PARTE I: Visao Geral do Sistema

### 1.1 Arquitetura atual

**Diagrama textual/ASCII (alto nivel):**
```
App.tsx (rotas)
  ├─ LoginPage / LandingPage
  └─ Modulos de exame (pages/exams/modules/*)
       └─ BaseExamPage (core)
           ├─ ModernExamLayout (grid 3 colunas)
           │   ├─ Sidebar (lista de orgaos)
           │   ├─ ReportCanvas (preview do laudo)
           │   └─ Painels (SelectedFindingsPanel + QuickActionsPanel)
           ├─ FloatingOrganPanelModern
           │   └─ OrganSection
           │       └─ FindingDetails* (generic/enhanced/especificos)
           ├─ Services (promptBuilder, reportGenerator, stream services)
           └─ Hooks/Utils (useAutoSave, findingAdapters, aiMetrics)
Data Layer (src/data/*) -> ignorada por .cursorignore (nao inspecionada)
```

**Modulo Basico (Core/Shared) e responsabilidades:**
- Orquestracao do fluxo de exame, estado e UI principal em `BaseExamPage` (`src/pages/exams/shared/BaseExamPage.tsx:L36-L457`).
- Composicao de layout e colunas em `ModernExamLayout` (`src/layouts/ModernExamLayout.tsx:L20-L56`).
- Selecionar orgaos, achados e detalhes via `Sidebar`, `FloatingOrganPanelModern` e `OrganSection` (`src/components/original/Sidebar.tsx`, `src/components/shared/FloatingOrganPanelModern.tsx`, `src/components/original/OrganSection.tsx`).
- Gerar laudo/IA e apresentar em `ReportCanvas` (`src/components/original/ReportCanvas.tsx`).
- Resumo e controle de geracao em `SelectedFindingsPanel` e `QuickActionsPanel` (`src/components/original/SelectedFindingsPanel.tsx`, `src/components/original/QuickActionsPanel.tsx`).
- Persistencia local de rascunho via `useAutoSave` (`src/hooks/useAutoSave.ts`).

**Modalidades identificadas (rotas / modulos):**
- Abdome total (`/abdome-modern`) -> `AbdomeTotalExam` (`src/App.tsx:L28`).
- Ecodoppler Carotidas (`/carotid-modern`) -> `CarotidExam` (`src/App.tsx:L29`).
- Ecodoppler Tireoide (`/thyroid-modern`) -> `ThyroidExam` (`src/App.tsx:L30`).
- Ultrassom de Mama (`/breast-exam`) -> `BreastExam` (`src/App.tsx:L31`).
- Doppler Venoso MMII (`/venous-modern`) -> `VenousExam` (`src/App.tsx:L32`).
- Doppler Arterial MMII (`/arterial-modern`) -> `ArterialExam` (`src/App.tsx:L33`).
- Ecodoppler Vasos Abdominais (`/abdominal-vessels-modern`) -> `AbdominalVesselsExam` (`src/App.tsx:L34`).
- US Parede Abdominal (`/abdominal-wall-modern`) -> `AbdominalWallExam` (`src/App.tsx:L35`).
- Ultrassom de Ombro (`/ombro-modern`) -> `OmbroExam` (`src/App.tsx:L36`).

### 1.2 Fluxo de geracao de laudo tipico

1. **Autenticacao**: `ProtectedRoute` protege rotas (`src/components/ProtectedRoute.tsx:L8-L15`) e `AuthContext` gerencia sessao local (`src/contexts/AuthContext.tsx:L59-L105`).
2. **Selecao de modalidade**: Landing page direciona para rota do exame (`src/pages/LandingPage.tsx:L7-L33`).
3. **Inicializacao do modulo**: cada modulo carrega `BaseExamPage` com `ExamConfig` (`src/pages/exams/modules/*.tsx`, `src/types/exam.ts:L34-L46`).
4. **Selecao de orgao**: `Sidebar` lista orgaos e permite marcar normalidade (`src/components/original/Sidebar.tsx:L24-L333`).
5. **Selecao de achados**: `OrganSection` lista categorias/achados e abre detalhes (`src/components/original/OrganSection.tsx:L176-L239`).
6. **Detalhamento clinico**: componentes `FindingDetails*` coletam medidas e caracteristicas (ex.: mama, tiroide, carotidas) (`src/components/original/*FindingDetails*.tsx`).
7. **Resumo e geracao**: `SelectedFindingsPanel` mostra achados e aciona "Gerar Laudo" (`src/components/original/SelectedFindingsPanel.tsx:L116-L140`).
8. **Geracao de laudo/IA**: `BaseExamPage` chama stream services e fallback (`src/pages/exams/shared/BaseExamPage.tsx:L170-L279`, `src/services/*StreamService.ts`).
9. **Visualizacao**: `ReportCanvas` renderiza impressao clinica e laudo (`src/components/original/ReportCanvas.tsx:L111-L331`).
10. **Persistencia local**: `useAutoSave` salva rascunhos por exame (`src/hooks/useAutoSave.ts:L14-L48`).

**Pontos de integracao entre modulos:**
- `ExamConfig` (camada de dados) define orgaos, grupos e componente de detalhes (`src/types/exam.ts:L34-L46`).
- `promptBuilder` e `reportGenerator` centralizam prompts e fallback (`src/services/promptBuilder.ts`, `src/services/reportGenerator.ts`).
- `findingAdapters` normaliza estrutura de achados para relatorio (`src/utils/findingAdapters.ts`).

---

## PARTE II: Analise de Consolidacao (Modulo Basico)

### 2.1 Elementos candidatos para o Modulo Basico

| Elemento identificado | Localizacao atual (modulos) | Frequencia de repeticao | Justificativa para consolidacao | Impacto esperado | Risco | Prioridade |
|---|---|---:|---|---|---|---|
| CRUD de instancias (adicionar/remover/collapse/rotulo de lesoes) | `FindingDetailsGeneric`, `FindingDetailsEnhanced`, `BreastUltrasoundFindingDetails`, `ThyroidFindingDetails`, `CarotidFindingDetails` | 5/5 | Logica identica com variacoes pequenas; padroniza UX e validações | Reducao de duplicacao e bugs de fluxo | Medio | Alta |
| Seletor de severidade ("Grau") | `FindingDetailsGeneric`, `FindingDetailsEnhanced`, `ThyroidFindingDetails`, `CarotidFindingDetails` | 4/5 | Mesma UI com opcoes fixas | Consistencia e menos retrabalho | Baixo | Alta |
| Calculadora TI-RADS | `ThyroidFindingDetails` vs `services/tiradsCalculator.ts` | 2/2 | Implementacoes paralelas podem divergir | Consistencia clinica | Medio | Alta |
| Calculadora BI-RADS | `BreastUltrasoundFindingDetails` vs `services/biradsCalculator.ts` | 2/2 | Duplicacao de logica e lexicos | Confianca clinica e manutenibilidade | Medio | Alta |
| Calculo de risco de placa | `CarotidFindingDetails` (getPlaqueRisk) + `PlaqueRiskCalculatorPanel` | 2/2 | Mesma regra em locais diferentes | Unificacao de criterios | Medio | Media |
| Mapeamento de labels de campos (prompt) | `promptBuilder.ts` (FIELD_LABELS/REDUNDANT_FIELDS) | 1 (central, mas desconectado da UI) | Evita divergencia entre UI e prompt | Menos incoerencias no laudo | Medio | Alta |
| Streaming (leitura de chunks) | `openaiStreamService`, `geminiStreamService`, `claudeStreamService` | 3/3 | Padrao duplicado de streaming | Menos bugs e padrao unico | Baixo | Media |
| Selecao de modelo de IA | `SelectedFindingsPanel` vs `AIModelSelector` | 2/2 | Duas UIs diferentes para mesma funcao | UX consistente | Baixo | Media |
| Progresso/coverage de orgaos | `SelectedFindingsPanel` e `QuickActionsPanel` | 2/2 | Calculos diferentes e divergentes | Consistencia de status | Baixo | Media |
| Observacoes extras (campo livre) | `ObservationInput` e props de `FloatingOrganPanelModern` nao usados em `BaseExamPage` | 1 (nao integrado) | Recurso generico aplicavel a todas modalidades | Padronizar anotacoes clinicas | Medio | Media |

### 2.2 Padroes reutilizaveis nao consolidados

- **Validacoes**: BI-RADS (validar combinacoes), TI-RADS, NASCET/EMI; hoje espalhadas em componentes e servicos (`src/services/biradsCalculator.ts`, `src/components/original/ThyroidFindingDetails.tsx`, `src/components/original/CarotidFindingDetails.tsx`).
- **Calculos**: TI-RADS duplicado (com e sem thresholds), BI-RADS duplicado, risco de placa em dois lugares.
- **Componentes UI**: selecao de severidade, formularios de instancia, badges de risco, listas de instancia.
- **Estruturas de dados**: `FindingMeasurement` com campos multi-dominio sem namespace (`src/types/report.ts:L3-L120`), o que aumenta colisao e inconsistencias em prompts/labels.

### 2.3 Elementos que DEVEM permanecer nos modulos especificos

| Elemento | Modulo | Justificativa para NAO consolidar |
|---|---|---|
| Lexico BI-RADS + elastografia mamaria | Mama | Altamente especifico do dominio mamario, requer atualizacao por guideline ACR |
| NASCET/Gray-Weale + hemodinamica carotidea | Carotidas | Criterios proprios do ecodoppler de carótidas |
| TI-RADS e volumes tiroideanos | Tireoide | Logica e referenciais exclusivos da tiroide |
| Parede abdominal (hernia, seroma/hematoma/abscesso) | Parede abdominal | Achados e campos especificos de parede |

---

## PARTE III: Adequacao Clinica dos Campos

### 3.1 Analise por modalidade

#### Ultrassom Mamario (BI-RADS)

**Estruturas anatomicas cobertas:**
- OK Mamas e lesoes nodulares/cisticas (UI dedicada).
- PARCIAL Doppler e elastografia (campos presentes, mas sem padronizacao de unidades).
- PARCIAL Linfonodos axilares / implantes (tipos existem em `FindingMeasurement`, mas nao ha UI explicita).

**Campos de medidas disponiveis (UI):**
| Medida | Presente? | Guideline de referencia | Observacoes |
|---|---|---|---|
| Tamanho | OK | ACR BI-RADS | Campo livre (sem validacao de unidade) |
| Quadrante | OK | ACR BI-RADS | Selecionado por lista |
| Forma, Margens, Orientacao, Ecogenicidade | OK | ACR BI-RADS | Campos completos no formulario |
| Calcificacoes | OK | ACR BI-RADS | Nao vi morfologia/distribuicao separadas |
| Doppler (fluxo/padrao/IR) | OK | ACR BI-RADS | Seletores por faixa |
| Elastografia SWE (Emean/Emax) | OK | ACR | Inclui qualitativo + kPa |
| Posicao horaria (clock position) | INSUF | ACR BI-RADS | Importado, mas nao encontrei input |

**Achados patologicos documentaveis:**
- OK Nodulos com lexicos completos e BI-RADS automatico.
- OK Cistos com classificacao e criterios de complexidade.
- OK Calcificacoes e doppler.

**Lacunas criticas identificadas:**
1. **Posicao horaria nao aparece na UI** embora haja referencia em tipos e resumo (`src/components/original/BreastUltrasoundFindingDetails.tsx:L165`), o que limita localizacao cirurgica.
2. **Distancia do mamilo / profundidade** existem em `FindingMeasurement` (`src/types/report.ts:L40-L44`), mas nao ha input dedicado no formulario.
3. **Linfonodos axilares e implantes** tem campos no tipo (`src/types/report.ts:L73-L83`), mas nao aparecem na UI mamaria.

**Campos redundantes/desnecessarios:**
- Duplicacao de calculo BI-RADS entre componente e servico (`src/components/original/BreastUltrasoundFindingDetails.tsx` vs `src/services/biradsCalculator.ts`).

#### Ecodoppler de Carotidas

**Estruturas anatomicas cobertas:**
- OK Carotidas comum, interna, externa e vertebrais (logica por `organId`).
- OK Placas, estenoses, EMI e padrao de fluxo vertebral.

**Campos de medidas disponiveis (UI):**
| Medida | Presente? | Guideline de referencia | Observacoes |
|---|---|---|---|
| VPS / VDF | OK | NASCET / IAC | Escolha por faixas (nao numerico livre) |
| Razao ICA/CCA | OK | NASCET / IAC | Seletores por faixa |
| NASCET (grau) | OK | NASCET | Automatico + manual |
| EMI | OK | Diretrizes de risco | Campo numerico livre (mm) |
| Gray-Weale | OK | Gray-Weale | Selecao direta |

**Achados patologicos documentaveis:**
- OK Estenose com classificacao automatica.
- OK Placas com risco e superficie.
- OK Vertebrais com hipoplasia/aplasia e roubo subclavia.

**Lacunas criticas identificadas:**
1. **VPS/VDF numericos exatos nao sao coletados** (apenas faixas), reduzindo fidelidade clinica.
2. **Razao ICA/ICA contralateral** existe em tipos (`src/types/report.ts:L13-L15`), mas nao ha input no formulario.
3. **Padroes de onda (tardus-parvus, triphasic, etc)** nao aparecem na UI.

**Campos redundantes/desnecessarios:**
- Duplicacao de calculo de risco de placa (`src/components/original/CarotidFindingDetails.tsx:L120-L157` vs `src/components/shared/PlaqueRiskCalculatorPanel.tsx`).

#### Ecodoppler de Tireoide

**Estruturas anatomicas cobertas:**
- OK Lobos, istmo, nodulos, parenquima, linfonodos (UI dedicada).
- PARCIAL Volume tiroideano (apenas volume direto, sem medidas tridimensionais).

**Campos de medidas disponiveis (UI):**
| Medida | Presente? | Guideline de referencia | Observacoes |
|---|---|---|---|
| Composicao / Ecogenicidade / Forma / Margens / Focos | OK | ACR TI-RADS | Pontuacao automatica |
| Dimensoes do nodulo | OK | ACR TI-RADS | Campo livre (sem validacao) |
| Volume por lobo (mL) | OK | ACR / referencia interna | Apenas volume direto |
| Espessura do istmo | OK | ACR | Campo livre |

**Achados patologicos documentaveis:**
- OK Nodulos com TI-RADS e recomendacao.
- OK Alteracoes de ecotextura/vascularizacao.
- OK Linfonodos suspeitos (campo texto).

**Lacunas criticas identificadas:**
1. **Recomendacao baseada em tamanho** existe no calculador central (`src/services/tiradsCalculator.ts:L111-L133`), mas o componente da tiroide usa calculo proprio sem thresholds.
2. **Dimensoes tridimensionais (comprimento/AP/transverso)** sao exibidas no resumo (`src/components/original/ThyroidFindingDetails.tsx:L288-L290`) mas nao ha input correspondente.
3. **Linfonodos** carecem de campos estruturados (tamanho, hilo, cortical) apesar de existirem em tipos (`src/types/report.ts:L78-L83`).

**Campos redundantes/desnecessarios:**
- Duplicacao de TI-RADS (componente vs servico).

#### Ultrassonografia Abdominal (Abdome total)

**Estruturas anatomicas cobertas:**
- OK Estruturas principais esperadas (figado, vesicula, vias biliares, pancreas, baco, rins, bexiga, aorta) mencionadas em templates (`src/services/promptBuilder.ts:L185-L199`).
- PARCIAL Detalhes por orgao dependem de `src/data` (nao inspecionado).

**Campos de medidas disponiveis (UI):**
| Medida | Presente? | Guideline de referencia | Observacoes |
|---|---|---|---|
| Tamanho / Localizacao / Segmento | OK | SRU/ACR | `FindingDetailsEnhanced` oferece seletores de localizacao |
| Descricao livre | OK | - | Texto livre |

**Achados patologicos documentaveis:**
- OK Lesoes focais por orgao com localizacao/segmento.

**Lacunas criticas identificadas:**
1. **Campos estruturados para medidas organicas** (ex.: diametro de vias biliares, tamanho de baço, espessura de parede vesicular) nao aparecem na UI base.
2. **Caracteristicas ecogenicas/esteatose** nao aparecem na UI base.

**Campos redundantes/desnecessarios:**
- Nenhuma evidente no core; depende de `src/data`.

#### Ecodoppler de Vasos Abdominais

**Estruturas anatomicas cobertas:**
- PARCIAL Aneurismas/placas sugeridos por labels (`src/services/promptBuilder.ts:L118-L121`).

**Campos de medidas disponiveis:**
| Medida | Presente? | Guideline | Observacoes |
|---|---|---|---|
| Morfologia de aneurisma / trombo mural / extensao | PARCIAL | SVS/ESVS | So evidenciado no prompt |

**Lacunas criticas identificadas:**
1. **Velocidades e indices hemodinamicos** (PSV, ratios) nao aparecem em UI base.

#### Doppler Arterial MMII

**Estruturas anatomicas cobertas:**
- PARCIAL Inferido por campos ITB e indices (`src/services/promptBuilder.ts:L114-L117`).

**Campos de medidas disponiveis:**
| Medida | Presente? | Guideline | Observacoes |
|---|---|---|---|
| ITB repouso / pos-exercicio | PARCIAL | AHA/ACC | Existe no prompt |
| Velocidade de pico / IP / IR | PARCIAL | SVS | Existe em tipos, nao confirmado em UI |

**Lacunas criticas identificadas:**
1. **Segmentacao arterial (iliaca/femoral/poplitea)** nao evidenciada na UI base.
2. **Classificacao de estenose por segmento** nao aparece no core.

#### Doppler Venoso MMII

**Estruturas anatomicas cobertas:**
- PARCIAL Campos sugerem refluxo e CEAP (`src/services/promptBuilder.ts:L104-L113`).

**Campos de medidas disponiveis:**
| Medida | Presente? | Guideline | Observacoes |
|---|---|---|---|
| Tempo de refluxo | PARCIAL | UIP | Existe no prompt |
| CEAP | PARCIAL | CEAP | Existe no prompt |
| Compressibilidade / fluxo | PARCIAL | UIP | Existe no prompt |

**Lacunas criticas identificadas:**
1. **Segmentos venosos (safena, perfurantes) e manobras dinamicas** nao evidenciadas no core.

#### US Parede Abdominal

**Estruturas anatomicas cobertas:**
- OK Hernias e complicacoes pos-operatorias inferidas por labels (`src/services/promptBuilder.ts:L67-L103`).

**Campos de medidas disponiveis:**
| Medida | Presente? | Guideline | Observacoes |
|---|---|---|---|
| Ostio, saco, conteudo, redutibilidade | OK | Hernia | Campos estruturados no prompt |
| Distancia inter-retos | OK | Diastase | Campo no prompt |

**Lacunas criticas identificadas:**
1. **Manobras dinamicas (Valsalva) e dor** nao aparecem como campos estruturados.

#### Ultrassom de Ombro

**Estruturas anatomicas cobertas:**
- INSUF Sem acesso aos dados de orgaos/achados (`src/data/ombroOrgans.ts` nao inspecionado).

**Lacunas criticas identificadas:**
1. Necessario revisar `src/data/ombroOrgans.ts` para validar cobertura do manguito, biceps e bursa.

---

## PARTE IV: Bugs e Implementacoes Erroneas

### 4.1 Bugs criticos (alta probabilidade de erro clinico)

| ID | Localizacao | Descricao do bug | Evidencia/Cenario de falha | Impacto | Urgencia |
|---|---|---|---|---|---|
| BUG-001 | `src/pages/exams/shared/BaseExamPage.tsx:L187-L194` + `src/services/*StreamService.ts` | Prompt especializado e calculado nao e usado no streaming real | Stream services constroem prompt proprio com `buildReportPrompt`, ignorando regras especificas (BI-RADS/TI-RADS) | Laudos podem ignorar diretrizes criticas | Critica |
| BUG-002 | `src/services/promptBuilder.ts:L130-L143` | Campos clinicos relevantes (EMI, etc) removidos do prompt | `REDUNDANT_FIELDS` remove `emi` e `emiValue`, entao IA nao recebe EMI | Impressao pode omitir dados hemodinamicos | Alta |
| BUG-003 | `src/hooks/useAutoSave.ts:L11-L48` + `BaseExamPage.tsx:L110-L117` | Reset do exame nao limpa rascunho; dados podem vazar entre pacientes | Auto-save usa chave apenas por exame e nao por paciente; reset nao chama clear | Risco LGPD/HIPAA e laudo incorreto | Critica |

### 4.2 Bugs moderados

| ID | Localizacao | Descricao do bug | Evidencia/Cenario de falha | Impacto | Urgencia |
|---|---|---|---|---|---|
| BUG-101 | `src/components/original/SelectedFindingsPanel.tsx:L53-L60` | Mudanca de modelo Claude nao dispara `onModelChange` | `selectedClaudeModel` nao esta nas dependencias do `useEffect` | Modelo errado usado | Alta |
| BUG-102 | `src/components/original/ReportCanvas.tsx:L25-L47` | `currentAiModel` nao inclui `claude` | UI rotula Claude como Gemini e fluxo usa modelo errado | Erro de comunicacao/UX | Media |
| BUG-103 | `src/components/original/QuickActionsPanel.tsx:L94-L96` | Progresso calcula com contagem de achados, nao de orgaos | Percentual pode inflar e confundir | Baixo | Media |
| BUG-104 | `src/components/original/FindingDetailsEnhanced.tsx:L782-L784` | `setIsEditing(true)` durante render | Pode gerar re-render loop e warnings | Media | Media |
| BUG-105 | `src/components/original/SelectedFindingsPanel.tsx:L238-L257` | EMI omitido no resumo | `skipFields` remove `emi/emiValue` e nao ha fallback | Perda de informacao no resumo | Media |
| BUG-106 | `src/services/openaiStreamService.ts:L24-L39` + `BaseExamPage.tsx:L180-L183` | Selecao de modelo so grava no sessionStorage ao gerar laudo | Impressao clinica pode usar modelo antigo | Baixo | Media |

### 4.3 Implementacoes problematicas (code smells medicos)

- **Duplicacao de calculadoras clinicas**: TI-RADS e BI-RADS implementados em mais de um lugar (risco de divergencia).
- **Campos multi-dominio sem namespace**: `FindingMeasurement` mistura mamario, vascular e tiroide no mesmo objeto (`src/types/report.ts:L3-L120`).
- **Prompts inconsistentes**: diferentes funcoes constroem prompts com formatos distintos (`promptBuilder.ts` vs `geminiClient.ts`).

### 4.4 Validacoes faltantes

| Campo/Funcao | Validacao ausente | Risco | Exemplo de input invalido nao bloqueado |
|---|---|---|---|
| Tamanho de lesoes | Range e unidade | Medio | "50 cm" em nodulo mamario |
| Volume tiroideano | Unidade / faixa fisiologica | Medio | "200 mL" por lobo sem alerta |
| VPS/VDF | Numerico e unidade | Medio | Texto livre sem cm/s |
| TI-RADS | Dependencia por tamanho | Alto | TR4 sem recomendacao baseada em tamanho |
| BI-RADS | Combinacoes inconsistentes | Medio | Calcificacao micro em cisto simples (nao barrado na UI) |

---

## PARTE V: Melhorias de UX

### 5.1 Problemas de usabilidade identificados

**Categoria: Fluxo de trabalho**
1. **Reset do exame nao limpa rascunho**: usuario pode reabrir exame e ver dados antigos.
   - *Evidencia*: `useAutoSave` sem limpeza + `handleResetExam` sem `clearState`.
   - *Sugestao*: ao resetar, limpar storage do exame ou exigir confirmacao.
   - *Beneficio esperado*: evita confusao e risco clinico.

**Categoria: Entrada de dados**
1. **Medidas como texto livre**: ausencia de mascara e unidade.
   - *Evidencia*: varios inputs `type="text"` para tamanho/volume.
   - *Sugestao*: campos numericos + unidade fixa (mm/cm) + validacao.
   - *Beneficio esperado*: menor erro de unidade.

**Categoria: Feedback e validacao**
1. **Falta de feedback imediato de inconsistencias BI-RADS/TI-RADS**.
   - *Evidencia*: validacoes existem em servico, mas nao em UI.
   - *Sugestao*: avisos inline quando combinacoes conflitantes forem selecionadas.
   - *Beneficio esperado*: melhora qualidade clinica.

**Categoria: Acessibilidade**
1. **ResolutionGuard bloqueia telas menores** (`MIN_WIDTH=1230`).
   - *Evidencia*: `ResolutionGuard.tsx:L7-L46`.
   - *Sugestao*: modo compacto para tablet / notebook menor.
   - *Beneficio esperado*: maior cobertura de uso.

### 5.2 Oportunidades de automacao/inteligencia

- **Sugestoes contextuais**: ao selecionar padroes suspeitos (ex.: Gray-Weale I/II), sugerir recomendacao automatica.
- **Auto-preenchimento**: reaproveitar medidas bilaterais (mama direita/esquerda, carótidas).
- **Templates dinamicos**: escolher template conforme indicacao clinica (rastreamento vs sintomatico).

### 5.3 Melhorias na visualizacao do laudo

- Padronizar terminologia entre UI e texto gerado (usar `FIELD_LABELS` alinhado ao formulario).
- Exibir resumo de medidas criticas (EMI, NASCET, TI-RADS, BI-RADS) no topo do laudo.
- Oferecer preview por orgao antes de geracao completa (minimiza retrabalho).

---

## PARTE VI: Recomendacoes Priorizadas

### Matriz de priorizacao

| # | Recomendacao resumida | Categoria | Impacto clinico | Esforco tecnico | Risco | Prioridade final |
|---|---|---|---|---|---|---|
| 1 | Aplicar prompt especializado no streaming (BI-RADS/TI-RADS/NASCET) | Bug | Alto | Baixo | Baixo | **P0 - Imediato** |
| 2 | Incluir EMI/NASCET e demais hemodinamicos no prompt da IA | Bug | Alto | Baixo | Baixo | **P0 - Imediato** |
| 3 | Isolar/limpar auto-save por paciente e resetar no "Reset Exam" | Seguranca | Alto | Medio | Medio | **P0 - Imediato** |
| 4 | Unificar TI-RADS e adicionar thresholds de tamanho na UI | Adequacao clinica | Alto | Medio | Medio | **P1 - Curto prazo** |
| 5 | Unificar BI-RADS e garantir clock position/distancia do mamilo | Adequacao clinica | Alto | Medio | Medio | **P1 - Curto prazo** |
| 6 | Corrigir selecao de modelo Claude + suporte a `claude` no ReportCanvas | Bug | Medio | Baixo | Baixo | **P1 - Curto prazo** |
| 7 | Criar esquema de campos/labels compartilhado entre UI e prompt | Consolidacao | Medio | Medio | Medio | **P1 - Curto prazo** |
| 8 | Validacoes de faixa/uniidade para medidas criticas | Adequacao clinica | Alto | Medio | Medio | **P1 - Curto prazo** |
| 9 | Padronizar progresso por orgao (unique) | UX | Baixo | Baixo | Baixo | **P2 - Medio prazo** |
| 10 | Revisar cobertura clinica de `src/data` (ombro, vascular, etc.) | Adequacao clinica | Alto | Medio | Medio | **P2 - Medio prazo** |

### Detalhamento das top 10 recomendacoes

**[#1 - Usar prompt especializado no streaming]**
- **Categoria**: Bug
- **Problema**: `buildSpecializedPrompt` e calculado mas nao usado pelos stream services.
- **Localizacao exata**: `BaseExamPage.tsx:L187-L194` vs `openaiStreamService.ts:L60-L92`, `geminiStreamService.ts:L54-L83`, `claudeStreamService.ts:L51-L63`.
- **Solucao proposta**: unificar a origem do prompt para streaming e fallback; garantir que o prompt especializado seja usado em todos provedores.
- **Justificativa clinica**: laudo deve seguir lexicos e diretrizes (BI-RADS/TI-RADS/NASCET).
- **Justificativa tecnica**: evita divergencia de templates.
- **Esforco estimado**: 4-8h.
- **Riscos e mitigacoes**: risco de regressao de prompt -> testes com casos padrao por modalidade.
- **Criterios de validacao**: laudo inclui termos BI-RADS/TI-RADS corretos em casos simulados.

**[#2 - Incluir EMI/NASCET no prompt IA]**
- **Categoria**: Bug
- **Problema**: `REDUNDANT_FIELDS` remove campos clinicos relevantes.
- **Localizacao exata**: `promptBuilder.ts:L130-L143`.
- **Solucao proposta**: revisar lista de campos redundantes e manter EMI/NASCET quando nao houver duplicidade real.
- **Justificativa clinica**: EMI e NASCET influenciam conduta.
- **Justificativa tecnica**: aumenta fidelidade do prompt.
- **Esforco estimado**: 2-4h.
- **Riscos e mitigacoes**: duplicacao de dados -> deduplicacao por chaves canonicas.
- **Criterios de validacao**: laudo IA inclui EMI e NASCET quando preenchidos.

**[#3 - Segregacao e limpeza do auto-save por paciente]**
- **Categoria**: Seguranca
- **Problema**: dados ficam em localStorage e podem vazar entre pacientes.
- **Localizacao exata**: `useAutoSave.ts:L11-L48`, `BaseExamPage.tsx:L110-L117`.
- **Solucao proposta**: chave do auto-save deve incluir paciente/sessao; adicionar `clearState` no reset; considerar criptografia local.
- **Justificativa clinica**: evita laudo cruzado.
- **Justificativa tecnica**: compliance LGPD/HIPAA.
- **Esforco estimado**: 1-2 dias.
- **Riscos e mitigacoes**: perda de rascunhos -> confirmacao antes de limpar.
- **Criterios de validacao**: reset limpa storage; troca de paciente nao reaproveita rascunho.

**[#4 - Unificar TI-RADS e thresholds de tamanho]**
- **Categoria**: Adequacao clinica
- **Problema**: TI-RADS duplicado e sem recomendacao por tamanho na UI de tiroide.
- **Localizacao exata**: `ThyroidFindingDetails.tsx:L35-L79` vs `tiradsCalculator.ts:L57-L145`.
- **Solucao proposta**: usar `calculateTirads` em todos os pontos, exibindo conduta.
- **Justificativa clinica**: conduta depende de tamanho e pontuacao.
- **Justificativa tecnica**: elimina divergencias.
- **Esforco estimado**: 1 dia.
- **Riscos e mitigacoes**: ajuste de UI -> testes com casos TR3/TR4/TR5.
- **Criterios de validacao**: recomendacao muda ao variar tamanho.

**[#5 - Unificar BI-RADS + campos de localizacao]**
- **Categoria**: Adequacao clinica
- **Problema**: calculo BI-RADS duplicado e falta de campos (clock position, distancia do mamilo).
- **Localizacao exata**: `BreastUltrasoundFindingDetails.tsx` e `biradsCalculator.ts`.
- **Solucao proposta**: usar calculadora unica e adicionar inputs estruturados.
- **Justificativa clinica**: localizacao precisa e essencial para seguimento/biópsia.
- **Justificativa tecnica**: reduz divergencia e simplifica testes.
- **Esforco estimado**: 1-2 dias.
- **Riscos e mitigacoes**: mudanca de formulario -> treinamento rapido do usuario.
- **Criterios de validacao**: laudo inclui posicao horaria e distancia do mamilo.

**[#6 - Corrigir selecao de modelo Claude e suporte no ReportCanvas]**
- **Categoria**: Bug
- **Problema**: modelo Claude nao atualiza e rotulo aparece errado.
- **Localizacao exata**: `SelectedFindingsPanel.tsx:L53-L60`, `ReportCanvas.tsx:L25-L47`.
- **Solucao proposta**: ajustar dependencias e tipos.
- **Justificativa clinica**: transparencia do modelo usado.
- **Justificativa tecnica**: evita inconsistencias.
- **Esforco estimado**: 2-4h.
- **Riscos e mitigacoes**: baixo risco.
- **Criterios de validacao**: troca de modelo reflete em UI e no endpoint.

**[#7 - Esquema de campos compartilhado (UI + Prompt)]**
- **Categoria**: Consolidacao
- **Problema**: labels e campos duplicados/soltos em `promptBuilder`.
- **Localizacao exata**: `promptBuilder.ts:L3-L121`.
- **Solucao proposta**: criar schema unico (id/label/unidade/validacao) usado por UI e prompt.
- **Justificativa clinica**: garante terminologia consistente.
- **Justificativa tecnica**: reduz manutencao.
- **Esforco estimado**: 2-4 dias.
- **Riscos e mitigacoes**: migracao incremental por modalidade.
- **Criterios de validacao**: labels identicos em UI e laudo.

**[#8 - Validacoes de faixa e unidade]**
- **Categoria**: Adequacao clinica
- **Problema**: entradas livres sem range fisiologico.
- **Localizacao exata**: inputs em `FindingDetails*`.
- **Solucao proposta**: validadores por tipo de medida (mm/cm, cm/s).
- **Justificativa clinica**: previne erros graves.
- **Justificativa tecnica**: reduz retrabalho.
- **Esforco estimado**: 2-3 dias.
- **Riscos e mitigacoes**: tolerancia a formatos livres -> usar parser.
- **Criterios de validacao**: erro ao digitar valores impossiveis.

**[#9 - Padronizar calculo de progresso]**
- **Categoria**: UX
- **Problema**: contagem por achados gera progresso inflado.
- **Localizacao exata**: `QuickActionsPanel.tsx:L94-L96`.
- **Solucao proposta**: usar contagem de orgaos unicos.
- **Justificativa clinica**: evita falsa sensacao de exame completo.
- **Justificativa tecnica**: simples.
- **Esforco estimado**: 1-2h.
- **Riscos e mitigacoes**: baixo.
- **Criterios de validacao**: progresso = orgaos unicos marcados.

**[#10 - Auditoria completa de `src/data` por modalidade]**
- **Categoria**: Adequacao clinica
- **Problema**: orgaos e achados reais estao em arquivos ignorados.
- **Localizacao exata**: `src/data/*.ts` (nao inspecionados).
- **Solucao proposta**: liberar leitura e revisar lexicos por guideline.
- **Justificativa clinica**: garante completude.
- **Justificativa tecnica**: melhora confianca e modularizacao.
- **Esforco estimado**: 1-2 semanas (analise clinica).
- **Riscos e mitigacoes**: escopo grande -> priorizar modalidades P0.
- **Criterios de validacao**: checklist de guidelines por modalidade.

---

## PARTE VII: Plano de Implementacao Sugerido

### Fase 1 (Sprint 1-2): Correcoes criticas
- Aplicar prompt especializado ao streaming.
- Ajustar `REDUNDANT_FIELDS` para incluir EMI/NASCET.
- Segregar auto-save por paciente + limpar no reset.

### Fase 2 (Sprint 3-4): Consolidacao no Modulo Basico - Lote 1
- Unificar TI-RADS e BI-RADS.
- Criar componentes base para instancias e severidade.

### Fase 3 (Sprint 5-6): Adequacao clinica prioritaria
- Adicionar campos ausentes (clock position, distancia do mamilo, medidas tridimensionais).
- Validacoes de faixa/unidade para medidas criticas.

### Fase 4 (Sprint 7+): UX e consolidacoes complexas
- Unificar selecao de modelo e progresso.
- Modo responsivo (sem ResolutionGuard bloqueante).

---

## PARTE VIII: Perguntas e Informacoes Necessarias

1. **Podemos liberar leitura de `src/data/**` para auditoria clinica completa?** - Necessaria para recomendacao #10.
2. **Os laudos precisam sempre seguir lexicos oficiais (BI-RADS/TI-RADS/NASCET) em todos provedores de IA?** - Necessaria para recomendacao #1.
3. **Ha identificacao de paciente disponivel no frontend para chavear o auto-save?** - Necessaria para recomendacao #3.
4. **Qual politica de envio de dados a provedores externos (Gemini/OpenAI/Claude)?** - Necessaria para recomendacao #3 e LGPD.

---

## PARTE IX: Anexos

### 9.1 Glossario de termos medicos utilizados

- **BI-RADS**: padrao ACR para classificacao de lesoes mamarias.
- **TI-RADS**: padrao ACR para classificacao de nodulos tiroideanos.
- **NASCET**: criterio para graduar estenose carotidea.
- **EMI**: espessamento medio-intimal.
- **VPS/VDF**: velocidade de pico sistolico / velocidade diastolica final.
- **Gray-Weale**: classificacao morfologica de placas.
- **CEAP**: classificacao clinica de doenca venosa.
- **ITB**: indice tornozelo-braco.
- **SWE**: elastografia por onda de cisalhamento.

### 9.2 Referencias clinicas consultadas

- ACR BI-RADS (5a edicao).
- ACR TI-RADS (2017).
- NASCET criteria.
- ESVS/ESC vascular guidelines.
- SRU consensus (abdome).

### 9.3 Metricas sugeridas para monitoramento

- Tempo medio de geracao de laudo por modalidade.
- Percentual de orgaos cobertos por exame (unique).
- Taxa de campos criticos nao preenchidos.
- Erros de validacao por modalidade.
- Custo medio de IA por laudo (tokens).
