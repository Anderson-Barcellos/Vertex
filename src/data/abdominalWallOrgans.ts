export interface AbdominalWallStructure {
  id: string;
  name: string;
  category: string;
  icon: string;
  findings: {
    id: string;
    label: string;
    details?: {
      type: 'measurement' | 'text' | 'select' | 'multiselect';
      label: string;
      options?: string[];
      unit?: string;
    }[];
  }[];
}

export const abdominalWallStructures: AbdominalWallStructure[] = [
  {
    id: 'subcutaneous',
    name: 'Tecido Subcutâneo',
    category: 'Camadas',
    icon: '🔬',
    findings: [
      {
        id: 'normal',
        label: 'Normal',
      },
      {
        id: 'thickening',
        label: 'Espessamento',
        details: [
          {
            type: 'measurement',
            label: 'Espessura (mm)',
            unit: 'mm'
          },
          {
            type: 'select',
            label: 'Localização',
            options: ['Difusa', 'Focal - Região umbilical', 'Focal - Hipogástrio', 'Focal - Flancos', 'Outra']
          }
        ]
      },
      {
        id: 'lipoma',
        label: 'Lipoma',
        details: [
          {
            type: 'measurement',
            label: 'Maior diâmetro (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Localização',
            options: ['Umbilical', 'Epigástrica', 'Hipogástrica', 'Flanco direito', 'Flanco esquerdo', 'Outra']
          },
          {
            type: 'text',
            label: 'Características adicionais'
          }
        ]
      },
      {
        id: 'collection',
        label: 'Coleção líquida/Hematoma',
        details: [
          {
            type: 'measurement',
            label: 'Maior diâmetro (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Tipo',
            options: ['Seroso simples', 'Hematoma agudo', 'Hematoma subagudo', 'Abscesso (suspeito)', 'Indeterminado']
          },
          {
            type: 'select',
            label: 'Localização',
            options: ['Subcutânea', 'Pré-aponeurótica', 'Intramuscular', 'Pré-peritoneal']
          }
        ]
      }
    ]
  },
  {
    id: 'rectus',
    name: 'Músculos Retos Abdominais',
    category: 'Camadas',
    icon: '💪',
    findings: [
      {
        id: 'normal',
        label: 'Normal',
      },
      {
        id: 'diastasis',
        label: 'Diástase dos Retos',
        details: [
          {
            type: 'measurement',
            label: 'Distância entre músculos - supraumbilical (cm)',
            unit: 'cm'
          },
          {
            type: 'measurement',
            label: 'Distância entre músculos - umbilical (cm)',
            unit: 'cm'
          },
          {
            type: 'measurement',
            label: 'Distância entre músculos - infraumbilical (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Gravidade',
            options: ['Leve (<2cm)', 'Moderada (2-3cm)', 'Acentuada (>3cm)']
          }
        ]
      },
      {
        id: 'hematoma',
        label: 'Hematoma Intramuscular',
        details: [
          {
            type: 'measurement',
            label: 'Dimensões (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Músculo acometido',
            options: ['Reto abdominal direito', 'Reto abdominal esquerdo', 'Oblíquo externo', 'Oblíquo interno', 'Transverso']
          }
        ]
      }
    ]
  },
  {
    id: 'hernias',
    name: 'Hérnias',
    category: 'Defeitos',
    icon: '🔴',
    findings: [
      {
        id: 'no_hernia',
        label: 'Sem hérnias',
      },
      {
        id: 'umbilical',
        label: 'Hérnia Umbilical',
        details: [
          {
            type: 'measurement',
            label: 'Diâmetro do anel (cm)',
            unit: 'cm'
          },
          {
            type: 'measurement',
            label: 'Dimensão do saco herniário (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Conteúdo',
            options: ['Gordura omental', 'Alças intestinais', 'Líquido', 'Indeterminado']
          },
          {
            type: 'select',
            label: 'Redutibilidade',
            options: ['Redutível', 'Irredutível', 'Parcialmente redutível']
          }
        ]
      },
      {
        id: 'epigastric',
        label: 'Hérnia Epigástrica',
        details: [
          {
            type: 'measurement',
            label: 'Diâmetro do anel (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Conteúdo',
            options: ['Gordura pré-peritoneal', 'Omental', 'Indeterminado']
          }
        ]
      },
      {
        id: 'incisional',
        label: 'Hérnia Incisional',
        details: [
          {
            type: 'text',
            label: 'Localização da cicatriz'
          },
          {
            type: 'measurement',
            label: 'Extensão do defeito (cm)',
            unit: 'cm'
          },
          {
            type: 'measurement',
            label: 'Maior diâmetro (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Conteúdo',
            options: ['Alças intestinais', 'Gordura omental', 'Ambos', 'Indeterminado']
          }
        ]
      },
      {
        id: 'spigelian',
        label: 'Hérnia de Spiegel',
        details: [
          {
            type: 'select',
            label: 'Lado',
            options: ['Direito', 'Esquerdo', 'Bilateral']
          },
          {
            type: 'measurement',
            label: 'Diâmetro do defeito (cm)',
            unit: 'cm'
          }
        ]
      }
    ]
  },
  {
    id: 'scars',
    name: 'Cicatrizes Cirúrgicas',
    category: 'Defeitos',
    icon: '✂️',
    findings: [
      {
        id: 'no_scars',
        label: 'Sem cicatrizes',
      },
      {
        id: 'scar_normal',
        label: 'Cicatriz sem alterações',
        details: [
          {
            type: 'text',
            label: 'Localização'
          }
        ]
      },
      {
        id: 'endometriosis',
        label: 'Endometriose de Parede',
        details: [
          {
            type: 'select',
            label: 'Cicatriz relacionada',
            options: ['Cesariana (Pfannenstiel)', 'Laparoscopia', 'Mediana', 'Outra']
          },
          {
            type: 'measurement',
            label: 'Dimensões da lesão (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Camada acometida',
            options: ['Subcutânea', 'Muscular', 'Ambas']
          },
          {
            type: 'text',
            label: 'Características ultrassonográficas'
          }
        ]
      },
      {
        id: 'granuloma',
        label: 'Granuloma de Sutura',
        details: [
          {
            type: 'measurement',
            label: 'Tamanho (cm)',
            unit: 'cm'
          },
          {
            type: 'text',
            label: 'Localização'
          }
        ]
      }
    ]
  },
  {
    id: 'other_findings',
    name: 'Outros Achados',
    category: 'Diversos',
    icon: '🔍',
    findings: [
      {
        id: 'no_other',
        label: 'Sem outros achados',
      },
      {
        id: 'solid_mass',
        label: 'Lesão Sólida',
        details: [
          {
            type: 'measurement',
            label: 'Dimensões (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Localização',
            options: ['Subcutânea', 'Intramuscular', 'Pré-peritoneal']
          },
          {
            type: 'text',
            label: 'Características ecográficas'
          }
        ]
      },
      {
        id: 'cyst',
        label: 'Cisto',
        details: [
          {
            type: 'measurement',
            label: 'Diâmetro (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Tipo',
            options: ['Simples', 'Complexo', 'Septado']
          },
          {
            type: 'text',
            label: 'Localização'
          }
        ]
      },
      {
        id: 'lymphadenopathy',
        label: 'Linfonodo',
        details: [
          {
            type: 'measurement',
            label: 'Maior eixo (cm)',
            unit: 'cm'
          },
          {
            type: 'select',
            label: 'Aspecto',
            options: ['Morfologia preservada', 'Aumentado', 'Aspecto reacional']
          }
        ]
      }
    ]
  }
];

export const abdominalWallCategories = [
  { id: 'layers', name: 'Camadas', color: '#3b82f6' },
  { id: 'defects', name: 'Defeitos', color: '#ef4444' },
  { id: 'misc', name: 'Diversos', color: '#8b5cf6' }
];
