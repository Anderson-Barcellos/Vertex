/**
 * Tipos TypeScript para Sistema de Léxicos BI-RADS
 *
 * Baseado na 5ª Edição do BI-RADS do American College of Radiology (ACR)
 *
 * @version 1.0.0
 * @date 2025-11-15
 */

// ============================================================================
// ENUMS - Léxicos BI-RADS Oficiais
// ============================================================================

/**
 * Tipo de achado mamário
 */
export type TipoAchado = 'normal' | 'nodulo' | 'cisto' | 'outros';

/**
 * Forma do nódulo/massa (Shape)
 */
export type Forma = 'oval' | 'redonda' | 'irregular';

/**
 * Orientação da lesão em relação à pele (Orientation)
 */
export type Orientacao = 'paralela' | 'nao-paralela';

/**
 * Margens da lesão (Margins)
 */
export type Margens =
  | 'circunscritas'      // Bem definidas (0 pontos)
  | 'indistintas'        // Mal definidas (+1)
  | 'angular'            // Angulares (+1)
  | 'microlobuladas'     // Microlobuladas (+2)
  | 'espiculadas';       // Espiculadas (+3)

/**
 * Padrão de eco interno (Echo Pattern)
 */
export type PadraoEco =
  | 'anecoico'           // Sem ecos internos (-1)
  | 'hiperecoico'        // Mais ecogênico que gordura (0)
  | 'complexo'           // Cístico-sólido (+1)
  | 'hipoecoico'         // Menos ecogênico (+1)
  | 'isoecoico'          // Igual à gordura (0)
  | 'heterogeneo';       // Múltiplas ecogenicidades (+1)

/**
 * Características acústicas posteriores (Posterior Features)
 */
export type CaracteristicaPosterior =
  | 'sem-alteracao'      // Sem mudanças (0)
  | 'reforco'            // Reforço acústico (-1, sugere cisto)
  | 'sombra'             // Sombra acústica (+2, suspeito)
  | 'combinado';         // Combinação de reforço e sombra (+1)

/**
 * Calcificações na lesão (Calcifications)
 */
export type Calcificacoes =
  | 'ausentes'           // Sem calcificações (0)
  | 'macro'              // Macrocalcificações grosseiras (0, benignas)
  | 'micro';             // Microcalcificações (+2, suspeitas)

/**
 * Vascularização ao Doppler (Vascularity)
 */
export type Vascularizacao =
  | 'ausente'            // Sem fluxo (0)
  | 'minima'             // Mínima, periférica (0)
  | 'moderada'           // Moderada, interna (+1)
  | 'acentuada';         // Acentuada, central penetrante (+2)

/**
 * Localização anatômica na mama (quadrantes)
 */
export type Localizacao =
  | 'QSE'                // Quadrante Superior Externo
  | 'QSI'                // Quadrante Superior Interno
  | 'QIE'                // Quadrante Inferior Externo
  | 'QII'                // Quadrante Inferior Interno
  | 'retroareolar'       // Região retroareolar/central
  | 'prolongamento-axilar'; // Prolongamento axilar

/**
 * Lateralidade
 */
export type Lado = 'direita' | 'esquerda';

/**
 * Categoria BI-RADS final
 */
export type CategoriaBiRads =
  | '1'   // Negativo
  | '2'   // Benigno
  | '3'   // Provavelmente benigno
  | '4A'  // Baixa suspeita
  | '4B'  // Moderada suspeita
  | '4C'  // Alta suspeita
  | '5'   // Altamente suspeito
  | '6';  // Malignidade comprovada

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Dados completos de uma lesão mamária
 */
export interface LesaoMamaria {
  // Identificação
  lado: Lado;
  tipo: TipoAchado;

  // Dados básicos
  tamanho?: string;              // Ex: "1.2 x 0.8 cm"
  localizacao?: Localizacao;

  // Léxicos BI-RADS (quando tipo = 'nodulo')
  forma?: Forma;
  orientacao?: Orientacao;
  margens?: Margens;
  padraoEco?: PadraoEco;
  posterior?: CaracteristicaPosterior;
  calcificacoes?: Calcificacoes;
  vascularizacao?: Vascularizacao;

  // Pontuação calculada
  pontuacaoTotal?: number;
  biradsCalculado?: CategoriaBiRads;

  // Observações adicionais
  observacoes?: string;
}

/**
 * Estado completo do exame de mama
 */
export interface EstadoExameMama {
  mamaDireita: LesaoMamaria;
  mamaEsquerda: LesaoMamaria;
  linfonodoDireito: 'normal' | 'alterado';
  linfonodoEsquerdo: 'normal' | 'alterado';
  laudoGerado?: string;
}

/**
 * Detalhamento da pontuação para transparência
 */
export interface DetalhePontuacao {
  lexicoNome: string;
  valorSelecionado: string;
  pontos: number;
  descricao: string;
}

/**
 * Resultado da calculadora de BI-RADS
 */
export interface ResultadoCalculoBiRads {
  categoria: CategoriaBiRads;
  pontuacaoTotal: number;
  detalhes: DetalhePontuacao[];
  recomendacao: string;
  nivelSuspeita: 'benigno' | 'provavelmente-benigno' | 'suspeito' | 'altamente-suspeito';
}

/**
 * Opção de dropdown com pontuação
 */
export interface OpcaoLexicoComPontuacao {
  valor: string;
  label: string;
  pontos: number;
  descricao?: string;
}
