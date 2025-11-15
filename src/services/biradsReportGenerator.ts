/**
 * Gerador de Laudos BI-RADS para Ultrassonografia Mamária
 *
 * Funções que geram texto médico formal em português seguindo
 * os padrões do Colégio Brasileiro de Radiologia (CBR) e ACR BI-RADS 5ª Edição
 *
 * @version 1.0.0
 * @date 2025-11-15
 */

import type {
  LesaoMamaria,
  Lado,
  Forma,
  Orientacao,
  Margens,
  PadraoEco,
  CaracteristicaPosterior,
  Calcificacoes,
  Vascularizacao,
  Localizacao,
  CategoriaBiRads
} from '@/types/birads';

// ============================================================================
// MAPAS DE TRADUÇÃO - Léxicos em Português Médico Formal
// ============================================================================

const MAPA_FORMA: Record<Forma, string> = {
  'oval': 'oval',
  'redonda': 'arredondada',
  'irregular': 'de contornos irregulares'
};

const MAPA_ORIENTACAO: Record<Orientacao, string> = {
  'paralela': 'orientação paralela à pele',
  'nao-paralela': 'orientação não-paralela à pele'
};

const MAPA_MARGENS: Record<Margens, string> = {
  'circunscritas': 'margens circunscritas',
  'indistintas': 'margens indistintas',
  'angular': 'margens angulares',
  'microlobuladas': 'margens microlobuladas',
  'espiculadas': 'margens espiculadas'
};

const MAPA_PADRAO_ECO: Record<PadraoEco, string> = {
  'anecoico': 'conteúdo anecoico',
  'hiperecoico': 'padrão hiperecoico',
  'complexo': 'aspecto complexo cístico-sólido',
  'hipoecoico': 'padrão hipoecoico',
  'isoecoico': 'padrão isoecoico em relação ao tecido adiposo',
  'heterogeneo': 'padrão heterogêneo com múltiplas ecogenicidades'
};

const MAPA_POSTERIOR: Record<CaracteristicaPosterior, string> = {
  'sem-alteracao': 'sem alterações acústicas posteriores',
  'reforco': 'com reforço acústico posterior',
  'sombra': 'com sombra acústica posterior',
  'combinado': 'com características acústicas posteriores mistas (reforço e sombra)'
};

const MAPA_CALCIFICACOES: Record<Calcificacoes, string> = {
  'ausentes': 'sem calcificações associadas',
  'macro': 'macrocalcificações grosseiras de aspecto benigno',
  'micro': 'microcalcificações puntiformes suspeitas'
};

const MAPA_VASCULARIZACAO: Record<Vascularizacao, string> = {
  'ausente': 'sem sinais de vascularização ao estudo Doppler',
  'minima': 'vascularização mínima periférica ao Doppler colorido',
  'moderada': 'vascularização moderada com fluxo intranodular ao Doppler',
  'acentuada': 'vascularização acentuada com padrão penetrante central ao Doppler'
};

const MAPA_LOCALIZACAO: Record<Localizacao, string> = {
  'QSE': 'quadrante superior externo',
  'QSI': 'quadrante superior interno',
  'QIE': 'quadrante inferior externo',
  'QII': 'quadrante inferior interno',
  'retroareolar': 'região retroareolar',
  'prolongamento-axilar': 'prolongamento axilar'
};

const MAPA_LADO: Record<Lado, string> = {
  'direita': 'direita',
  'esquerda': 'esquerda'
};

// ============================================================================
// FUNÇÕES GERADORAS DE TEXTO
// ============================================================================

/**
 * Gera descrição médica completa de um nódulo sólido
 * Inclui TODOS os léxicos BI-RADS selecionados de forma fluente
 */
export function gerarDescricaoNodulo(lesao: LesaoMamaria): string {
  if (lesao.tipo !== 'nodulo') {
    return '';
  }

  const partes: string[] = [];

  // Início da frase
  partes.push('Nódulo sólido');

  // Forma
  if (lesao.forma) {
    partes.push(MAPA_FORMA[lesao.forma]);
  }

  // Localização
  if (lesao.localizacao) {
    partes.push(`no ${MAPA_LOCALIZACAO[lesao.localizacao]}`);
  }

  // Tamanho
  if (lesao.tamanho) {
    partes.push(`medindo ${lesao.tamanho}`);
  }

  // Juntar primeira parte
  let descricao = partes.join(' ') + ',';

  // Segunda parte: características detalhadas
  const caracteristicas: string[] = [];

  if (lesao.margens) {
    caracteristicas.push(MAPA_MARGENS[lesao.margens]);
  }

  if (lesao.orientacao) {
    caracteristicas.push(MAPA_ORIENTACAO[lesao.orientacao]);
  }

  if (lesao.padraoEco) {
    caracteristicas.push(MAPA_PADRAO_ECO[lesao.padraoEco]);
  }

  if (lesao.posterior) {
    caracteristicas.push(MAPA_POSTERIOR[lesao.posterior]);
  }

  if (caracteristicas.length > 0) {
    descricao += ' apresentando ' + caracteristicas.join(', ');
  }

  // Terceira parte: calcificações e vascularização
  const adicionais: string[] = [];

  if (lesao.calcificacoes) {
    adicionais.push(MAPA_CALCIFICACOES[lesao.calcificacoes]);
  }

  if (lesao.vascularizacao) {
    adicionais.push(MAPA_VASCULARIZACAO[lesao.vascularizacao]);
  }

  if (adicionais.length > 0) {
    descricao += '. ' + adicionais.map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('. ');
  }

  // Observações adicionais
  if (lesao.observacoes) {
    descricao += '. ' + lesao.observacoes;
  }

  return descricao + '.';
}

/**
 * Gera descrição de cisto simples (padrão BI-RADS 2)
 */
export function gerarDescricaoCistoSimples(lesao: LesaoMamaria): string {
  if (lesao.tipo !== 'cisto') {
    return '';
  }

  let descricao = 'Imagem anecoica de paredes finas e regulares';

  if (lesao.tamanho) {
    descricao += `, medindo ${lesao.tamanho}`;
  }

  descricao += ', com reforço acústico posterior';

  if (lesao.localizacao) {
    descricao += `, localizada no ${MAPA_LOCALIZACAO[lesao.localizacao]}`;
  }

  descricao += '. Aspecto característico de cisto simples.';

  if (lesao.observacoes) {
    descricao += ' ' + lesao.observacoes;
  }

  return descricao;
}

/**
 * Gera descrição de mama sem alterações (padrão BI-RADS 1)
 */
export function gerarDescricaoMamaNormal(lado: Lado): string {
  return `Mama ${MAPA_LADO[lado]}: tecido mamário de padrão fibroglandular habitual, sem evidências de nódulos sólidos, formações císticas ou outras alterações focais. Ausência de espessamentos cutâneos, distorções arquiteturais ou coleções líquidas.`;
}

/**
 * Gera impressão diagnóstica com categoria BI-RADS e recomendação
 */
export function gerarImpressaoDiagnostica(lesao: LesaoMamaria, birads: CategoriaBiRads): string {
  const ladoTexto = lesao.lado === 'direita' ? 'Mama direita' : 'Mama esquerda';
  let descricaoLesao = '';
  let recomendacao = '';

  // Descrição curta da lesão
  if (lesao.tipo === 'nodulo') {
    descricaoLesao = 'Nódulo sólido';
    if (lesao.localizacao) {
      descricaoLesao += ` no ${MAPA_LOCALIZACAO[lesao.localizacao]}`;
    }
  } else if (lesao.tipo === 'cisto') {
    descricaoLesao = 'Cisto simples';
    if (lesao.localizacao) {
      descricaoLesao += ` no ${MAPA_LOCALIZACAO[lesao.localizacao]}`;
    }
  } else if (lesao.tipo === 'normal') {
    return `${ladoTexto}: Sem alterações significativas - BI-RADS ${birads}.`;
  }

  // Recomendações baseadas no BI-RADS
  switch (birads) {
    case '1':
      recomendacao = 'Exame normal. Seguimento de rotina conforme faixa etária.';
      break;
    case '2':
      recomendacao = 'Achado benigno. Seguimento de rotina conforme faixa etária.';
      break;
    case '3':
      recomendacao = 'Achado provavelmente benigno. Controle ultrassonográfico em 6 meses recomendado.';
      break;
    case '4A':
      recomendacao = 'Baixa suspeita de malignidade (2-10%). Biópsia percutânea recomendada.';
      break;
    case '4B':
      recomendacao = 'Moderada suspeita de malignidade (10-50%). Biópsia percutânea recomendada.';
      break;
    case '4C':
      recomendacao = 'Alta suspeita de malignidade (50-95%). Biópsia percutânea fortemente recomendada.';
      break;
    case '5':
      recomendacao = 'Altamente suspeito de malignidade (>95%). Biópsia ou exérese cirúrgica indicada.';
      break;
    case '6':
      recomendacao = 'Malignidade comprovada por biópsia. Seguimento oncológico.';
      break;
    default:
      recomendacao = 'Avaliação clínica recomendada.';
  }

  return `${ladoTexto}: ${descricaoLesao} - BI-RADS ${birads}. ${recomendacao}`;
}

/**
 * Gera laudo completo formatado em Markdown
 * Inclui: TÉCNICA, ACHADOS, LINFONODOS, IMPRESSÃO DIAGNÓSTICA
 */
export function gerarLaudoCompleto(
  mamaDireita: LesaoMamaria,
  mamaEsquerda: LesaoMamaria,
  linfonodos: { direito: 'normal' | 'alterado'; esquerdo: 'normal' | 'alterado' }
): string {
  const dataExame = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  let laudo = '';

  // CABEÇALHO
  laudo += '# ULTRASSONOGRAFIA DE MAMAS\n\n';
  laudo += `**Data do Exame:** ${dataExame}\n\n`;
  laudo += '---\n\n';

  // TÉCNICA
  laudo += '## TÉCNICA\n\n';
  laudo += 'Exame realizado com transdutor linear de alta frequência (7.5-12 MHz), ';
  laudo += 'avaliando ambas as mamas e regiões axilares em múltiplos planos (transversal e longitudinal). ';
  laudo += 'Estudo complementar com Doppler colorido para análise de vascularização das lesões identificadas.\n\n';
  laudo += '---\n\n';

  // ACHADOS
  laudo += '## ACHADOS\n\n';

  // Mama Direita
  laudo += '### MAMA DIREITA\n\n';
  if (mamaDireita.tipo === 'normal') {
    laudo += gerarDescricaoMamaNormal('direita') + '\n\n';
  } else if (mamaDireita.tipo === 'nodulo') {
    laudo += gerarDescricaoNodulo(mamaDireita) + '\n\n';
  } else if (mamaDireita.tipo === 'cisto') {
    laudo += gerarDescricaoCistoSimples(mamaDireita) + '\n\n';
  }

  // Mama Esquerda
  laudo += '### MAMA ESQUERDA\n\n';
  if (mamaEsquerda.tipo === 'normal') {
    laudo += gerarDescricaoMamaNormal('esquerda') + '\n\n';
  } else if (mamaEsquerda.tipo === 'nodulo') {
    laudo += gerarDescricaoNodulo(mamaEsquerda) + '\n\n';
  } else if (mamaEsquerda.tipo === 'cisto') {
    laudo += gerarDescricaoCistoSimples(mamaEsquerda) + '\n\n';
  }

  laudo += '---\n\n';

  // LINFONODOS
  laudo += '## LINFONODOS AXILARES\n\n';

  const linfonodoDireito = linfonodos.direito === 'normal'
    ? 'Linfonodos axilares direitos de morfologia e dimensões habituais, preservando o hilo gorduroso central.'
    : 'Linfonodos axilares direitos com alterações morfológicas - avaliação complementar recomendada.';

  const linfonodoEsquerdo = linfonodos.esquerdo === 'normal'
    ? 'Linfonodos axilares esquerdos de morfologia e dimensões habituais, preservando o hilo gorduroso central.'
    : 'Linfonodos axilares esquerdos com alterações morfológicas - avaliação complementar recomendada.';

  laudo += `**Região Axilar Direita:** ${linfonodoDireito}\n\n`;
  laudo += `**Região Axilar Esquerda:** ${linfonodoEsquerdo}\n\n`;
  laudo += '---\n\n';

  // IMPRESSÃO DIAGNÓSTICA
  laudo += '## IMPRESSÃO DIAGNÓSTICA\n\n';

  const biradsDireita = mamaDireita.biradsCalculado || '1';
  const biradsEsquerda = mamaEsquerda.biradsCalculado || '1';

  laudo += gerarImpressaoDiagnostica(mamaDireita, biradsDireita) + '\n\n';
  laudo += gerarImpressaoDiagnostica(mamaEsquerda, biradsEsquerda) + '\n\n';

  // CATEGORIA FINAL
  const categoriaFinal = biradsDireita > biradsEsquerda ? biradsDireita : biradsEsquerda;
  laudo += `**CLASSIFICAÇÃO BI-RADS FINAL:** ${categoriaFinal}\n\n`;

  // RODAPÉ
  laudo += '---\n\n';
  laudo += '*Laudo gerado pelo Sistema Vertex US V2 - ultrassom.ai*\n';
  laudo += '*Baseado nos critérios ACR BI-RADS 5ª Edição*\n';

  return laudo;
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Capitaliza primeira letra de uma string
 */
function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Gera descrição de múltiplas lesões (caso existam várias)
 */
export function gerarDescricaoMultiplasLesoes(lesoes: LesaoMamaria[]): string {
  if (lesoes.length === 0) {
    return 'Sem lesões identificadas.';
  }

  if (lesoes.length === 1) {
    const lesao = lesoes[0];
    if (lesao.tipo === 'nodulo') {
      return gerarDescricaoNodulo(lesao);
    } else if (lesao.tipo === 'cisto') {
      return gerarDescricaoCistoSimples(lesao);
    }
  }

  // Múltiplas lesões
  let descricao = `Identificadas ${lesoes.length} lesões:\n\n`;

  lesoes.forEach((lesao, index) => {
    descricao += `**Lesão ${index + 1}:** `;
    if (lesao.tipo === 'nodulo') {
      descricao += gerarDescricaoNodulo(lesao);
    } else if (lesao.tipo === 'cisto') {
      descricao += gerarDescricaoCistoSimples(lesao);
    }
    descricao += '\n\n';
  });

  return descricao;
}

/**
 * Gera recomendação clínica baseada no BI-RADS
 */
export function gerarRecomendacaoClinica(birads: CategoriaBiRads): string {
  const recomendacoes: Record<CategoriaBiRads, string> = {
    '1': 'Exame negativo. Não há achados significativos. Seguimento de rotina conforme faixa etária e fatores de risco.',
    '2': 'Achado(s) benigno(s). Não há necessidade de seguimento diferenciado. Rastreamento de rotina conforme faixa etária.',
    '3': 'Achado(s) provavelmente benigno(s). Recomenda-se controle ultrassonográfico em intervalo curto (6 meses) para documentação de estabilidade.',
    '4A': 'Baixa suspeita de malignidade (probabilidade de 2-10%). Biópsia percutânea (core biopsy ou PAAF) recomendada para caracterização histopatológica.',
    '4B': 'Moderada suspeita de malignidade (probabilidade de 10-50%). Biópsia percutânea (core biopsy) fortemente recomendada.',
    '4C': 'Alta suspeita de malignidade (probabilidade de 50-95%). Biópsia percutânea ou exérese cirúrgica fortemente indicada. Correlação com mamografia e/ou ressonância recomendada.',
    '5': 'Altamente suspeito de malignidade (probabilidade >95%). Biópsia para confirmação histopatológica seguida de tratamento oncológico apropriado.',
    '6': 'Malignidade comprovada por biópsia prévia. Este exame é utilizado para estadiamento, planejamento cirúrgico ou monitoramento de resposta à terapia neoadjuvante.'
  };

  return recomendacoes[birads] || 'Correlação clínico-radiológica recomendada.';
}
