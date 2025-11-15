/**
 * Constantes de Léxicos BI-RADS com Pontuações
 *
 * Todas as opções de dropdowns e suas respectivas pontuações
 * para cálculo automático da categoria BI-RADS.
 *
 * @version 1.0.0
 * @date 2025-11-15
 */

import type {
  OpcaoLexicoComPontuacao,
  Forma,
  Orientacao,
  Margens,
  PadraoEco,
  CaracteristicaPosterior,
  Calcificacoes,
  Vascularizacao,
  Localizacao
} from '@/types/birads';

// ============================================================================
// OPÇÕES DE LÉXICOS COM PONTUAÇÃO
// ============================================================================

/**
 * Forma do nódulo/massa
 */
export const OPCOES_FORMA: OpcaoLexicoComPontuacao[] = [
  {
    valor: 'oval',
    label: 'Oval',
    pontos: 0,
    descricao: 'Forma ovalada - favorece benignidade'
  },
  {
    valor: 'redonda',
    label: 'Redonda',
    pontos: 0,
    descricao: 'Forma redonda - favorece benignidade'
  },
  {
    valor: 'irregular',
    label: 'Irregular',
    pontos: 2,
    descricao: 'Forma irregular - suspeito de malignidade'
  }
];

/**
 * Orientação da lesão
 */
export const OPCOES_ORIENTACAO: OpcaoLexicoComPontuacao[] = [
  {
    valor: 'paralela',
    label: 'Paralela à pele',
    pontos: 0,
    descricao: 'Eixo maior paralelo à pele - favorece benignidade'
  },
  {
    valor: 'nao-paralela',
    label: 'Não-paralela (antiparalela)',
    pontos: 2,
    descricao: 'Eixo maior perpendicular à pele - suspeito'
  }
];

/**
 * Margens da lesão
 */
export const OPCOES_MARGENS: OpcaoLexicoComPontuacao[] = [
  {
    valor: 'circunscritas',
    label: 'Circunscritas (bem definidas)',
    pontos: 0,
    descricao: 'Margens nítidas e bem delimitadas - benigno'
  },
  {
    valor: 'indistintas',
    label: 'Indistintas (mal definidas)',
    pontos: 1,
    descricao: 'Margens pouco definidas - intermediário'
  },
  {
    valor: 'angular',
    label: 'Angulares',
    pontos: 1,
    descricao: 'Margens com ângulos agudos - intermediário'
  },
  {
    valor: 'microlobuladas',
    label: 'Microlobuladas',
    pontos: 2,
    descricao: 'Pequenas ondulações nas margens - suspeito'
  },
  {
    valor: 'espiculadas',
    label: 'Espiculadas',
    pontos: 3,
    descricao: 'Espículas radiando da lesão - altamente suspeito'
  }
];

/**
 * Padrão de eco interno
 */
export const OPCOES_PADRAO_ECO: OpcaoLexicoComPontuacao[] = [
  {
    valor: 'anecoico',
    label: 'Anecoico',
    pontos: -1,
    descricao: 'Sem ecos internos - favorece cisto simples'
  },
  {
    valor: 'hiperecoico',
    label: 'Hiperecoico',
    pontos: 0,
    descricao: 'Mais ecogênico que gordura - pode ser gordura'
  },
  {
    valor: 'isoecoico',
    label: 'Isoecoico',
    pontos: 0,
    descricao: 'Mesma ecogenicidade da gordura'
  },
  {
    valor: 'hipoecoico',
    label: 'Hipoecoico',
    pontos: 1,
    descricao: 'Menos ecogênico que gordura - achado comum'
  },
  {
    valor: 'heterogeneo',
    label: 'Heterogêneo',
    pontos: 1,
    descricao: 'Múltiplas ecogenicidades - suspeito'
  },
  {
    valor: 'complexo',
    label: 'Complexo cístico-sólido',
    pontos: 1,
    descricao: 'Componentes sólidos e císticos'
  }
];

/**
 * Características acústicas posteriores
 */
export const OPCOES_POSTERIOR: OpcaoLexicoComPontuacao[] = [
  {
    valor: 'sem-alteracao',
    label: 'Sem alteração',
    pontos: 0,
    descricao: 'Não há mudanças na transmissão sonora'
  },
  {
    valor: 'reforco',
    label: 'Reforço acústico',
    pontos: -1,
    descricao: 'Aumento de ecos posteriores - favorece cisto'
  },
  {
    valor: 'sombra',
    label: 'Sombra acústica',
    pontos: 2,
    descricao: 'Atenuação posterior - suspeito de malignidade'
  },
  {
    valor: 'combinado',
    label: 'Padrão combinado',
    pontos: 1,
    descricao: 'Reforço e sombra concomitantes'
  }
];

/**
 * Calcificações na lesão
 */
export const OPCOES_CALCIFICACOES: OpcaoLexicoComPontuacao[] = [
  {
    valor: 'ausentes',
    label: 'Ausentes',
    pontos: 0,
    descricao: 'Sem calcificações visíveis'
  },
  {
    valor: 'macro',
    label: 'Macrocalcificações (grosseiras)',
    pontos: 0,
    descricao: 'Calcificações grandes - tipicamente benignas'
  },
  {
    valor: 'micro',
    label: 'Microcalcificações (puntiformes)',
    pontos: 2,
    descricao: 'Calcificações pequenas - suspeitas'
  }
];

/**
 * Vascularização ao Doppler
 */
export const OPCOES_VASCULARIZACAO: OpcaoLexicoComPontuacao[] = [
  {
    valor: 'ausente',
    label: 'Ausente',
    pontos: 0,
    descricao: 'Sem fluxo detectável ao Doppler'
  },
  {
    valor: 'minima',
    label: 'Mínima (periférica)',
    pontos: 0,
    descricao: 'Fluxo periférico escasso'
  },
  {
    valor: 'moderada',
    label: 'Moderada (interna)',
    pontos: 1,
    descricao: 'Fluxo interno moderado'
  },
  {
    valor: 'acentuada',
    label: 'Acentuada (central penetrante)',
    pontos: 2,
    descricao: 'Fluxo central abundante - suspeito'
  }
];

/**
 * Localização na mama
 */
export const OPCOES_LOCALIZACAO: { valor: Localizacao; label: string }[] = [
  { valor: 'QSE', label: 'QSE (Quadrante Superior Externo)' },
  { valor: 'QSI', label: 'QSI (Quadrante Superior Interno)' },
  { valor: 'QIE', label: 'QIE (Quadrante Inferior Externo)' },
  { valor: 'QII', label: 'QII (Quadrante Inferior Interno)' },
  { valor: 'retroareolar', label: 'Retroareolar (Central)' },
  { valor: 'prolongamento-axilar', label: 'Prolongamento Axilar' }
];

// ============================================================================
// TABELAS DE PONTUAÇÃO (para lookup rápido)
// ============================================================================

/**
 * Mapa de pontuação por forma
 */
export const PONTUACAO_FORMA: Record<Forma, number> = {
  'oval': 0,
  'redonda': 0,
  'irregular': 2
};

/**
 * Mapa de pontuação por orientação
 */
export const PONTUACAO_ORIENTACAO: Record<Orientacao, number> = {
  'paralela': 0,
  'nao-paralela': 2
};

/**
 * Mapa de pontuação por margens
 */
export const PONTUACAO_MARGENS: Record<Margens, number> = {
  'circunscritas': 0,
  'indistintas': 1,
  'angular': 1,
  'microlobuladas': 2,
  'espiculadas': 3
};

/**
 * Mapa de pontuação por padrão de eco
 */
export const PONTUACAO_PADRAO_ECO: Record<PadraoEco, number> = {
  'anecoico': -1,
  'hiperecoico': 0,
  'isoecoico': 0,
  'hipoecoico': 1,
  'heterogeneo': 1,
  'complexo': 1
};

/**
 * Mapa de pontuação por características posteriores
 */
export const PONTUACAO_POSTERIOR: Record<CaracteristicaPosterior, number> = {
  'sem-alteracao': 0,
  'reforco': -1,
  'sombra': 2,
  'combinado': 1
};

/**
 * Mapa de pontuação por calcificações
 */
export const PONTUACAO_CALCIFICACOES: Record<Calcificacoes, number> = {
  'ausentes': 0,
  'macro': 0,
  'micro': 2
};

/**
 * Mapa de pontuação por vascularização
 */
export const PONTUACAO_VASCULARIZACAO: Record<Vascularizacao, number> = {
  'ausente': 0,
  'minima': 0,
  'moderada': 1,
  'acentuada': 2
};

// ============================================================================
// CONSTANTES ADICIONAIS
// ============================================================================

/**
 * Recomendações por categoria BI-RADS
 */
export const RECOMENDACOES_BIRADS: Record<string, string> = {
  '1': 'Rotina de rastreamento anual.',
  '2': 'Achado benigno. Rotina de rastreamento anual.',
  '3': 'Achado provavelmente benigno. Controle ultrassonográfico em 6 meses.',
  '4A': 'Baixa suspeita de malignidade (2-10%). Biópsia indicada.',
  '4B': 'Moderada suspeita de malignidade (10-50%). Biópsia recomendada.',
  '4C': 'Alta suspeita de malignidade (50-95%). Biópsia fortemente recomendada.',
  '5': 'Altamente suspeito de malignidade (>95%). Biópsia urgente indicada.',
  '6': 'Malignidade comprovada por biópsia. Tratamento oncológico.'
};

/**
 * Descrições das categorias BI-RADS
 */
export const DESCRICOES_BIRADS: Record<string, string> = {
  '1': 'Negativo',
  '2': 'Benigno',
  '3': 'Provavelmente Benigno',
  '4A': 'Baixa Suspeita de Malignidade',
  '4B': 'Moderada Suspeita de Malignidade',
  '4C': 'Alta Suspeita de Malignidade',
  '5': 'Altamente Suspeito de Malignidade',
  '6': 'Malignidade Comprovada'
};
