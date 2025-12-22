# Arquitetura Modular de Exames - Vertex V2

**Implementado em:** 2025-12-18  
**Atualizado em:** 2025-12-22  
**Status:** Produção (Abdome, Carótidas, Tireoide migrados)

---

## Visão Geral

Sistema de templates reutilizáveis para páginas de exame, eliminando duplicação de código e centralizando lógica comum.

### Antes vs Depois

| Métrica | Antes | Depois |
|---------|-------|--------|
| Linhas por exame | ~600 | ~20-30 |
| Lógica duplicada | 8x (cada exame) | 1x (BaseExamPage) |
| Manutenção | N lugares | 1 lugar |
| Novo exame | Copiar ~600 linhas | Config de ~20 linhas |

---

## Estrutura de Arquivos

```
src/
├── types/
│   └── exam.ts                    # ExamConfig interface
├── utils/
│   └── findingAdapters.ts         # Funções utilitárias
├── pages/modern/
│   ├── BaseExamPage.tsx           # Template base (~300 linhas)
│   └── exams/
│       ├── index.ts               # Re-exports
│       ├── AbdomeTotalExam.tsx    # ✅ Migrado
│       ├── CarotidExam.tsx        # ✅ Migrado
│       ├── ThyroidExam.tsx        # ✅ Migrado
│       ├── BreastExam.tsx         # 🔜 Pendente
│       ├── ArterialExam.tsx       # 🔜 Pendente
│       ├── VenousExam.tsx         # 🔜 Pendente
│       └── WallExam.tsx           # 🔜 Pendente
```

---

## Interface ExamConfig

```typescript
interface ExamConfig {
  id: string;                      // 'abdome-total', 'carotid', etc.
  title: string;                   // "Abdome Total"
  subtitle: string;                // "Ultrassonografia Abdominal"
  examType: string;                // Para prompts IA
  organsCatalog: Organ[];          // Catálogo de órgãos/achados
  autoSaveKey: string;             // Chave para useAutoSave
  excludeFromNormalAll?: string[]; // IDs excluídos do "Marcar todos normal"
  FindingDetailsComponent?: ComponentType; // Componente customizado (opcional)
}
```

---

## Como Criar um Novo Exame

### 1. Criar arquivo de config em `src/pages/modern/exams/`

```typescript
// NovoExam.tsx
import BaseExamPage from '../BaseExamPage';
import { novoOrgans } from '@/data/novoOrgans';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'novo-exam',
  title: 'Novo Exame',
  subtitle: 'Descrição do exame',
  examType: 'Ultrassonografia de Novo Exame',
  organsCatalog: novoOrgans,
  autoSaveKey: 'novo-exam-modern',
  excludeFromNormalAll: ['observacoes-novo']
};

export default function NovoExam() {
  return <BaseExamPage config={config} />;
}
```

### 2. Adicionar export em `index.ts`

```typescript
export { default as NovoExam } from './NovoExam';
```

### 3. Adicionar rota em `App.tsx`

```typescript
import { NovoExam } from './pages/modern/exams';
// ...
<Route path="/novo-exam" element={<ProtectedRoute><NovoExam /></ProtectedRoute>} />
```

---

## Componentes de Detalhes Customizados

Para exames com campos específicos (Carótidas, Tireoide, Mama), passar um componente customizado:

```typescript
import CarotidFindingDetails from '@/components/original/CarotidFindingDetails';

const config: ExamConfig = {
  // ...
  FindingDetailsComponent: CarotidFindingDetails
};
```

### Componentes Disponíveis

| Exame | Componente | Campos Específicos |
|-------|------------|-------------------|
| Abdome | `FindingDetailsGeneric` | Básico |
| Carótidas | `CarotidFindingDetails` | VPS, VDF, NASCET, placas |
| Tireoide | `ThyroidFindingDetails` | TI-RADS ACR 2017, Volume Gutekunst |
| Mama | `BreastUltrasoundFindingDetails` | BI-RADS 5ª Ed |

---

## Funções Utilitárias (findingAdapters.ts)

```typescript
// Normaliza achado para estrutura comum
normalizeFinding(finding, catalog): NormalizedFinding

// Agrupa achados por órgão
groupFindingsByOrgan(findings, catalog): Map<string, NormalizedFinding[]>

// Gera resumo textual
buildFindingSummary(selectedFindings, normalOrgans, catalog): string

// Obtém órgãos marcáveis (exclui observações)
getMarkableOrgans(config): Organ[]
```

---

## Roadmap de Migração

### Fase 1 - Completa ✅
- [x] Criar infraestrutura (types, utils, BaseExamPage)
- [x] Migrar Abdome Total
- [x] Remover arquivo legado

### Fase 2 - Exames com Componentes Customizados
- [x] Carótidas (`CarotidFindingDetails`)
- [x] Tireoide (`ThyroidFindingDetails`)
- [ ] Mama (`BreastUltrasoundFindingDetails`)

### Fase 3 - Exames Genéricos
- [ ] Arterial
- [ ] Venoso
- [ ] Parede Abdominal
- [ ] Vasos Abdominais

### Fase 4 - Limpeza
- [ ] Remover arquivos legados após validação
- [ ] Remover `ExamTemplateModern.example.tsx`

---

## Providers de IA Suportados

O `BaseExamPage` roteia automaticamente para o provider correto:

| Provider | Stream Service | Model Constant |
|----------|---------------|----------------|
| Gemini | `geminiStreamService` | `GEMINI_MODEL` |
| OpenAI | `openaiStreamService` | `OPENAI_MODEL` |
| Claude | `claudeStreamService` | `CLAUDE_MODEL` |

---

## Referências

- `src/pages/modern/BaseExamPage.tsx` - Template base
- `src/types/exam.ts` - Interfaces
- `src/utils/findingAdapters.ts` - Funções utilitárias
- `src/pages/modern/exams/` - Módulos de exame
