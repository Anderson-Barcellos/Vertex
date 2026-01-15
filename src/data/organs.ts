import {
  LATERALITY,
  STEATOSIS_DISTRIBUTION,
  STEATOSIS_ATTENUATION,
  ASCITES_GRADE,
  GALLSTONE_TYPE,
  GALLSTONE_MOBILITY,
  ACOUSTIC_SHADOW,
  BOSNIAK_CLASSIFICATION,
  RENAL_CALCULUS_LOCATION,
  RENAL_POLE,
  HYDRONEPHROSIS_CAUSE,
  NEPHROPATHY_ECHOGENICITY,
  CORTICOMEDULLARY_DIFF,
  AORTA_ANEURYSM_MORPHOLOGY,
  AORTA_ANEURYSM_EXTENSION,
  MURAL_THROMBUS,
  SEVERITY_GRADES,
  PRESENCE,
  EXTENT_SIMPLE,
  SIZE_GRADE,
  DISTRIBUTION_FOCAL,
  DUCT_STATUS,
  CHRONIC_LIVER_SIGNS,
  PANCREATIC_COLLECTIONS,
  NECROSIS_STATUS
} from './shared/commonFields';

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
  hideNormalOption?: boolean;
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
              { id: 'distribuicao', label: 'Distribuição', type: 'select', options: [...STEATOSIS_DISTRIBUTION] },
              { id: 'atenuacao', label: 'Atenuação hepática', type: 'select', options: [...STEATOSIS_ATTENUATION] }
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
              { id: 'sinais', label: 'Sinais', type: 'select', options: [...CHRONIC_LIVER_SIGNS] },
              { id: 'ascite', label: 'Ascite', type: 'select', options: [...ASCITES_GRADE] }
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
            hasQuantity: true,
            extraFields: [
              { id: 'dimensao-calculo', label: 'Maior cálculo (mm)', type: 'text', placeholder: 'ex: 12' },
              { id: 'tipo-calculo', label: 'Tipo', type: 'select', options: [...GALLSTONE_TYPE] },
              { id: 'mobilidade', label: 'Mobilidade', type: 'select', options: [...GALLSTONE_MOBILITY] },
              { id: 'sombra', label: 'Sombra acústica', type: 'select', options: [...ACOUSTIC_SHADOW] }
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
              { id: 'extensao-calc', label: 'Extensão', type: 'select', options: [...EXTENT_SIMPLE] }
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
              { id: 'colecoes', label: 'Coleções', type: 'select', options: [...PANCREATIC_COLLECTIONS] },
              { id: 'necrose', label: 'Necrose', type: 'select', options: [...NECROSIS_STATUS] }
            ]
          },
          {
            id: 'pancreatite-cronica',
            name: 'Pancreatite Crônica',
            description: 'Alterações crônicas do parênquima',
            hasDetails: true,
            extraFields: [
              { id: 'calcificacoes-panc', label: 'Calcificações', type: 'select', options: [...DISTRIBUTION_FOCAL] },
              { id: 'wirsung', label: 'Ducto de Wirsung', type: 'select', options: [...DUCT_STATUS] }
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
            hasLocation: true,
            hasQuantity: true,
            extraFields: [
              { id: 'lado-calculo', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'localizacao-calculo', label: 'Localização', type: 'select', options: [...RENAL_CALCULUS_LOCATION] },
              { id: 'sombra-acustica', label: 'Sombra acústica', type: 'select', options: [...ACOUSTIC_SHADOW] }
            ]
          },
          {
            id: 'hidronefrose',
            name: 'Hidronefrose',
            description: 'Dilatação do sistema pielocalicinal',
            severity: 'leve',
            hasDetails: true,
            hasSeverity: true,
            extraFields: [
              { id: 'lado-hidro', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'causa-provavel', label: 'Causa provável', type: 'select', options: [...HYDRONEPHROSIS_CAUSE] },
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
            name: 'Cisto Renal',
            description: 'Lesão cística no parênquima renal',
            hasDetails: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'polo-cisto', label: 'Polo', type: 'select', options: [...RENAL_POLE] },
              { id: 'dimensao-cisto', label: 'Dimensão (mm)', type: 'text', placeholder: 'ex: 25' }
            ]
          },
          {
            id: 'rim-policistico',
            name: 'Doença Policística',
            description: 'Múltiplos cistos renais bilaterais',
            hasDetails: true,
            extraFields: [
              { id: 'tamanho-rins', label: 'Tamanho renal', type: 'select', options: [...SIZE_GRADE] },
              { id: 'cistos-hepaticos', label: 'Cistos hepáticos', type: 'select', options: [...PRESENCE].reverse() }
            ]
          },
          {
            id: 'nefropatia-parenquimatosa',
            name: 'Nefropatia Parenquimatosa',
            description: 'Alterações difusas do parênquima renal',
            hasDetails: true,
            extraFields: [
              { id: 'lado-nefro', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'ecogenicidade-renal', label: 'Ecogenicidade', type: 'select', options: [...NEPHROPATHY_ECHOGENICITY] },
              { id: 'diferenciacao', label: 'Diferenciação córtico-medular', type: 'select', options: [...CORTICOMEDULLARY_DIFF] }
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
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'polo-massa', label: 'Polo', type: 'select', options: [...RENAL_POLE] },
              { id: 'dimensao-massa', label: 'Dimensão (mm)', type: 'text', placeholder: 'ex: 30' }
            ]
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
              { id: 'morfologia-aneu', label: 'Morfologia', type: 'select', options: [...AORTA_ANEURYSM_MORPHOLOGY] },
              { id: 'trombo-mural', label: 'Trombo mural', type: 'select', options: [...MURAL_THROMBUS] },
              { id: 'extensao-aneu', label: 'Extensão', type: 'select', options: [...AORTA_ANEURYSM_EXTENSION] }
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
  },
  {
    id: 'prostata',
    name: 'Próstata',
    icon: 'oval',
    normalDescription: 'apresenta dimensões normais, contornos regulares e ecotextura homogênea, sem evidências de nódulos ou calcificações.',
    categories: [
      {
        id: 'dimensoes-prostata',
        name: 'Dimensões e Volume',
        findings: [
          {
            id: 'aumento-prostatico',
            name: 'Aumento Prostático',
            description: 'Hiperplasia prostática benigna',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              { id: 'volume-prostatico', label: 'Volume (cm³)', type: 'text', placeholder: 'ex: 35' },
              { id: 'peso-estimado', label: 'Peso estimado (g)', type: 'text', placeholder: 'ex: 40' },
              { id: 'lobo-medio', label: 'Lobo médio', type: 'select', options: ['Não identificado', 'Presente, sem protrusão', 'Protrusão intravesical'] }
            ]
          },
          {
            id: 'prostata-normal',
            name: 'Volume Normal',
            description: 'Próstata com dimensões preservadas',
            hasDetails: true,
            isNormal: true,
            extraFields: [
              { id: 'volume-normal', label: 'Volume (cm³)', type: 'text', placeholder: 'ex: 20' }
            ]
          }
        ]
      },
      {
        id: 'ecotextura-prostata',
        name: 'Ecotextura',
        findings: [
          {
            id: 'ecotextura-heterogenea-prostata',
            name: 'Ecotextura Heterogênea',
            description: 'Alteração difusa da ecotextura prostática',
            hasDetails: true
          },
          {
            id: 'calcificacoes-prostaticas',
            name: 'Calcificações',
            description: 'Calcificações no parênquima prostático',
            hasDetails: true,
            hasSeverity: true,
            extraFields: [
              { id: 'distribuicao-calc-prost', label: 'Distribuição', type: 'select', options: ['Periuretrais', 'Difusas', 'Focais'] }
            ]
          }
        ]
      },
      {
        id: 'lesoes-prostata',
        name: 'Lesões Focais',
        findings: [
          {
            id: 'nodulo-prostatico',
            name: 'Nódulo Prostático',
            description: 'Lesão nodular no parênquima prostático',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              { id: 'localizacao-nodulo-prost', label: 'Localização', type: 'select', options: ['Zona periférica', 'Zona transicional', 'Zona central'] },
              { id: 'ecogenicidade-nodulo-prost', label: 'Ecogenicidade', type: 'select', options: ['Hipoecogênico', 'Isoecogênico', 'Hiperecogênico'] },
              { id: 'contornos-nodulo-prost', label: 'Contornos', type: 'select', options: ['Regulares', 'Irregulares', 'Mal definidos'] }
            ]
          },
          {
            id: 'cisto-prostatico',
            name: 'Cisto Prostático',
            description: 'Formação cística prostática',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              { id: 'localizacao-cisto-prost', label: 'Localização', type: 'select', options: ['Linha média', 'Paramediano', 'Periférico'] }
            ]
          }
        ]
      },
      {
        id: 'residuo-vesical',
        name: 'Resíduo Pós-Miccional',
        findings: [
          {
            id: 'residuo-pos-miccional',
            name: 'Resíduo Urinário',
            description: 'Volume residual pós-miccional',
            hasDetails: true,
            extraFields: [
              { id: 'volume-residual', label: 'Volume (ml)', type: 'text', placeholder: 'ex: 50' },
              { id: 'classificacao-residuo', label: 'Classificação', type: 'select', options: ['Normal (< 50ml)', 'Leve (50-100ml)', 'Moderado (100-200ml)', 'Acentuado (> 200ml)'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'observacoes-abdome',
    name: 'Observações',
    icon: 'notes',
    normalDescription: '',
    categories: [
      {
        id: 'obs-abdome',
        name: 'Observações Gerais',
        findings: [
          {
            id: 'obs-abdome-texto',
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