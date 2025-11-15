/**
 * Componentes especializados para exame de mama
 * Incluem léxicos BI-RADS e cálculo em tempo real
 */

export { BiRadsDisplay } from './BiRadsDisplay';
export type { BiRadsDisplayProps } from './BiRadsDisplay';

// Componentes de Léxico BI-RADS
export { LexicoDropdown } from './LexicoDropdown';
export type { LexicoDropdownProps, OpcaoLexicoComPontuacao } from './LexicoDropdown';

// Seções de Exame
export { LinfonodosSection } from './LinfonodosSection';
export type { LinfonodosSectionProps } from './LinfonodosSection';

// Opções Pré-configuradas
export {
  OPCOES_FORMA,
  OPCOES_MARGENS,
  OPCOES_ORIENTACAO,
  OPCOES_FEATURES_ACUSTICAS,
  OPCOES_COMPOSICAO,
  OPCOES_VASCULARIZACAO,
  OPCOES_PADRAO_VASCULAR,
  OPCOES_ELASTOGRAFIA,
  OPCOES_PROFUNDIDADE,
  OPCOES_POSICAO_RELOGIO,
  OPCOES_QUADRANTE,
  OPCOES_BIRADS_CATEGORIA,
} from './lexicoOpcoes';
