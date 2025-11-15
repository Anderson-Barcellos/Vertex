/**
 * Opções pré-configuradas para léxicos BI-RADS
 * Baseado nas diretrizes do BI-RADS 5th Edition
 */

import type { OpcaoLexicoComPontuacao } from './LexicoDropdown';

// ============================================================================
// OPÇÕES DE FORMA
// ============================================================================
export const OPCOES_FORMA: OpcaoLexicoComPontuacao[] = [
  {
    id: 'forma-oval',
    label: 'Oval',
    valor: 'oval',
    pontos: -1,
    descricao: 'Lesão com contorno oval ou elipsoidal, mais larga que profunda',
  },
  {
    id: 'forma-redonda',
    label: 'Redonda',
    valor: 'redonda',
    pontos: 0,
    descricao: 'Lesão com contorno arredondado ou circular',
  },
  {
    id: 'forma-irregular',
    label: 'Irregular',
    valor: 'irregular',
    pontos: 3,
    descricao: 'Lesão com contorno irregular ou assimétrico, sugestivo de malignidade',
  },
];

// ============================================================================
// OPÇÕES DE MARGENS
// ============================================================================
export const OPCOES_MARGENS: OpcaoLexicoComPontuacao[] = [
  {
    id: 'margens-circunscritas',
    label: 'Circunscritas',
    valor: 'circunscritas',
    pontos: -1,
    descricao: 'Margens bem definidas, nítidas e demarcadas',
  },
  {
    id: 'margens-indistintas',
    label: 'Indistintas',
    valor: 'indistintas',
    pontos: 1,
    descricao: 'Margens pouco definidas, difíceis de caracterizar com precisão',
  },
  {
    id: 'margens-microlobuladas',
    label: 'Microlobuladas',
    valor: 'microlobuladas',
    pontos: 2,
    descricao: 'Margens com pequenas projeções lobulares',
  },
  {
    id: 'margens-espiculadas',
    label: 'Espiculadas',
    valor: 'espiculadas',
    pontos: 3,
    descricao: 'Margens com projeções pontiagudas ou espículas, altamente suspeita',
  },
];

// ============================================================================
// OPÇÕES DE ORIENTAÇÃO
// ============================================================================
export const OPCOES_ORIENTACAO: OpcaoLexicoComPontuacao[] = [
  {
    id: 'orientacao-paralela',
    label: 'Paralela',
    valor: 'paralela',
    pontos: -1,
    descricao: 'Lesão orientada paralelamente ao plano da pele (mais larga que profunda)',
  },
  {
    id: 'orientacao-nao-paralela',
    label: 'Não Paralela',
    valor: 'nao-paralela',
    pontos: 3,
    descricao: 'Lesão com orientação não paralela ao plano da pele (mais profunda que larga)',
  },
];

// ============================================================================
// OPÇÕES DE CARACTERÍSTICAS ACÚSTICAS POSTERIORES
// ============================================================================
export const OPCOES_FEATURES_ACUSTICAS: OpcaoLexicoComPontuacao[] = [
  {
    id: 'features-sem-alteracoes',
    label: 'Sem Alterações',
    valor: 'sem-alteracoes',
    pontos: -1,
    descricao: 'Transmissão acústica normal posteriormente à lesão',
  },
  {
    id: 'features-reforco',
    label: 'Reforço',
    valor: 'reforco',
    pontos: 0,
    descricao: 'Aumento da ecogenicidade posterior à lesão (típico de cistos)',
  },
  {
    id: 'features-sombra',
    label: 'Sombra',
    valor: 'sombra',
    pontos: 2,
    descricao: 'Redução da ecogenicidade posterior à lesão (sugestivo de malignidade)',
  },
];

// ============================================================================
// OPÇÕES DE COMPOSIÇÃO
// ============================================================================
export const OPCOES_COMPOSICAO: OpcaoLexicoComPontuacao[] = [
  {
    id: 'composicao-anecoica',
    label: 'Anecoica',
    valor: 'anecoica',
    pontos: -1,
    descricao: 'Lesão sem ecos internos, sem refúgio acústico posterior',
  },
  {
    id: 'composicao-hiperecogenica',
    label: 'Hiperecogênica',
    valor: 'hiperecogenica',
    pontos: 0,
    descricao: 'Lesão com ecos internos densos',
  },
  {
    id: 'composicao-complexa',
    label: 'Complexa',
    valor: 'complexa',
    pontos: 1,
    descricao: 'Lesão com componentes sólidos e císticos mistos',
  },
  {
    id: 'composicao-solida',
    label: 'Sólida',
    valor: 'solida',
    pontos: 1,
    descricao: 'Lesão predominantemente sólida',
  },
];

// ============================================================================
// OPÇÕES DE VASCULARIZAÇÃO (Padrão Doppler)
// ============================================================================
export const OPCOES_VASCULARIZACAO: OpcaoLexicoComPontuacao[] = [
  {
    id: 'vasc-ausente',
    label: 'Ausente',
    valor: 'ausente',
    pontos: -1,
    descricao: 'Sem fluxo Doppler detectado',
  },
  {
    id: 'vasc-periferica',
    label: 'Periférica',
    valor: 'periferica',
    pontos: 0,
    descricao: 'Fluxo apenas nas bordas da lesão',
  },
  {
    id: 'vasc-central',
    label: 'Central',
    valor: 'central',
    pontos: 2,
    descricao: 'Fluxo no centro da lesão',
  },
  {
    id: 'vasc-mista',
    label: 'Mista',
    valor: 'mista',
    pontos: 2,
    descricao: 'Fluxo tanto central quanto periférico',
  },
];

// ============================================================================
// OPÇÕES DE PADRÃO VASCULAR
// ============================================================================
export const OPCOES_PADRAO_VASCULAR: OpcaoLexicoComPontuacao[] = [
  {
    id: 'padrao-penetrante',
    label: 'Penetrante',
    valor: 'penetrante',
    pontos: 1,
    descricao: 'Vasos perpendiculares entrando na lesão',
  },
  {
    id: 'padrao-radiado',
    label: 'Radiado',
    valor: 'radiado',
    pontos: 2,
    descricao: 'Vasos irradiando para fora da lesão',
  },
];

// ============================================================================
// OPÇÕES DE ELASTOGRAFIA
// ============================================================================
export const OPCOES_ELASTOGRAFIA: OpcaoLexicoComPontuacao[] = [
  {
    id: 'elasto-1',
    label: 'Tipo 1 (Mole)',
    valor: 'tipo-1',
    pontos: -1,
    descricao: 'Padrão elástico, benigno',
  },
  {
    id: 'elasto-2',
    label: 'Tipo 2 (Intermediário)',
    valor: 'tipo-2',
    pontos: 0,
    descricao: 'Padrão misto',
  },
  {
    id: 'elasto-3',
    label: 'Tipo 3 (Duro)',
    valor: 'tipo-3',
    pontos: 1,
    descricao: 'Padrão rígido, suspeito',
  },
  {
    id: 'elasto-4',
    label: 'Tipo 4 (Muito Duro)',
    valor: 'tipo-4',
    pontos: 3,
    descricao: 'Padrão muito rígido, sugestivo de malignidade',
  },
];

// ============================================================================
// OPÇÕES DE PROFUNDIDADE
// ============================================================================
export const OPCOES_PROFUNDIDADE: OpcaoLexicoComPontuacao[] = [
  {
    id: 'prof-superficial',
    label: 'Superficial',
    valor: 'superficial',
    pontos: 0,
    descricao: 'Lesão na região subcutânea superficial',
  },
  {
    id: 'prof-intermediaria',
    label: 'Intermediária',
    valor: 'intermediaria',
    pontos: 0,
    descricao: 'Lesão em parênquima mamário intermédio',
  },
  {
    id: 'prof-profunda',
    label: 'Profunda',
    valor: 'profunda',
    pontos: 0,
    descricao: 'Lesão próxima à parede torácica ou regiões profundas',
  },
];

// ============================================================================
// OPÇÕES DE POSIÇÃO NO RELÓGIO
// ============================================================================
export const OPCOES_POSICAO_RELOGIO: OpcaoLexicoComPontuacao[] = [
  { id: 'pos-12', label: '12 horas', valor: '12', descricao: 'Posição superior' },
  { id: 'pos-1', label: '1 hora', valor: '1', descricao: 'Posição superior-lateral' },
  { id: 'pos-2', label: '2 horas', valor: '2', descricao: 'Posição superior-lateral' },
  { id: 'pos-3', label: '3 horas', valor: '3', descricao: 'Posição lateral' },
  { id: 'pos-4', label: '4 horas', valor: '4', descricao: 'Posição inferior-lateral' },
  { id: 'pos-5', label: '5 horas', valor: '5', descricao: 'Posição inferior-lateral' },
  { id: 'pos-6', label: '6 horas', valor: '6', descricao: 'Posição inferior' },
  { id: 'pos-7', label: '7 horas', valor: '7', descricao: 'Posição inferior-medial' },
  { id: 'pos-8', label: '8 horas', valor: '8', descricao: 'Posição inferior-medial' },
  { id: 'pos-9', label: '9 horas', valor: '9', descricao: 'Posição medial' },
  { id: 'pos-10', label: '10 horas', valor: '10', descricao: 'Posição superior-medial' },
  { id: 'pos-11', label: '11 horas', valor: '11', descricao: 'Posição superior-medial' },
];

// ============================================================================
// OPÇÕES DE QUADRANTE
// ============================================================================
export const OPCOES_QUADRANTE: OpcaoLexicoComPontuacao[] = [
  {
    id: 'quad-qse',
    label: 'QSE',
    valor: 'qse',
    descricao: 'Quadrante Superior Externo',
  },
  {
    id: 'quad-qsi',
    label: 'QSI',
    valor: 'qsi',
    descricao: 'Quadrante Superior Interno',
  },
  {
    id: 'quad-qie',
    label: 'QIE',
    valor: 'qie',
    descricao: 'Quadrante Inferior Externo',
  },
  {
    id: 'quad-qii',
    label: 'QII',
    valor: 'qii',
    descricao: 'Quadrante Inferior Interno',
  },
  {
    id: 'quad-retroareolar',
    label: 'Retroareolar',
    valor: 'retroareolar',
    descricao: 'Região retroareolar',
  },
];

// ============================================================================
// OPÇÕES DE CATEGORIA BI-RADS (Final)
// ============================================================================
export const OPCOES_BIRADS_CATEGORIA: OpcaoLexicoComPontuacao[] = [
  {
    id: 'birads-0',
    label: 'BI-RADS 0 - Incompleto',
    valor: 'birads-0',
    pontos: 0,
    descricao: 'Necessário investigação adicional',
  },
  {
    id: 'birads-1',
    label: 'BI-RADS 1 - Normal',
    valor: 'birads-1',
    pontos: -1,
    descricao: 'Achado sem significância clínica',
  },
  {
    id: 'birads-2',
    label: 'BI-RADS 2 - Benigno',
    valor: 'birads-2',
    pontos: -1,
    descricao: 'Achado definitivamente benigno',
  },
  {
    id: 'birads-3',
    label: 'BI-RADS 3 - Provavelmente Benigno',
    valor: 'birads-3',
    pontos: 0,
    descricao: 'Lesão com achados benignos, risco <2% de malignidade',
  },
  {
    id: 'birads-4',
    label: 'BI-RADS 4 - Suspeita',
    valor: 'birads-4',
    pontos: 2,
    descricao: 'Achados suspeitos, risco 2-95% de malignidade',
  },
  {
    id: 'birads-5',
    label: 'BI-RADS 5 - Altamente Suspeito',
    valor: 'birads-5',
    pontos: 3,
    descricao: 'Achados altamente sugestivos de malignidade, risco >95%',
  },
  {
    id: 'birads-6',
    label: 'BI-RADS 6 - Confirmado Maligno',
    valor: 'birads-6',
    pontos: 3,
    descricao: 'Malignidade confirmada por biópsia ou resgate',
  },
];
