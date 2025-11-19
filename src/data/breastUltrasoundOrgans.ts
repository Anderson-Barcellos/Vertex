/**
 * Vertex V2 - Breast Ultrasound Organs Data
 * Estrutura completa para Ultrassonografia Mamária com BI-RADS 2013/2023
 *
 * @author Vertex Team
 * @date 2025-11-13
 */

import { Organ, OrganCategory, Finding } from './organs';

// ============================================================================
// CONSTANTES - DIRETRIZES BI-RADS 2013/2023
// ============================================================================

/**
 * Quadrantes mamários - Localização anatômica padronizada
 */
export const BREAST_QUADRANTS = [
  { value: 'qse', label: 'Quadrante Superior Externo (QSE)' },
  { value: 'qsi', label: 'Quadrante Superior Interno (QSI)' },
  { value: 'qie', label: 'Quadrante Inferior Externo (QIE)' },
  { value: 'qii', label: 'Quadrante Inferior Interno (QII)' },
  { value: 'retroareolar', label: 'Região Retroareolar/Central' },
  { value: 'prolongamento-axilar', label: 'Prolongamento Axilar' }
];

/**
 * Profundidade mamária - Terços anterior/médio/posterior
 */
export const BREAST_DEPTH = [
  { value: 'anterior', label: 'Terço Anterior (superficial)' },
  { value: 'medio', label: 'Terço Médio' },
  { value: 'posterior', label: 'Terço Posterior (profundo)' }
];

/**
 * Forma do nódulo - Classificação BI-RADS
 */
export const NODULE_SHAPE = [
  'Oval',
  'Redondo',
  'Irregular'
];

/**
 * Margens do nódulo - Classificação BI-RADS
 */
export const NODULE_MARGINS = [
  'Circunscritas',
  'Indistintas',
  'Anguladas',
  'Microlobuladas',
  'Espiculadas'
];

/**
 * Orientação do nódulo - Classificação BI-RADS
 */
export const NODULE_ORIENTATION = [
  'Paralela ao plano da pele',
  'Não paralela ao plano da pele (vertical)'
];

/**
 * Ecogenicidade - Classificação BI-RADS
 */
export const NODULE_ECHOGENICITY = [
  'Anecoica',
  'Hipoecóica',
  'Isoecóica',
  'Hiperecóica',
  'Heterogênea'
];

/**
 * Características acústicas posteriores - Classificação BI-RADS
 */
export const POSTERIOR_FEATURES = [
  'Sem alterações posteriores',
  'Reforço acústico posterior',
  'Sombra acústica posterior',
  'Padrão combinado'
];

/**
 * Vascularização ao Doppler colorido
 */
export const VASCULARIZATION = [
  'Ausente',
  'Mínima (1-2 pontos de fluxo)',
  'Moderada (3-4 pontos de fluxo)',
  'Acentuada (>4 pontos ou fluxo penetrante)'
];

/**
 * Índice de Resistência (IR) - Doppler
 */
export const RESISTIVITY_INDEX_BREAST = [
  { value: 'normal', label: 'Normal (IR 0.70-0.80)', risk: 'low' },
  { value: 'borderline', label: 'Limítrofe (IR 0.65-0.70)', risk: 'medium' },
  { value: 'reduced', label: 'Reduzido (IR <0.65) - suspeito', risk: 'high' }
];

/**
 * Categorias BI-RADS com estratificação de risco
 */
export const BIRADS_CATEGORIES = [
  { value: '0', label: 'BI-RADS 0 - Incompleto (necessita avaliação adicional)', risk: 'incomplete' },
  { value: '1', label: 'BI-RADS 1 - Negativo', risk: 'low' },
  { value: '2', label: 'BI-RADS 2 - Achado benigno', risk: 'low' },
  { value: '3', label: 'BI-RADS 3 - Provavelmente benigno (<2% malignidade)', risk: 'low' },
  { value: '4A', label: 'BI-RADS 4A - Suspeita baixa (2-10% malignidade)', risk: 'medium' },
  { value: '4B', label: 'BI-RADS 4B - Suspeita intermediária (10-50% malignidade)', risk: 'high' },
  { value: '4C', label: 'BI-RADS 4C - Suspeita moderada (50-95% malignidade)', risk: 'high' },
  { value: '5', label: 'BI-RADS 5 - Altamente suspeito (>95% malignidade)', risk: 'critical' },
  { value: '6', label: 'BI-RADS 6 - Malignidade comprovada por biópsia', risk: 'critical' }
];

/**
 * Composição mamária (densidade) - BI-RADS
 */
export const BREAST_COMPOSITION = [
  'Mamas predominantemente gordurosas',
  'Áreas dispersas de densidade fibroglandular',
  'Mamas heterogeneamente densas',
  'Mamas extremamente densas'
];

/**
 * Morfologia de calcificações - BI-RADS
 */
export const CALCIFICATION_MORPHOLOGY = [
  'Grosseiras (benignas)',
  'Finas pleomórficas',
  'Amorfas',
  'Finas lineares ou ramificadas'
];

/**
 * Distribuição de calcificações - BI-RADS
 */
export const CALCIFICATION_DISTRIBUTION = [
  'Difusa',
  'Regional',
  'Agrupada',
  'Linear',
  'Segmentar'
];

/**
 * Conteúdo interno de cistos
 */
export const CYST_INTERNAL_CONTENT = [
  'Anecoico',
  'Ecos internos finos',
  'Septações finas (<0.5mm)',
  'Debris ou sedimentação',
  'Nódulo mural'
];

/**
 * Conteúdo ductal - Ectasias
 */
export const DUCTAL_CONTENT = [
  'Anecoico (limpo)',
  'Debris ecogênicos',
  'Espesso/ecogênico',
  'Massa intraductal'
];

/**
 * Morfologia de linfonodo
 */
export const LYMPH_NODE_MORPHOLOGY = [
  'Ovalado (normal)',
  'Arredondado (suspeito)',
  'Irregular (muito suspeito)'
];

/**
 * Padrão de vascularização linfonodal - Doppler
 */
export const LYMPH_NODE_VASCULARIZATION = [
  'Hilar (normal)',
  'Periférica (suspeita)',
  'Difusa (suspeita)',
  'Ausente'
];

/**
 * Presença de hilo gorduroso - Linfonodo
 */
export const LYMPH_NODE_HILUS = [
  'Presente (normal)',
  'Atenuado (suspeito)',
  'Ausente (muito suspeito)'
];

/**
 * Clock position - Posição horária na mama
 */
export const CLOCK_POSITION = [
  { value: '1h', label: '1 hora' },
  { value: '2h', label: '2 horas' },
  { value: '3h', label: '3 horas (lateral)' },
  { value: '4h', label: '4 horas' },
  { value: '5h', label: '5 horas' },
  { value: '6h', label: '6 horas (inferior)' },
  { value: '7h', label: '7 horas' },
  { value: '8h', label: '8 horas' },
  { value: '9h', label: '9 horas (lateral)' },
  { value: '10h', label: '10 horas' },
  { value: '11h', label: '11 horas' },
  { value: '12h', label: '12 horas (superior)' }
];

/**
 * Scores de elastografia - Classificação de Tsukuba
 */
export const ELASTOGRAPHY_SCORES = [
  { value: '1', label: 'Score 1 - Totalmente elástico (verde)', risk: 'low' },
  { value: '2', label: 'Score 2 - Parcialmente elástico (verde/azul)', risk: 'low' },
  { value: '3', label: 'Score 3 - Parcialmente rígido (azul/verde)', risk: 'medium' },
  { value: '4', label: 'Score 4 - Totalmente rígido (azul)', risk: 'high' },
  { value: '5', label: 'Score 5 - Rigidez estendida (azul+)', risk: 'high' }
];

/**
 * Strain ratio - Índice de rigidez relativa
 */
export const STRAIN_RATIO_CATEGORIES = [
  { value: 'normal', label: 'Normal (<2.0)', risk: 'low' },
  { value: 'borderline', label: 'Limítrofe (2.0-3.0)', risk: 'medium' },
  { value: 'suspicious', label: 'Suspeito (3.0-4.0)', risk: 'high' },
  { value: 'highly-suspicious', label: 'Altamente suspeito (>4.0)', risk: 'high' }
];

/**
 * Mobilidade das lesões
 */
export const LESION_MOBILITY = [
  'Móvel (desliza livremente)',
  'Parcialmente móvel',
  'Fixa (aderida aos tecidos)'
];

/**
 * Pattern vascular - Doppler
 */
export const VASCULAR_PATTERN = [
  'Ausente',
  'Periférico (rim vascular)',
  'Central (nutrício)',
  'Misto (central + periférico)',
  'Difuso/caótico (suspeito)'
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Retorna classe CSS para cor do badge BI-RADS baseado na categoria
 */
export const getBiradsColor = (category: string): string => {
  if (!category) return 'bg-gray-500/20 text-gray-300 border-gray-500/30';

  if (category.includes('1') || category.includes('2')) {
    return 'bg-green-500/20 text-green-300 border-green-500/30';
  }
  if (category.includes('3')) {
    return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  }
  if (category.includes('4A')) {
    return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
  }
  if (category.includes('4B') || category.includes('4C')) {
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  }
  if (category.includes('5') || category.includes('6')) {
    return 'bg-red-700/20 text-red-200 border-red-700/30';
  }
  if (category.includes('0')) {
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  }

  return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

/**
 * Retorna nível de risco baseado na categoria BI-RADS
 */
export const getBiradsRiskLevel = (category: string): 'low' | 'medium' | 'high' | 'critical' | 'incomplete' => {
  const birads = BIRADS_CATEGORIES.find(c => category.includes(c.value));
  return (birads?.risk as any) || 'low';
};

/**
 * Calculadora BI-RADS Inteligente
 * Sugere categoria baseada nas características ultrassonográficas
 */
export const calculateBiradsCategory = (characteristics: {
  shape?: string;
  margins?: string;
  echogenicity?: string;
  posteriorFeatures?: string;
  orientation?: string;
  vascularization?: string;
  elastographyScore?: string;
  strainRatio?: string;
  isComplex?: boolean;
  hasCalcifications?: boolean;
}): { 
  suggestedCategory: string; 
  confidence: 'high' | 'medium' | 'low';
  reasoning: string[];
  alerts: string[];
} => {
  const {
    shape,
    margins,
    echogenicity,
    posteriorFeatures,
    orientation,
    vascularization,
    elastographyScore,
    strainRatio,
    isComplex,
    hasCalcifications
  } = characteristics;

  const reasoning: string[] = [];
  const alerts: string[] = [];
  let score = 0; // Score de suspeição (0-100)

  // Análise da forma
  if (shape === 'Irregular') {
    score += 25;
    reasoning.push('Forma irregular (suspeita)');
  } else if (shape === 'Oval' || shape === 'Redondo') {
    score -= 10;
    reasoning.push('Forma regular (favorável)');
  }

  // Análise das margens (mais importante)
  if (margins === 'Espiculadas') {
    score += 40;
    reasoning.push('Margens espiculadas (altamente suspeitas)');
    alerts.push('⚠️ Margens espiculadas sugerem malignidade');
  } else if (margins === 'Anguladas' || margins === 'Microlobuladas') {
    score += 30;
    reasoning.push('Margens suspeitas');
  } else if (margins === 'Indistintas') {
    score += 15;
    reasoning.push('Margens indistintas');
  } else if (margins === 'Circunscritas') {
    score -= 15;
    reasoning.push('Margens circunscritas (favorável)');
  }

  // Análise da ecogenicidade
  if (echogenicity === 'Hipoecóica') {
    score += 10;
    reasoning.push('Lesão hipoecóica');
  } else if (echogenicity === 'Hiperecóica') {
    score -= 20;
    reasoning.push('Lesão hiperecóica (possivelmente gordurosa)');
  }

  // Características posteriores
  if (posteriorFeatures === 'Sombra acústica posterior') {
    score += 20;
    reasoning.push('Sombra acústica posterior');
    alerts.push('⚠️ Sombra acústica pode indicar malignidade');
  } else if (posteriorFeatures === 'Reforço acústico posterior') {
    score -= 5;
    reasoning.push('Reforço acústico posterior');
  }

  // Orientação
  if (orientation === 'Não paralela ao plano da pele (vertical)') {
    score += 15;
    reasoning.push('Orientação vertical (suspeita)');
  } else if (orientation === 'Paralela ao plano da pele') {
    score -= 5;
    reasoning.push('Orientação paralela (favorável)');
  }

  // Vascularização
  if (vascularization === 'Acentuada (>4 pontos ou fluxo penetrante)') {
    score += 15;
    reasoning.push('Hipervascularização');
  } else if (vascularization === 'Difuso/caótico (suspeito)') {
    score += 25;
    reasoning.push('Padrão vascular suspeito');
    alerts.push('⚠️ Padrão vascular caótico é suspeito');
  }

  // Elastografia
  if (elastographyScore === 'Score 4 - Totalmente rígido (azul)' || 
      elastographyScore === 'Score 5 - Rigidez estendida (azul+)') {
    score += 20;
    reasoning.push('Elastografia suspeita (score 4-5)');
    alerts.push('⚠️ Elastografia com rigidez alta');
  } else if (elastographyScore === 'Score 1 - Totalmente elástico (verde)' ||
             elastographyScore === 'Score 2 - Parcialmente elástico (verde/azul)') {
    score -= 10;
    reasoning.push('Elastografia favorável (score 1-2)');
  }

  // Strain ratio
  if (strainRatio) {
    const ratio = parseFloat(strainRatio);
    if (!isNaN(ratio)) {
      if (ratio > 4.0) {
        score += 25;
        reasoning.push(`Strain ratio elevado (${ratio})`);
        alerts.push('⚠️ Strain ratio >4.0 é altamente suspeito');
      } else if (ratio > 3.0) {
        score += 15;
        reasoning.push(`Strain ratio suspeito (${ratio})`);
      } else if (ratio < 2.0) {
        score -= 5;
        reasoning.push(`Strain ratio normal (${ratio})`);
      }
    }
  }

  // Lesões complexas
  if (isComplex) {
    score += 10;
    reasoning.push('Lesão complexa');
  }

  // Calcificações
  if (hasCalcifications) {
    score += 15;
    reasoning.push('Presença de calcificações');
  }

  // Determinar categoria baseada no score
  let suggestedCategory: string;
  let confidence: 'high' | 'medium' | 'low';

  if (score >= 70) {
    suggestedCategory = 'BI-RADS 5 - Altamente suspeito (>95% malignidade)';
    confidence = 'high';
    alerts.push('🚨 ALTA SUSPEITA - Biópsia indicada');
  } else if (score >= 50) {
    suggestedCategory = 'BI-RADS 4C - Suspeita moderada (50-95% malignidade)';
    confidence = 'high';
    alerts.push('⚠️ MODERADA SUSPEITA - Biópsia recomendada');
  } else if (score >= 30) {
    suggestedCategory = 'BI-RADS 4B - Suspeita intermediária (10-50% malignidade)';
    confidence = 'medium';
  } else if (score >= 15) {
    suggestedCategory = 'BI-RADS 4A - Suspeita baixa (2-10% malignidade)';
    confidence = 'medium';
  } else if (score >= 5) {
    suggestedCategory = 'BI-RADS 3 - Provavelmente benigno (<2% malignidade)';
    confidence = 'medium';
  } else {
    suggestedCategory = 'BI-RADS 2 - Achado benigno';
    confidence = score < -10 ? 'high' : 'medium';
  }

  // Ajustar confiança baseado na quantidade de características avaliadas
  const totalCharacteristics = Object.values(characteristics).filter(v => v !== undefined && v !== '').length;
  if (totalCharacteristics < 3) {
    confidence = 'low';
    alerts.push('ℹ️ Poucos dados para análise precisa');
  }

  return {
    suggestedCategory,
    confidence,
    reasoning,
    alerts
  };
};

// ============================================================================
// DEFINIÇÃO DOS ÓRGÃOS - MAMA DIREITA
// ============================================================================

const mamaDireitaCategories: OrganCategory[] = [
  {
    id: 'nodulos',
    name: 'Nódulos e Massas',
    findings: [
      {
        id: 'nodulo-solido',
        name: 'Nódulo Sólido',
        description: 'Lesão sólida a caracterizar',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          {
            id: 'shape',
            label: 'Forma',
            type: 'select',
            options: NODULE_SHAPE
          },
          {
            id: 'margins',
            label: 'Margens',
            type: 'select',
            options: NODULE_MARGINS
          },
          {
            id: 'echogenicity',
            label: 'Ecogenicidade',
            type: 'select',
            options: NODULE_ECHOGENICITY
          },
          {
            id: 'distanceFromNipple',
            label: 'Distância do Mamilo (cm)',
            type: 'text',
            placeholder: 'Ex: 3.5 cm'
          },
          {
            id: 'clockPosition',
            label: 'Posição (Horário)',
            type: 'select',
            options: CLOCK_POSITION.map(c => c.label)
          },
          {
            id: 'mobility',
            label: 'Mobilidade',
            type: 'select',
            options: LESION_MOBILITY
          },
          {
            id: 'elastographyScore',
            label: 'Elastografia (Tsukuba)',
            type: 'select',
            options: ELASTOGRAPHY_SCORES.map(e => e.label)
          },
          {
            id: 'strainRatio',
            label: 'Strain Ratio',
            type: 'text',
            placeholder: 'Ex: 2.5'
          },
          {
            id: 'vascularPattern',
            label: 'Padrão Vascular',
            type: 'select',
            options: VASCULAR_PATTERN
          },
          {
            id: 'peakVelocity',
            label: 'Velocidade de Pico (cm/s)',
            type: 'text',
            placeholder: 'Ex: 15.2 cm/s'
          },
          {
            id: 'pulsatilityIndex',
            label: 'Índice de Pulsatilidade',
            type: 'text',
            placeholder: 'Ex: 0.8'
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: BIRADS_CATEGORIES.map(c => c.label)
          }
        ]
      },
      {
        id: 'nodulo-complexo',
        name: 'Nódulo Complexo',
        description: 'Lesão com componente sólido e cístico',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          {
            id: 'shape',
            label: 'Forma',
            type: 'select',
            options: NODULE_SHAPE
          },
          {
            id: 'margins',
            label: 'Margens',
            type: 'select',
            options: NODULE_MARGINS
          },
          {
            id: 'solidComponent',
            label: 'Componente Sólido',
            type: 'text',
            placeholder: 'Descrição do componente sólido'
          },
          {
            id: 'cysticComponent',
            label: 'Componente Cístico',
            type: 'text',
            placeholder: 'Descrição do componente cístico'
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: BIRADS_CATEGORIES.map(c => c.label)
          }
        ]
      },
      {
        id: 'agrupamento-nodulos',
        name: 'Agrupamento de Nódulos',
        description: 'Múltiplos nódulos agrupados',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          {
            id: 'numberOfNodules',
            label: 'Número de Nódulos',
            type: 'text',
            placeholder: 'Ex: 3-4 nódulos'
          },
          {
            id: 'pattern',
            label: 'Padrão de Distribuição',
            type: 'select',
            options: ['Agrupados', 'Difusos', 'Segmentares']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: BIRADS_CATEGORIES.map(c => c.label)
          }
        ]
      }
    ]
  },
  {
    id: 'lesoes-cisticas',
    name: 'Lesões Císticas',
    findings: [
      {
        id: 'cisto-simples',
        name: 'Cisto Simples',
        description: 'Lesão cística benigna (BI-RADS 2)',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          {
            id: 'internalContent',
            label: 'Conteúdo Interno',
            type: 'select',
            options: ['Anecoico (limpo)', 'Ecos internos finos']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: ['BI-RADS 2 - Achado benigno']
          }
        ]
      },
      {
        id: 'cisto-complicado',
        name: 'Cisto Complicado',
        description: 'Cisto com debris ou septações finas',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          {
            id: 'internalContent',
            label: 'Conteúdo Interno',
            type: 'select',
            options: CYST_INTERNAL_CONTENT
          },
          {
            id: 'septations',
            label: 'Septações',
            type: 'select',
            options: ['Ausentes', 'Finas (<0.5mm)', 'Espessas (>0.5mm)']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: BIRADS_CATEGORIES.map(c => c.label)
          }
        ]
      },
      {
        id: 'cisto-complexo',
        name: 'Cisto Complexo',
        description: 'Cisto com nódulo mural ou septações espessas',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'muralNodule',
            label: 'Nódulo Mural',
            type: 'select',
            options: ['Ausente', 'Presente - descrever']
          },
          {
            id: 'thickSeptations',
            label: 'Septações Espessas',
            type: 'select',
            options: ['Ausentes', 'Presentes']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: BIRADS_CATEGORIES.map(c => c.label)
          }
        ]
      }
    ]
  },
  {
    id: 'calcificacoes',
    name: 'Calcificações',
    findings: [
      {
        id: 'calcificacoes',
        name: 'Calcificações',
        description: 'Depósitos cálcicos no parênquima mamário',
        hasDetails: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          {
            id: 'morphology',
            label: 'Morfologia',
            type: 'select',
            options: CALCIFICATION_MORPHOLOGY
          },
          {
            id: 'distribution',
            label: 'Distribuição',
            type: 'select',
            options: CALCIFICATION_DISTRIBUTION
          },
          {
            id: 'extent',
            label: 'Extensão',
            type: 'text',
            placeholder: 'Ex: área de 2x2 cm'
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: BIRADS_CATEGORIES.map(c => c.label)
          }
        ]
      }
    ]
  },
  {
    id: 'alteracoes-ductais',
    name: 'Alterações Ductais',
    findings: [
      {
        id: 'ectasia-ductal',
        name: 'Ectasia Ductal',
        description: 'Dilatação dos ductos mamários',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'ductalDiameter',
            label: 'Diâmetro do Ducto (mm)',
            type: 'text',
            placeholder: 'Normal <2mm'
          },
          {
            id: 'ductalContent',
            label: 'Conteúdo Ductal',
            type: 'select',
            options: DUCTAL_CONTENT
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: BIRADS_CATEGORIES.map(c => c.label)
          }
        ]
      },
      {
        id: 'papiloma-intraductal',
        name: 'Papiloma Intraductal',
        description: 'Proliferação epitelial intraductal',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'ductalLocation',
            label: 'Localização no Ducto',
            type: 'select',
            options: ['Central', 'Periférico']
          },
          {
            id: 'associatedDilation',
            label: 'Ectasia Associada',
            type: 'select',
            options: ['Sim', 'Não']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: BIRADS_CATEGORIES.map(c => c.label)
          }
        ]
      }
    ]
  },
  {
    id: 'alteracoes-cutaneas',
    name: 'Alterações Cutâneas e Aréolo-Papilares',
    findings: [
      {
        id: 'espessamento-cutaneo',
        name: 'Espessamento Cutâneo',
        description: 'Aumento da espessura da pele mamária (normal <2mm)',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'thickness',
            label: 'Espessura (mm)',
            type: 'text',
            placeholder: 'Normal <2mm'
          },
          {
            id: 'pattern',
            label: 'Padrão',
            type: 'select',
            options: ['Focal', 'Difuso', 'Peau d\'orange']
          }
        ]
      },
      {
        id: 'retracao-papilar',
        name: 'Retração Papilar',
        description: 'Inversão ou retração do complexo aréolo-papilar',
        hasDetails: true,
        extraFields: [
          {
            id: 'type',
            label: 'Tipo',
            type: 'select',
            options: ['Retração focal', 'Inversão completa', 'Distorção']
          },
          {
            id: 'associatedMass',
            label: 'Massa Associada',
            type: 'select',
            options: ['Sim - descrever', 'Não']
          }
        ]
      },
      {
        id: 'alteracao-areolar',
        name: 'Alteração Areolar',
        description: 'Espessamento ou irregularidade areolar',
        hasDetails: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'appearance',
            label: 'Aspecto',
            type: 'text',
            placeholder: 'Descrever alteração'
          }
        ]
      }
    ]
  },
  {
    id: 'distorcoes',
    name: 'Distorções Arquiteturais',
    findings: [
      {
        id: 'distorcao-arquitetural',
        name: 'Distorção Arquitetural',
        description: 'Desestruturação da arquitetura mamária normal',
        hasDetails: true,
        hasLocation: true,
        hasMeasurement: true,
        extraFields: [
          {
            id: 'pattern',
            label: 'Padrão',
            type: 'text',
            placeholder: 'Descrever padrão de distorção'
          },
          {
            id: 'associatedMass',
            label: 'Massa Associada',
            type: 'select',
            options: ['Sim', 'Não']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: BIRADS_CATEGORIES.map(c => c.label)
          }
        ]
      }
    ]
  },
  {
    id: 'outros-achados',
    name: 'Outros Achados',
    findings: [
      {
        id: 'fibroadenoma',
        name: 'Fibroadenoma',
        description: 'Nódulo benigno típico',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          {
            id: 'shape',
            label: 'Forma',
            type: 'select',
            options: ['Oval', 'Redondo', 'Lobulado']
          },
          {
            id: 'margins',
            label: 'Margens',
            type: 'select',
            options: ['Circunscritas', 'Indistintas']
          },
          {
            id: 'echogenicity',
            label: 'Ecogenicidade',
            type: 'select',
            options: ['Hipoecóica', 'Isoecóica']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: ['BI-RADS 2 - Achado benigno', 'BI-RADS 3 - Provavelmente benigno (<2% malignidade)']
          }
        ]
      },
      {
        id: 'lipoma',
        name: 'Lipoma',
        description: 'Lesão adiposa benigna',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'echogenicity',
            label: 'Ecogenicidade',
            type: 'select',
            options: ['Hiperecóica (gordurosa)']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: ['BI-RADS 2 - Achado benigno']
          }
        ]
      },
      {
        id: 'galactocele',
        name: 'Galactocele',
        description: 'Cisto com conteúdo leitoso',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'internalContent',
            label: 'Conteúdo',
            type: 'select',
            options: ['Hipoecóico homogêneo', 'Heterogêneo (gordura-fluido)', 'Nível líquido-líquido']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: ['BI-RADS 2 - Achado benigno']
          }
        ]
      }
    ]
  },
  {
    id: 'lesoes-inflamatorias',
    name: 'Lesões Inflamatórias e Infecciosas',
    findings: [
      {
        id: 'abscesso',
        name: 'Abscesso Mamário',
        description: 'Coleção líquida inflamatória/purulenta',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'clockPosition',
            label: 'Posição (Horário)',
            type: 'select',
            options: CLOCK_POSITION.map(c => c.label)
          },
          {
            id: 'internalContent',
            label: 'Conteúdo',
            type: 'select',
            options: ['Anecoico', 'Debris ecogênicos', 'Septações', 'Nível líquido-debris']
          },
          {
            id: 'wallThickness',
            label: 'Espessura da Parede (mm)',
            type: 'text',
            placeholder: 'Ex: 3mm'
          },
          {
            id: 'surroundingEdema',
            label: 'Edema Circundante',
            type: 'select',
            options: ['Presente', 'Ausente', 'Leve', 'Moderado', 'Acentuado']
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: ['BI-RADS 2 - Achado benigno']
          }
        ]
      },
      {
        id: 'mastite',
        name: 'Mastite',
        description: 'Processo inflamatório do parênquima mamário',
        hasDetails: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'pattern',
            label: 'Padrão',
            type: 'select',
            options: ['Focal', 'Segmentar', 'Difuso']
          },
          {
            id: 'echotexture',
            label: 'Ecotextura',
            type: 'select',
            options: ['Hipoecóica heterogênea', 'Hiperecóica (gordurosa)', 'Mista']
          },
          {
            id: 'skinThickening',
            label: 'Espessamento Cutâneo',
            type: 'select',
            options: ['Presente', 'Ausente']
          },
          {
            id: 'type',
            label: 'Tipo',
            type: 'select',
            options: ['Aguda', 'Crônica', 'Granulomatosa']
          }
        ]
      },
      {
        id: 'necrose-gordurosa',
        name: 'Necrose Gordurosa',
        description: 'Necrose do tecido adiposo mamário',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'clockPosition',
            label: 'Posição (Horário)',
            type: 'select',
            options: CLOCK_POSITION.map(c => c.label)
          },
          {
            id: 'appearance',
            label: 'Aspecto',
            type: 'select',
            options: ['Cisto oleoso', 'Massa hipoecóica', 'Calcificação distrófica']
          },
          {
            id: 'history',
            label: 'História Relevante',
            type: 'text',
            placeholder: 'Ex: trauma, cirurgia prévia'
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: ['BI-RADS 2 - Achado benigno', 'BI-RADS 3 - Provavelmente benigno (<2% malignidade)']
          }
        ]
      },
      {
        id: 'seroma-hematoma',
        name: 'Seroma/Hematoma',
        description: 'Coleção líquida pós-procedimento',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'type',
            label: 'Tipo',
            type: 'select',
            options: ['Seroma', 'Hematoma agudo', 'Hematoma organizando']
          },
          {
            id: 'internalContent',
            label: 'Conteúdo',
            type: 'select',
            options: ['Anecoico', 'Ecos finos', 'Níveis líquido-líquido', 'Debris']
          },
          {
            id: 'postProcedure',
            label: 'Pós-procedimento',
            type: 'text',
            placeholder: 'Ex: biópsia, cirurgia (tempo decorrido)'
          },
          {
            id: 'biradsCategory',
            label: 'Categoria BI-RADS',
            type: 'select',
            options: ['BI-RADS 2 - Achado benigno']
          }
        ]
      }
    ]
  },
  {
    id: 'implantes',
    name: 'Implantes e Complicações',
    findings: [
      {
        id: 'ruptura-implante',
        name: 'Ruptura de Implante',
        description: 'Ruptura intracapsular ou extracapsular',
        hasDetails: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'ruptureType',
            label: 'Tipo de Ruptura',
            type: 'select',
            options: ['Intracapsular', 'Extracapsular', 'Ambas']
          },
          {
            id: 'implantType',
            label: 'Tipo de Implante',
            type: 'select',
            options: ['Silicone', 'Salina', 'Desconhecido']
          },
          {
            id: 'signs',
            label: 'Sinais Ultrassonográficos',
            type: 'text',
            placeholder: 'Ex: stepladder sign, snowstorm'
          },
          {
            id: 'siliconoma',
            label: 'Siliconoma',
            type: 'select',
            options: ['Presente', 'Ausente']
          }
        ]
      },
      {
        id: 'contratura-capsular',
        name: 'Contratura Capsular',
        description: 'Espessamento e fibrose da cápsula periprotésica',
        hasDetails: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'bakerGrade',
            label: 'Classificação de Baker',
            type: 'select',
            options: [
              'Baker I - Normal',
              'Baker II - Palpável mas não visível',
              'Baker III - Visível e firme',
              'Baker IV - Dura e dolorosa'
            ]
          },
          {
            id: 'capsuleThickness',
            label: 'Espessura Capsular (mm)',
            type: 'text',
            placeholder: 'Normal <2mm'
          },
          {
            id: 'implantDistortion',
            label: 'Distorção do Implante',
            type: 'select',
            options: ['Presente', 'Ausente']
          }
        ]
      },
      {
        id: 'dobras-radiais',
        name: 'Dobras Radiais (Radial Folds)',
        description: 'Dobras na superfície do implante',
        hasDetails: true,
        hasLocation: true,
        extraFields: [
          {
            id: 'severity',
            label: 'Intensidade',
            type: 'select',
            options: ['Leve', 'Moderada', 'Acentuada']
          },
          {
            id: 'location',
            label: 'Localização no Implante',
            type: 'select',
            options: ['Superior', 'Inferior', 'Medial', 'Lateral', 'Múltiplas']
          }
        ]
      }
    ]
  }
];

// ============================================================================
// DEFINIÇÃO DOS ÓRGÃOS - LINFONODOS AXILARES
// ============================================================================

const linfonodosCategories: OrganCategory[] = [
  {
    id: 'linfonodos',
    name: 'Alterações Linfonodais',
    findings: [
      {
        id: 'linfonodo-suspeito',
        name: 'Linfonodo Suspeito',
        description: 'Linfonodo com características anormais',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          {
            id: 'corticalThickness',
            label: 'Espessura Cortical (mm)',
            type: 'text',
            placeholder: 'Normal <3mm'
          },
          {
            id: 'hilusPresence',
            label: 'Hilo Gorduroso',
            type: 'select',
            options: LYMPH_NODE_HILUS
          },
          {
            id: 'morphology',
            label: 'Morfologia',
            type: 'select',
            options: LYMPH_NODE_MORPHOLOGY
          },
          {
            id: 'axillaryLevel',
            label: 'Nível Axilar',
            type: 'select',
            options: ['Nível I (inferior)', 'Nível II (médio)', 'Nível III (superior/apical)']
          }
        ]
      },
      {
        id: 'linfonodo-aumentado',
        name: 'Linfonodo Aumentado',
        description: 'Linfonodo com dimensões aumentadas',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          {
            id: 'corticalThickness',
            label: 'Espessura Cortical (mm)',
            type: 'text',
            placeholder: 'Normal <3mm'
          },
          {
            id: 'hilusPresence',
            label: 'Hilo Gorduroso',
            type: 'select',
            options: LYMPH_NODE_HILUS
          },
          {
            id: 'morphology',
            label: 'Morfologia',
            type: 'select',
            options: LYMPH_NODE_MORPHOLOGY
          }
        ]
      }
    ]
  }
];

// ============================================================================
// EXPORTAÇÃO DOS ÓRGÃOS
// ============================================================================

export const breastUltrasoundOrgans: Organ[] = [
  {
    id: 'mama-direita',
    name: 'Mama Direita',
    icon: 'drop',
    normalDescription: 'apresenta parênquima mamário com ecotextura preservada, sem evidências de nódulos sólidos ou císticos, calcificações suspeitas, distorção arquitetural ou espessamento cutâneo. Não há alterações do complexo aréolo-papilar. Ductos de calibre preservado.',
    categories: mamaDireitaCategories
  },
  {
    id: 'mama-esquerda',
    name: 'Mama Esquerda',
    icon: 'drop',
    normalDescription: 'apresenta parênquima mamário com ecotextura preservada, sem evidências de nódulos sólidos ou císticos, calcificações suspeitas, distorção arquitetural ou espessamento cutâneo. Não há alterações do complexo aréolo-papilar. Ductos de calibre preservado.',
    categories: mamaDireitaCategories // Mesmas categorias
  },
  {
    id: 'linfonodos-axilares-direitos',
    name: 'Linfonodos Axilares Direitos',
    icon: 'circle',
    normalDescription: 'são visualizados linfonodos de morfologia preservada, com hilo gorduroso evidente e espessura cortical normal (<3mm). Padrão de vascularização hilar ao Doppler colorido.',
    categories: linfonodosCategories
  },
  {
    id: 'linfonodos-axilares-esquerdos',
    name: 'Linfonodos Axilares Esquerdos',
    icon: 'circle',
    normalDescription: 'são visualizados linfonodos de morfologia preservada, com hilo gorduroso evidente e espessura cortical normal (<3mm). Padrão de vascularização hilar ao Doppler colorido.',
    categories: linfonodosCategories // Mesmas categorias
  }
];

export default breastUltrasoundOrgans;
