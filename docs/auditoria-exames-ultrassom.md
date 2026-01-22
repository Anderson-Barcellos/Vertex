# Auditoria Técnica e de Usabilidade — Módulos de Exames Ultrassonográficos (Vertex V2)

Data: 2026-01-20

## Sumário Executivo
O Vertex V2 já apresenta uma base sólida para geração de laudos, com arquitetura modular de exames e recursos de UX importantes para o contexto clínico (auto‑save, seleção rápida de normalidade, múltiplas instâncias de achados e painéis de ação). Alguns módulos estão clinicamente muito ricos — especialmente Carótidas, Tireoide e Mama — com léxicos estruturados e cálculos auxiliares que elevam a qualidade do laudo.

Ao mesmo tempo, há fragilidades técnicas que impactam diretamente a completude clínica e a confiabilidade do output. A principal é a inconsistência entre módulos no uso de estruturas compartilhadas e no componente de detalhes dos achados, o que pode impedir o registro de medidas essenciais em algumas seções (ex.: Abdome Total). Há ainda lacunas clínicas relevantes em certos exames (ex.: vias biliares e sistema portal em Abdome Total; sistema venoso pélvico em Venoso), além de inconsistências terminológicas e ausência de validações e cálculos automáticos que seriam especialmente valiosos em Doppler.

Em resumo: o sistema está bem encaminhado, mas precisa de padronização estrutural, reforço de completude clínica e melhorias de usabilidade focadas em reduzir cliques e evitar omissões. As recomendações abaixo priorizam impacto clínico e segurança do laudo.

---

## Análise por Seção de Exame

### 1) Abdome Total
**Completude Técnica**
- Cobertura adequada para fígado, vesícula, pâncreas, rins, baço, bexiga, próstata e aorta.
- Lacunas relevantes: vias biliares (intra/extra‑hepáticas e colédoco), veia porta e veias hepáticas, veia cava inferior, adrenais, retroperitônio/linfonodos e avaliação pélvica feminina (útero e anexos). Para “abdome total”, essas estruturas são esperadas na prática clínica contemporânea.
- Falta registro estruturado de medidas “normais” (ex.: tamanhos renais e hepáticos) quando desejado.

**Qualidade da Terminologia Médica**
- Terminologia geral é adequada; descrições são clínicas e compreensíveis.
- Alguns termos poderiam padronizar abreviações e estilos (“US+”, “JUP” e variações de termos anatômicos), para manter consistência com outros módulos.

**Fluxo de Trabalho e Usabilidade**
- O exame usa FindingDetailsGeneric, que não apresenta campos padrão de medida/localização quando `hasMeasurement/hasLocation` é usado sem `extraFields`. Resultado: várias lesões (ex.: cisto hepático, hemangioma, nódulo sólido) ficam sem campo para medidas/localização no fluxo real. Isso compromete a qualidade do laudo e a velocidade do usuário.
- Observações aparecem como um órgão com opção de “normalidade”, o que não agrega valor e pode confundir o usuário.

**Consistência entre Seções**
- Este módulo usa listas compartilhadas, mas ainda mantém observações manuais e campos únicos que poderiam ser padronizados.

**Funcionalidades de Doppler**
- Não há campos estruturados para Doppler em abdome (ex.: veia porta, artéria hepática, índices renais). Isso reduz a capacidade de documentar fluxos quando o Doppler é parte do exame.

**Potencial para Automação e Validação**
- Validação numérica de medidas (mm/cm) e padronização de unidades.
- Cálculo automático de volume prostático e classificação de esteatose/ascite com base em critérios pré‑definidos.

---

### 2) Ecodoppler de Carótidas e Vertebrais
**Completude Técnica**
- Cobertura robusta: placas, estenose, oclusão, suboclusão, EMI, variações anatômicas e vertebrais. Inclui critérios NASCET/IAC, GSM, placa vulnerável, roubo da subclávia.
- Muito completo para uso clínico de rotina e pesquisa.

**Qualidade da Terminologia Médica**
- Terminologia avançada adequada (GSM, Gray‑Weale, NASCET, EMI).
- Há mistura de nomenclaturas em português e siglas em inglês sem padronização de apresentação; isso pode ser uniformizado para consistência nos laudos.

**Fluxo de Trabalho e Usabilidade**
- Há cálculo automático de estenose com base em VPS/VDF/razão, o que é um ponto forte.
- Muitos campos numéricos são “text”, sem validação; alto risco de digitação inconsistente (cm/s vs mm/s; valores com texto).

**Consistência entre Seções**
- Parte das constantes é duplicada no componente (limiares e critérios). Isso gera risco de divergência futura entre dados e UI.

**Funcionalidades de Doppler**
- Excelente cobertura espectral e colorido; inclui ratios, critérios hemodinâmicos e parâmetros de risco.
- Faltam validações automáticas de coerência (ex.: VPS alto com NASCET “leve”).

**Potencial para Automação e Validação**
- Auto‑preenchimento de NASCET e sugestão de intervenção já iniciado; ampliar para alertas de inconsistência (ex.: VPS/ratio discordantes).
- Padronizar unidades e inserir máscaras numéricas para velocidades/índices.

---

### 3) Tireoide
**Completude Técnica**
- Inclui TI‑RADS 2017 completo, elastografia, volumetria, linfonodos e paratireoides — excelente cobertura.
- Falta visão de volume total (soma de lobos + istmo) e parâmetros como tempo de seguimento e categoria final TI‑RADS por glândula.

**Qualidade da Terminologia Médica**
- Há inconsistência ortográfica (“Tireóide”, “Tireoide”, “tiroidiano”). Recomenda‑se padronizar para “Tireoide/tireoidiano”.

**Fluxo de Trabalho e Usabilidade**
- O componente especializado calcula TI‑RADS automaticamente: ponto muito positivo.
- Campos de volumetria pedem dimensões, mas o cálculo de volume total por sexo não é exposto ao usuário; isso gera passo manual desnecessário.

**Consistência entre Seções**
- Listas internas duplicam campos que já existem em `shared` (vascularização, ecotextura, regiões), criando divergência potencial.

**Funcionalidades de Doppler**
- Padrão de vascularização e elastografia estão presentes, mas sem índices (RI/PI) quando relevantes.

**Potencial para Automação e Validação**
- Calcular e exibir volume do lobo automaticamente + classificação (normal/aumentado/reduzido) já existe no código, mas pode ser automatizado e mostrado no fluxo.
- Regra automática para recomendação de PAAF baseada em tamanho + TI‑RADS.

---

### 4) Mama (Ultrassonografia Mamária)
**Completude Técnica**
- BI‑RADS estruturado com léxico detalhado, elastografia, Doppler, cistos, alterações cutâneas/ductais e linfonodos axilares — cobertura muito boa.
- Lacunas: ausência de avaliação de próteses mamárias; profundidade (anterior/médio/posterior) existe como constante, mas não aparece no formulário; ausência de indicação explícita de “lesão não‑massa”.

**Qualidade da Terminologia Médica**
- Termos BI‑RADS estão bem aplicados e atualizados.
- Alguns termos de Doppler e elastografia são apresentados como “Emean/Emax/SWE” sem explicitar unidade obrigatória (kPa) em todos os campos.

**Fluxo de Trabalho e Usabilidade**
- O cálculo de BI‑RADS por pontuação é um diferencial, mas o usuário ainda precisa interpretar o resultado e não há confirmação obrigatória do BI‑RADS final por mama.
- Há boa organização por nódulo/cisto, porém várias seções “condicionais” ficam invisíveis até serem acionadas — risco de subutilização.

**Consistência entre Seções**
- O léxico é coerente internamente, porém a nomenclatura de localização (relógio/quadrante) difere de outras seções que usam “localização livre”.

**Funcionalidades de Doppler**
- Cobertura completa (fluxo, padrão vascular, RI). Ótimo.

**Potencial para Automação e Validação**
- Auto‑geração de BI‑RADS final por mama e validação mínima (ex.: nódulo suspeito sem margens preenchidas) aumentariam segurança.
- Sugestões diagnósticas já existem; podem ser exibidas como checklist obrigatório quando BI‑RADS ≥ 4.

---

### 5) Ecodoppler Arterial de Membros Inferiores
**Completude Técnica**
- Segmentação aorto‑ilíaco, femoral, poplíteo e infrapoplíteo com PSV/VR e padrões de onda. Inclui ITB/IDB e WIfI.
- Faltam elementos usuais como avaliação de enxertos/stents, estenose por aceleração de fluxo distal, e “runoff” distal (número de artérias pérvias até o pé).

**Qualidade da Terminologia Médica**
- Terminologia adequada, porém com abreviações não padronizadas (“VR” vs “Velocity Ratio”, “MID/MIE”).

**Fluxo de Trabalho e Usabilidade**
- Muitos campos são texto livre; sem validação numérica e sem cálculo automático do ITB/IDB, o preenchimento é mais lento e sujeito a erro.

**Consistência entre Seções**
- Usa `createObservacoesOrgan` (bom), mas mantém listas clínicas duplicadas de ITB/WIfI em vez de usar `shared`.

**Funcionalidades de Doppler**
- Cobertura básica adequada (PSV, padrão de onda). Faltam EDV, tempo de aceleração e índices hemodinâmicos para casos complexos.

**Potencial para Automação e Validação**
- Cálculo automático de ITB/IDB, classificação e alertas para incompressibilidade.
- Sugestão automática de grau de estenose baseada em VR/PSV.

---

### 6) Ecodoppler Venoso de Membros Inferiores
**Completude Técnica**
- Cobertura ampla: TVP aguda/crônica, refluxos profundos e superficiais, perfurantes, panturrilha, CEAP e VCSS, May‑Thurner.
- Ausência de documentação estruturada de fluxo espontâneo, fasicidade respiratória e resposta à compressão distal em veias profundas (itens clássicos do estudo Doppler venoso).

**Qualidade da Terminologia Médica**
- Termos adequados, porém “Manobra de Paraná” não é consenso amplo e pode gerar dúvida em ambientes fora da região.

**Fluxo de Trabalho e Usabilidade**
- Alta densidade de campos por segmento; pode ser pesado em exames em série. Falta um modo “rápido” para estudos negativos.

**Consistência entre Seções**
- CEAP/VCSS são definidos localmente e poderiam ser centralizados como em `shared`.

**Funcionalidades de Doppler**
- Refluxo é documentado, mas não há campos dedicados para fasicidade/espontaneidade/augmentação — itens críticos para excluir trombose proximal.

**Potencial para Automação e Validação**
- Cálculo automático do VCSS total.
- Validação de refluxo patológico com tempo informado (ex.: >0,5s superficial).

---

### 7) Ecodoppler de Vasos Abdominais
**Completude Técnica**
- Inclui aorta, tronco celíaco, AMS, AMI, artérias renais e ilíacas comuns, com critérios hemodinâmicos e aneurismas.
- Faltam sistemas venosos (porta, hepáticas, cava), artéria hepática/esplênica e parâmetros renais intraparenquimatosos (aceleration time, RI segmentar) em casos de estenose renal.

**Qualidade da Terminologia Médica**
- Boa terminologia, porém critérios de estenose aparecem em múltiplos formatos (texto livre vs listas). Recomenda‑se padronização para evitar interpretações divergentes.

**Fluxo de Trabalho e Usabilidade**
- Muitos campos de texto livre e poucas validações; risco de inconsistência entre valores e classificação selecionada.

**Consistência entre Seções**
- Não reutiliza padrões de fluxo e trombo mural existentes no `shared`, criando duplicação.

**Funcionalidades de Doppler**
- Cobertura sólida para PSV/EDV e RAR, mas faltam índices adicionais e campos para variação respiratória (ex.: síndrome do ligamento arqueado).

**Potencial para Automação e Validação**
- Classificação automática de estenose (renal, celíaco, mesentérica) com base em PSV/EDV/RAR.
- Alertas para aneurisma em faixas cirúrgicas.

---

### 8) Parede Abdominal
**Completude Técnica**
- Muito completo para hérnias (inguinal direta/indireta, femoral, umbilical, epigástrica, incisional, Spiegel, lombar), com conteúdo e redutibilidade.
- Inclui lesões de partes moles e complicações de tela cirúrgica.

**Qualidade da Terminologia Médica**
- Terminologia boa e aplicável à prática clínica.

**Fluxo de Trabalho e Usabilidade**
- Exame é detalhado, mas pode ser verboso. Seria útil um “modo rápido” para ausência de hérnia.

**Consistência entre Seções**
- Listas de hérnia e manobras duplicam o `shared`, gerando manutenção paralela.

**Funcionalidades de Doppler**
- Não aplicável, mas poderia existir campo opcional de vascularização em massas/lesões para aumentar a precisão diagnóstica.

**Potencial para Automação e Validação**
- Padronização automática de unidades (mm vs cm) e cálculo de área do defeito (óstio × saco) quando ambos preenchidos.

---

### 9) Ombro (USG Musculoesquelética)
**Completude Técnica**
- Boa cobertura de manguito rotador (supra, infra, subescapular), tendão do bíceps, bursa subacromial, AC e derrame.
- Lacunas: teres minor, dinâmica do impacto subacromial, avaliação do intervalo rotador, ligamentos e labrum (quando aplicável), além de tendão do peitoral maior (em alguns protocolos).

**Qualidade da Terminologia Médica**
- Terminologia correta, mas sem descrições de normalidade para cada estrutura (impacta laudo normal).

**Fluxo de Trabalho e Usabilidade**
- Sem normalDescription por órgão; isso enfraquece a geração automática de laudos normais.

**Consistência entre Seções**
- Usa `createObservacoesOrgan`, mas passou um segundo parâmetro inválido (não utilizado). Isso indica divergência na API interna.

**Funcionalidades de Doppler**
- Doppler não é central neste exame, mas poderia estar disponível em bursites/tenossinovites para distinguir inflamatório.

**Potencial para Automação e Validação**
- Sugestões automáticas de gravidade (parcial vs completa) com base nas medidas inseridas.

---

## Achados Críticos
1. **Abdome Total**: uso de FindingDetailsGeneric impede preenchimento de medidas/localização em achados que não possuem `extraFields`, comprometendo a completude clínica do laudo.
2. **Ombro**: ausência de `normalDescription` por órgão pode gerar laudos normais incompletos ou com texto vazio/“undefined”.
3. **Templates de prompt por exame**: chaves de `examType` não correspondem aos valores reais configurados, o que impede o uso dos templates especializados.
4. **Duplicação de critérios clínicos** (especialmente em Carótidas): valores em componentes divergentes dos dados base podem gerar inconsistência diagnóstica.
5. **Ausência de validação numérica e unidades** em campos críticos (velocidades, diâmetros e índices) aumenta risco de erro e laudos incoerentes.

---

## Oportunidades de Melhoria (priorizadas)
**Alta prioridade**
- Padronizar o componente de detalhes de achados para garantir medidas/localização em todos os exames (ou garantir `extraFields` completos quando usar o genérico).
- Corrigir o mapeamento de `examType` para templates especializados de prompt.
- Normalizar unidades e adicionar validação numérica mínima (mm, cm, cm/s, kPa).
- Garantir `normalDescription` em todos os órgãos do módulo de Ombro.

**Média prioridade**
- Centralizar listas clínicas em `shared` (CEAP, WIfI, refluxo, hérnias, vascularização, etc.) para evitar divergências.
- Expandir completude clínica dos módulos com maior lacuna (Abdome Total, Vasos Abdominais, Venoso).
- Automatizar cálculos simples: ITB/IDB, VCSS total, classificação por PSV/RAR, volume tireoidiano.

**Baixa prioridade**
- Refinar textos de “normalidade” para reduzir repetição e aumentar fluidez nos laudos.
- Padronizar abreviações e idioma de siglas (PT‑BR com glossário padronizado).

---

## Considerações Técnicas
- **Inconsistência de componentes**: alguns exames usam `FindingDetailsGeneric`, outros usam versões especializadas. Isso gera experiências diferentes e perda de campos essenciais.
- **Campo vs Label**: o prompt e o fallback textual usam IDs internos dos campos; quando não mapeados, aparecem termos pouco clínicos no laudo. A lista de `FIELD_LABELS` precisa acompanhar todos os `extraFields` reais.
- **Templates de prompt**: a escolha é feita por string exata de `examType`. Hoje há divergências entre o `examType` do config e a chave dos templates, reduzindo a qualidade do laudo gerado.
- **Duplicação de léxicos**: várias constantes clínicas são redefinidas em módulos específicos, aumentando o custo de manutenção e o risco de divergência terminológica.

---

## Próximos Passos Recomendados (roadmap)
1) **Correções críticas e padronização de entradas**: unificar o componente de detalhes ou garantir campos equivalentes, ajustar `examType` para templates, garantir `normalDescription` no Ombro e padronizar unidades.
2) **Automação de cálculos clínicos**: ITB/IDB, VCSS, TI‑RADS, BI‑RADS final por mama, estenose renal/mesentérica por PSV/EDV/RAR.
3) **Completar módulos com lacunas clínicas**: vias biliares e sistema portal no abdome; venoso pélvico e critérios de fasicidade; vasos abdominais com sistema porta e IVC.
4) **Harmonização terminológica**: unificar léxicos via `shared` e revisar nomenclatura ortográfica (tireoide/tireóide, tiroidiano/tireoidiano).

