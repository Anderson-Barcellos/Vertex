/**
 * Calculadora de Categoria BI-RADS para Lesões Mamárias
 *
 * Sistema automático de pontuação baseado nos léxicos do BI-RADS 5ª Edição (ACR).
 * Calcula a categoria BI-RADS somando pontos de cada característica ultrassonográfica.
 *
 * @module biradsCalculator
 * @version 1.0.0
 * @date 2025-11-15
 */

import type {
  LesaoMamaria,
  ResultadoCalculoBiRads,
  DetalhePontuacao,
  CategoriaBiRads
} from '@/types/birads';

import {
  PONTUACAO_FORMA,
  PONTUACAO_ORIENTACAO,
  PONTUACAO_MARGENS,
  PONTUACAO_PADRAO_ECO,
  PONTUACAO_POSTERIOR,
  PONTUACAO_CALCIFICACOES,
  PONTUACAO_VASCULARIZACAO,
  RECOMENDACOES_BIRADS,
  OPCOES_FORMA,
  OPCOES_ORIENTACAO,
  OPCOES_MARGENS,
  OPCOES_PADRAO_ECO,
  OPCOES_POSTERIOR,
  OPCOES_CALCIFICACOES,
  OPCOES_VASCULARIZACAO
} from '@/data/biradsLexicons';

// ============================================================================
// FUNÇÕES AUXILIARES PRIVADAS
// ============================================================================

/**
 * Verifica se a lesão é um cisto simples
 *
 * Critérios diagnósticos de cisto simples (BI-RADS 2):
 * - Padrão anecoico (sem ecos internos)
 * - Reforço acústico posterior
 * - Forma oval ou redonda
 * - Margens circunscritas (bem definidas)
 *
 * @param lesao - Dados da lesão mamária
 * @returns true se for cisto simples
 */
function isCistoSimples(lesao: LesaoMamaria): boolean {
  return (
    lesao.padraoEco === 'anecoico' &&
    lesao.posterior === 'reforco' &&
    (lesao.forma === 'oval' || lesao.forma === 'redonda') &&
    (!lesao.margens || lesao.margens === 'circunscritas')
  );
}

/**
 * Converte pontuação total em categoria BI-RADS
 *
 * Tabela de conversão:
 * - <= 0: BI-RADS 2 (Benigno)
 * - 1-2: BI-RADS 3 (Provavelmente benigno)
 * - 3-4: BI-RADS 4A (Baixa suspeita)
 * - 5-6: BI-RADS 4B (Moderada suspeita)
 * - 7-8: BI-RADS 4C (Alta suspeita)
 * - >= 9: BI-RADS 5 (Altamente suspeito)
 *
 * @param pontuacaoTotal - Soma dos pontos de todos os léxicos
 * @returns Categoria BI-RADS correspondente
 */
function converterPontuacaoParaCategoria(pontuacaoTotal: number): CategoriaBiRads {
  if (pontuacaoTotal <= 0) return '2';
  if (pontuacaoTotal <= 2) return '3';
  if (pontuacaoTotal <= 4) return '4A';
  if (pontuacaoTotal <= 6) return '4B';
  if (pontuacaoTotal <= 8) return '4C';
  return '5';
}

/**
 * Determina o nível de suspeita baseado na categoria BI-RADS
 *
 * @param categoria - Categoria BI-RADS calculada
 * @returns Nível de suspeita em português
 */
function determinarNivelSuspeita(
  categoria: CategoriaBiRads
): 'benigno' | 'provavelmente-benigno' | 'suspeito' | 'altamente-suspeito' {
  if (categoria === '2') return 'benigno';
  if (categoria === '3') return 'provavelmente-benigno';
  if (categoria === '4A' || categoria === '4B' || categoria === '4C') return 'suspeito';
  return 'altamente-suspeito';
}

/**
 * Busca a descrição de uma opção de léxico
 *
 * @param opcoes - Array de opções do léxico
 * @param valor - Valor selecionado
 * @returns Label e descrição da opção
 */
function buscarDescricaoLexicoOption(
  opcoes: { valor: string; label: string; descricao?: string }[],
  valor: string | undefined
): { label: string; descricao: string } {
  const opcao = opcoes.find((opt) => opt.valor === valor);
  return {
    label: opcao?.label || valor || 'não especificado',
    descricao: opcao?.descricao || ''
  };
}

// ============================================================================
// FUNÇÕES PÚBLICAS
// ============================================================================

/**
 * Obtém a pontuação detalhada de todos os léxicos
 *
 * Percorre todos os léxicos BI-RADS da lesão e retorna um array
 * com a pontuação individual de cada característica.
 *
 * @param lesao - Dados completos da lesão mamária
 * @returns Array com detalhamento de cada léxico avaliado
 *
 * @example
 * ```typescript
 * const lesao: LesaoMamaria = {
 *   lado: 'esquerda',
 *   tipo: 'nodulo',
 *   forma: 'irregular',
 *   margens: 'espiculadas',
 *   padraoEco: 'hipoecoico'
 * };
 *
 * const detalhes = obterPontuacaoLexicos(lesao);
 * // Retorna:
 * // [
 * //   { lexicoNome: 'Forma', valorSelecionado: 'Irregular', pontos: 2, ... },
 * //   { lexicoNome: 'Margens', valorSelecionado: 'Espiculadas', pontos: 3, ... },
 * //   ...
 * // ]
 * ```
 */
export function obterPontuacaoLexicos(lesao: LesaoMamaria): DetalhePontuacao[] {
  const detalhes: DetalhePontuacao[] = [];

  // 1. Forma
  if (lesao.forma) {
    const { label, descricao } = buscarDescricaoLexicoOption(OPCOES_FORMA, lesao.forma);
    detalhes.push({
      lexicoNome: 'Forma',
      valorSelecionado: label,
      pontos: PONTUACAO_FORMA[lesao.forma],
      descricao
    });
  }

  // 2. Orientação
  if (lesao.orientacao) {
    const { label, descricao } = buscarDescricaoLexicoOption(OPCOES_ORIENTACAO, lesao.orientacao);
    detalhes.push({
      lexicoNome: 'Orientação',
      valorSelecionado: label,
      pontos: PONTUACAO_ORIENTACAO[lesao.orientacao],
      descricao
    });
  }

  // 3. Margens
  if (lesao.margens) {
    const { label, descricao } = buscarDescricaoLexicoOption(OPCOES_MARGENS, lesao.margens);
    detalhes.push({
      lexicoNome: 'Margens',
      valorSelecionado: label,
      pontos: PONTUACAO_MARGENS[lesao.margens],
      descricao
    });
  }

  // 4. Padrão de Eco
  if (lesao.padraoEco) {
    const { label, descricao } = buscarDescricaoLexicoOption(OPCOES_PADRAO_ECO, lesao.padraoEco);
    detalhes.push({
      lexicoNome: 'Padrão de Eco',
      valorSelecionado: label,
      pontos: PONTUACAO_PADRAO_ECO[lesao.padraoEco],
      descricao
    });
  }

  // 5. Características Posteriores
  if (lesao.posterior) {
    const { label, descricao } = buscarDescricaoLexicoOption(OPCOES_POSTERIOR, lesao.posterior);
    detalhes.push({
      lexicoNome: 'Características Posteriores',
      valorSelecionado: label,
      pontos: PONTUACAO_POSTERIOR[lesao.posterior],
      descricao
    });
  }

  // 6. Calcificações
  if (lesao.calcificacoes) {
    const { label, descricao } = buscarDescricaoLexicoOption(
      OPCOES_CALCIFICACOES,
      lesao.calcificacoes
    );
    detalhes.push({
      lexicoNome: 'Calcificações',
      valorSelecionado: label,
      pontos: PONTUACAO_CALCIFICACOES[lesao.calcificacoes],
      descricao
    });
  }

  // 7. Vascularização
  if (lesao.vascularizacao) {
    const { label, descricao } = buscarDescricaoLexicoOption(
      OPCOES_VASCULARIZACAO,
      lesao.vascularizacao
    );
    detalhes.push({
      lexicoNome: 'Vascularização',
      valorSelecionado: label,
      pontos: PONTUACAO_VASCULARIZACAO[lesao.vascularizacao],
      descricao
    });
  }

  return detalhes;
}

/**
 * Calcula a categoria BI-RADS de uma lesão mamária
 *
 * Algoritmo:
 * 1. Verifica se é cisto simples (retorna BI-RADS 2 automaticamente)
 * 2. Soma os pontos de todos os léxicos preenchidos
 * 3. Converte a pontuação em categoria BI-RADS
 * 4. Retorna resultado com categoria, pontuação, detalhes e recomendação
 *
 * @param lesao - Dados completos da lesão mamária
 * @returns Resultado completo do cálculo BI-RADS
 *
 * @example
 * ```typescript
 * const lesao: LesaoMamaria = {
 *   lado: 'direita',
 *   tipo: 'nodulo',
 *   forma: 'oval',
 *   padraoEco: 'anecoico',
 *   posterior: 'reforco',
 *   margens: 'circunscritas'
 * };
 *
 * const resultado = calcularBiRads(lesao);
 * // Retorna:
 * // {
 * //   categoria: '2',
 * //   pontuacaoTotal: -2,
 * //   detalhes: [...],
 * //   recomendacao: 'Achado benigno. Rotina de rastreamento anual.',
 * //   nivelSuspeita: 'benigno'
 * // }
 * ```
 */
export function calcularBiRads(lesao: LesaoMamaria): ResultadoCalculoBiRads {
  // Detecção automática de cisto simples
  if (isCistoSimples(lesao)) {
    const detalhes = obterPontuacaoLexicos(lesao);
    return {
      categoria: '2',
      pontuacaoTotal: detalhes.reduce((sum, d) => sum + d.pontos, 0),
      detalhes,
      recomendacao:
        'Cisto simples detectado. ' + (RECOMENDACOES_BIRADS['2'] || 'Achado benigno.'),
      nivelSuspeita: 'benigno'
    };
  }

  // Obter pontuação de cada léxico
  const detalhes = obterPontuacaoLexicos(lesao);

  // Somar pontos totais
  const pontuacaoTotal = detalhes.reduce((soma, detalhe) => soma + detalhe.pontos, 0);

  // Converter pontuação em categoria
  const categoria = converterPontuacaoParaCategoria(pontuacaoTotal);

  // Determinar nível de suspeita
  const nivelSuspeita = determinarNivelSuspeita(categoria);

  // Buscar recomendação
  const recomendacao = RECOMENDACOES_BIRADS[categoria] || 'Avaliação adicional recomendada.';

  return {
    categoria,
    pontuacaoTotal,
    detalhes,
    recomendacao,
    nivelSuspeita
  };
}

/**
 * Valida combinações de léxicos de uma lesão mamária
 *
 * Verifica se há combinações clinicamente inconsistentes ou impossíveis,
 * como por exemplo:
 * - Cisto com margens espiculadas
 * - Lesão anecoica com sombra acústica
 * - Vascularização em lesão puramente cística
 *
 * @param lesao - Dados da lesão mamária a validar
 * @returns Array de mensagens de erro (vazio se válido)
 *
 * @example
 * ```typescript
 * const lesao: LesaoMamaria = {
 *   lado: 'esquerda',
 *   tipo: 'cisto',
 *   padraoEco: 'anecoico',
 *   margens: 'espiculadas' // INVÁLIDO!
 * };
 *
 * const erros = validarLesao(lesao);
 * // Retorna: ['Cistos não devem ter margens espiculadas.']
 * ```
 */
export function validarLesao(lesao: LesaoMamaria): string[] {
  const erros: string[] = [];

  // Validação 1: Cisto não deve ter margens espiculadas
  if (
    lesao.tipo === 'cisto' &&
    (lesao.margens === 'espiculadas' || lesao.margens === 'microlobuladas')
  ) {
    erros.push(
      `Cistos não devem ter margens ${lesao.margens}. Margens espiculadas/microlobuladas são características de lesões sólidas suspeitas.`
    );
  }

  // Validação 2: Lesão anecoica não deve ter sombra acústica
  if (lesao.padraoEco === 'anecoico' && lesao.posterior === 'sombra') {
    erros.push(
      'Lesão anecoica (sem ecos internos) tipicamente não causa sombra acústica. Sombra sugere conteúdo sólido denso.'
    );
  }

  // Validação 3: Cisto simples não deve ter vascularização
  if (
    lesao.tipo === 'cisto' &&
    lesao.padraoEco === 'anecoico' &&
    (lesao.vascularizacao === 'moderada' || lesao.vascularizacao === 'acentuada')
  ) {
    erros.push(
      'Cisto simples (anecoico) não deve apresentar vascularização interna. Vascularização sugere componente sólido.'
    );
  }

  // Validação 4: Margens espiculadas em lesão oval/redonda é inconsistente
  if (
    (lesao.forma === 'oval' || lesao.forma === 'redonda') &&
    lesao.margens === 'espiculadas'
  ) {
    erros.push(
      'Inconsistência: lesão com forma regular (oval/redonda) raramente apresenta margens espiculadas. Revisar achados.'
    );
  }

  // Validação 5: Orientação não-paralela deve ter outros critérios suspeitos
  if (
    lesao.orientacao === 'nao-paralela' &&
    lesao.forma === 'oval' &&
    lesao.margens === 'circunscritas' &&
    lesao.padraoEco === 'hiperecoico'
  ) {
    erros.push(
      'Orientação não-paralela em lesão com características benignas é incomum. Reavaliar orientação.'
    );
  }

  // Validação 6: Reforço acústico em lesão sólida hipoecoica com margens espiculadas
  if (
    lesao.posterior === 'reforco' &&
    lesao.padraoEco === 'hipoecoico' &&
    lesao.margens === 'espiculadas'
  ) {
    erros.push(
      'Reforço acústico posterior é raro em lesões sólidas suspeitas (hipoecoicas com margens espiculadas). Verificar achados.'
    );
  }

  // Validação 7: Microcalcificações em cisto puro
  if (lesao.tipo === 'cisto' && lesao.padraoEco === 'anecoico' && lesao.calcificacoes === 'micro') {
    erros.push(
      'Microcalcificações não são esperadas em cistos simples. Considerar reclassificar como lesão complexa.'
    );
  }

  // Validação 8: Lesão sem características definidas
  if (
    lesao.tipo === 'nodulo' &&
    !lesao.forma &&
    !lesao.margens &&
    !lesao.padraoEco &&
    !lesao.posterior
  ) {
    erros.push(
      'Lesão nodular sem características definidas. Preencher ao menos os léxicos principais (forma, margens, padrão de eco).'
    );
  }

  return erros;
}
