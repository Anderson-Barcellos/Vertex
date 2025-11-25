export interface Finding {
  id: string;
  name: string;
  description: string;
  severity?: 'leve' | 'moderado' | 'acentuado';
  hasDetails?: boolean;
  hasSeverity?: boolean;  // Shows severity dropdown
  hasMeasurement?: boolean;  // Shows size input
  hasLocation?: boolean;  // Shows location input
  hasQuantity?: boolean;  // Shows quantity input
  isNormal?: boolean;  // Marks as normal finding
  // Campos específicos para mama/BI-RADS
  hasShape?: boolean;
  hasMargins?: boolean;
  hasOrientation?: boolean;
  hasEchogenicity?: boolean;
  hasPosteriorFeatures?: boolean;
  hasVascularization?: boolean;
  hasBirads?: boolean;
  hasDistribution?: boolean;
  hasInternalContent?: boolean;
  hasCorticalThickness?: boolean;
  // Campos extras para doppler de carótidas
  extraFields?: (string | {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
  })[];
}

export interface OrganCategory {
  id: string;
  name: string;
  findings: Finding[];
}

export interface Organ {
  id: string;
  name: string;
  icon: string;
  categories: OrganCategory[];
  normalDescription: string;
}

export const organs: Organ[] = [
  {
    id: 'figado',
    name: 'Fígado',
    icon: 'liver',
    normalDescription: 'apresenta dimensões normais, contornos regulares e ecotextura homogênea. A ecogenicidade do parênquima é compatível com o padrão habitual, sem evidências de lesões focais ou difusas.',
    categories: [
      {
        id: 'dimensoes',
        name: 'Dimensões e Contornos',
        findings: [
          {
            id: 'hepatomegalia',
            name: 'Hepatomegalia',
            description: 'Aumento das dimensões hepáticas',
            severity: 'leve',
            hasDetails: true
          },
          {
            id: 'contornos-irregulares',
            name: 'Contornos Irregulares',
            description: 'Superfície hepática com irregularidades',
            hasDetails: true
          }
        ]
      },
      {
        id: 'ecotextura',
        name: 'Alterações de Ecotextura',
        findings: [
          {
            id: 'esteatose',
            name: 'Esteatose Hepática',
            description: 'Infiltração gordurosa do parênquima hepático',
            severity: 'leve',
            hasDetails: true,
            hasSeverity: true,
            extraFields: [
              { id: 'distribuicao', label: 'Distribuição', type: 'select', options: ['Difusa', 'Focal', 'Multifocal', 'Periportal'] },
              { id: 'atenuacao', label: 'Atenuação hepática', type: 'select', options: ['Maior que baço', 'Igual ao baço', 'Menor que baço'] }
            ]
          },
          {
            id: 'cirrose',
            name: 'Cirrose',
            description: 'Fibrose hepática avançada com nodularidade',
            hasDetails: true
          },
          {
            id: 'ecotextura-heterogenea',
            name: 'Ecotextura Heterogênea',
            description: 'Alteração difusa da arquitetura hepática',
            hasDetails: true
          },
          {
            id: 'hepatopatia-cronica',
            name: 'Hepatopatia Crônica',
            description: 'Sinais de doença hepática crônica',
            hasDetails: true,
            extraFields: [
              { id: 'sinais', label: 'Sinais', type: 'select', options: ['Heterogeneidade', 'Nodularidade', 'Hipertrofia lobo caudado', 'Esplenomegalia associada'] },
              { id: 'ascite', label: 'Ascite', type: 'select', options: ['Ausente', 'Mínima', 'Moderada', 'Volumosa'] }
            ]
          }
        ]
      },
      {
        id: 'lesoes',
        name: 'Lesões Focais',
        findings: [
          {
            id: 'cisto-simples',
            name: 'Cisto Simples',
            description: 'Lesão cística benigna',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasQuantity: true
          },
          {
            id: 'hemangioma',
            name: 'Hemangioma',
            description: 'Tumor vascular benigno',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          },
          {
            id: 'nodulo-solido',
            name: 'Nódulo Sólido',
            description: 'Lesão sólida a esclarecer',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasQuantity: true
          }
        ]
      }
    ]
  },
  {
    id: 'vesicula',
    name: 'Vesícula Biliar',
    icon: 'drop',
    normalDescription: 'possui forma piriforme, paredes finas e conteúdo anecoico. Não foram identificados cálculos ou espessamento parietal.',
    categories: [
      {
        id: 'calculos',
        name: 'Cálculos e Lama Biliar',
        findings: [
          {
            id: 'colelitíase',
            name: 'Colelitíase',
            description: 'Presença de cálculos na vesícula biliar',
            hasDetails: true,
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'tipo-calculo', label: 'Tipo', type: 'select', options: ['Único', 'Múltiplos', 'Microlitíase'] },
              { id: 'mobilidade', label: 'Mobilidade', type: 'select', options: ['Móvel', 'Impactado no infundíbulo', 'Impactado no colo'] },
              { id: 'sombra', label: 'Sombra acústica', type: 'select', options: ['Presente', 'Ausente'] }
            ]
          },
          {
            id: 'lama-biliar',
            name: 'Lama Biliar',
            description: 'Material particulado em suspensão',
            hasDetails: true
          }
        ]
      },
      {
        id: 'parede',
        name: 'Alterações Parietais',
        findings: [
          {
            id: 'colecistite',
            name: 'Colecistite',
            description: 'Inflamação da vesícula biliar',
            severity: 'leve',
            hasDetails: true
          },
          {
            id: 'espessamento-parietal',
            name: 'Espessamento Parietal',
            description: 'Aumento da espessura da parede vesicular',
            hasDetails: true,
            hasMeasurement: true  // Espessura em mm
          },
          {
            id: 'polipos',
            name: 'Pólipos',
            description: 'Projeções parietais intraluminais',
            hasDetails: true,
            hasMeasurement: true,
            hasQuantity: true
          },
          {
            id: 'vesicula-porcelana',
            name: 'Vesícula em Porcelana',
            description: 'Calcificação parietal da vesícula',
            hasDetails: true,
            extraFields: [
              { id: 'extensao-calc', label: 'Extensão', type: 'select', options: ['Parcial', 'Completa'] }
            ]
          },
          {
            id: 'murphy-positivo',
            name: 'Sinal de Murphy US+',
            description: 'Dor à compressão do transdutor sobre a vesícula',
            hasDetails: true
          }
        ]
      },
      {
        id: 'cirurgia-previa',
        name: 'Cirurgia Prévia',
        findings: [
          {
            id: 'colecistectomia',
            name: 'Colecistectomia',
            description: 'Ausência da vesícula biliar (cirurgia prévia)',
            hasDetails: true,
            isNormal: false
          }
        ]
      }
    ]
  },
  {
    id: 'pancreas',
    name: 'Pâncreas',
    icon: 'grain',
    normalDescription: 'foi visualizado com contornos regulares, dimensões normais e ecotextura homogênea. A ecogenicidade está preservada em relação ao fígado.',
    categories: [
      {
        id: 'inflamacao',
        name: 'Alterações Inflamatórias',
        findings: [
          {
            id: 'pancreatite',
            name: 'Pancreatite',
            description: 'Processo inflamatório pancreático',
            severity: 'leve',
            hasDetails: true
          },
          {
            id: 'aumento-volume',
            name: 'Aumento de Volume',
            description: 'Dimensões aumentadas do pâncreas',
            hasDetails: true,
            hasMeasurement: true
          },
          {
            id: 'pancreatite-aguda',
            name: 'Pancreatite Aguda',
            description: 'Inflamação aguda do pâncreas',
            hasDetails: true,
            extraFields: [
              { id: 'colecoes', label: 'Coleções', type: 'select', options: ['Ausentes', 'Peripancreáticas', 'Retroperitoneais'] },
              { id: 'necrose', label: 'Necrose', type: 'select', options: ['Não visível', 'Suspeita', 'Evidente'] }
            ]
          },
          {
            id: 'pancreatite-cronica',
            name: 'Pancreatite Crônica',
            description: 'Alterações crônicas do parênquima',
            hasDetails: true,
            extraFields: [
              { id: 'calcificacoes-panc', label: 'Calcificações', type: 'select', options: ['Ausentes', 'Focais', 'Difusas'] },
              { id: 'wirsung', label: 'Ducto de Wirsung', type: 'select', options: ['Normal', 'Dilatado', 'Irregular'] }
            ]
          }
        ]
      },
      {
        id: 'lesoes-cisticas',
        name: 'Lesões Císticas',
        findings: [
          {
            id: 'cistos',
            name: 'Cistos Pancreáticos',
            description: 'Lesões císticas no parênquima',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasQuantity: true
          },
          {
            id: 'pseudocistos',
            name: 'Pseudocistos',
            description: 'Coleções líquidas pós-inflamatórias',
            hasDetails: true
          }
        ]
      },
      {
        id: 'lesoes-solidas',
        name: 'Lesões Sólidas',
        findings: [
          {
            id: 'massa-solida',
            name: 'Massa Sólida',
            description: 'Lesão sólida pancreática',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      }
    ]
  },
  {
    id: 'rins',
    name: 'Rins',
    icon: 'kidney',
    normalDescription: 'Os rins direito e esquerdo possuem dimensões normais, contornos regulares e relação córtico-medular preservada.',
    categories: [
      {
        id: 'calculos',
        name: 'Calculose',
        findings: [
          {
            id: 'nefrolitiase',
            name: 'Nefrolitíase',
            description: 'Presença de cálculos renais',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,  // Cálice, pelve, ureter proximal
            hasQuantity: true
          },
          {
            id: 'hidronefrose',
            name: 'Hidronefrose',
            description: 'Dilatação do sistema pielocalicinal',
            severity: 'leve',
            hasDetails: true,
            hasSeverity: true,
            extraFields: [
              { id: 'lado-hidro', label: 'Lado', type: 'select', options: ['Direito', 'Esquerdo', 'Bilateral'] },
              { id: 'causa-provavel', label: 'Causa provável', type: 'select', options: ['Obstrutiva', 'Não obstrutiva', 'Indeterminada'] },
              { id: 'pelve', label: 'Pelve renal (mm)', type: 'text', placeholder: 'ex: 15' }
            ]
          }
        ]
      },
      {
        id: 'lesoes-cisticas',
        name: 'Lesões Císticas',
        findings: [
          {
            id: 'cistos-renais',
            name: 'Cistos Renais',
            description: 'Lesões císticas no parênquima renal',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasQuantity: true,
            extraFields: [
              { id: 'classificacao-bosniak', label: 'Bosniak', type: 'select', options: ['I (simples)', 'II', 'IIF', 'III', 'IV'] },
              { id: 'lado-cisto', label: 'Lado', type: 'select', options: ['Direito', 'Esquerdo', 'Bilateral'] }
            ]
          },
          {
            id: 'rim-policistico',
            name: 'Doença Policística',
            description: 'Múltiplos cistos renais bilaterais',
            hasDetails: true,
            extraFields: [
              { id: 'tamanho-rins', label: 'Tamanho renal', type: 'select', options: ['Normal', 'Aumentado', 'Muito aumentado'] },
              { id: 'cistos-hepaticos', label: 'Cistos hepáticos', type: 'select', options: ['Ausentes', 'Presentes'] }
            ]
          },
          {
            id: 'nefropatia-parenquimatosa',
            name: 'Nefropatia Parenquimatosa',
            description: 'Alterações difusas do parênquima renal',
            hasDetails: true,
            extraFields: [
              { id: 'lado-nefro', label: 'Lado', type: 'select', options: ['Direito', 'Esquerdo', 'Bilateral'] },
              { id: 'ecogenicidade-renal', label: 'Ecogenicidade', type: 'select', options: ['Aumentada (grau I)', 'Aumentada (grau II)', 'Aumentada (grau III)'] },
              { id: 'diferenciacao', label: 'Diferenciação córtico-medular', type: 'select', options: ['Preservada', 'Reduzida', 'Ausente'] }
            ]
          }
        ]
      },
      {
        id: 'lesoes-solidas',
        name: 'Lesões Sólidas',
        findings: [
          {
            id: 'massa-renal',
            name: 'Massa Renal',
            description: 'Lesão sólida no parênquima renal',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      }
    ]
  },
  {
    id: 'baco',
    name: 'Baço',
    icon: 'oval',
    normalDescription: 'apresenta dimensões normais, contornos regulares e ecotextura homogênea.',
    categories: [
      {
        id: 'dimensoes',
        name: 'Alterações Dimensionais',
        findings: [
          {
            id: 'esplenomegalia',
            name: 'Esplenomegalia',
            description: 'Aumento das dimensões esplênicas',
            severity: 'leve',
            hasDetails: true,
            hasMeasurement: true,  // Normal até 12cm no maior eixo
            hasSeverity: true
          }
        ]
      },
      {
        id: 'lesoes',
        name: 'Lesões Focais',
        findings: [
          {
            id: 'cistos-esplenicos',
            name: 'Cistos Esplênicos',
            description: 'Lesões císticas no parênquima esplênico',
            hasDetails: true,
            hasMeasurement: true,
            hasQuantity: true
          },
          {
            id: 'lesao-focal',
            name: 'Lesão Focal',
            description: 'Alteração focal do parênquima esplênico',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      }
    ]
  },
  {
    id: 'bexiga',
    name: 'Bexiga',
    icon: 'drop-half-bottom',
    normalDescription: 'está repleta, com paredes finas e conteúdo anecoico.',
    categories: [
      {
        id: 'parede',
        name: 'Alterações Parietais',
        findings: [
          {
            id: 'cistite',
            name: 'Cistite',
            description: 'Inflamação da parede vesical',
            hasDetails: true
          },
          {
            id: 'espessamento-vesical',
            name: 'Espessamento Parietal',
            description: 'Aumento da espessura da parede vesical',
            hasDetails: true,
            hasMeasurement: true  // Normal até 3mm com bexiga cheia
          }
        ]
      },
      {
        id: 'conteudo',
        name: 'Alterações do Conteúdo',
        findings: [
          {
            id: 'calculos-vesicais',
            name: 'Cálculos Vesicais',
            description: 'Presença de cálculos na bexiga',
            hasDetails: true
          },
          {
            id: 'detritos',
            name: 'Detritos',
            description: 'Material particulado intravesical',
            hasDetails: true
          }
        ]
      },
      {
        id: 'lesoes',
        name: 'Lesões',
        findings: [
          {
            id: 'polipos-vesicais',
            name: 'Pólipos',
            description: 'Projeções parietais intravesicais',
            hasDetails: true
          },
          {
            id: 'massa-vesical',
            name: 'Massa',
            description: 'Lesão sólida na parede vesical',
            hasDetails: true
          }
        ]
      }
    ]
  },
  {
    id: 'aorta',
    name: 'Aorta',
    icon: 'heart',
    normalDescription: 'A aorta abdominal apresenta calibre normal ao longo do seu trajeto, sem evidências de ectasias ou aneurismas.',
    categories: [
      {
        id: 'dilatacao',
        name: 'Alterações do Calibre',
        findings: [
          {
            id: 'ectasia',
            name: 'Ectasia Aórtica',
            description: 'Dilatação discreta da aorta abdominal (2,5-3,0cm)',
            hasDetails: true,
            hasMeasurement: true,  // Diâmetro em cm
            hasLocation: true  // Suprarrenal, infrarrenal, ilíaca
          },
          {
            id: 'aneurisma',
            name: 'Aneurisma',
            description: 'Dilatação significativa da aorta abdominal (>3,0cm)',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              { id: 'morfologia-aneu', label: 'Morfologia', type: 'select', options: ['Fusiforme', 'Sacular'] },
              { id: 'trombo-mural', label: 'Trombo mural', type: 'select', options: ['Ausente', 'Parcial', 'Circunferencial'] },
              { id: 'extensao-aneu', label: 'Extensão', type: 'select', options: ['Infrarrenal', 'Pararrenal', 'Suprarrenal', 'Aorto-ilíaco'] }
            ]
          }
        ]
      },
      {
        id: 'parede',
        name: 'Alterações Parietais',
        findings: [
          {
            id: 'calcificacoes',
            name: 'Calcificações Parietais',
            description: 'Depósitos calcários na parede aórtica',
            hasDetails: true,
            hasSeverity: true,  // Leve, moderada, acentuada
            hasLocation: true
          }
        ]
      }
    ]
  }
];