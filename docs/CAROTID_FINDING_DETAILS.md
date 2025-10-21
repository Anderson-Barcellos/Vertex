# CarotidFindingDetails Component

## Visão Geral

Componente React especializado para entrada de dados de achados em exames de **Ecodoppler de Carótidas e Vertebrais**. Baseado no `FindingDetailsEnhanced.tsx`, mas com campos extras específicos para avaliação vascular.

## Localização

**Arquivo:** `/root/PROJECT/src/components/CarotidFindingDetails.tsx`

## Funcionalidades

### 1. Detecção Automática de Tipo de Achado

O componente detecta automaticamente o tipo de achado baseado no `finding.id` e `organId`:

- **Estenose:** Campos para velocidades Doppler (VPS, VDF, razão, NASCET)
- **Placas:** Campos para caracterização (ecogenicidade, composição, superfície)
- **EMI:** Campo numérico com badge de classificação automática
- **Vertebrais:** Campos para velocidade, IR, padrão de fluxo e roubo da subclávia

### 2. Campos Específicos por Tipo

#### Para Estenoses (finding.id contém "estenose")

| Campo | Tipo | Valores | Descrição |
|-------|------|---------|-----------|
| **VPS** | Select | Normal (<125), Moderada (125-230), Severa (>230), Crítica (>300) | Velocidade de Pico Sistólico |
| **VDF** | Select | Same as VPS | Velocidade Diastólica Final |
| **Razão ACI/ACC** | Select | Normal (<2.0), Moderada (2.0-4.0), Severa (>4.0) | Razão de velocidades |
| **NASCET** | Select | <50%, 50-69%, 70-99%, 100% | Grau de estenose com badge de risco |

#### Para Placas (finding.id contém "placa")

| Campo | Tipo | Valores | Descrição |
|-------|------|---------|-----------|
| **Ecogenicidade** | Select | Hipoecogênica (lipídica), Isoecogênica, Hiperecogênica (fibrosa), Calcificada | Com indicador de risco |
| **Composição** | Select | Homogênea, Heterogênea, Mista, Lipídica | Com indicador de risco |
| **Superfície** | Select | Lisa, Irregular, Ulcerada | Superfície da placa |
| **Tamanho** | Input text | Ex: "2.5 x 1.8 mm" | Dimensões da placa |

**Badge de Risco Automático:** Calculado baseado na combinação de ecogenicidade, composição e superfície:
- **Alto Risco:** Placa hipoecogênica, heterogênea ou ulcerada
- **Médio Risco:** Placa isoecogênica ou mista
- **Baixo Risco:** Placa hiperecogênica, homogênea e calcificada

#### Para EMI (finding.id contém "imi" ou "espessamento")

| Campo | Tipo | Range | Descrição |
|-------|------|-------|-----------|
| **EMI (mm)** | Input number | 0.0 - 3.0, step 0.1 | Espessamento Médio-Intimal |

**Badge de Classificação Automática:**
- **Normal** (verde): < 0.9 mm
- **Limítrofe** (amarelo): 0.9 - 1.0 mm
- **Espessado** (laranja): 1.0 - 1.5 mm
- **Placa** (vermelho): > 1.5 mm

#### Para Vertebrais (organId === 'vd' ou 've')

| Campo | Tipo | Valores | Descrição |
|-------|------|---------|-----------|
| **Velocidade** | Select | Normal (30-80), Aumentada (>100), Reduzida (<30), Ausente (0) | VPS em cm/s |
| **IR** | Select | Normal (0.55-0.75), Baixo (<0.55), Alto (>0.75) | Índice de Resistividade |
| **Padrão de Fluxo** | Select | Anterógrado, Retrógrado, To-and-fro, Ausente | Direção do fluxo |
| **Roubo Subclávia** | Select | Ausente, Parcial, Completo | Síndrome do roubo |

### 3. Localizações Anatômicas Específicas

O componente usa as constantes do `/root/PROJECT/src/data/carotidOrgans.ts`:

- **Carótidas Comuns (CCD/CCE):** Proximal, Médio, Distal, Bifurcação
- **Carótidas Internas (CID/CIE):** Bulbo, Cervical proximal/médio/distal
- **Carótidas Externas (CED/CEE):** Origem, Proximal, Médio, Distal
- **Vertebrais (VD/VE):** V0 (origem), V1 (pré-foraminal), V2 (foraminal), V3 (atlanto-axial), V4 (intracraniano)

### 4. Badges Coloridos de Risco

O componente exibe automaticamente badges coloridos baseados em:

#### Estenoses (NASCET)
- **Baixo Risco** (verde): < 50%
- **Médio Risco** (amarelo): 50-69%
- **Alto Risco** (laranja): 70-99%
- **Crítico** (vermelho): 100% (oclusão)

#### Placas (Ecogenicidade + Composição + Superfície)
Algoritmo de risco combinado:
```typescript
const getPlaqueRisk = (echogenicity, composition, surface) => {
  // Hipoecogênica = alto risco
  // Heterogênea = alto risco
  // Ulcerada = alto risco
  // Combinação determina risco final
}
```

#### EMI (Valor numérico)
- **Verde:** < 0.9 mm (Normal)
- **Amarelo:** 0.9-1.0 mm (Limítrofe)
- **Laranja:** 1.0-1.5 mm (Espessado)
- **Vermelho:** > 1.5 mm (Placa)

## Constantes Exportadas

O componente define e exporta as seguintes constantes:

```typescript
export const VELOCITY_THRESHOLDS    // Thresholds de VPS/VDF
export const STENOSIS_RATIO         // Razões ACI/ACC
export const NASCET_CRITERIA        // Graus NASCET com risco
export const PLAQUE_ECHOGENICITY    // Tipos de ecogenicidade
export const PLAQUE_COMPOSITION     // Tipos de composição
export const EMI_VALUES             // Ranges de EMI
export const VERTEBRAL_VELOCITY     // Velocidades vertebrais
export const VERTEBRAL_IR           // Índices de resistividade
export const SUBCLAVIAN_STEAL       // Tipos de roubo
```

## Interface TypeScript Atualizada

Adicionados novos campos em `/root/PROJECT/src/types/report.ts`:

```typescript
export interface FindingMeasurement {
  // ... campos existentes ...

  // Carotid Doppler specific fields
  vps?: string;                  // Velocidade de Pico Sistólico
  vdf?: string;                  // Velocidade Diastólica Final
  ratio?: string;                // Razão VPS ACI/ACC
  nascet?: string;               // Grau NASCET de estenose
  echogenicity?: string;         // Ecogenicidade da placa
  composition?: string;          // Composição da placa
  surface?: string;              // Superfície da placa
  emiValue?: string;             // Espessamento Médio-Intimal em mm
  vertebralVelocity?: string;    // Velocidade em vertebrais
  vertebralIR?: string;          // Índice de Resistividade
  flowPattern?: string;          // Padrão de fluxo
  subclavianSteal?: string;      // Roubo da subclávia
}
```

## Uso

O componente já está integrado em `/root/PROJECT/src/pages/CarotidExam.tsx`:

```tsx
import CarotidFindingDetails from '@/components/CarotidFindingDetails';

// ...

<OrganSection
  organ={organ}
  selectedFindings={selectedFindings}
  onFindingSelect={handleFindingSelect}
  onFindingDeselect={handleFindingDeselect}
  onMarkAsNormal={handleMarkAsNormal}
  isNormal={normalOrgans.includes(organ.id)}
  FindingDetailsComponent={CarotidFindingDetails}  // ← Componente customizado
/>
```

## Props

```typescript
interface CarotidFindingDetailsProps {
  finding: Finding;              // Objeto do achado
  organId: string;               // ID do órgão (ccd, cie, vd, etc.)
  severity?: string;             // Grau de severidade
  instances?: FindingInstance[]; // Múltiplas instâncias
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
}
```

## Helpers Internos

### getEMIClassification(value: number)
Retorna objeto com `{ min, max, label, color }` baseado no valor de EMI.

### getPlaqueRisk(echogenicity?, composition?, surface?)
Calcula risco combinado da placa: `'low' | 'medium' | 'high'`

### getRiskBadgeColor(risk: string)
Retorna classes Tailwind para colorir badges de risco.

### getLocationOptions()
Retorna array de opções de localização baseado no `organId`.

## Exemplo de Dados Salvos

```json
{
  "id": "1234567890",
  "measurements": {
    "location": "Bulbo carotídeo",
    "vps": "Severa (>230 cm/s)",
    "vdf": "Moderada (125-230 cm/s)",
    "ratio": "Severa (>4.0)",
    "nascet": "70-99% (Severa)",
    "description": "Placa heterogênea com estenose significativa"
  }
}
```

## Validação

O botão "Salvar" só é habilitado se pelo menos um campo relevante estiver preenchido:
- `location`
- `size`
- `vps`
- `emiValue`
- `echogenicity`
- `vertebralVelocity`

## Estilo e UX

- **Layout:** Mesma estrutura do `FindingDetailsEnhanced`
- **Ícones:** Lucide React (Ruler, MapPin, Activity, TrendingUp, Waves)
- **Cores:** Dark theme consistente com sistema
- **Badges:** Coloridos automaticamente baseado em risco
- **Validação:** Input de EMI com min/max/step
- **Feedback:** Badge de classificação instantâneo ao digitar EMI

## Testes

Build completado com sucesso:
```bash
✓ built in 8.64s
```

Nenhum erro TypeScript encontrado.

## Referências Médicas

As constantes seguem as diretrizes de:
- **NASCET Criteria** (North American Symptomatic Carotid Endarterectomy Trial)
- **Consenso da SBR** (Sociedade Brasileira de Radiologia)
- **Guidelines de Doppler Vascular**

## Próximos Passos

- [ ] Adicionar validação de valores numéricos
- [ ] Implementar cálculo automático de razão VPS baseado em valores inseridos
- [ ] Adicionar tooltip com referências médicas nos campos
- [ ] Criar preset templates para achados comuns

---

**Autor:** Claude (via Anders)
**Data:** 21 de Outubro de 2025
**Versão:** 1.0.0
