# Vertex V2 - Quick Reference

**Sistema de Laudos Ultrassonográficos com IA**  
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4  
**IA:** Gemini/OpenAI/Claude (streaming)  
**Dev:** http://localhost:8200 | **Prod:** https://ultrassom.ai/

## 🚀 Comandos Essenciais

```bash
npm run dev          # Desenvolvimento (porta 8200)
npm run build        # Build produção
npx tsc --noEmit     # Check TypeScript (95 erros conhecidos)
```

## 🏗️ Arquitetura Simplificada

```
src/
├── pages/exams/
│   ├── shared/BaseExamPage.tsx    # Template base (toda lógica)
│   └── modules/*Exam.tsx          # Configs por modalidade (6 linhas)
├── data/
│   ├── examConfigs.ts              # Configurações centralizadas
│   ├── shared/commonFields.ts      # Constantes compartilhadas
│   └── *Organs.ts                  # Catálogos por exame
├── components/original/
│   ├── FindingDetailsGeneric.tsx   # Detalhes padrão
│   └── *FindingDetails.tsx         # Específicos (Carotid, Thyroid, Breast)
└── services/
    ├── promptBuilder.ts             # Prompts especializados
    └── unifiedAIService.ts          # Streaming IA
```

## 📊 Status dos Módulos

| Exame | Calculadoras | Prompt IA | Status |
|-------|--------------|-----------|--------|
| Carótidas | NASCET, Gray-Weale | ✅ Especializado | ⭐⭐⭐⭐⭐ |
| Tireoide | TI-RADS ACR | ✅ Especializado | ⭐⭐⭐⭐⭐ |
| Mama | BI-RADS | ✅ Especializado | ⭐⭐⭐⭐⭐ |
| Arterial | ITB/IDB Auto | ✅ Especializado | ⭐⭐⭐⭐⭐ |
| Venoso | - | ✅ Especializado | ⭐⭐⭐⭐ |
| Ombro | - | ✅ Especializado | ⭐⭐⭐⭐ |
| Abdome | Sub-modalidades | ✅ Básico | ⭐⭐⭐⭐ |

## 🔧 Padrões de Código

### Adicionar Novo Exame
```typescript
// 1. Criar catálogo em data/newExamOrgans.ts
export const newExamOrgans: Organ[] = [...]

// 2. Criar config em data/examConfigs.ts
export const newExamConfig: ExamConfig = {
  id: 'new-exam',
  title: 'Novo Exame',
  organsCatalog: newExamOrgans,
  FindingDetailsComponent: FindingDetailsGeneric
}

// 3. Criar módulo em pages/exams/modules/NewExam.tsx (6 linhas!)
import BaseExamPage from '../shared/BaseExamPage';
import { newExamConfig } from '@/data/examConfigs';
export default function NewExam() {
  return <BaseExamPage config={newExamConfig} />;
}
```

### Campos Redundantes (não incluir em prompts)
```typescript
// Em promptBuilder.ts
const REDUNDANT_FIELDS = new Set([
  'measurement', 'nascet', 'ratio', 'emi', 'emiValue',
  'emiClassification', 'plaqueEchogenicity', 'flowPattern'
]);
```

## 🐛 Issues Conhecidas

- **TypeScript:** 95 erros (principalmente ui/chart.tsx e resizable.tsx)
- **Auth:** Client-side apenas (migrar para backend)
- **Mobile:** Bloqueado < 1230px (ResolutionGuard)

## 🔐 Autenticação

```
Login: anders
Senha: vertex2025
```

## 📡 API Backend

- **Endpoint:** https://ultrassom.ai:8177
- **Rotas:** /geminiCall, /openaiCall, /claudeCall
- **Config:** /root/GEMINI_API/main.py (prompts sistema)

## 🎯 Roadmap Resumido

Ver [ROADMAP.md](./ROADMAP.md) para histórico completo.

### Próximas Prioridades
1. Validação ranges numéricos em tempo real
2. Resolver warnings container queries
3. Migrar auth para backend
4. Mobile responsive

---

**Branch:** master | **Dev:** Dr. Anderson (Anders) - Santa Cruz do Sul/RS