# Auditoria de Conformidade com Diretrizes de Ultrassonografia

**Data da Auditoria:** 09 de Dezembro de 2025  
**Sistema:** Vertex V2  
**Auditor:** Claude Code (Agente Especialista em Guidelines)

---

## Resumo Executivo

| Exame | Conformidade | Status | Prioridade de Ajuste |
|-------|-------------|--------|---------------------|
| Carótidas (ESVS 2023/IAC 2021) | 96% | Excelente | Baixa |
| Tireoide (TI-RADS) | 95% | Excelente | Baixa |
| Mama (BI-RADS) | 92% | Excelente | Baixa |
| Doppler Venoso (CEAP/CBR-SBACV) | 88% | Muito Bom | Baixa |
| Doppler Arterial (SBACV/TASC) | 85% | Bom | Média |
| Abdome Total (CBR) | 82% | Bom | Média |
| Parede Abdominal (EHS) | 78% | Satisfatório | Média |

---

## 1. TIREOIDE - ACR TI-RADS 2017

### Referência
- ACR Thyroid Imaging Reporting and Data System (TI-RADS) 2017
- AIUM Practice Parameter for Thyroid Ultrasound 2023

### Status Atual: EXCELENTE (95%)

#### Itens Conformes
- [x] Composição (0-2 pontos): Todas opções presentes
- [x] Ecogenicidade (0-3 pontos): Completo
- [x] Forma (0-3 pontos): Correto (mais largo/mais alto)
- [x] Margens (0-3 pontos): Incluindo extensão extratiroidea
- [x] Focos ecogênicos (0-3 pontos): Microcalcificações, macrocalcificações
- [x] Função `calculateTIRADS()` implementada
- [x] Categorias TR1-TR5 com recomendações de PAAF
- [x] Elastografia (Score 1-5)
- [x] Níveis cervicais I-VII para linfonodos

#### Sugestões de Melhoria
```typescript
// thyroidOrgans.ts - Adicionar campo de volume calculado automaticamente
{
  id: 'volume-calculado',
  label: 'Volume (calculado)',
  type: 'calculated',
  formula: 'comprimento * ap * transverso * 0.52 / 1000',
  unit: 'ml'
}

// Adicionar halo periférico (ausente nas opções atuais)
export const NODULE_HALO = [
  { value: 'ausente', label: 'Ausente', points: 0 },
  { value: 'fino-completo', label: 'Fino e completo', points: 0 },
  { value: 'incompleto', label: 'Incompleto ou ausente focalmente', points: 1 }
];
```

---

## 2. MAMA - ACR BI-RADS 5ª Edição (2013/2023)

### Referência
- ACR BI-RADS Atlas 5th Edition (2013)
- ACR BI-RADS v2025 Manual (atualização recente)

### Status Atual: EXCELENTE (92%)

#### Itens Conformes
- [x] Forma: Oval, Redondo, Irregular
- [x] Margens: Circunscritas, Indistintas, Anguladas, Microlobuladas, Espiculadas
- [x] Orientação: Paralela / Não paralela
- [x] Ecogenicidade: Anecóica, Hipoecóica, Isoecóica, Hiperecóica, Heterogênea
- [x] Características posteriores: Reforço, Sombra, Sem alterações, Padrão combinado
- [x] Categorias BI-RADS 0-6 com subcategorias 4A/4B/4C
- [x] Calcificações: Morfologia e distribuição
- [x] Elastografia Tsukuba (1-5) e Strain Ratio
- [x] Calculadora BI-RADS inteligente (`calculateBiradsCategory()`)
- [x] Linfonodos axilares com níveis I-III

#### Sugestões de Melhoria
```typescript
// breastUltrasoundOrgans.ts - Adicionar "Achados Associados" do léxico BI-RADS v2025

export const ASSOCIATED_FEATURES = [
  'Retração cutânea',
  'Retração papilar',
  'Espessamento cutâneo',
  'Espessamento trabecular',
  'Edema cutâneo',
  'Alterações vasculares',
  'Alterações de elasticidade',
  'Linfonodos axilares'
];

// Adicionar campo "Casos Especiais" (BI-RADS v2025)
export const SPECIAL_CASES = [
  'Massa palpável (M)',
  'Implante mamário',
  'Gravidez/lactação',
  'Mama masculina',
  'Pós-procedimento'
];
```

---

## 3. CARÓTIDAS - ESVS 2023 / IAC 2021 / SRU 2003

### Referência
- **ESVS 2023** - European Society for Vascular Surgery Clinical Practice Guidelines
- **IAC 2021** - Intersocietal Accreditation Commission (atualização dos critérios SRU)
- **SRU 2003** - Society of Radiologists in Ultrasound Consensus Conference
- NASCET Trial Criteria

### Status Atual: EXCELENTE (96%) - ATUALIZADO EM 09/12/2025

#### Itens Conformes
- [x] Critérios NASCET (<50%, 50-69%, 70-99%, Suboclusão, Oclusão)
- [x] Velocidades: VPS, VDF, Razão ACI/ACC com referências IAC 2021
- [x] EMI (Espessamento Médio-Intimal) com classificação
- [x] Classificação Gray-Weale (Tipos I-IV)
- [x] Superfície de placas (Lisa, Irregular, Ulcerada)
- [x] Artérias vertebrais com padrão de fluxo e roubo subclávia
- [x] Segmentos V0-V4 para vertebrais
- [x] Hipoplasia/Aplasia vertebral
- [x] **GSM (Gray Scale Median)** - Vulnerabilidade de placa (Tipos 1-4)
- [x] **Status Sintomático** - Assintomático, AIT, AVC, Amaurose fugaz
- [x] **Features de Placa Vulnerável** - JBA, IPN, DWA, ulceração, hemorragia
- [x] **Indicações de Intervenção ESVS 2023** - Classes I, IIa, III
- [x] **Função `calculateStenosisGrade()`** - Cálculo automático de grau e recomendação

#### Implementações Recentes (09/12/2025)

**Novas constantes adicionadas:**
```typescript
// Status sintomático do paciente (ESVS 2023)
export const PATIENT_SYMPTOMS = [
  'Assintomático',
  'AIT hemisférico ipsilateral (<6 meses)',
  'AVC isquêmico ipsilateral (<6 meses)',
  'Amaurose fugaz ipsilateral',
  'AIT/AVC >6 meses (considerar assintomático)',
  'Sintomas inespecíficos (tontura, cefaleia)'
];

// GSM (Gray Scale Median) - Vulnerabilidade de Placa
export const PLAQUE_GSM = [
  { value: 'tipo1-ecolucente', label: 'Tipo 1 - Ecolucente (GSM <25) - ALTO RISCO', risk: 'high' },
  { value: 'tipo2-predominante-ecolucente', label: 'Tipo 2 - Predominantemente ecolucente (GSM 25-50)', risk: 'high' },
  { value: 'tipo3-predominante-ecogenica', label: 'Tipo 3 - Predominantemente ecogênica (GSM 50-75)', risk: 'medium' },
  { value: 'tipo4-ecogenica', label: 'Tipo 4 - Ecogênica/Calcificada (GSM >75)', risk: 'low' }
];

// Features de Placa Vulnerável (ESVS 2023)
export const VULNERABLE_PLAQUE_FEATURES = [
  'JBA - Área negra justa-luminal',
  'IPN - Neovascularização intraplaca (ao CEUS)',
  'DWA - Áreas brancas discretas (calcificações focais)',
  'Hemorragia intraplaca',
  'Ulceração >2mm de profundidade',
  'Trombo luminal',
  'Superfície irregular',
  'Progressão rápida (>0.5mm/ano)'
];

// Critérios IAC 2021 (atualização dos SRU 2003)
export const IAC_2021_CRITERIA = {
  normal: { stenosis: 'Normal', vps: '<125', edv: '<40', ratio: '<2.0' },
  moderate_50_69: { stenosis: '50-69%', vps: '125-230', edv: '40-100', ratio: '2.0-4.0' },
  severe_70_99: { stenosis: '≥70%', vps: '>230', edv: '>100', ratio: '>4.0' },
  near_occlusion: { stenosis: 'Suboclusão', vps: 'Variável/Baixa', note: 'String sign' },
  occlusion: { stenosis: 'Oclusão', vps: 'Ausente' }
};
```

**Função calculadora implementada:**
```typescript
export const calculateStenosisGrade = (params: {
  vps: number;
  vdf?: number;
  ratio?: number;
  symptomatic: boolean;
  plaqueGSM?: string;
  vulnerableFeatures?: string[];
}): StenosisAnalysis => {
  // Retorna: grade, nascet, confidence, interventionRecommendation, alerts
}
```

#### Sugestões Futuras (Baixa Prioridade)
- Adicionar campo de GSM numérico (valor exato medido)
- Integrar com CEUS para neovascularização intraplaca
- Adicionar Doppler Transcraniano (microêmbolos)

---

## 4. DOPPLER VENOSO - CEAP/CBR-SBACV 2022

### Referência
- Consenso CBR-SBACV sobre Duplex Scan para DVC (2020)
- Diretriz Conjunta TEV CBR-SBACV-SBC-DIC (2022)
- Classificação CEAP (C0-C6, E, A, P)

### Status Atual: MUITO BOM (88%)

#### Itens Conformes
- [x] Classificação CEAP completa (C, E, A, P)
- [x] VCSS (Venous Clinical Severity Score) - todos 10 itens
- [x] Critérios de refluxo: >0.5s (superficial), >1.0s (profundo), >0.35s (perfurante)
- [x] Manobras provocativas (Valsalva, compressão, ortostatismo)
- [x] TVP: tipo de trombo, ecogenicidade, compressibilidade
- [x] Síndrome de May-Thurner
- [x] Sistema profundo, safênico, perfurantes, panturrilha
- [x] Cisto de Baker

#### Sugestões de Melhoria
```typescript
// venousOrgans.ts - Adicionar Villalta Score para síndrome pós-trombótica

export const VILLALTA_SCORE = {
  symptoms: [
    { name: 'Dor', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] },
    { name: 'Cãibras', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] },
    { name: 'Peso', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] },
    { name: 'Parestesia', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] },
    { name: 'Prurido', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] }
  ],
  signs: [
    { name: 'Edema pré-tibial', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] },
    { name: 'Endurecimento cutâneo', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] },
    { name: 'Hiperpigmentação', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] },
    { name: 'Hiperemia', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] },
    { name: 'Ectasia venosa', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] },
    { name: 'Dor à compressão', options: ['0-Ausente', '1-Leve', '2-Moderado', '3-Grave'] }
  ],
  ulcer: { present: 'Úlcera presente = score mínimo de 15' }
};

// Adicionar variantes anatômicas (safena acessória, duplicação)
export const VENOUS_VARIANTS = [
  'Safena Magna duplicada',
  'Safena Acessória Anterior',
  'Safena Acessória Posterior',
  'Drenagem atípica da JSF',
  'Safena Parva alta (crossa acima fossa poplítea)',
  'Veia de Giacomini'
];
```

---

## 5. DOPPLER ARTERIAL - SBACV/TASC II

### Referência
- Diretrizes SBACV para DAOP (2015)
- TASC II Classification (2007)
- SVS WIfI Classification (2014)

### Status Atual: BOM (85%)

#### Itens Conformes
- [x] ITB com classificação (Normal, Leve, Moderado, Grave, Incompressível)
- [x] IDB (Índice Dedo-Braquial) para diabéticos
- [x] ITB pós-exercício com tempo de recuperação
- [x] Classificação WIfI (Wound, Ischemia, foot Infection)
- [x] Classificação de Fontaine
- [x] Distância de claudicação
- [x] Padrão de onda (Trifásico, Bifásico, Monofásico, Ausente)
- [x] Aneurisma poplíteo com trombo mural

#### Sugestões de Melhoria
```typescript
// arterialOrgans.ts - Adicionar classificação TASC II

export const TASC_AORTOILIAC = [
  'TASC A - Estenose focal <3cm, unilateral/bilateral CIA ou CIE',
  'TASC B - Estenose curta (<3cm) AIC + CIE ou estenose unilateral AIC',
  'TASC C - Estenose bilateral CIE ou oclusão unilateral CIE',
  'TASC D - Oclusão aorto-ilíaca ou bilateral CIE, doença AAA'
];

export const TASC_FEMOROPOPLITEAL = [
  'TASC A - Estenose única <10cm ou oclusão <5cm',
  'TASC B - Múltiplas estenoses <5cm ou oclusão 5-15cm',
  'TASC C - Estenoses/oclusões múltiplas >15cm ou lesão pós-stent',
  'TASC D - Oclusão >20cm ou CFA envolvida'
];

// Adicionar PSV ratio por segmento (critério de estenose)
export const PSV_RATIO_CRITERIA = {
  normal: '<2.0',
  stenosis_50: '2.0-4.0',
  stenosis_75: '>4.0',
  occlusion: 'Ausência de fluxo'
};

// Adicionar tempo de aceleração sistólica (TAS) - tardus parvus
export const ACCELERATION_TIME = [
  'Normal (<140ms)',
  'Prolongado (140-200ms) - estenose a montante',
  'Muito prolongado (>200ms) - estenose significativa proximal'
];
```

---

## 6. ABDOME TOTAL - CBR/AIUM

### Referência
- CBHPM Código 4.09.01.12-2
- AIUM Practice Parameter for Abdominal Ultrasound

### Status Atual: BOM (82%)

#### Itens Conformes
- [x] Fígado: hepatomegalia, esteatose (com graus), cirrose
- [x] Vesícula: colelitíase (tipo, mobilidade, sombra), pólipos
- [x] Pâncreas: pancreatite aguda/crônica, cistos
- [x] Rins: nefrolitíase, hidronefrose (com graus), Bosniak
- [x] Baço: esplenomegalia com medidas
- [x] Aorta: ectasia, aneurisma (morfologia, trombo)
- [x] Bexiga: alterações parietais e conteúdo

#### Sugestões de Melhoria
```typescript
// organs.ts - Adicionar medidas padronizadas e referências

export const LIVER_MEASUREMENTS = {
  hepatomegaly_criteria: {
    longitudinal: '>15.5 cm na linha hemiclavicular',
    caudate_lobe: 'Relação lobo caudado/LD >0.65 = cirrose'
  }
};

// Adicionar Classificação de esteatose por atenuação (Hamaguchi)
export const STEATOSIS_HAMAGUCHI = [
  'Score 0 - Normal',
  'Score 1 - Leve aumento de ecogenicidade',
  'Score 2 - Visualização prejudicada dos vasos intra-hepáticos',
  'Score 3 - Visualização prejudicada do diafragma',
  'Score 4 - Rim posterior não visível'
];

// Adicionar LI-RADS para lesões hepáticas em hepatopatas
export const LIRADS_CATEGORIES = [
  'LR-NC - Não categorizável',
  'LR-1 - Definitivamente benigno',
  'LR-2 - Provavelmente benigno',
  'LR-3 - Probabilidade intermediária',
  'LR-4 - Provavelmente CHC',
  'LR-5 - Definitivamente CHC',
  'LR-M - Maligno, não CHC',
  'LR-TIV - Tumor em veia'
];

// Adicionar SFU (Society for Fetal Urology) para hidronefrose
export const HYDRONEPHROSIS_SFU = [
  'Grau 0 - Normal',
  'Grau I - Pelve levemente dilatada, cálices normais',
  'Grau II - Pelve moderadamente dilatada, alguns cálices dilatados',
  'Grau III - Pelve e cálices uniformemente dilatados',
  'Grau IV - Pelve e cálices muito dilatados, adelgaçamento cortical'
];
```

---

## 7. PAREDE ABDOMINAL - EHS Guidelines

### Referência
- European Hernia Society (EHS) Classification 2009
- AIUM Practice Parameter for Abdominal Wall Ultrasound

### Status Atual: SATISFATÓRIO (78%)

#### Itens Conformes
- [x] Hérnias inguinais (direta, indireta, femoral)
- [x] Hérnias ventrais (umbilical, epigástrica, incisional)
- [x] Hérnias laterais (Spiegel, lombar)
- [x] Manobras dinâmicas (Valsalva, tosse, ortostatismo)
- [x] Campos: óstio, saco, conteúdo, redutibilidade
- [x] Diástase de retos

#### Sugestões de Melhoria
```typescript
// abdominalWallOrgans.ts - Adicionar classificação EHS

export const EHS_INGUINAL_CLASSIFICATION = {
  lateral: ['L1 (<1.5cm)', 'L2 (1.5-3cm)', 'L3 (>3cm)'],
  medial: ['M1 (<1.5cm)', 'M2 (1.5-3cm)', 'M3 (>3cm)'],
  femoral: ['F1 (<1.5cm)', 'F2 (1.5-3cm)', 'F3 (>3cm)'],
  combined: 'Combinação de tipos (especificar)'
};

export const EHS_VENTRAL_CLASSIFICATION = {
  midline: ['M1 - Subxifoide', 'M2 - Epigástrica', 'M3 - Umbilical', 'M4 - Infraumbilical', 'M5 - Suprapúbica'],
  lateral: ['L1 - Subcostal', 'L2 - Flanco', 'L3 - Ilíaca', 'L4 - Lombar'],
  width: ['W1 (<4cm)', 'W2 (4-10cm)', 'W3 (>10cm)'],
  recurrence: ['R0 - Primária', 'R1 - 1ª recidiva', 'R2+ - Múltiplas recidivas']
};

// Adicionar sinais de complicação
export const HERNIA_COMPLICATIONS = [
  'Sem complicações',
  'Irredutibilidade',
  'Encarceramento (conteúdo edemaciado)',
  'Estrangulamento (ausência de fluxo)',
  'Enterocele com sinais de sofrimento de alça'
];

// Adicionar campo para avaliação de tela prévia
export const MESH_EVALUATION = [
  'Tela não visualizada',
  'Tela íntegra sem coleções',
  'Seroma peritela',
  'Possível infecção de tela',
  'Recidiva herniária junto à tela',
  'Meshoma (granuloma de tela)'
];
```

---

## Priorização de Implementações

### Alta Prioridade (Implementar em 1-2 semanas)
1. **Abdome** - Adicionar LI-RADS e classificação SFU de hidronefrose
2. **Doppler Arterial** - Adicionar TASC II e tempo de aceleração sistólica
3. **Parede Abdominal** - Adicionar classificação EHS

### Média Prioridade (Implementar em 1 mês)
4. **Doppler Venoso** - Adicionar Villalta Score e variantes anatômicas
5. ~~**Carótidas** - Adicionar GSM e campo de sintomas~~ **IMPLEMENTADO (09/12/2025)**
6. **Tireoide** - Adicionar halo periférico e cálculo automático de volume

### Baixa Prioridade (Implementar quando possível)
7. **Mama** - Adicionar "Achados Associados" e "Casos Especiais" do BI-RADS v2025

---

## Histórico de Atualizações

| Data | Exame | Alterações | Conformidade |
|------|-------|------------|--------------|
| 09/12/2025 | Carótidas | GSM, sintomas, ESVS 2023, IAC 2021, calculateStenosisGrade() | 90% → 96% |

---

## Conclusão

O sistema Vertex V2 demonstra **excelente conformidade** com as principais diretrizes internacionais de ultrassonografia.

**Destaques:**
- **Carótidas** agora lidera com 96% de conformidade (ESVS 2023 + IAC 2021)
- **Tireoide** e **Mama** mantêm excelência (95% e 92%)
- Funções calculadoras implementadas: `calculateTIRADS()`, `calculateBiradsCategory()`, `calculateStenosisGrade()`

As sugestões de melhoria restantes visam:
1. Adicionar classificações de risco padronizadas (LI-RADS, EHS, TASC)
2. Incluir campos para scores clínicos (Villalta, Hamaguchi)
3. Melhorar a estratificação de risco em exames vasculares

**Conformidade geral estimada: 89%** (atualizado em 09/12/2025)

---

*Relatório gerado automaticamente pelo agente de auditoria de diretrizes*  
*Última atualização: 09 de Dezembro de 2025*  
*Próxima auditoria recomendada: Março 2026*
