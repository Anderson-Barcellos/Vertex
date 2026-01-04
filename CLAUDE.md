# Vertex V2 - Documentação Claude

**Sistema de Geração de Laudos Ultrassonográficos com IA**  
**Versão:** 2.0.0 | **Dev Server:** http://localhost:8200

---

## Stack

- **Frontend:** React 19 + TypeScript 5.9 + Vite 7.2.0
- **Estilização:** Tailwind CSS v4 + Radix UI
- **IA:** Gemini 3.0 Pro + OpenAI GPT-4 + Claude Sonnet (streaming)

---

## Arquitetura

```
src/
├── pages/modern/
│   ├── BaseExamPage.tsx       # Template base (~300 linhas) - TODA lógica comum
│   └── exams/                 # Módulos de configuração (~20-30 linhas cada)
│       ├── AbdomeTotalExam.tsx   # ✅ Migrado
│       ├── CarotidExam.tsx       # ✅ Migrado
│       ├── ThyroidExam.tsx       # ✅ Migrado
│       └── ...                   # Demais exames
├── types/
│   └── exam.ts                # ExamConfig interface
├── utils/
│   └── findingAdapters.ts     # Funções utilitárias
├── components/original/    # Sidebar, ReportCanvas, FindingDetails*
├── components/shared/      # FloatingOrganPanelModern, TiradsCalculatorPanel
├── data/                   # organs.ts, carotidOrgans.ts, etc.
├── hooks/                  # useAutoSave, useDropdownGuard
└── services/               # geminiStreamService, openaiStreamService, claudeStreamService
```

> **Doc completa:** `docs/MODULAR_EXAM_ARCHITECTURE.md`

---

## Comandos

```bash
npm run dev                 # Dev server (porta 8200)
git status && git add -A && git commit -m "..." && git push origin master
```

---

## Estado das Modalidades

| Modalidade | Dados | FindingDetails | Classificador | Agrupamento |
|------------|-------|----------------|---------------|-------------|
| **Abdome** | ✅ Completo | Generic | - | - |
| **Carótidas** | ✅ Completo | Específico | ✅ NASCET/ESVS | ✅ Bilateral |
| **Tireoide** | ✅ Completo | Específico | ✅ TI-RADS ACR | - |
| **Mama** | ✅ Completo | Específico | ✅ BI-RADS 5ª Ed | ✅ Bilateral |
| **Arterial** | ✅ Básico | Generic | - | - |
| **Venoso** | ✅ Básico | Generic | - | - |
| **Parede** | ✅ Básico | Generic | - | - |

---

## Roadmap

### Fase 1 - Arquitetura Modular (Concluída ✅)
- [x] Criar BaseExamPage.tsx (template compartilhado)
- [x] Criar ExamConfig interface e findingAdapters
- [x] Migrar Abdome Total para arquitetura modular
- [x] Adicionar suporte a Claude como provider

### Fase 2 - Migração de Exames Customizados (Concluída ✅)
- [x] Migrar Carótidas (CarotidFindingDetails)
- [x] Migrar Tireoide (ThyroidFindingDetails)

### Fase 3 - Migração de Exames Restantes (Pendente 🔜)

**5 exames legados (~600 linhas cada) → módulos (~25 linhas cada)**

| # | Exame | Legado | Novo | Dados | FindingDetails |
|---|-------|--------|------|-------|----------------|
| 1 | Mama | `BreastExamModern.tsx` | `exams/BreastExam.tsx` | `breastUltrasoundOrgans.ts` | `BreastUltrasoundFindingDetails` |
| 2 | Arterial | `ArterialExamModern.tsx` | `exams/ArterialExam.tsx` | `arterialOrgans.ts` | Generic |
| 3 | Venoso | `VenousExamModern.tsx` | `exams/VenousExam.tsx` | `venousOrgans.ts` | Generic |
| 4 | Parede | `AbdominalWallExamModern.tsx` | `exams/AbdominalWallExam.tsx` | `abdominalWallOrgans.ts` | Generic |
| 5 | Vasos Abd | `AbdominalVesselsExamModern.tsx` | `exams/AbdominalVesselsExam.tsx` | `abdominalVesselsOrgans.ts` | Generic |

**Passos de implementação:**
1. Criar arquivo em `src/pages/modern/exams/NomeExam.tsx` (template abaixo)
2. Adicionar export em `src/pages/modern/exams/index.ts`
3. Atualizar import em `src/App.tsx`
4. Testar no browser
5. Remover arquivo legado após validação

**Template padrão (~25 linhas):**
```typescript
import BaseExamPage from '../BaseExamPage';
import { nomeOrgans } from '@/data/nomeOrgans';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'nome-exam',
  title: 'Nome do Exame',
  subtitle: 'Ultrassonografia de Nome',
  examType: 'Ultrassonografia de Nome',
  organsCatalog: nomeOrgans,
  autoSaveKey: 'nome-exam-modern',
  excludeFromNormalAll: ['observacoes']
};

export default function NomeExam() {
  return <BaseExamPage config={config} />;
}
```

**Limpeza final:**
- [ ] Remover `ExamTemplateModern.example.tsx`
- [ ] Remover 5 arquivos `*ExamModern.tsx` legados

### Fase 4 - Classificadores
- [x] BI-RADS 5ª Edição para Mama
- [ ] CEAP/VCSS para Venoso
- [ ] Fontaine/ITB para Arterial

### Fase 5 - Expansão
- [ ] Novos exames conforme demanda clínica

**Workflow:** `docs/panorama-{modalidade}.md` → Anders fornece schema → Implementar → Build

---

## Padrões de Código

### Agrupamento no Sidebar (Exames Bilaterais)
```typescript
// Em organs.ts - Interface Organ
group?: string;      // Nome do grupo (ex: "Carótidas Comuns")
groupOrder?: number; // Ordem de exibição (1, 2, 3...)

// Exemplo em carotidOrgans.ts
{
  id: 'acc-d',
  name: 'Carótida Comum Direita',
  group: 'Carótidas Comuns',
  groupOrder: 1,
  // ...
}
```
O Sidebar detecta automaticamente e renderiza grupos colapsáveis com "Direita/Esquerda".

### Exames Modernos
```typescript
const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
const [tempFindingDetails, setTempFindingDetails] = useState<...>({});

// Props do FloatingOrganPanelModern
tempDetails={getTempDetails(currentOrgan.id)}
onTempDetailsChange={handleTempDetailsChange}
```

### IA Streaming
```typescript
import { unifiedAIService } from '@/services/unifiedAIService';
await unifiedAIService.generateReport(data, { model: 'gemini', onChunk, onComplete });
```

---

## Diretrizes

**Sempre:**
- Preservar estado ao minimizar/trocar componentes
- Usar streaming para geração de laudos
- Seguir padrões dos exames modernos existentes

**Nunca:**
- Criar exames sem seguir estrutura moderna
- Usar estado local quando deveria ser elevado
- Esquecer persistência em novos exames

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Painel fecha ao selecionar dropdown | `useDropdownGuard` + `useOutsidePointerDismiss` |
| Estado perdido ao minimizar | `tempFindingDetails` nos componentes pais |
| CORS na API | Usar proxy `/api/gemini` |

---

## Autenticação

- **Login:** anders / vertex2025
- **Arquivos:** `AuthContext.tsx`, `LoginPage.tsx`, `ProtectedRoute.tsx`

---

## Contexto

**Desenvolvido por:** Dr. Anderson (Anders) - Neuropsiquiatria e Ultrassonografia  
**Local:** Santa Cruz do Sul, RS, Brasil  
**Branch:** master | **Histórico:** `docs/changelog-vertex.md`

---

## Sistema de Memória

```bash
/memorypack                  # Indexa conversas
search "termo"               # Busca semântica
/memlist vertex --limit 5    # Ver recentes
```

---

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
