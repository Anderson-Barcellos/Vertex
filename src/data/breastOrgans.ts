import { Organ, OrganCategory, Finding } from './organs';

export const breastOrgans: Organ[] = [
  {
    id: 'mama-direita',
    name: 'Mama Direita',
    icon: 'breast',
    normalDescription: 'apresenta parênquima mamário com ecotextura habitual, sem evidências de nódulos, cistos ou outras lesões focais. Pele e tecido subcutâneo de espessura normal.',
    categories: [
      {
        id: 'achados-normais',
        name: 'Achados Normais',
        findings: [
          {
            id: 'mama-direita-normal',
            name: 'Mama direita de aspecto normal',
            description: 'Parênquima mamário com ecotextura habitual',
            isNormal: true
          }
        ]
      },
      {
        id: 'nodulos',
        name: 'Nódulos',
        findings: [
          {
            id: 'nodulo-solido',
            name: 'Nódulo sólido',
            description: 'Lesão nodular sólida',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasShape: true,
            hasMargins: true,
            hasOrientation: true,
            hasEchogenicity: true,
            hasPosteriorFeatures: true,
            hasVascularization: true,
            hasBirads: true
          },
          {
            id: 'fibroadenoma',
            name: 'Fibroadenoma',
            description: 'Nódulo sólido ovalado de contornos regulares',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasShape: true,
            hasMargins: true,
            hasOrientation: true,
            hasBirads: true
          },
          {
            id: 'lipoma',
            name: 'Lipoma',
            description: 'Lesão compressível de conteúdo adiposo',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasBirads: true
          }
        ]
      },
      {
        id: 'cistos',
        name: 'Cistos',
        findings: [
          {
            id: 'cisto-simples',
            name: 'Cisto simples',
            description: 'Lesão cística anecóica com paredes finas',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasBirads: true
          },
          {
            id: 'cisto-complexo',
            name: 'Cisto complexo',
            description: 'Lesão cística com componente sólido ou septos',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasInternalContent: true,
            hasBirads: true
          },
          {
            id: 'cisto-complicado',
            name: 'Cisto complicado',
            description: 'Cisto com debris ou conteúdo espesso',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasBirads: true
          }
        ]
      },
      {
        id: 'alteracoes-arquiteturais',
        name: 'Alterações Arquiteturais',
        findings: [
          {
            id: 'distorcao-arquitetural',
            name: 'Distorção arquitetural',
            description: 'Alteração da arquitetura normal do parênquima',
            hasDetails: true,
            hasLocation: true,
            hasBirads: true
          },
          {
            id: 'ectasia-ductal',
            name: 'Ectasia ductal',
            description: 'Dilatação dos ductos lactíferos',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          },
          {
            id: 'espessamento-cutaneo',
            name: 'Espessamento cutâneo',
            description: 'Espessamento da pele > 2mm',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'calcificacoes',
        name: 'Calcificações',
        findings: [
          {
            id: 'microcalcificacoes',
            name: 'Microcalcificações',
            description: 'Focos hiperecogênicos puntiformes',
            hasDetails: true,
            hasLocation: true,
            hasDistribution: true,
            hasBirads: true
          },
          {
            id: 'macrocalcificacoes',
            name: 'Macrocalcificações',
            description: 'Calcificações grosseiras > 0.5mm',
            hasDetails: true,
            hasLocation: true,
            hasBirads: true
          }
        ]
      }
    ]
  },
  {
    id: 'mama-esquerda',
    name: 'Mama Esquerda',
    icon: 'breast',
    normalDescription: 'apresenta parênquima mamário com ecotextura habitual, sem evidências de nódulos, cistos ou outras lesões focais. Pele e tecido subcutâneo de espessura normal.',
    categories: [
      {
        id: 'achados-normais',
        name: 'Achados Normais',
        findings: [
          {
            id: 'mama-esquerda-normal',
            name: 'Mama esquerda de aspecto normal',
            description: 'Parênquima mamário com ecotextura habitual',
            isNormal: true
          }
        ]
      },
      {
        id: 'nodulos',
        name: 'Nódulos',
        findings: [
          {
            id: 'nodulo-solido-esq',
            name: 'Nódulo sólido',
            description: 'Lesão nodular sólida',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasShape: true,
            hasMargins: true,
            hasOrientation: true,
            hasEchogenicity: true,
            hasPosteriorFeatures: true,
            hasVascularization: true,
            hasBirads: true
          },
          {
            id: 'fibroadenoma-esq',
            name: 'Fibroadenoma',
            description: 'Nódulo sólido ovalado de contornos regulares',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasShape: true,
            hasMargins: true,
            hasOrientation: true,
            hasBirads: true
          },
          {
            id: 'lipoma-esq',
            name: 'Lipoma',
            description: 'Lesão compressível de conteúdo adiposo',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasBirads: true
          }
        ]
      },
      {
        id: 'cistos',
        name: 'Cistos',
        findings: [
          {
            id: 'cisto-simples-esq',
            name: 'Cisto simples',
            description: 'Lesão cística anecóica com paredes finas',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasBirads: true
          },
          {
            id: 'cisto-complexo-esq',
            name: 'Cisto complexo',
            description: 'Lesão cística com componente sólido ou septos',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasInternalContent: true,
            hasBirads: true
          },
          {
            id: 'cisto-complicado-esq',
            name: 'Cisto complicado',
            description: 'Cisto com debris ou conteúdo espesso',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasBirads: true
          }
        ]
      },
      {
        id: 'alteracoes-arquiteturais',
        name: 'Alterações Arquiteturais',
        findings: [
          {
            id: 'distorcao-arquitetural-esq',
            name: 'Distorção arquitetural',
            description: 'Alteração da arquitetura normal do parênquima',
            hasDetails: true,
            hasLocation: true,
            hasBirads: true
          },
          {
            id: 'ectasia-ductal-esq',
            name: 'Ectasia ductal',
            description: 'Dilatação dos ductos lactíferos',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          },
          {
            id: 'espessamento-cutaneo-esq',
            name: 'Espessamento cutâneo',
            description: 'Espessamento da pele > 2mm',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'calcificacoes',
        name: 'Calcificações',
        findings: [
          {
            id: 'microcalcificacoes-esq',
            name: 'Microcalcificações',
            description: 'Focos hiperecogênicos puntiformes',
            hasDetails: true,
            hasLocation: true,
            hasDistribution: true,
            hasBirads: true
          },
          {
            id: 'macrocalcificacoes-esq',
            name: 'Macrocalcificações',
            description: 'Calcificações grosseiras > 0.5mm',
            hasDetails: true,
            hasLocation: true,
            hasBirads: true
          }
        ]
      }
    ]
  },
  {
    id: 'axilas',
    name: 'Regiões Axilares',
    icon: 'lymph',
    normalDescription: 'apresentam linfonodos de morfologia e dimensões habituais, com hilo gorduroso preservado, sem sinais de linfonodomegalias ou alterações suspeitas.',
    categories: [
      {
        id: 'achados-normais',
        name: 'Achados Normais',
        findings: [
          {
            id: 'axilas-normais',
            name: 'Linfonodos axilares normais',
            description: 'Linfonodos com morfologia e dimensões habituais',
            isNormal: true
          }
        ]
      },
      {
        id: 'linfonodos',
        name: 'Linfonodos',
        findings: [
          {
            id: 'linfonodomegalia-reacional',
            name: 'Linfonodomegalia reacional',
            description: 'Linfonodos aumentados com hilo preservado',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          },
          {
            id: 'linfonodo-suspeito',
            name: 'Linfonodo suspeito',
            description: 'Linfonodo com espessamento cortical ou perda do hilo',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasCorticalThickness: true,
            hasBirads: true
          },
          {
            id: 'linfonodo-metastatico',
            name: 'Linfonodo com características metastáticas',
            description: 'Linfonodo com perda completa do hilo e cortical espessada',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasCorticalThickness: true,
            hasBirads: true
          }
        ]
      }
    ]
  },
  {
    id: 'pele-tecido-subcutaneo',
    name: 'Pele e Tecido Subcutâneo',
    icon: 'skin',
    normalDescription: 'apresentam espessura normal (< 2mm), sem evidências de espessamento, edema ou retrações.',
    categories: [
      {
        id: 'achados-normais',
        name: 'Achados Normais',
        findings: [
          {
            id: 'pele-normal',
            name: 'Pele e tecido subcutâneo normais',
            description: 'Espessura cutânea normal (< 2mm)',
            isNormal: true
          }
        ]
      },
      {
        id: 'alteracoes-cutaneas',
        name: 'Alterações Cutâneas',
        findings: [
          {
            id: 'edema-cutaneo',
            name: 'Edema cutâneo',
            description: 'Espessamento da pele com padrão em casca de laranja',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          },
          {
            id: 'retracao-cutanea',
            name: 'Retração cutânea',
            description: 'Depressão ou retração da superfície cutânea',
            hasDetails: true,
            hasLocation: true
          },
          {
            id: 'fistula-cutanea',
            name: 'Fístula cutânea',
            description: 'Trajeto fistuloso para a pele',
            hasDetails: true,
            hasLocation: true
          }
        ]
      }
    ]
  }
];

// Opções específicas para localização em mamas
export const BREAST_LOCATIONS = [
  { value: 'qse', label: 'Quadrante superior externo' },
  { value: 'qsi', label: 'Quadrante superior interno' },
  { value: 'qie', label: 'Quadrante inferior externo' },
  { value: 'qii', label: 'Quadrante inferior interno' },
  { value: 'retroareolar', label: 'Região retroareolar' },
  { value: 'jq-superior', label: 'Junção de quadrantes superiores' },
  { value: 'jq-inferior', label: 'Junção de quadrantes inferiores' },
  { value: 'jq-externo', label: 'Junção de quadrantes externos' },
  { value: 'jq-interno', label: 'Junção de quadrantes internos' }
];

// Sistema de posição horária
export const CLOCK_POSITIONS = [
  { value: '12h', label: '12 horas' },
  { value: '1h', label: '1 hora' },
  { value: '2h', label: '2 horas' },
  { value: '3h', label: '3 horas' },
  { value: '4h', label: '4 horas' },
  { value: '5h', label: '5 horas' },
  { value: '6h', label: '6 horas' },
  { value: '7h', label: '7 horas' },
  { value: '8h', label: '8 horas' },
  { value: '9h', label: '9 horas' },
  { value: '10h', label: '10 horas' },
  { value: '11h', label: '11 horas' }
];

// Distância da papila
export const NIPPLE_DISTANCES = [
  { value: '0-2cm', label: '0-2 cm da papila' },
  { value: '2-4cm', label: '2-4 cm da papila' },
  { value: '4-6cm', label: '4-6 cm da papila' },
  { value: '>6cm', label: '> 6 cm da papila' }
];

// Classificação BI-RADS
export const BIRADS_CATEGORIES = [
  { value: '0', label: 'BI-RADS 0 - Avaliação incompleta' },
  { value: '1', label: 'BI-RADS 1 - Negativo' },
  { value: '2', label: 'BI-RADS 2 - Benigno' },
  { value: '3', label: 'BI-RADS 3 - Provavelmente benigno' },
  { value: '4a', label: 'BI-RADS 4A - Suspeição baixa' },
  { value: '4b', label: 'BI-RADS 4B - Suspeição moderada' },
  { value: '4c', label: 'BI-RADS 4C - Suspeição alta' },
  { value: '5', label: 'BI-RADS 5 - Altamente sugestivo de malignidade' },
  { value: '6', label: 'BI-RADS 6 - Malignidade confirmada' }
];

// Formas dos nódulos
export const NODULE_SHAPES = [
  { value: 'oval', label: 'Oval' },
  { value: 'redondo', label: 'Redondo' },
  { value: 'irregular', label: 'Irregular' }
];

// Margens dos nódulos
export const NODULE_MARGINS = [
  { value: 'circunscritas', label: 'Circunscritas' },
  { value: 'indistintas', label: 'Indistintas' },
  { value: 'anguladas', label: 'Anguladas' },
  { value: 'microlobuladas', label: 'Microlobuladas' },
  { value: 'espiculadas', label: 'Espiculadas' }
];

// Orientação dos nódulos
export const NODULE_ORIENTATION = [
  { value: 'paralela', label: 'Paralela à pele' },
  { value: 'nao-paralela', label: 'Não paralela à pele' }
];

// Ecogenicidade
export const ECHOGENICITY = [
  { value: 'anecoico', label: 'Anecóico' },
  { value: 'hiperecoico', label: 'Hiperecóico' },
  { value: 'isoecoico', label: 'Isoecóico' },
  { value: 'hipoecoico', label: 'Hipoecóico' },
  { value: 'heterogeneo', label: 'Heterogêneo' }
];

// Características posteriores
export const POSTERIOR_FEATURES = [
  { value: 'sem-alteracao', label: 'Sem alteração' },
  { value: 'reforco', label: 'Reforço acústico' },
  { value: 'sombra', label: 'Sombra acústica' },
  { value: 'padrão-misto', label: 'Padrão misto' }
];

// Vascularização
export const VASCULARIZATION = [
  { value: 'ausente', label: 'Ausente' },
  { value: 'periferica', label: 'Periférica' },
  { value: 'central', label: 'Central' },
  { value: 'mista', label: 'Mista' }
];

// Distribuição de calcificações
export const CALCIFICATION_DISTRIBUTION = [
  { value: 'agrupadas', label: 'Agrupadas' },
  { value: 'lineares', label: 'Lineares' },
  { value: 'segmentares', label: 'Segmentares' },
  { value: 'regionais', label: 'Regionais' },
  { value: 'difusas', label: 'Difusas' }
];

// Conteúdo interno de cistos
export const CYST_CONTENT = [
  { value: 'anecoico', label: 'Anecóico (simples)' },
  { value: 'debris', label: 'Com debris' },
  { value: 'nivel-liquido', label: 'Nível líquido-líquido' },
  { value: 'septos-finos', label: 'Septos finos' },
  { value: 'septos-espessos', label: 'Septos espessos' },
  { value: 'componente-solido', label: 'Componente sólido' }
];