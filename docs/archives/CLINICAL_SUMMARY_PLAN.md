# 🩺 Plano: Resumo Clínico Inteligente no ExamStatisticsPanel

**Status:** 📋 Planejado (Implementação Futura)  
**Data:** 18 de Novembro de 2025  
**Prioridade:** Média (após validação dos campos corrigidos)

---

## 🎯 Objetivo

Adicionar uma seção de **Resumo Clínico** no `ExamStatisticsPanel` que mostra automaticamente badges de risco e classificações baseadas nos achados selecionados pelo usuário.

---

## 📐 Design Visual Proposto

```
┌──────────────────────────────────────┐
│ 🩺 Resumo Clínico                    │
├──────────────────────────────────────┤
│ Risco Global                         │
│ [🔴 CRÍTICO]                         │
│                                      │
│ Achados Prioritários                 │
│ • 🔴 Estenose 70% (VPS 280) - ACI-D │
│ • 🟠 Placa Tipo II instável - ACC-E │
│                                      │
│ Classificações Padronizadas          │
│ • NASCET: 70-99% (grave)            │
│ • EMI: 1.2mm (espessado)            │
│ • Gray-Weale: Tipo II (risco mod.)  │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│ ⚡ Estatísticas da IA                │
│ (seção existente sem alterações)    │
└──────────────────────────────────────┘
```

---

## 🧠 Algoritmo de Cálculo de Risco Global

### Hierarquia de Prioridade (Carótidas)

```typescript
CRÍTICO (🔴):
- Estenose ≥70% NASCET
- Oclusão arterial
- VPS >230 cm/s

ALTO (🟠):
- Placa ulcerada
- Estenose 50-69% NASCET
- Placa Gray-Weale Tipo I (hipoecóica)
- Roubo da subclávia completo

MODERADO (🟡):
- Placa Gray-Weale Tipo II
- EMI >1.0mm
- Estenose <50%
- Vertebral hipoplásica

BAIXO (🟢):
- EMI limítrofe (0.9-1.0mm)
- Placa calcificada (Tipo IV)

NORMAL (⚪):
- Apenas órgãos normais
```

### Lógica de Decisão

```typescript
function calculateGlobalRisk(findings: SelectedFinding[]): RiskLevel {
  if (findings.length === 0) return 'normal';
  
  const risks = findings.map(f => evaluateFindingRisk(f));
  
  // Retorna o maior risco encontrado
  if (risks.includes('critical')) return 'critical';
  if (risks.includes('high')) return 'high';
  if (risks.includes('moderate')) return 'moderate';
  return 'low';
}
```

---

## 📊 Extração de Achados Críticos

### Top 3 Achados por Gravidade

```typescript
interface CriticalFinding {
  severity: 'critical' | 'high' | 'moderate';
  label: string;        // "Estenose 70%"
  details?: string;     // "VPS 280 cm/s"
  location: string;     // "ACI-D"
  badge: string;        // "🔴"
}

function extractTopFindings(findings: SelectedFinding[]): CriticalFinding[] {
  return findings
    .map(f => ({
      severity: evaluateFindingRisk(f),
      label: buildLabel(f),
      details: buildDetails(f),
      location: formatLocation(f.organId),
      badge: getBadgeIcon(evaluateFindingRisk(f))
    }))
    .sort((a, b) => compareSeverity(a.severity, b.severity))
    .slice(0, 3); // Top 3
}
```

---

## 🏷️ Classificações Automáticas

### NASCET (Grau de Estenose)

```typescript
function extractNASCET(findings: SelectedFinding[]): string | undefined {
  const stenosisFindings = findings.filter(f => 
    f.finding.id.includes('estenose') && 
    f.instances?.[0]?.measurements?.nascetGrade
  );
  
  if (stenosisFindings.length === 0) return undefined;
  
  // Retorna o maior grau de estenose encontrado
  const grades = stenosisFindings.map(f => 
    f.instances![0].measurements.nascetGrade
  );
  
  return findHighestNASCET(grades); // "70-99% (grave)"
}
```

### EMI (Espessamento Médio-Intimal)

```typescript
function extractEMI(findings: SelectedFinding[]): string | undefined {
  const emiFindings = findings.filter(f => 
    f.finding.id.includes('imi') || f.finding.id.includes('espessamento')
  );
  
  if (emiFindings.length === 0) return undefined;
  
  const values = emiFindings.flatMap(f => 
    f.instances?.map(i => parseFloat(i.measurements.emi || '0')) || []
  );
  
  const maxEMI = Math.max(...values);
  const classification = classifyEMI(maxEMI);
  
  return `${maxEMI.toFixed(1)}mm (${classification})`; // "1.2mm (espessado)"
}
```

### Gray-Weale (Placas)

```typescript
function extractGrayWeale(findings: SelectedFinding[]): string | undefined {
  const plaqueFindings = findings.filter(f => 
    f.finding.id.includes('placa')
  );
  
  if (plaqueFindings.length === 0) return undefined;
  
  const types = plaqueFindings.flatMap(f =>
    f.instances?.map(i => 
      getGrayWealeType(i.measurements.echogenicity || '')
    ).filter(t => t !== '') || []
  );
  
  // Retorna o tipo mais instável (I > II > III > IV)
  const mostUnstable = findMostUnstableType(types);
  
  return `Tipo ${mostUnstable} (${getTypeDescription(mostUnstable)})`;
}
```

---

## 🎨 Códigos de Cores

```typescript
const RISK_COLORS = {
  critical: {
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    border: 'border-red-500/30',
    badge: '🔴'
  },
  high: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-300',
    border: 'border-orange-500/30',
    badge: '🟠'
  },
  moderate: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    border: 'border-yellow-500/30',
    badge: '🟡'
  },
  low: {
    bg: 'bg-green-500/20',
    text: 'text-green-300',
    border: 'border-green-500/30',
    badge: '🟢'
  },
  normal: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-300',
    border: 'border-gray-500/30',
    badge: '⚪'
  }
};
```

---

## 📁 Estrutura de Arquivos

### Novos Arquivos a Criar

```
src/
├── utils/
│   └── clinicalSummary.ts          # ← NOVO
│       ├── calculateGlobalRisk()
│       ├── extractCriticalFindings()
│       ├── extractNASCET()
│       ├── extractEMI()
│       └── extractGrayWeale()
│
└── types/
    └── report.ts                     # Modificar
        ├── type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'normal'
        └── interface ClinicalSummary { ... }
```

### Arquivos a Modificar

```
src/components/original/ExamStatisticsPanel.tsx
  ├── Adicionar props: selectedFindings, normalOrgans, examType
  ├── Import: useClinicalSummary hook
  └── Renderizar nova seção acima de "Estatísticas da IA"

src/pages/modern/CarotidExamModern.tsx
  └── Passar props adicionais para ExamStatisticsPanel
```

---

## 🔧 Implementação por Etapas

### Fase 1: Tipos e Estrutura Base
- [ ] Adicionar tipos `RiskLevel` e `ClinicalSummary` em `report.ts`
- [ ] Criar arquivo `clinicalSummary.ts` com funções stub
- [ ] Modificar props do `ExamStatisticsPanel`

### Fase 2: Lógica de Carótidas
- [ ] Implementar `calculateGlobalRisk()` para carótidas
- [ ] Implementar `extractCriticalFindings()` para carótidas
- [ ] Implementar `extractNASCET()`, `extractEMI()`, `extractGrayWeale()`

### Fase 3: Interface Visual
- [ ] Criar componente `ClinicalSummarySection` no ExamStatisticsPanel
- [ ] Adicionar badges coloridos de risco
- [ ] Adicionar lista de achados prioritários
- [ ] Adicionar seção de classificações

### Fase 4: Integração
- [ ] Integrar em `CarotidExamModern`
- [ ] Testar com casos reais
- [ ] Ajustar estilos e cores

### Fase 5: Outros Exames (Futuro)
- [ ] Tireóide → TI-RADS
- [ ] Mama → BI-RADS
- [ ] Abdome → Lesões focais

---

## 🧪 Casos de Teste

### Caso 1: Exame Normal
**Entrada:** Todos órgãos normais  
**Saída Esperada:**
```
Risco Global: ⚪ NORMAL
Sem achados patológicos
```

### Caso 2: EMI Limítrofe
**Entrada:** EMI 0.95mm em CCD  
**Saída Esperada:**
```
Risco Global: 🟢 BAIXO
Classificações:
• EMI: 0.9mm (limítrofe)
```

### Caso 3: Estenose Moderada
**Entrada:** Estenose 60%, VPS 180 cm/s, NASCET 50-69%  
**Saída Esperada:**
```
Risco Global: 🟠 ALTO
Achados Prioritários:
• 🟠 Estenose moderada (VPS 180) - ACI-D
Classificações:
• NASCET: 50-69% (moderada)
```

### Caso 4: Estenose Crítica + Placa Instável
**Entrada:** 
- Estenose 85%, VPS 320 cm/s, NASCET 70-99%
- Placa Tipo II, EMI 1.3mm  

**Saída Esperada:**
```
Risco Global: 🔴 CRÍTICO
Achados Prioritários:
• 🔴 Estenose grave (VPS 320) - ACI-D
• 🟠 Placa Tipo II instável - ACC-E
Classificações:
• NASCET: 70-99% (grave)
• EMI: 1.3mm (espessado)
• Gray-Weale: Tipo II (risco moderado)
```

---

## 🎯 Benefícios Esperados

1. ✅ **Visão Executiva** - Médico identifica risco global instantaneamente
2. ✅ **Priorização Automática** - Achados críticos destacados automaticamente
3. ✅ **Quality Assurance** - Detecta inconsistências (VPS baixa + NASCET alto)
4. ✅ **Educacional** - Reforça classificações padronizadas
5. ✅ **Não Intrusivo** - Não altera fluxo de trabalho existente
6. ✅ **Escalável** - Fácil adicionar novos exames no futuro

---

## 🚀 Recursos Avançados (v2 - Futuro Distante)

### Alertas Inteligentes
```
⚠️ Inconsistência Detectada
VPS 120 cm/s mas NASCET 70-99%
Revisar dados ou considerar artefato
```

### Comparação com Exame Anterior
```
📊 Tendência
EMI: 0.8mm → 1.2mm (+50%)
Considerar seguimento em 6 meses
```

### Sugestões Clínicas
```
💡 Recomendação
Estenose bilateral >70%
Considerar avaliação neurovascular
```

---

## ⚙️ Complexidade Estimada

- **Tempo:** 4-6 horas de desenvolvimento
- **Risco:** Baixo (não altera código existente)
- **Dependências:** Nenhuma lib externa
- **Testabilidade:** Alta (funções puras)

---

## 📝 Notas de Implementação

1. **Modularidade:** Manter lógica específica de cada exame separada
2. **Performance:** Cálculo leve, não impacta UX
3. **Acessibilidade:** Usar cores + ícones + texto (não apenas cor)
4. **Responsividade:** Adaptar para telas pequenas
5. **Internacionalização:** Preparar strings para i18n futuro

---

## 🔗 Referências

- Critérios NASCET: [SVS Guidelines 2021](https://www.jvascsurg.org/)
- Classificação Gray-Weale: [Ultrasound Med Biol 1988](https://pubmed.ncbi.nlm.nih.gov/3051612/)
- EMI normal: [Radiology 2007](https://pubs.rsna.org/)

---

**Última atualização:** 18/11/2025  
**Autor:** Claude + Anders  
**Status:** 📋 Aguardando validação dos campos corrigidos
