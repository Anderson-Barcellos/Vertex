# Vertex V2 - Documentacao Claude

**Sistema de Geracao de Laudos Ultrassonograficos com IA**  
**Versao:** 2.3.0 | **Dev Server:** http://localhost:8200

---

## Stack

- **Frontend:** React 19 + TypeScript 5.9 + Vite 7.2.0
- **Estilizacao:** Tailwind CSS v4 + Radix UI
- **IA:** Gemini 3.0 Pro + OpenAI GPT-4 + Claude Sonnet (streaming)

---

## Arquitetura

```
src/
├── pages/
│   ├── LandingPage.tsx           # Landing page principal
│   ├── LoginPage.tsx
│   └── exams/
│       ├── shared/
│       │   └── BaseExamPage.tsx  # Template base - TODA logica comum
│       └── modules/              # Modulos de configuracao (~6 linhas cada)
│           ├── AbdomeTotalExam.tsx
│           ├── CarotidExam.tsx
│           ├── ThyroidExam.tsx
│           ├── BreastExam.tsx
│           ├── ArterialExam.tsx
│           ├── VenousExam.tsx
│           ├── AbdominalVesselsExam.tsx
│           ├── AbdominalWallExam.tsx
│           └── OmbroExam.tsx
├── data/
│   ├── examConfigs.ts            # CONFIGS CENTRALIZADAS
│   ├── shared/
│   │   ├── commonFields.ts       # Constantes compartilhadas (LATERALITY, PLAQUE_COMPOSITION, etc)
│   │   └── commonOrgans.ts       # createObservacoesOrgan()
│   ├── organs.ts                 # Abdome (100% migrado para commonFields)
│   ├── carotidOrgans.ts          # Carotidas + Bulbos (parcialmente migrado)
│   ├── ombroOrgans.ts            # Ombro - manguito rotador completo
│   └── *Organs.ts                # Dados especificos de cada exame
├── components/
│   ├── original/
│   │   ├── Sidebar.tsx
│   │   ├── ReportCanvas.tsx
│   │   ├── FindingDetailsGeneric.tsx
│   │   └── CarotidFindingDetails.tsx  # Especifico com Gray-Weale automatico
│   └── shared/
│       ├── TiradsCalculatorPanel.tsx
│       ├── PlaqueRiskCalculatorPanel.tsx
│       └── FloatingOrganPanelModern.tsx
├── hooks/
│   └── useAutoSave, useDropdownGuard
└── services/
    ├── promptBuilder.ts          # Filtro de campos redundantes
    ├── reportGenerator.ts
    └── unifiedAIService.ts
```

---

## Estado das Modalidades

| Modalidade | FindingDetails | Classificador | commonFields | Status |
|------------|----------------|---------------|--------------|--------|
| **Abdome** | Generic | - | 100% | Ativo |
| **Carotidas** | Especifico | NASCET + Gray-Weale | Parcial | Ativo |
| **Ombro** | Generic | - | 100% | Ativo |
| **Tireoide** | Especifico | TI-RADS ACR | - | Desativado* |
| **Mama** | Especifico | BI-RADS 5a Ed | - | Desativado* |
| **Arterial** | Generic | - | - | Desativado* |
| **Venoso** | Generic | - | - | Desativado* |
| **Vasos Abd** | Generic | - | - | Desativado* |
| **Parede** | Generic | - | - | Desativado* |

*Desativado = removido temporariamente da LandingPage ate migracao completa

---

## Sessao 2026-01-20 - Ultima Atualizacao

### Concluido
- **Reestruturacao completa das Carotidas**: 
  - Estrutura hibrida com helper functions (createPlaqueFindings, createHemodynamicFindings, etc)
  - Manteve 10 vasos individuais mas com codigo reutilizavel
  - Adicionou novos achados: dissecao, aneurisma, tortuosidade (kinking/coiling)
  - Reducao de 1745 para 1594 linhas com mais funcionalidades
- **Correcao da duplicacao da EMI**:
  - Adicionados todos campos EMI em REDUNDANT_FIELDS (emi_value, emi_classification, emiClassification)
  - Problema resolvia no promptBuilder.ts
- **Limpeza de arquivos mortos**: 6 arquivos removidos
- Novo modulo: **Ombro** (manguito rotador completo)
  - 7 estruturas: Biceps, Supraespinhal, Infraespinhal, Subescapular, Bursa, Art. AC, Derrame
  - 20+ achados com campos detalhados (face da rotura, extensao %, gap, atrofia)
- Sub-modalidades do Abdome (Total, Superior, Vias Urinarias, Prostata)
- LandingPage: card "Abdome" (hub) + card "Ombro" (cyan)

### Sessao 2026-01-13
- Migracao 100% do Abdome para commonFields.ts
- Reorganizacao de pastas: `pages/exams/shared/` e `pages/exams/modules/`
- Gray-Weale automatico baseado em ecogenicidade + composicao
- Constantes comuns: PLAQUE_COMPOSITION, PLAQUE_SURFACE

### Funcao getGrayWealeType melhorada
```typescript
// Infere automaticamente o tipo Gray-Weale
getGrayWealeType(ecogenicity, composition) 
// Retorna: 'I' | 'II' | 'III' | 'IV' | ''

// Descricoes de risco
GRAY_WEALE_DESCRIPTIONS = {
  'I': 'Uniformemente ecolucente - ALTO RISCO',
  'II': 'Predominantemente ecolucente - ALTO RISCO',
  'III': 'Predominantemente ecogenica - RISCO MODERADO',
  'IV': 'Uniformemente ecogenica - BAIXO RISCO'
}
```

---

## Roadmap Detalhado

### Fase 1: Migracao de Dados (Em andamento)
- [x] Abdome Total - 100% commonFields + sub-modalidades
- [x] Carotidas - Estrutura hibrida com helper functions + Gray-Weale automatico
- [x] Ombro - Modulo completo com manguito rotador
- [ ] Tireoide - Migrar constantes para commonFields
- [ ] Mama - Migrar constantes para commonFields
- [ ] Arterial MMII - Migrar constantes
- [ ] Venoso MMII - Migrar constantes
- [ ] Vasos Abdominais - Migrar constantes
- [ ] Parede Abdominal - Migrar constantes

### Fase 2: Proximas Prioridades (Q1 2026)
- [ ] Reativar exames desabilitados (Tireoide, Mama, Arterial, Venoso)
- [ ] Migrar constantes restantes para commonFields
- [ ] Testes unitarios para helper functions
- [ ] Documentacao API interna

### Fase 3: Calculadoras Automaticas
- [x] NASCET/ESVS Calculator (Carotidas)
- [x] Gray-Weale automatico (Carotidas)
- [x] TI-RADS Calculator (Tireoide)
- [x] BI-RADS Calculator (Mama)
- [ ] CEAP/VCSS Calculator (Venoso)
- [ ] WIfI/Fontaine Calculator (Arterial)
- [ ] Bosniak Calculator (Abdome - cistos renais)
- [ ] Manguito Rotador Score (Ombro)

### Fase 4: UX/Interface (Q2 2026)
- [ ] Sidebar com agrupamento bilateral em todos os exames
- [ ] FindingDetails especifico para cada modalidade
- [ ] Preview do laudo em tempo real
- [ ] Atalhos de teclado para adicionar achados
- [ ] Dark mode
- [ ] Mobile responsive

### Fase 5: Integracao e Export (Q2-Q3 2026)
- [ ] Exportacao PDF com formatacao customizada
- [ ] Integracao com PACS/RIS
- [ ] Templates de laudo por patologia
- [ ] Historico de laudos por paciente
- [ ] API REST para integracao externa

### Fase 6: IA Avancada (Q3-Q4 2026)
- [ ] Sugestao automatica de achados baseado em contexto
- [ ] Correlacao clinico-radiologica
- [ ] Frases padronizadas por instituicao
- [ ] Analise de imagens com Vision AI

---

## Padroes de Codigo

### Helper Functions para Evitar Duplicacao (Novo!)
```typescript
// Criar funcoes reutilizaveis ao inves de duplicar codigo
const createPlaqueFindings = (defaultSide?: string): Finding[] => [...]
const createHemodynamicFindings = (defaultSide?: string, segmentOptions?: string[]): Finding[] => [...]

// Uso em multiplos orgaos
findings: createPlaqueFindings('direito')
findings: createPlaqueFindings('esquerdo')
```

### Template de Exame (6 linhas)
```typescript
import BaseExamPage from '../shared/BaseExamPage';
import { arterialConfig } from '@/data/examConfigs';

export default function ArterialExam() {
  return <BaseExamPage config={arterialConfig} />;
}
```

### Constantes Compartilhadas
```typescript
// Em commonFields.ts
export const PLAQUE_COMPOSITION = ['Homogenea', 'Heterogenea', 'Calcificada', 'Mista'] as const;

// Em *Organs.ts - importar e usar
import { PLAQUE_COMPOSITION } from './shared/commonFields';
options: PLAQUE_COMPOSITION
```

### Campos Redundantes (promptBuilder.ts)
```typescript
const REDUNDANT_FIELDS = new Set([
  'measurement',   // remove quando ha campos especificos
  'emi',           // mantem apenas 'emi_value'
  'emiValue',      // evita duplicacao
  'emi_classification', // campo ja processado  
  'emiClassification',  // evita duplicacao
  'nascet',        // usa 'nascetGrade'
  'ratio',         // usa 'ratioICA_CCA'
  'plaqueEchogenicity',  // usa 'echogenicity'
  'plaqueComposition', // evita duplicacao
  'plaqueSurface',     // evita duplicacao
  'vertebralFlowPattern', // evita duplicacao
  'flowPattern',    // evita duplicacao
]);
```

---

## Troubleshooting

| Problema | Solucao |
|----------|---------|  
| Painel fecha ao selecionar dropdown | `useDropdownGuard` |
| Observacoes com checkbox "Normal" | `hideNormalOption: true` |
| Nao adiciona multiplas lesoes | Precisa campo `lado` como primeiro extraField |
| EMI duplicando no laudo | Adicionar todos campos EMI em REDUNDANT_FIELDS |
| organsCatalog.find is not a function | Exportar como array `Organ[]`, nao objeto |
| Gray-Weale nao aparece | Verificar getGrayWealeType() |

---

## Guidelines de Programacao

### 1. Organizacao de Arquivos
- **pages/exams/modules/**: Apenas templates minimos (6 linhas)
- **pages/exams/shared/**: Logica compartilhada (BaseExamPage)
- **data/*Organs.ts**: Dados especificos de cada exame
- **data/shared/commonFields.ts**: Constantes reutilizaveis

### 2. Principio DRY (Don't Repeat Yourself)
- Use helper functions para achados repetitivos
- Importe constantes de commonFields.ts
- Evite duplicacao de strings/opcoes

### 3. Performance
- Lazy loading para modulos de exame
- useCallback/useMemo onde apropriado
- Evite re-renders desnecessarios

### 4. Nomenclatura
- IDs unicos com padrao: `${nome-achado}-${lado}`
- Helper functions: `create[Tipo]Findings`
- Constantes: UPPERCASE_SNAKE_CASE

### 5. Estado e Props
- tempDetails para estado temporario de findings
- onTempDetailsChange para sincronizar com parent
- Manter estado local quando nao ha callback

---

## Autenticacao

- **Login:** anders / vertex2025

---

## Contexto

**Dev:** Dr. Anderson (Anders) - Santa Cruz do Sul, RS  
**Branch:** master

---

## Memoria (Memory Layer V2)

### Comandos
```bash
/memorypack                    # Indexa conversas pendentes
/memsearch "query"             # Busca semantica
/compact                       # Gera resumo da sessao (usar ~60% contexto)
```

### CLI Direto
```bash
/root/.claude/memory/venv/bin/python /root/.claude/memory/cli_v2.py search "termo" --project vertex
```

---

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
