# Vertex V2 - Documentação Claude

**Sistema de Geração de Laudos Ultrassonográficos com IA**  
**Versão:** 2.1.0 | **Dev Server:** http://localhost:8200

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
│   ├── BaseExamPage.tsx       # Template base - TODA lógica comum
│   └── exams/                 # Módulos de configuração (~6 linhas cada)
│       └── [8 exames migrados]
├── data/
│   ├── examConfigs.ts         # ⭐ CONFIGS CENTRALIZADAS
│   ├── shared/                # Dados compartilhados
│   │   ├── commonFields.ts    # LATERALITY, STENOSIS_GRADE, etc
│   │   └── commonOrgans.ts    # createObservacoesOrgan()
│   └── *Organs.ts             # Dados específicos de cada exame
├── components/
│   ├── original/              # Sidebar, ReportCanvas, FindingDetails*
│   └── shared/                # Calculadoras e painéis reutilizáveis
│       ├── TiradsCalculatorPanel.tsx      # TI-RADS automático
│       ├── PlaqueRiskCalculatorPanel.tsx  # Risco de placa (Gray-Weale)
│       └── FloatingOrganPanelModern.tsx
├── hooks/                     # useAutoSave, useDropdownGuard
└── services/                  # unifiedAIService, streamers
```

---

## Estado das Modalidades

| Modalidade | FindingDetails | Classificador | Múltiplas Lesões |
|------------|----------------|---------------|------------------|
| **Abdome** | Generic | - | ✅ |
| **Carótidas** | Específico | ✅ NASCET + Risco Placa | ✅ |
| **Tireoide** | Específico | ✅ TI-RADS ACR | ✅ |
| **Mama** | Específico | ✅ BI-RADS 5ª Ed | ✅ |
| **Arterial** | Generic | - | ✅ |
| **Venoso** | Generic | - | ✅ |
| **Vasos Abd** | Generic | - | ✅ |
| **Parede** | Generic | - | ✅ |

---

## Roadmap

### Concluído ✅
- [x] Arquitetura modular (BaseExamPage + ExamConfig)
- [x] Migração de todos os 8 exames
- [x] Sistema de múltiplas lesões por achado
- [x] Configs centralizadas (examConfigs.ts)
- [x] Dados compartilhados (shared/)
- [x] hideNormalOption para Observações
- [x] TI-RADS Calculator (Tireoide)
- [x] BI-RADS Calculator (Mama)
- [x] NASCET/ESVS Calculator (Carótidas)
- [x] Plaque Risk Calculator (Carótidas - Gray-Weale)
- [x] Home.tsx com todas as rotas modernas

### Próximos Passos 🔜
- [ ] CEAP/VCSS Calculator (Venoso)
- [ ] WIfI/Fontaine Calculator (Arterial)
- [ ] Conectar findingFormatter e promptCustomizer no BaseExamPage
- [ ] Sidebar com agrupamento bilateral (como Carótidas)
- [ ] Novos exames conforme demanda clínica

### Futuro 🔮
- [ ] Exportação PDF com formatação customizada
- [ ] Integração com PACS/RIS
- [ ] Templates de laudo por patologia

---

## Padrões de Código

### Template de Exame
```typescript
import BaseExamPage from '../BaseExamPage';
import { arterialConfig } from '@/data/examConfigs';

export default function ArterialExam() {
  return <BaseExamPage config={arterialConfig} />;
}
```

### hideNormalOption
```typescript
{ id: 'observacoes', hideNormalOption: true, ... }
```

### Múltiplas Lesões
Achados com campo `lado` nos extraFields ativam automaticamente o modo multi-instância.

### Calculadoras
```typescript
<TiradsCalculatorPanel composition={...} echogenicity={...} />
<PlaqueRiskCalculatorPanel echogenicity={...} composition={...} surface={...} />
```

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Painel fecha ao selecionar dropdown | `useDropdownGuard` |
| Observações com checkbox "Normal" | `hideNormalOption: true` |
| Não adiciona múltiplas lesões | Precisa campo `lado` |

---

## Autenticação

- **Login:** anders / vertex2025

---

## Contexto

**Dev:** Dr. Anderson (Anders) - Santa Cruz do Sul, RS  
**Branch:** master

---

## Memória

```bash
/memorypack                  # Indexa conversas
search "termo"               # Busca semântica
```

---

## Documentação Detalhada

Para informações completas sobre arquitetura, layout system, regras médicas e troubleshooting:
→ **docs/VERTEX_V2_COMPLETE_MANUAL.md**

---

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
