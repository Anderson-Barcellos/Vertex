import { Organ } from './organs';

export const HERNIA_CONTENTS = [
  'Gordura pré-peritoneal',
  'Alça intestinal',
  'Epíplon',
  'Conteúdo misto'
];

export const HERNIA_REDUCIBILITY = [
  'Redutível',
  'Parcialmente redutível',
  'Irredutível',
  'Estrangulada'
];

export const DYNAMIC_MANEUVERS = [
  'Valsalva',
  'Tosse',
  'Esforço abdominal',
  'Ortostatismo',
  'Decúbito'
];

export const HERNIA_VISIBILITY = [
  'Visível em repouso',
  'Visível somente com Valsalva',
  'Visível somente com tosse',
  'Visível em ortostatismo',
  'Não visível (referida)'
];

export const abdominalWallOrgans: Organ[] = [
  {
    id: 'inguinal-direita',
    name: 'Região Inguinal Direita',
    icon: 'hernia',
    normalDescription: 'região inguinal direita sem evidências de hérnias ou defeitos parietais ao estudo estático e dinâmico (Valsalva).',
    categories: [
      {
        id: 'hernias-ing-d',
        name: 'Hérnias',
        findings: [
          {
            id: 'hernia-inguinal-indireta-d',
            name: 'Hérnia Inguinal Indireta',
            description: 'Lateral aos vasos epigástricos inferiores',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-inguinal-direta-d',
            name: 'Hérnia Inguinal Direta',
            description: 'Medial aos vasos epigástricos (Hesselbach)',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-femoral-d',
            name: 'Hérnia Femoral',
            description: 'Abaixo do ligamento inguinal',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 10' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'inguinal-esquerda',
    name: 'Região Inguinal Esquerda',
    icon: 'hernia',
    normalDescription: 'região inguinal esquerda sem evidências de hérnias ou defeitos parietais ao estudo estático e dinâmico (Valsalva).',
    categories: [
      {
        id: 'hernias-ing-e',
        name: 'Hérnias',
        findings: [
          {
            id: 'hernia-inguinal-indireta-e',
            name: 'Hérnia Inguinal Indireta',
            description: 'Lateral aos vasos epigástricos inferiores',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-inguinal-direta-e',
            name: 'Hérnia Inguinal Direta',
            description: 'Medial aos vasos epigástricos (Hesselbach)',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-femoral-e',
            name: 'Hérnia Femoral',
            description: 'Abaixo do ligamento inguinal',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 10' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'parede-anterior',
    name: 'Parede Anterior',
    icon: 'abdominal-wall',
    normalDescription: 'parede abdominal anterior com integridade muscular preservada, sem defeitos herniários na linha alba ou região umbilical.',
    categories: [
      {
        id: 'hernias-anteriores',
        name: 'Hérnias',
        findings: [
          {
            id: 'hernia-umbilical',
            name: 'Hérnia Umbilical',
            description: 'Através do anel umbilical',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 12' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-epigastrica',
            name: 'Hérnia Epigástrica',
            description: 'Linha alba acima do umbigo',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 8' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-incisional',
            name: 'Hérnia Incisional',
            description: 'Em cicatriz cirúrgica prévia',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 40' },
              { id: 'local', label: 'Local da cicatriz', type: 'text', placeholder: 'ex: Linha média infraumbilical' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'diastase-retos',
            name: 'Diástase de Retos',
            description: 'Afastamento dos músculos retos abdominais',
            hasMeasurement: true,
            extraFields: [
              { id: 'distancia', label: 'Distância inter-retos (mm)', type: 'text', placeholder: 'ex: 35' },
              { id: 'nivel', label: 'Nível', type: 'select', options: ['Supraumbilical', 'Umbilical', 'Infraumbilical', 'Toda extensão'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'parede-lateral',
    name: 'Parede Lateral',
    icon: 'abdominal-wall',
    normalDescription: 'paredes laterais do abdome sem defeitos herniários identificáveis (linhas semilunares e região lombar).',
    categories: [
      {
        id: 'hernias-laterais',
        name: 'Hérnias',
        findings: [
          {
            id: 'hernia-spiegel-d',
            name: 'Hérnia de Spiegel Direita',
            description: 'Através da linha semilunar',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-spiegel-e',
            name: 'Hérnia de Spiegel Esquerda',
            description: 'Através da linha semilunar',
            hasMeasurement: true,
            extraFields: [
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-lombar',
            name: 'Hérnia Lombar',
            description: 'Triângulo de Petit ou Grynfeltt',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: ['Direito', 'Esquerdo'] },
              { id: 'visibilidade', label: 'Visibilidade', type: 'select', options: HERNIA_VISIBILITY },
              { id: 'manobra', label: 'Manobra realizada', type: 'select', options: DYNAMIC_MANEUVERS },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 30' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'outras-lesoes',
    name: 'Outras Lesões de Parede',
    icon: 'lesion',
    normalDescription: 'sem lesões de partes moles identificáveis na parede abdominal.',
    categories: [
      {
        id: 'lesoes-partes-moles',
        name: 'Lesões de Partes Moles',
        findings: [
          {
            id: 'lipoma-parede',
            name: 'Lipoma de Parede Abdominal',
            description: 'Lesão adiposa benigna',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              { id: 'localizacao-lipoma', label: 'Localização', type: 'select', options: ['Subcutâneo', 'Intramuscular', 'Subfascial'] },
              { id: 'ecogenicidade-lipoma', label: 'Ecogenicidade', type: 'select', options: ['Hiperecóico homogêneo', 'Isoecóico à gordura', 'Levemente heterogêneo'] },
              { id: 'contornos-lipoma', label: 'Contornos', type: 'select', options: ['Bem definidos', 'Lobulados', 'Mal definidos'] }
            ]
          },
          {
            id: 'endometrioma-parede',
            name: 'Endometrioma de Parede',
            description: 'Implante endometriótico em cicatriz (Pfannenstiel, cesárea)',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              { id: 'localizacao-endo', label: 'Localização', type: 'select', options: ['Cicatriz de cesárea', 'Cicatriz de Pfannenstiel', 'Cicatriz umbilical (laparoscopia)', 'Outra'] },
              { id: 'ecogenicidade-endo', label: 'Ecogenicidade', type: 'select', options: ['Hipoecóico heterogêneo', 'Sólido-cístico', 'Cistos internos'] },
              { id: 'vascularizacao-endo', label: 'Vascularização', type: 'select', options: ['Ausente', 'Periférica', 'Central', 'Mista'] },
              { id: 'sintomas-ciclicos', label: 'Dor cíclica (menstrual)', type: 'select', options: ['Sim', 'Não', 'Não informado'] }
            ]
          },
          {
            id: 'seroma-parede',
            name: 'Seroma Pós-operatório',
            description: 'Coleção líquida em cicatriz/loja cirúrgica',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              { id: 'localizacao-seroma', label: 'Localização', type: 'text', placeholder: 'ex: Loja de tela inguinal D' },
              { id: 'conteudo-seroma', label: 'Conteúdo', type: 'select', options: ['Anecóico', 'Ecos finos (proteináceo)', 'Septações', 'Debris (infectado?)'] },
              { id: 'tempo-pos-op', label: 'Tempo pós-operatório', type: 'text', placeholder: 'ex: 15 dias' }
            ]
          },
          {
            id: 'hematoma-parede',
            name: 'Hematoma de Parede',
            description: 'Coleção hemática intramuscular ou subfascial',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              { id: 'localizacao-hematoma', label: 'Localização', type: 'select', options: ['Reto abdominal D', 'Reto abdominal E', 'Oblíquo externo', 'Oblíquo interno', 'Transverso', 'Subcutâneo'] },
              { id: 'fase-hematoma', label: 'Fase', type: 'select', options: ['Agudo (hiperecóico)', 'Subagudo (misto)', 'Crônico (hipoecóico/anecóico)'] },
              { id: 'causa-hematoma', label: 'Causa', type: 'select', options: ['Pós-operatório', 'Trauma', 'Anticoagulação', 'Espontâneo', 'Não esclarecida'] }
            ]
          },
          {
            id: 'abscesso-parede',
            name: 'Abscesso de Parede',
            description: 'Coleção purulenta na parede abdominal',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              { id: 'localizacao-abscesso', label: 'Localização', type: 'text', placeholder: 'ex: Região inguinal D' },
              { id: 'conteudo-abscesso', label: 'Conteúdo', type: 'select', options: ['Hipoecóico heterogêneo', 'Debris ecogênicos', 'Nível líquido', 'Gas (artefatos)'] },
              { id: 'parede-abscesso', label: 'Parede', type: 'select', options: ['Fina', 'Espessa', 'Irregular'] }
            ]
          },
          {
            id: 'nodulo-solido-parede',
            name: 'Nódulo Sólido a Esclarecer',
            description: 'Lesão sólida de natureza indeterminada',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              { id: 'localizacao-nodulo', label: 'Localização', type: 'text', placeholder: 'ex: Subcutâneo, região periumbilical' },
              { id: 'ecogenicidade-nodulo', label: 'Ecogenicidade', type: 'select', options: ['Hipoecóico', 'Isoecóico', 'Hiperecóico', 'Heterogêneo'] },
              { id: 'vascularizacao-nodulo', label: 'Vascularização', type: 'select', options: ['Ausente', 'Escassa', 'Moderada', 'Acentuada'] },
              { id: 'mobilidade-nodulo', label: 'Mobilidade', type: 'select', options: ['Móvel', 'Aderido a planos profundos', 'Fixo'] }
            ]
          }
        ]
      },
      {
        id: 'tela-cirurgica',
        name: 'Tela Cirúrgica',
        findings: [
          {
            id: 'tela-normoposta',
            name: 'Tela Cirúrgica Normoposicionada',
            description: 'Tela de hernioplastia em posição adequada',
            hasDetails: true,
            hasLocation: true,
            extraFields: [
              { id: 'localizacao-tela', label: 'Localização', type: 'select', options: ['Inguinal D', 'Inguinal E', 'Umbilical', 'Incisional', 'Epigástrica'] },
              { id: 'aspecto-tela', label: 'Aspecto', type: 'select', options: ['Integra, sem coleções', 'Com seroma adjacente', 'Parcialmente visualizada'] }
            ]
          },
          {
            id: 'complicacao-tela',
            name: 'Complicação de Tela',
            description: 'Alteração relacionada à tela cirúrgica',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              { id: 'localizacao-comp', label: 'Localização', type: 'select', options: ['Inguinal D', 'Inguinal E', 'Umbilical', 'Incisional', 'Epigástrica'] },
              { id: 'tipo-comp', label: 'Tipo de Complicação', type: 'select', options: ['Seroma peritela', 'Infecção/abscesso', 'Recidiva herniária', 'Migração da tela', 'Aderências'] },
              { id: 'colecao', label: 'Coleção associada', type: 'select', options: ['Ausente', 'Presente - anecóica', 'Presente - com debris', 'Presente - loculada'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'observacoes',
    name: 'Observações',
    icon: 'notes',
    normalDescription: '',
    categories: [
      {
        id: 'obs-gerais',
        name: 'Observações Gerais',
        findings: [
          {
            id: 'obs-texto',
            name: 'Observação Adicional',
            description: 'Informações complementares',
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
