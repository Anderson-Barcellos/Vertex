# Integração do Componente CarotidFindingDetails

## Resumo
Integração completa do componente `CarotidFindingDetails` no sistema, substituindo o `FindingDetailsEnhanced` na página `CarotidExam.tsx` e atualizando todos os prompts de IA para suportar os novos campos específicos de Doppler de Carótidas.

## Mudanças Implementadas

### 1. Componente OrganSection.tsx
**Arquivo:** `/root/PROJECT/src/components/OrganSection.tsx`

**Mudanças:**
- Adicionada prop opcional `FindingDetailsComponent` para permitir componentes customizados
- Default mantido como `FindingDetailsEnhanced` para compatibilidade com outras modalidades
- Interface atualizada para suportar componentes customizados:

```typescript
interface OrganSectionProps {
  // ... props existentes
  FindingDetailsComponent?: React.ComponentType<{
    finding: Finding;
    organId: string;
    severity?: string;
    instances?: FindingInstance[];
    onSeverityChange: (severity: string) => void;
    onInstancesChange: (instances: FindingInstance[]) => void;
  }>;
}
```

### 2. Página CarotidExam.tsx
**Arquivo:** `/root/PROJECT/src/pages/CarotidExam.tsx`

**Mudanças:**
- Importado `CarotidFindingDetails` do caminho correto
- Passado componente customizado via prop para `OrganSection`:

```typescript
<OrganSection
  // ... outras props
  FindingDetailsComponent={CarotidFindingDetails}
/>
```

### 3. Tipos TypeScript (report.ts)
**Arquivo:** `/root/PROJECT/src/types/report.ts`

**Campos Adicionados ao `FindingMeasurement`:**

#### Velocimetria
- `vps` - Velocidade de Pico Sistólico (cm/s)
- `vdf` - Velocidade Diastólica Final (cm/s)
- `ratioICA_CCA` - Razão VPS ICA/CCA
- `ratioICA_ICA` - Razão VPS ICA/ICA contralateral

#### Características de Placas
- `plaqueEchogenicity` - Ecogenicidade da placa (Gray-Weale)
- `plaqueComposition` - Composição da placa
- `plaqueSurface` - Superfície da placa

#### EMI e Vertebrais
- `emi` - Espessamento Médio-Intimal em mm
- `vertebralFlowPattern` - Padrão de fluxo vertebral
- `subclavianSteal` - Roubo da subclávia (Sim/Não)

**Campos Legacy Mantidos:**
Todos os campos antigos foram mantidos com comentários `(deprecated)` para compatibilidade.

### 4. Serviço Gemini Stream (geminiStreamService.ts)
**Arquivo:** `/root/PROJECT/src/services/geminiStreamService.ts`

**Mudanças no SYSTEM_INSTRUCTION:**

Adicionada seção completa de referências clínicas:

```markdown
## REFERÊNCIAS CLÍNICAS PARA DOPPLER DE CARÓTIDAS

### CRITÉRIOS NASCET DE ESTENOSE CAROTÍDEA
- Normal: VPS < 125 cm/s | Razão ICA/CCA < 2.0
- <50%: VPS < 125 cm/s | Razão ICA/CCA < 2.0
- 50-69%: VPS 125-230 cm/s | Razão ICA/CCA 2.0-4.0
- ≥70% sem oclusão: VPS > 230 cm/s | Razão ICA/CCA > 4.0 | VDF > 100 cm/s
- Oclusão total: Ausência de fluxo detectável
- Pré-oclusiva: VPS reduzida com estenose visual severa

### CLASSIFICAÇÃO GRAY-WEALE DE PLACAS
- Tipo 1 (Anecóica): Homogeneamente hipoecóica/anecóica, instável
- Tipo 2 (Predominantemente hipoecóica): < 50% ecogênica, moderadamente instável
- Tipo 3 (Predominantemente ecogênica): > 50% ecogênica, mais estável
- Tipo 4 (Uniformemente ecogênica): Homogeneamente hiperecóica, estável
- Tipo 5 (Calcificada): Sombra acústica posterior, geralmente estável

### VALORES DE REFERÊNCIA EMI
- Normal: < 0.9 mm (adultos < 40 anos) | < 1.0 mm (adultos > 40 anos)
- Espessamento: 1.0-1.2 mm
- Placa aterosclerótica: > 1.2 mm
```

**Diretrizes Específicas para Doppler:**
```markdown
### PARA LAUDOS DE DOPPLER DE CARÓTIDAS:
- INTERPRETAÇÃO DE VELOCIDADES: Correlacione valores de VPS e VDF com os critérios NASCET
- ANÁLISE DE PLACAS: Descreva características usando classificação Gray-Weale
- ESTRATIFICAÇÃO DE RISCO: Relacione EMI aumentado, placas instáveis e estenoses
- FLUXO VERTEBRAL: Interprete padrões anormais no contexto de roubo da subclávia
- CORRELAÇÃO BILATERAL: Compare achados entre carótidas direita e esquerda
```

**Mudanças no método `buildPrompt`:**

Atualizado o loop de instâncias para incluir todos os novos campos:

```typescript
if (instance.measurements.vps) {
  prompt += ` | VPS: ${instance.measurements.vps} cm/s`;
}
if (instance.measurements.vdf) {
  prompt += ` | VDF: ${instance.measurements.vdf} cm/s`;
}
if (instance.measurements.ratioICA_CCA) {
  prompt += ` | Razão ICA/CCA: ${instance.measurements.ratioICA_CCA}`;
}
if (instance.measurements.ratioICA_ICA) {
  prompt += ` | Razão ICA/ICA contralateral: ${instance.measurements.ratioICA_ICA}`;
}
if (instance.measurements.emi) {
  prompt += ` | EMI: ${instance.measurements.emi} mm`;
}
if (instance.measurements.plaqueEchogenicity) {
  prompt += ` | Ecogenicidade da placa: ${instance.measurements.plaqueEchogenicity}`;
}
if (instance.measurements.plaqueComposition) {
  prompt += ` | Composição da placa: ${instance.measurements.plaqueComposition}`;
}
if (instance.measurements.plaqueSurface) {
  prompt += ` | Superfície da placa: ${instance.measurements.plaqueSurface}`;
}
if (instance.measurements.vertebralFlowPattern) {
  prompt += ` | Padrão de fluxo vertebral: ${instance.measurements.vertebralFlowPattern}`;
}
if (instance.measurements.subclavianSteal) {
  prompt += ` | Roubo da subclávia: ${instance.measurements.subclavianSteal}`;
}
```

### 5. Serviço OpenAI Stream (openaiStreamService.ts)
**Arquivo:** `/root/PROJECT/src/services/openaiStreamService.ts`

**Mudanças:**
- Idênticas ao `geminiStreamService.ts`
- Adicionadas mesmas referências clínicas ao SYSTEM_INSTRUCTION
- Adicionadas mesmas diretrizes específicas para Doppler
- Atualizado método `buildPrompt` com todos os novos campos

### 6. Cliente Gemini (geminiClient.ts)
**Arquivo:** `/root/PROJECT/src/services/geminiClient.ts`

**Mudanças no método `buildPrompt`:**

Adicionados todos os campos de Doppler ao loop de instâncias:

```typescript
if (instance.measurements?.vps) {
  prompt += `    • VPS: ${instance.measurements.vps} cm/s\n`;
}
// ... todos os outros campos com formatação de lista
```

## Benefícios da Implementação

### 1. Componente Reutilizável
O `OrganSection` agora aceita componentes customizados, permitindo:
- Usar `FindingDetailsEnhanced` para abdome total
- Usar `CarotidFindingDetails` para Doppler de carótidas
- Criar novos componentes para outras modalidades sem modificar código existente

### 2. IA Context-Aware
Os prompts de IA agora incluem:
- Critérios NASCET para interpretação automática de velocidades
- Classificação Gray-Weale para análise de placas
- Valores de referência de EMI
- Diretrizes específicas para correlação bilateral

### 3. Laudos Mais Precisos
Com as referências clínicas integradas, a IA pode:
- Determinar automaticamente o grau de estenose baseado em VPS/VDF
- Classificar placas usando terminologia padronizada
- Estratificar risco vascular adequadamente
- Interpretar achados de roubo da subclávia

### 4. Compatibilidade Mantida
- Todos os campos legacy foram mantidos
- Componentes antigos continuam funcionando
- Build passou sem erros TypeScript
- Nenhuma breaking change introduzida

## Arquivos Modificados

1. `/root/PROJECT/src/components/OrganSection.tsx`
2. `/root/PROJECT/src/pages/CarotidExam.tsx`
3. `/root/PROJECT/src/types/report.ts`
4. `/root/PROJECT/src/services/geminiStreamService.ts`
5. `/root/PROJECT/src/services/openaiStreamService.ts`
6. `/root/PROJECT/src/services/geminiClient.ts`

## Próximos Passos Recomendados

### 1. Testes de Integração
- [ ] Testar seleção de achados em CarotidExam
- [ ] Verificar se campos de Doppler aparecem corretamente
- [ ] Testar geração de laudo com IA (Gemini e OpenAI)
- [ ] Validar interpretação automática de critérios NASCET

### 2. Interface do SelectedFindingsPanel
- [ ] Adicionar seção de "Referências Clínicas" mostrando:
  - Tabela de critérios NASCET
  - Classificação Gray-Weale
  - Valores de referência EMI
- [ ] Adicionar tooltip explicativo em cada campo

### 3. Validações de Dados
- [ ] Adicionar validação de valores de VPS/VDF (números positivos)
- [ ] Validar formato de razões (números decimais)
- [ ] Adicionar alertas para valores fora da normalidade

### 4. Melhorias de UX
- [ ] Adicionar cálculo automático de razões (ICA/CCA, ICA/ICA)
- [ ] Sugerir grau NASCET baseado em velocidades inseridas
- [ ] Indicadores visuais de risco (cores) baseados em EMI e estenose

## Referências Técnicas

### NASCET Criteria
- North American Symptomatic Carotid Endarterectomy Trial
- Padrão-ouro para classificação de estenose carotídea

### Gray-Weale Classification
- Sistema de classificação de placas carotídeas por ecogenicidade
- Correlação com instabilidade e risco de AVC

### EMI (Espessamento Médio-Intimal)
- Marcador precoce de aterosclerose
- Valor preditivo para eventos cardiovasculares

---

**Data de Implementação:** 2025-10-21
**Build Status:** ✅ Passed
**TypeScript Errors:** 0
**Warnings:** 1 (chunk size - não crítico)
