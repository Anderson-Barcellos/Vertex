import type { Organ } from '@/types/exam';
import { LATERALITY_NO_BILATERAL, SEVERITY_GRADES, createLateralityField } from './shared/commonFields';
import { createObservacoesOrgan } from './shared/commonOrgans';

const LADO_FIELD = createLateralityField('lado', false);

const TEAR_EXTENT = ['< 50% da espessura', '> 50% da espessura'] as const;
const TEAR_FACE = ['Articular', 'Bursal', 'Intrassubstancial'] as const;
const CALCIFICATION_ASPECT = ['Bem definida', 'Mal definida', 'Em reabsorção'] as const;
const CALCIFICATION_LOCATION = ['Inserção', 'Corpo do tendão', 'Junção miotendínea'] as const;
const TENDON_ECHOGENICITY = ['Hipoecóico', 'Heterogêneo', 'Hiperecóico focal'] as const;
const BICEPS_POSITION = ['Centrado no sulco', 'Subluxado medialmente', 'Luxado medialmente'] as const;
const BURSA_GRADE = ['Leve', 'Moderada', 'Acentuada'] as const;
const AC_JOINT_FINDINGS = ['Osteófitos', 'Distensão capsular', 'Irregularidade cortical'] as const;
const EFFUSION_AMOUNT = ['Mínimo', 'Moderado', 'Volumoso'] as const;
const MUSCLE_ATROPHY = ['Ausente', 'Leve', 'Moderada', 'Acentuada'] as const;

export const ombroOrgans: Organ[] = [
  {
    id: 'tendao-biceps',
    name: 'Tendão do Bíceps',
    categories: [
      {
        name: 'Posição',
        findings: [
          {
            id: 'biceps-posicao',
            name: 'Posição do tendão',
            extraFields: [
              LADO_FIELD,
              { id: 'posicao', label: 'Posição', type: 'select', options: [...BICEPS_POSITION] }
            ]
          }
        ]
      },
      {
        name: 'Alterações',
        findings: [
          {
            id: 'biceps-tendinopatia',
            name: 'Tendinopatia',
            extraFields: [
              LADO_FIELD,
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: [...TENDON_ECHOGENICITY] },
              { id: 'espessamento', label: 'Espessamento', type: 'select', options: ['Presente', 'Ausente'] }
            ]
          },
          {
            id: 'biceps-tenossinovite',
            name: 'Tenossinovite',
            extraFields: [
              LADO_FIELD,
              { id: 'liquido', label: 'Líquido peritendinoso', type: 'select', options: [...SEVERITY_GRADES] }
            ]
          },
          {
            id: 'biceps-rotura-parcial',
            name: 'Rotura parcial',
            extraFields: [
              LADO_FIELD,
              { id: 'extensao-percentual', label: 'Extensão', type: 'select', options: [...TEAR_EXTENT] },
              { id: 'dimensao-mm', label: 'Dimensão (mm)', type: 'text', placeholder: 'ex: 8' }
            ]
          },
          {
            id: 'biceps-rotura-completa',
            name: 'Rotura completa',
            extraFields: [
              LADO_FIELD,
              { id: 'retracao', label: 'Retração do coto (mm)', type: 'text', placeholder: 'ex: 25' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'supraespinhal',
    name: 'Supraespinhal',
    categories: [
      {
        name: 'Tendinopatia',
        findings: [
          {
            id: 'supra-tendinopatia',
            name: 'Tendinopatia/Tendinose',
            extraFields: [
              LADO_FIELD,
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: [...TENDON_ECHOGENICITY] },
              { id: 'espessura', label: 'Espessura alterada', type: 'select', options: ['Espessado', 'Afilado', 'Normal'] }
            ]
          }
        ]
      },
      {
        name: 'Roturas',
        findings: [
          {
            id: 'supra-rotura-parcial',
            name: 'Rotura parcial',
            extraFields: [
              LADO_FIELD,
              { id: 'face', label: 'Face acometida', type: 'select', options: [...TEAR_FACE] },
              { id: 'extensao-percentual', label: 'Extensão', type: 'select', options: [...TEAR_EXTENT] },
              { id: 'dimensao-ap', label: 'Dimensão AP (mm)', type: 'text', placeholder: 'ex: 8' },
              { id: 'dimensao-transv', label: 'Dimensão transversal (mm)', type: 'text', placeholder: 'ex: 12' }
            ]
          },
          {
            id: 'supra-rotura-completa',
            name: 'Rotura completa',
            extraFields: [
              LADO_FIELD,
              { id: 'gap', label: 'Gap tendíneo (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'retracao', label: 'Retração (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'atrofia-muscular', label: 'Atrofia muscular', type: 'select', options: [...MUSCLE_ATROPHY] }
            ]
          }
        ]
      },
      {
        name: 'Calcificações',
        findings: [
          {
            id: 'supra-calcificacao',
            name: 'Calcificação',
            extraFields: [
              LADO_FIELD,
              { id: 'localizacao', label: 'Localização', type: 'select', options: [...CALCIFICATION_LOCATION] },
              { id: 'aspecto', label: 'Aspecto', type: 'select', options: [...CALCIFICATION_ASPECT] },
              { id: 'dimensao-mm', label: 'Dimensão (mm)', type: 'text', placeholder: 'ex: 12' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'infraespinhal',
    name: 'Infraespinhal',
    categories: [
      {
        name: 'Alterações',
        findings: [
          {
            id: 'infra-tendinopatia',
            name: 'Tendinopatia/Tendinose',
            extraFields: [
              LADO_FIELD,
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: [...TENDON_ECHOGENICITY] }
            ]
          },
          {
            id: 'infra-rotura-parcial',
            name: 'Rotura parcial',
            extraFields: [
              LADO_FIELD,
              { id: 'face', label: 'Face acometida', type: 'select', options: [...TEAR_FACE] },
              { id: 'extensao-percentual', label: 'Extensão', type: 'select', options: [...TEAR_EXTENT] },
              { id: 'dimensao-mm', label: 'Dimensão (mm)', type: 'text', placeholder: 'ex: 8' }
            ]
          },
          {
            id: 'infra-rotura-completa',
            name: 'Rotura completa',
            extraFields: [
              LADO_FIELD,
              { id: 'gap', label: 'Gap tendíneo (mm)', type: 'text', placeholder: 'ex: 12' },
              { id: 'atrofia-muscular', label: 'Atrofia muscular', type: 'select', options: [...MUSCLE_ATROPHY] }
            ]
          },
          {
            id: 'infra-calcificacao',
            name: 'Calcificação',
            extraFields: [
              LADO_FIELD,
              { id: 'aspecto', label: 'Aspecto', type: 'select', options: [...CALCIFICATION_ASPECT] },
              { id: 'dimensao-mm', label: 'Dimensão (mm)', type: 'text', placeholder: 'ex: 8' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'subescapular',
    name: 'Subescapular',
    categories: [
      {
        name: 'Alterações',
        findings: [
          {
            id: 'sub-tendinopatia',
            name: 'Tendinopatia/Tendinose',
            extraFields: [
              LADO_FIELD,
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: [...TENDON_ECHOGENICITY] }
            ]
          },
          {
            id: 'sub-rotura-parcial',
            name: 'Rotura parcial',
            extraFields: [
              LADO_FIELD,
              { id: 'extensao-percentual', label: 'Extensão', type: 'select', options: [...TEAR_EXTENT] },
              { id: 'fibras', label: 'Fibras acometidas', type: 'select', options: ['Superiores', 'Inferiores', 'Todas'] },
              { id: 'dimensao-mm', label: 'Dimensão (mm)', type: 'text', placeholder: 'ex: 10' }
            ]
          },
          {
            id: 'sub-rotura-completa',
            name: 'Rotura completa',
            extraFields: [
              LADO_FIELD,
              { id: 'gap', label: 'Gap tendíneo (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'retracao', label: 'Retração (mm)', type: 'text', placeholder: 'ex: 18' }
            ]
          },
          {
            id: 'sub-calcificacao',
            name: 'Calcificação',
            extraFields: [
              LADO_FIELD,
              { id: 'aspecto', label: 'Aspecto', type: 'select', options: [...CALCIFICATION_ASPECT] },
              { id: 'dimensao-mm', label: 'Dimensão (mm)', type: 'text', placeholder: 'ex: 6' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'bursa-subacromial',
    name: 'Bursa Subacromial-Subdeltoidea',
    categories: [
      {
        name: 'Alterações',
        findings: [
          {
            id: 'bursite',
            name: 'Bursite',
            extraFields: [
              LADO_FIELD,
              { id: 'grau', label: 'Grau', type: 'select', options: [...BURSA_GRADE] },
              { id: 'espessura-mm', label: 'Espessura (mm)', type: 'text', placeholder: 'ex: 3' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: ['Líquido anecóico', 'Líquido espesso', 'Debris', 'Hemorrágico'] }
            ]
          },
          {
            id: 'espessamento-bursal',
            name: 'Espessamento sinovial',
            extraFields: [
              LADO_FIELD,
              { id: 'espessura-mm', label: 'Espessura (mm)', type: 'text', placeholder: 'ex: 2' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'articulacao-ac',
    name: 'Articulação Acromioclavicular',
    categories: [
      {
        name: 'Alterações',
        findings: [
          {
            id: 'ac-artrose',
            name: 'Artrose acromioclavicular',
            extraFields: [
              LADO_FIELD,
              { id: 'grau', label: 'Grau', type: 'select', options: [...SEVERITY_GRADES] },
              { id: 'achados', label: 'Achados', type: 'multiselect', options: [...AC_JOINT_FINDINGS] }
            ]
          },
          {
            id: 'ac-distensao',
            name: 'Distensão capsular',
            extraFields: [
              LADO_FIELD,
              { id: 'espessura-mm', label: 'Espessura capsular (mm)', type: 'text', placeholder: 'ex: 4' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'derrame-articular',
    name: 'Derrame Articular',
    categories: [
      {
        name: 'Avaliação',
        findings: [
          {
            id: 'derrame-glenoumeral',
            name: 'Derrame glenoumeral',
            extraFields: [
              LADO_FIELD,
              { id: 'quantidade', label: 'Quantidade', type: 'select', options: [...EFFUSION_AMOUNT] },
              { id: 'aspecto', label: 'Aspecto', type: 'select', options: ['Anecóico', 'Com debris', 'Espesso', 'Septado'] }
            ]
          },
          {
            id: 'cisto-paralabral',
            name: 'Cisto paralabral',
            extraFields: [
              LADO_FIELD,
              { id: 'localizacao', label: 'Localização', type: 'select', options: ['Anterior', 'Posterior', 'Superior'] },
              { id: 'dimensao-mm', label: 'Maior dimensão (mm)', type: 'text', placeholder: 'ex: 15' }
            ]
          }
        ]
      }
    ]
  },
  createObservacoesOrgan('observacoes-ombro', 'Observações')
];

export default ombroOrgans;
