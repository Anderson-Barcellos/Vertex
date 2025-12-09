import { Organ, OrganCategory, Finding } from './organs';

// ============================================================================
// CONSTANTES - DIRETRIZES ACR TI-RADS 2017
// ============================================================================

// Sistema TI-RADS (Thyroid Imaging Reporting and Data System)
export const TIRADS_CATEGORIES = [
  { value: 'tr1', label: 'TI-RADS 1 (Benigno)', points: 0, risk: 'low', recommendation: 'Sem seguimento' },
  { value: 'tr2', label: 'TI-RADS 2 (Não suspeito)', points: 2, risk: 'low', recommendation: 'Sem seguimento' },
  { value: 'tr3', label: 'TI-RADS 3 (Levemente suspeito)', points: 3, risk: 'medium', recommendation: 'PAAF se ≥2.5cm, seguimento se ≥1.5cm' },
  { value: 'tr4', label: 'TI-RADS 4 (Moderadamente suspeito)', points: [4, 6], risk: 'high', recommendation: 'PAAF se ≥1.5cm, seguimento se ≥1cm' },
  { value: 'tr5', label: 'TI-RADS 5 (Altamente suspeito)', points: 7, risk: 'critical', recommendation: 'PAAF se ≥1cm, seguimento se ≥0.5cm' }
];

// Composição do Nódulo (0-2 pontos)
export const NODULE_COMPOSITION = [
  { value: 'cistico', label: 'Cístico ou quase totalmente cístico', points: 0, risk: 'low' },
  { value: 'espongiforme', label: 'Espongiforme', points: 0, risk: 'low' },
  { value: 'misto-cistico', label: 'Misto cístico-sólido', points: 1, risk: 'low' },
  { value: 'solido-coloide', label: 'Sólido ou quase totalmente sólido com coloide', points: 1, risk: 'medium' },
  { value: 'solido', label: 'Sólido ou quase totalmente sólido', points: 2, risk: 'medium' }
];

// Ecogenicidade (0-3 pontos)
export const NODULE_ECHOGENICITY = [
  { value: 'anecogênico', label: 'Anecogênico', points: 0, risk: 'low' },
  { value: 'hiperecogênico', label: 'Hiperecogênico ou isoecogênico', points: 1, risk: 'low' },
  { value: 'hipoecogênico', label: 'Hipoecogênico', points: 2, risk: 'medium' },
  { value: 'muito-hipoecogênico', label: 'Muito hipoecogênico', points: 3, risk: 'high' }
];

// Forma (0-3 pontos)
export const NODULE_SHAPE = [
  { value: 'mais-largo-que-alto', label: 'Mais largo que alto', points: 0, risk: 'low' },
  { value: 'mais-alto-que-largo', label: 'Mais alto que largo', points: 3, risk: 'high' }
];

// Margens (0-3 pontos)
export const NODULE_MARGINS = [
  { value: 'lisas', label: 'Lisas', points: 0, risk: 'low' },
  { value: 'mal-definidas', label: 'Mal definidas', points: 0, risk: 'low' },
  { value: 'lobuladas-irregulares', label: 'Lobuladas ou irregulares', points: 2, risk: 'medium' },
  { value: 'extensao-extratiroidea', label: 'Extensão extratiroidea', points: 3, risk: 'critical' }
];

// Focos Ecogênicos / Calcificações (0-3 pontos)
export const ECHOGENIC_FOCI = [
  { value: 'ausentes', label: 'Ausentes ou grandes artefatos em cometa', points: 0, risk: 'low' },
  { value: 'macrocalcificacoes', label: 'Macrocalcificações', points: 1, risk: 'medium' },
  { value: 'calcificacoes-perifericas', label: 'Calcificações periféricas (anel)', points: 2, risk: 'medium' },
  { value: 'microcalcificacoes', label: 'Microcalcificações puntiformes', points: 3, risk: 'high' }
];

// Padrão Vascular Doppler
export const VASCULARITY_PATTERN = [
  { value: 'ausente', label: 'Ausente ou mínimo', risk: 'low' },
  { value: 'periferico', label: 'Predominantemente periférico', risk: 'low' },
  { value: 'misto', label: 'Misto (central e periférico)', risk: 'medium' },
  { value: 'central', label: 'Predominantemente central', risk: 'high' }
];

// Elastografia (Elasticity Score)
export const ELASTOGRAPHY_SCORE = [
  { value: '1', label: 'Score 1 - Uniformemente elástico (verde)', risk: 'low' },
  { value: '2', label: 'Score 2 - Predominantemente elástico', risk: 'low' },
  { value: '3', label: 'Score 3 - Heterogêneo (misto)', risk: 'medium' },
  { value: '4', label: 'Score 4 - Predominantemente rígido', risk: 'high' },
  { value: '5', label: 'Score 5 - Uniformemente rígido (azul)', risk: 'high' }
];

// Características da Ecotextura do Parênquima
export const PARENCHYMA_ECHOTEXTURE = [
  { value: 'homogenea', label: 'Homogênea', description: 'Ecotextura normal preservada' },
  { value: 'heterogenea-difusa', label: 'Heterogênea difusa', description: 'Alteração difusa (tireoidite crônica)' },
  { value: 'hipoecogenica-difusa', label: 'Hipoecogênica difusa', description: 'Sugestivo de tireoidite' },
  { value: 'grosseiramente-heterogenea', label: 'Grosseiramente heterogênea', description: 'Bócio multinodular' }
];

// Vascularização do Parênquima
export const PARENCHYMA_VASCULARITY = [
  { value: 'normal', label: 'Vascularização preservada' },
  { value: 'aumentada', label: 'Vascularização aumentada (hiperemia)' },
  { value: 'reduzida', label: 'Vascularização reduzida' }
];

// Características dos Linfonodos
export const LYMPH_NODE_FEATURES = [
  { value: 'normal', label: 'Morfologia preservada (hiliar, ovóide)' },
  { value: 'suspeito', label: 'Características suspeitas' }
];

export const LYMPH_NODE_SUSPICIOUS_CRITERIA = [
  'Perda do hilo hiperecoico',
  'Forma arredondada (L/T < 2)',
  'Microcalcificações',
  'Cistos internos',
  'Vascularização periférica aumentada',
  'Hiperecogenicidade difusa'
];

// Localização no Lobo
export const THYROID_LOBE_LOCATION = [
  { value: 'terco-superior', label: 'Terço superior' },
  { value: 'terco-medio', label: 'Terço médio' },
  { value: 'terco-inferior', label: 'Terço inferior' },
  { value: 'transicao-istmo', label: 'Transição com istmo' }
];

// Dimensões Normais da Tireóide
export const NORMAL_THYROID_DIMENSIONS = {
  lobeLength: { min: 40, max: 60, unit: 'mm', label: 'Comprimento lobo' },
  lobeWidth: { min: 13, max: 18, unit: 'mm', label: 'Largura lobo (AP)' },
  lobeDepth: { min: 20, max: 25, unit: 'mm', label: 'Espessura lobo (transverso)' },
  isthmusThickness: { min: 2, max: 6, unit: 'mm', label: 'Espessura istmo' }
};

// Volume da Tireóide (Fórmula: Comprimento × AP × Transverso × 0.52)
export const calculateThyroidVolume = (length: number, ap: number, transverse: number): number => {
  return length * ap * transverse * 0.52 / 1000; // resultado em ml
};

// Função para calcular TI-RADS baseado nas características selecionadas
export const calculateTIRADS = (characteristics: {
  composition?: string;
  echogenicity?: string;
  shape?: string;
  margins?: string;
  echogenicFoci?: string;
}): { points: number; category: string; recommendation: string } => {
  let totalPoints = 0;

  // Composição (0-2 pontos)
  const compMatch = NODULE_COMPOSITION.find(c => c.label === characteristics.composition);
  if (compMatch) totalPoints += compMatch.points;

  // Ecogenicidade (0-3 pontos)
  const echoMatch = NODULE_ECHOGENICITY.find(e => e.label === characteristics.echogenicity);
  if (echoMatch) totalPoints += echoMatch.points;

  // Forma (0-3 pontos)
  const shapeMatch = NODULE_SHAPE.find(s => s.label === characteristics.shape);
  if (shapeMatch) totalPoints += shapeMatch.points;

  // Margens (0-3 pontos)
  const marginMatch = NODULE_MARGINS.find(m => m.label === characteristics.margins);
  if (marginMatch) totalPoints += marginMatch.points;

  // Focos ecogênicos (0-3 pontos)
  const fociMatch = ECHOGENIC_FOCI.find(f => f.label === characteristics.echogenicFoci);
  if (fociMatch) totalPoints += fociMatch.points;

  // Determinar categoria TI-RADS
  let category: string;
  let recommendation: string;

  if (totalPoints === 0) {
    category = 'TI-RADS 1 (Benigno)';
    recommendation = 'Sem necessidade de seguimento';
  } else if (totalPoints <= 2) {
    category = 'TI-RADS 2 (Não suspeito)';
    recommendation = 'Sem necessidade de seguimento';
  } else if (totalPoints === 3) {
    category = 'TI-RADS 3 (Levemente suspeito)';
    recommendation = 'PAAF se ≥2.5cm; Seguimento se ≥1.5cm';
  } else if (totalPoints >= 4 && totalPoints <= 6) {
    category = 'TI-RADS 4 (Moderadamente suspeito)';
    recommendation = 'PAAF se ≥1.5cm; Seguimento se ≥1.0cm';
  } else {
    category = 'TI-RADS 5 (Altamente suspeito)';
    recommendation = 'PAAF se ≥1.0cm; Seguimento se ≥0.5cm';
  }

  return { points: totalPoints, category, recommendation };
};

// Opções de TI-RADS para campo calculado
export const TIRADS_DISPLAY_OPTIONS = [
  'TI-RADS 1 (Benigno) - 0 pts',
  'TI-RADS 2 (Não suspeito) - 2 pts',
  'TI-RADS 3 (Levemente suspeito) - 3 pts',
  'TI-RADS 4 (Moderadamente suspeito) - 4-6 pts',
  'TI-RADS 5 (Altamente suspeito) - ≥7 pts'
];

// ============================================================================
// DEFINIÇÃO DOS ÓRGÃOS E ACHADOS
// ============================================================================

export const thyroidOrgans: Organ[] = [
  {
    id: 'ltd',
    name: 'Lobo Direito da Tireóide',
    icon: 'thyroid-right',
    normalDescription: 'apresenta dimensões preservadas, ecotextura homogênea e contornos regulares. Vascularização ao Doppler colorido preservada. Ausência de nódulos ou lesões focais.',
    categories: [
      {
        id: 'ecotextura-ltd',
        name: 'Ecotextura do Parênquima',
        findings: [
          {
            id: 'ecotextura-heterogenea-ltd',
            name: 'Ecotextura heterogênea',
            description: 'Alteração difusa da ecotextura',
            hasDetails: true,
            extraFields: [
              {
                id: 'echotexture_pattern',
                label: 'Padrão de Ecotextura',
                type: 'select',
                options: PARENCHYMA_ECHOTEXTURE.map(p => p.label)
              },
              {
                id: 'vascularity',
                label: 'Vascularização',
                type: 'select',
                options: PARENCHYMA_VASCULARITY.map(v => v.label)
              }
            ]
          },
          {
            id: 'tireopatia-difusa-ltd',
            name: 'Tireoidite/Tireopatia difusa',
            description: 'Alteração inflamatória difusa do parênquima',
            hasDetails: true,
            extraFields: [
              {
                id: 'echotexture_pattern',
                label: 'Padrão de Ecotextura',
                type: 'select',
                options: PARENCHYMA_ECHOTEXTURE.map(p => p.label)
              },
              {
                id: 'vascularity',
                label: 'Vascularização',
                type: 'select',
                options: PARENCHYMA_VASCULARITY.map(v => v.label)
              }
            ]
          }
        ]
      },
      {
        id: 'nodulos-ltd',
        name: 'Nódulos',
        findings: [
          {
            id: 'nodulo-ltd',
            name: 'Nódulo tiroidiano',
            description: 'Lesão nodular no lobo direito',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'composition',
                label: 'Composição',
                type: 'select',
                options: NODULE_COMPOSITION.map(c => c.label)
              },
              {
                id: 'echogenicity',
                label: 'Ecogenicidade',
                type: 'select',
                options: NODULE_ECHOGENICITY.map(e => e.label)
              },
              {
                id: 'shape',
                label: 'Forma',
                type: 'select',
                options: NODULE_SHAPE.map(s => s.label)
              },
              {
                id: 'margins',
                label: 'Margens',
                type: 'select',
                options: NODULE_MARGINS.map(m => m.label)
              },
              {
                id: 'echogenic_foci',
                label: 'Focos ecogênicos',
                type: 'select',
                options: ECHOGENIC_FOCI.map(f => f.label)
              },
              {
                id: 'vascularity_pattern',
                label: 'Padrão vascular (Doppler)',
                type: 'select',
                options: VASCULARITY_PATTERN.map(v => v.label)
              },
              {
                id: 'elastography',
                label: 'Elastografia (opcional)',
                type: 'select',
                options: ELASTOGRAPHY_SCORE.map(e => e.label)
              },
              {
                id: 'tirads_calculated',
                label: 'TI-RADS (selecione após preencher acima)',
                type: 'select',
                options: TIRADS_DISPLAY_OPTIONS
              }
            ]
          },
          {
            id: 'cisto-ltd',
            name: 'Cisto simples',
            description: 'Lesão cística anecóica',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'dimensoes-ltd',
        name: 'Dimensões / Volume',
        findings: [
          {
            id: 'aumento-volumetrico-ltd',
            name: 'Aumento volumétrico',
            description: 'Lobo aumentado de volume',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'comprimento',
                label: 'Comprimento (mm)',
                type: 'text',
                placeholder: 'Ex: 55'
              },
              {
                id: 'ap',
                label: 'AP - Anteroposterior (mm)',
                type: 'text',
                placeholder: 'Ex: 22'
              },
              {
                id: 'transverso',
                label: 'Transverso (mm)',
                type: 'text',
                placeholder: 'Ex: 28'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'lte',
    name: 'Lobo Esquerdo da Tireóide',
    icon: 'thyroid-left',
    normalDescription: 'apresenta dimensões preservadas, ecotextura homogênea e contornos regulares. Vascularização ao Doppler colorido preservada. Ausência de nódulos ou lesões focais.',
    categories: [
      {
        id: 'ecotextura-lte',
        name: 'Ecotextura do Parênquima',
        findings: [
          {
            id: 'ecotextura-heterogenea-lte',
            name: 'Ecotextura heterogênea',
            description: 'Alteração difusa da ecotextura',
            hasDetails: true,
            extraFields: [
              {
                id: 'echotexture_pattern',
                label: 'Padrão de Ecotextura',
                type: 'select',
                options: PARENCHYMA_ECHOTEXTURE.map(p => p.label)
              },
              {
                id: 'vascularity',
                label: 'Vascularização',
                type: 'select',
                options: PARENCHYMA_VASCULARITY.map(v => v.label)
              }
            ]
          },
          {
            id: 'tireopatia-difusa-lte',
            name: 'Tireoidite/Tireopatia difusa',
            description: 'Alteração inflamatória difusa do parênquima',
            hasDetails: true,
            extraFields: [
              {
                id: 'echotexture_pattern',
                label: 'Padrão de Ecotextura',
                type: 'select',
                options: PARENCHYMA_ECHOTEXTURE.map(p => p.label)
              },
              {
                id: 'vascularity',
                label: 'Vascularização',
                type: 'select',
                options: PARENCHYMA_VASCULARITY.map(v => v.label)
              }
            ]
          }
        ]
      },
      {
        id: 'nodulos-lte',
        name: 'Nódulos',
        findings: [
          {
            id: 'nodulo-lte',
            name: 'Nódulo tiroidiano',
            description: 'Lesão nodular no lobo esquerdo',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'composition',
                label: 'Composição',
                type: 'select',
                options: NODULE_COMPOSITION.map(c => c.label)
              },
              {
                id: 'echogenicity',
                label: 'Ecogenicidade',
                type: 'select',
                options: NODULE_ECHOGENICITY.map(e => e.label)
              },
              {
                id: 'shape',
                label: 'Forma',
                type: 'select',
                options: NODULE_SHAPE.map(s => s.label)
              },
              {
                id: 'margins',
                label: 'Margens',
                type: 'select',
                options: NODULE_MARGINS.map(m => m.label)
              },
              {
                id: 'echogenic_foci',
                label: 'Focos ecogênicos',
                type: 'select',
                options: ECHOGENIC_FOCI.map(f => f.label)
              },
              {
                id: 'vascularity_pattern',
                label: 'Padrão vascular (Doppler)',
                type: 'select',
                options: VASCULARITY_PATTERN.map(v => v.label)
              },
              {
                id: 'elastography',
                label: 'Elastografia (opcional)',
                type: 'select',
                options: ELASTOGRAPHY_SCORE.map(e => e.label)
              },
              {
                id: 'tirads_calculated',
                label: 'TI-RADS (selecione após preencher acima)',
                type: 'select',
                options: TIRADS_DISPLAY_OPTIONS
              }
            ]
          },
          {
            id: 'cisto-lte',
            name: 'Cisto simples',
            description: 'Lesão cística anecóica',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'dimensoes-lte',
        name: 'Dimensões / Volume',
        findings: [
          {
            id: 'aumento-volumetrico-lte',
            name: 'Aumento volumétrico',
            description: 'Lobo aumentado de volume',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'comprimento',
                label: 'Comprimento (mm)',
                type: 'text',
                placeholder: 'Ex: 55'
              },
              {
                id: 'ap',
                label: 'AP - Anteroposterior (mm)',
                type: 'text',
                placeholder: 'Ex: 22'
              },
              {
                id: 'transverso',
                label: 'Transverso (mm)',
                type: 'text',
                placeholder: 'Ex: 28'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'istmo',
    name: 'Istmo Tiroidiano',
    icon: 'thyroid-isthmus',
    normalDescription: 'apresenta espessura preservada (normal < 6 mm), ecotextura homogênea. Ausência de nódulos ou alterações focais.',
    categories: [
      {
        id: 'alteracoes-istmo',
        name: 'Alterações do Istmo',
        findings: [
          {
            id: 'espessamento-istmo',
            name: 'Espessamento do istmo',
            description: 'Istmo com espessura aumentada (> 6 mm)',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'thickness',
                label: 'Espessura (mm)',
                type: 'text',
                placeholder: 'Ex: 8'
              }
            ]
          },
          {
            id: 'nodulo-istmo',
            name: 'Nódulo no istmo',
            description: 'Lesão nodular no istmo',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'composition',
                label: 'Composição',
                type: 'select',
                options: NODULE_COMPOSITION.map(c => c.label)
              },
              {
                id: 'echogenicity',
                label: 'Ecogenicidade',
                type: 'select',
                options: NODULE_ECHOGENICITY.map(e => e.label)
              },
              {
                id: 'shape',
                label: 'Forma',
                type: 'select',
                options: NODULE_SHAPE.map(s => s.label)
              },
              {
                id: 'margins',
                label: 'Margens',
                type: 'select',
                options: NODULE_MARGINS.map(m => m.label)
              },
              {
                id: 'echogenic_foci',
                label: 'Focos ecogênicos',
                type: 'select',
                options: ECHOGENIC_FOCI.map(f => f.label)
              },
              {
                id: 'tirads_calculated',
                label: 'TI-RADS (selecione após preencher acima)',
                type: 'select',
                options: TIRADS_DISPLAY_OPTIONS
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'linfonodos',
    name: 'Linfonodos Cervicais',
    icon: 'lymph-nodes',
    normalDescription: 'linfonodos cervicais com morfologia preservada, hilo hiperecoico presente e dimensões normais. Ausência de características suspeitas.',
    categories: [
      {
        id: 'linfonodos-cervicais',
        name: 'Linfonodos Regionais',
        findings: [
          {
            id: 'linfonodo-suspeito',
            name: 'Linfonodo com características suspeitas',
            description: 'Linfonodo cervical com critérios de suspeição',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'suspicious_features',
                label: 'Características Suspeitas',
                type: 'multiselect',
                options: LYMPH_NODE_SUSPICIOUS_CRITERIA
              },
              {
                id: 'level',
                label: 'Nível Cervical',
                type: 'select',
                options: [
                  'Nível I (submandibular)',
                  'Nível II (jugular superior)',
                  'Nível III (jugular médio)',
                  'Nível IV (jugular inferior)',
                  'Nível V (triângulo posterior)',
                  'Nível VI (compartimento central)',
                  'Nível VII (mediastino superior)'
                ]
              }
            ]
          },
          {
            id: 'linfonodo-aumentado',
            name: 'Linfonodo aumentado (benigno)',
            description: 'Linfonodo aumentado sem critérios de suspeição',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'level',
                label: 'Nível Cervical',
                type: 'select',
                options: [
                  'Nível I (submandibular)',
                  'Nível II (jugular superior)',
                  'Nível III (jugular médio)',
                  'Nível IV (jugular inferior)',
                  'Nível V (triângulo posterior)',
                  'Nível VI (compartimento central)',
                  'Nível VII (mediastino superior)'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'paratireoides',
    name: 'Paratireoides',
    icon: 'parathyroid',
    normalDescription: 'paratireoides não visualizadas em suas topografias habituais, o que é compatível com a normalidade.',
    categories: [
      {
        id: 'lesoes-paratireoides',
        name: 'Lesões das Paratireoides',
        findings: [
          {
            id: 'adenoma-paratireoide',
            name: 'Adenoma de Paratireoide',
            description: 'Nódulo hipoecoico posterior à tireoide',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'localizacao-para',
                label: 'Localização',
                type: 'select',
                options: [
                  'Superior direita',
                  'Superior esquerda',
                  'Inferior direita',
                  'Inferior esquerda',
                  'Ectópica - mediastino',
                  'Ectópica - retroesofágica',
                  'Ectópica - intratiroidiana'
                ]
              },
              {
                id: 'ecogenicidade-para',
                label: 'Ecogenicidade',
                type: 'select',
                options: [
                  'Hipoecóico homogêneo',
                  'Hipoecóico heterogêneo',
                  'Isoecóico',
                  'Cístico'
                ]
              },
              {
                id: 'vascularizacao-para',
                label: 'Vascularização',
                type: 'select',
                options: [
                  'Ausente',
                  'Periférica (arco vascular)',
                  'Central',
                  'Mista'
                ]
              },
              {
                id: 'polo-feeding',
                label: 'Polo vascular (feeding vessel)',
                type: 'select',
                options: [
                  'Presente',
                  'Ausente',
                  'Não avaliável'
                ]
              }
            ]
          },
          {
            id: 'hiperplasia-paratireoide',
            name: 'Hiperplasia de Paratireoides',
            description: 'Aumento difuso de múltiplas paratireoides',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'numero-glandulas',
                label: 'Número de glândulas visíveis',
                type: 'select',
                options: ['1', '2', '3', '4']
              },
              {
                id: 'localizacao-hiperplasia',
                label: 'Localização',
                type: 'select',
                options: [
                  'Bilateral simétrica',
                  'Bilateral assimétrica',
                  'Unilateral'
                ]
              }
            ]
          },
          {
            id: 'cisto-paratireoide',
            name: 'Cisto de Paratireoide',
            description: 'Lesão cística em topografia de paratireoide',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'localizacao-cisto-para',
                label: 'Localização',
                type: 'select',
                options: [
                  'Superior direita',
                  'Superior esquerda',
                  'Inferior direita',
                  'Inferior esquerda'
                ]
              },
              {
                id: 'conteudo-cisto-para',
                label: 'Conteúdo',
                type: 'select',
                options: [
                  'Anecóico (simples)',
                  'Ecos finos (proteináceo)',
                  'Hemorrágico'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'observacoes-tireoide',
    name: 'Observações',
    icon: 'notes',
    normalDescription: '',
    categories: [
      {
        id: 'obs-tireoide',
        name: 'Observações Gerais',
        findings: [
          {
            id: 'obs-tireoide-texto',
            name: 'Observação Adicional',
            description: 'Informações complementares ao exame',
            hasDetails: true,
            extraFields: [
              { id: 'texto', label: 'Observações', type: 'textarea', placeholder: 'Digite observações adicionais...' }
            ]
          }
        ]
      }
    ]
  }
];
