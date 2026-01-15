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

## Sessao 2026-01-15 - Resumo

### Concluido
- Novo modulo: **Ombro** (manguito rotador completo)
  - 7 estruturas: Biceps, Supraespinhal, Infraespinhal, Subescapular, Bursa, Art. AC, Derrame
  - 20+ achados com campos detalhados (face da rotura, extensao %, gap, atrofia)
- Sub-modalidades do Abdome (Total, Superior, Vias Urinarias, Prostata)
- Multiplas instancias para Cistos Renais e Massa Renal
- Campo dimensao em Colelitiase
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
- [x] Carotidas - Bulbos criados, Gray-Weale automatico
- [x] Ombro - Modulo completo com manguito rotador
- [ ] Carotidas - Simplificar placas em ACC/ACI/ACE (mesmo padrao dos bulbos)
- [ ] Tireoide - Migrar constantes para commonFields
- [ ] Mama - Migrar constantes para commonFields
- [ ] Arterial MMII - Migrar constantes
- [ ] Venoso MMII - Migrar constantes
- [ ] Vasos Abdominais - Migrar constantes
- [ ] Parede Abdominal - Migrar constantes

### Fase 2: Calculadoras Automaticas
- [x] NASCET/ESVS Calculator (Carotidas)
- [x] Gray-Weale automatico (Carotidas)
- [x] TI-RADS Calculator (Tireoide)
- [x] BI-RADS Calculator (Mama)
- [ ] CEAP/VCSS Calculator (Venoso)
- [ ] WIfI/Fontaine Calculator (Arterial)
- [ ] Bosniak Calculator (Abdome - cistos renais)

### Fase 3: UX/Interface
- [ ] Sidebar com agrupamento bilateral em todos os exames
- [ ] FindingDetails especifico para cada modalidade
- [ ] Preview do laudo em tempo real
- [ ] Atalhos de teclado para adicionar achados

### Fase 4: Integracao e Export
- [ ] Exportacao PDF com formatacao customizada
- [ ] Integracao com PACS/RIS
- [ ] Templates de laudo por patologia
- [ ] Historico de laudos por paciente

### Fase 5: IA Avancada
- [ ] Sugestao automatica de achados baseado em contexto
- [ ] Correlacao clinico-radiologica
- [ ] Frases padronizadas por instituicao

---

## Padroes de Codigo

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
  'emiValue',      // usa 'emi'
  'nascet',        // usa 'nascetGrade'
  'ratio',         // usa 'ratioICA_CCA'
  'plaqueEchogenicity',  // usa 'echogenicity'
  // ...
]);
```

---

## Troubleshooting

| Problema | Solucao |
|----------|---------|
| Painel fecha ao selecionar dropdown | `useDropdownGuard` |
| Observacoes com checkbox "Normal" | `hideNormalOption: true` |
| Nao adiciona multiplas lesoes | Precisa campo `lado` como primeiro extraField |
| EMI duplicando no laudo | Verificar REDUNDANT_FIELDS |
| organsCatalog.find is not a function | Exportar como array `Organ[]`, nao objeto |
| Gray-Weale nao aparece | Verificar getGrayWealeType() |

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
