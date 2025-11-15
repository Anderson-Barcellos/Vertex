/**
 * Breast Report Builder - Sistema de Geração de Laudos por Regras
 *
 * Motor inteligente que gera laudos de ultrassom de mamas baseado em:
 * - Frases prontas adaptativas
 * - Classificação BI-RADS automática
 * - Combinação lógica de achados
 * - Zero latência (sem chamadas de API)
 *
 * @author Vertex Team
 * @version 1.0.0
 * @date 2025-11-14
 */

import type { SelectedFinding } from '@/types/report';
import type { Organ } from '@/data/organs';

/**
 * Templates de frases por tipo de lesão e BI-RADS
 */
const PHRASE_TEMPLATES = {
  // Nódulos sólidos
  nodule: {
    birads2: (data: LesionData) =>
      `Nódulo sólido de contornos regulares e bem definidos, medindo ${data.size}, localizado ${data.location}. Apresenta margens circunscritas, orientação paralela e padrão hipoecóico homogêneo. ${data.vascularization}. BI-RADS 2 - Achado benigno.`,

    birads3: (data: LesionData) =>
      `Nódulo sólido ovalado, de contornos regulares, medindo ${data.size}, localizado ${data.location}. Apresenta margens circunscritas, orientação paralela à pele e ecotextura homogênea. ${data.vascularization}. BI-RADS 3 - Achado provavelmente benigno. Sugestão de controle ultrassonográfico em 6 meses.`,

    birads4a: (data: LesionData) =>
      `Nódulo sólido medindo ${data.size}, localizado ${data.location}. Apresenta contornos ${data.margins || 'parcialmente indefinidos'}, ${data.orientation || 'orientação não paralela'} e ${data.echogenicity || 'ecotextura heterogênea'}. ${data.vascularization}. BI-RADS 4A - Lesão suspeita de baixa probabilidade de malignidade. Indicada investigação histopatológica.`,

    birads4b: (data: LesionData) =>
      `Nódulo sólido irregular medindo ${data.size}, localizado ${data.location}. Caracteriza-se por margens ${data.margins || 'espiculadas/microlobuladas'}, ${data.orientation || 'orientação não paralela'} e ${data.echogenicity || 'hipoecogenicidade marcante'}. ${data.vascularization}. ${data.posterior || 'Sombra acústica posterior'} presente. BI-RADS 4B - Lesão suspeita de moderada probabilidade de malignidade. Fortemente indicada investigação histopatológica.`,

    birads4c: (data: LesionData) =>
      `Nódulo sólido de morfologia irregular medindo ${data.size}, localizado ${data.location}. Apresenta múltiplas características suspeitas: margens espiculadas, orientação não paralela, acentuada hipoecogenicidade e ${data.posterior || 'sombra acústica posterior'}. ${data.vascularization}. BI-RADS 4C - Lesão suspeita de alta probabilidade de malignidade. Urgente investigação histopatológica.`,

    birads5: (data: LesionData) =>
      `Nódulo sólido de morfologia francamente irregular medindo ${data.size}, localizado ${data.location}. Apresenta critérios altamente suspeitos: margens espiculadas, orientação antiparalela, acentuada hipoecogenicidade, sombra acústica posterior e ${data.vascularization}. BI-RADS 5 - Lesão altamente suspeita de malignidade. Indicação urgente de biópsia.`
  },

  // Cistos
  cyst: {
    simple: (data: LesionData) =>
      `Imagem anecóica arredondada, de paredes finas e regulares, medindo ${data.size}, com acentuado reforço acústico posterior, localizada ${data.location}. Achado compatível com cisto simples. BI-RADS 2 - Achado benigno.`,

    complex: (data: LesionData) =>
      `Formação cística ${data.complexity || 'com septações e debris internos'}, medindo ${data.size}, localizada ${data.location}. ${data.walls || 'Paredes espessadas irregulares'}. ${data.solid || 'Componente sólido vegetante identificado'}. BI-RADS ${data.birads || '4A'} - ${data.birads === '3' ? 'Cisto complicado. Sugestão de controle em 6 meses.' : 'Lesão cística complexa suspeita. Indicada investigação complementar.'}`,

    clustered: (data: LesionData) =>
      `Múltiplos cistos simples agrupados, o maior medindo ${data.size}, localizados ${data.location}. Apresentam características típicas de cistos simples com paredes finas e reforço acústico posterior. BI-RADS 2 - Achados benignos.`
  },

  // Fibroadenomas
  fibroadenoma: {
    typical: (data: LesionData) =>
      `Nódulo sólido ovalado, bem delimitado, de contornos regulares e lobulados, medindo ${data.size}, localizado ${data.location}. Apresenta orientação paralela à pele, margens circunscritas e ecotextura homogênea hipoecóica. ${data.vascularization}. Achado compatível com fibroadenoma. BI-RADS 2 - Achado benigno.`,

    giant: (data: LesionData) =>
      `Volumosa formação sólida ovalada medindo ${data.size}, localizada ${data.location}. Apresenta contornos lobulados bem definidos, orientação paralela e ecotextura heterogênea com áreas hipoecóicas. ${data.vascularization}. Compatível com fibroadenoma gigante ou tumor filoide de baixo grau. BI-RADS 3 - Sugestão de controle evolutivo e considerar investigação complementar se sintomático.`
  },

  // Alterações benignas
  benign: {
    fibrocystic: (data: LesionData) =>
      `Alterações fibrocísticas difusas caracterizadas por múltiplos microcistos e áreas de fibrose ${data.distribution || 'bilaterais e simétricas'}. ${data.additional || ''}. BI-RADS 2 - Alterações benignas.`,

    duct: (data: LesionData) =>
      `Ectasia ductal ${data.location || 'retroareolar'}, com ductos medindo até ${data.size || '3-4mm'}. ${data.content || 'Conteúdo anecóico/hipoecóico em seu interior'}. BI-RADS 2 - Alteração benigna.`,

    lymphNode: (data: LesionData) =>
      `Linfonodo ${data.location || 'axilar'} de aspecto habitual, medindo ${data.size}, com córtex hipoecóico fino e hilo gorduroso preservado. BI-RADS 2 - Linfonodo de aspecto benigno.`
  },

  // Achados especiais
  special: {
    normal: () =>
      `Tecido mamário de ecotextura preservada, sem evidências de nódulos sólidos ou formações císticas significativas. Ductos de calibre habitual. Ausência de sinais diretos ou indiretos de malignidade.`,

    implant: (data: LesionData) =>
      `Prótese mamária ${data.type || 'de silicone'} ${data.position || 'retromuscular'} de contornos regulares, sem evidências de ruptura ou coleções periprotéticas. ${data.additional || ''}`,

    postSurgical: (data: LesionData) =>
      `Alterações pós-operatórias em ${data.location} caracterizadas por ${data.findings || 'área de remodelação cicatricial e distorção arquitetural'}. Ausência de imagens nodulares suspeitas no leito cirúrgico. ${data.additional || ''}`
  }
};

/**
 * Mapeamento de categorias BI-RADS para recomendações
 */
const BIRADS_RECOMMENDATIONS = {
  '0': 'BI-RADS 0 - Avaliação incompleta. Necessária investigação adicional com outros métodos de imagem.',
  '1': 'BI-RADS 1 - Negativo. Rotina de rastreamento habitual.',
  '2': 'BI-RADS 2 - Achado benigno. Rotina de rastreamento habitual.',
  '3': 'BI-RADS 3 - Achado provavelmente benigno. Sugestão de controle ultrassonográfico semestral.',
  '4A': 'BI-RADS 4A - Lesão suspeita de baixa probabilidade de malignidade (2-10%). Indicada investigação histopatológica.',
  '4B': 'BI-RADS 4B - Lesão suspeita de moderada probabilidade de malignidade (10-50%). Fortemente indicada investigação histopatológica.',
  '4C': 'BI-RADS 4C - Lesão suspeita de alta probabilidade de malignidade (50-95%). Urgente investigação histopatológica.',
  '5': 'BI-RADS 5 - Lesão altamente suspeita de malignidade (>95%). Indicação de biópsia e tratamento oncológico adequado.',
  '6': 'BI-RADS 6 - Malignidade comprovada por biópsia. Em tratamento oncológico.'
};

/**
 * Interface para dados de lesão
 */
interface LesionData {
  size: string;
  location: string;
  margins?: string;
  orientation?: string;
  echogenicity?: string;
  vascularization?: string;
  posterior?: string;
  birads?: string;
  complexity?: string;
  walls?: string;
  solid?: string;
  distribution?: string;
  additional?: string;
  content?: string;
  type?: string;
  position?: string;
  findings?: string;
}

/**
 * Extrai dados estruturados de um achado
 * Usa apenas campos disponíveis em FindingMeasurement (size, location, description)
 */
function extractLesionData(finding: SelectedFinding): LesionData {
  const instances = finding.instances || [];
  const firstInstance = instances[0]?.measurements;

  if (!firstInstance) {
    return {
      size: 'dimensões não especificadas',
      location: 'localização não especificada'
    };
  }

  // Usa os campos disponíveis: size e location
  const size = firstInstance.size || 'dimensões não especificadas';
  const location = firstInstance.location || 'localização não especificada';

  // Vascularização padrão
  const vascularization = 'Estudo Doppler realizado';

  // Características adicionais da descrição
  const description = firstInstance.description || '';

  return {
    size,
    location,
    vascularization,
    additional: description
  };
}

/**
 * Determina o tipo de lesão baseado no achado
 * Usa apenas nome do achado e descrição (sem depender de campos específicos)
 */
function determineLesionType(finding: SelectedFinding): { category: keyof typeof PHRASE_TEMPLATES; subtype: string } {
  const findingName = finding.finding.name.toLowerCase();
  const description = finding.instances?.[0]?.measurements?.description?.toLowerCase() || '';

  // Cistos
  if (findingName.includes('cisto')) {
    if (findingName.includes('simples') || description.includes('simples')) return { category: 'cyst', subtype: 'simple' };
    if (findingName.includes('agrupados') || description.includes('agrupados')) return { category: 'cyst', subtype: 'clustered' };
    return { category: 'cyst', subtype: 'complex' };
  }

  // Fibroadenomas
  if (findingName.includes('fibroadenoma')) {
    if (findingName.includes('gigante') || description.includes('gigante')) return { category: 'fibroadenoma', subtype: 'giant' };
    return { category: 'fibroadenoma', subtype: 'typical' };
  }

  // Alterações benignas
  if (findingName.includes('fibrocístic')) return { category: 'benign', subtype: 'fibrocystic' };
  if (findingName.includes('ectasia') || findingName.includes('ducto')) return { category: 'benign', subtype: 'duct' };
  if (findingName.includes('linfonodo')) return { category: 'benign', subtype: 'lymphNode' };

  // Achados especiais
  if (findingName.includes('prótese') || findingName.includes('implante')) return { category: 'special', subtype: 'implant' };
  if (findingName.includes('pós-operatório') || findingName.includes('cicatriz')) return { category: 'special', subtype: 'postSurgical' };

  // Nódulos por critérios de suspeição (baseado em palavras-chave)
  if (description.includes('espiculad') || description.includes('irregular') || findingName.includes('suspeito')) {
    return { category: 'nodule', subtype: 'birads4b' };
  }

  if (description.includes('maligno') || description.includes('birads 5')) {
    return { category: 'nodule', subtype: 'birads5' };
  }

  if (description.includes('benigno') || description.includes('birads 2')) {
    return { category: 'nodule', subtype: 'birads2' };
  }

  // Default: nódulo provavelmente benigno (BI-RADS 3)
  return { category: 'nodule', subtype: 'birads3' };
}

/**
 * Gera descrição para um único achado
 */
function generateFindingDescription(finding: SelectedFinding): string {
  const { category, subtype } = determineLesionType(finding);
  const lesionData = extractLesionData(finding);

  try {
    // Acessa o template de forma segura
    const categoryTemplates = PHRASE_TEMPLATES[category];
    if (categoryTemplates) {
      const template = (categoryTemplates as any)[subtype];
      if (typeof template === 'function') {
        return template(lesionData);
      }
    }
  } catch (error) {
    console.warn('Erro ao gerar descrição do achado:', error);
  }

  // Fallback
  return `Achado em ${lesionData.location}, medindo ${lesionData.size}.`;
}

/**
 * Determina BI-RADS final do exame (considera o maior)
 * Usa o subtype determinado pela função determineLesionType
 */
function determineFinalBirads(findings: SelectedFinding[]): string {
  const biradsOrder = ['1', '2', '3', '4A', '4B', '4C', '5', '6'];
  let maxBirads = '1';

  findings.forEach(finding => {
    const { subtype } = determineLesionType(finding);

    // Extrai BI-RADS do subtype (ex: 'birads3' -> '3')
    const biradsMatch = subtype.match(/birads(\w+)/i);
    if (biradsMatch) {
      const birads = biradsMatch[1].toUpperCase();
      if (biradsOrder.indexOf(birads) > biradsOrder.indexOf(maxBirads)) {
        maxBirads = birads;
      }
    }
  });

  return maxBirads;
}

/**
 * Gera laudo completo de ultrassom de mamas
 */
export function buildBreastReport(
  selectedFindings: SelectedFinding[],
  normalOrgans: string[],
  organsList: Organ[]
): string {
  const sections: string[] = [];

  // Cabeçalho
  sections.push('# LAUDO DE ULTRASSONOGRAFIA MAMÁRIA\n');
  sections.push('## TÉCNICA');
  sections.push('Exame realizado com transdutor linear de alta frequência (7-12 MHz), com avaliação sistemática de ambas as mamas e regiões axilares, incluindo estudo com Doppler colorido quando indicado.\n');

  // Achados
  sections.push('## ACHADOS');

  if (selectedFindings.length === 0 && normalOrgans.length === 0) {
    sections.push(PHRASE_TEMPLATES.special.normal());
  } else {
    // Mamas normais
    if (normalOrgans.length > 0) {
      const normalBreasts = normalOrgans
        .map(id => organsList.find(o => o.id === id)?.name)
        .filter(Boolean);

      if (normalBreasts.length > 0) {
        sections.push(`**${normalBreasts.join(' e ')}:** Tecido mamário de ecotextura preservada, sem nódulos ou formações císticas significativas.\n`);
      }
    }

    // Achados patológicos
    selectedFindings.forEach((finding, index) => {
      const organ = organsList.find(o => o.id === finding.organId);
      const description = generateFindingDescription(finding);
      sections.push(`**${organ?.name || 'Achado'} ${index + 1}:**\n${description}\n`);
    });
  }

  // Impressão diagnóstica e classificação BI-RADS
  sections.push('## IMPRESSÃO DIAGNÓSTICA\n');

  if (selectedFindings.length === 0) {
    sections.push('Exame ultrassonográfico mamário dentro dos limites da normalidade.\n');
    sections.push('**CLASSIFICAÇÃO:** BI-RADS 1 - Negativo');
    sections.push('\n**RECOMENDAÇÃO:** Seguimento de rotina conforme protocolo de rastreamento.');
  } else {
    // Lista resumida dos principais achados
    const summaryFindings = selectedFindings.map((f, i) => {
      const organ = organsList.find(o => o.id === f.organId);
      const { subtype } = determineLesionType(f);
      return `${i + 1}. ${organ?.name}: ${subtype.includes('birads') ? `Lesão BI-RADS ${subtype.replace('birads', '').toUpperCase()}` : f.finding.name}`;
    });

    sections.push(summaryFindings.join('\n'));

    // BI-RADS final
    const finalBirads = determineFinalBirads(selectedFindings);
    const recommendation = BIRADS_RECOMMENDATIONS[finalBirads as keyof typeof BIRADS_RECOMMENDATIONS] || '';

    sections.push(`\n**CLASSIFICAÇÃO FINAL:** ${recommendation}`);
  }

  // Observações
  sections.push('\n## OBSERVAÇÕES');
  sections.push('- Correlação com exame clínico e mamografia é sempre recomendada.');
  sections.push('- Este exame ultrassonográfico complementa, mas não substitui, a mamografia no rastreamento do câncer de mama.');
  sections.push('- Em caso de dúvidas ou necessidade de esclarecimentos adicionais, favor entrar em contato.');

  return sections.join('\n');
}

/**
 * Gera impressão clínica resumida (para preview)
 */
export function buildBreastImpression(
  selectedFindings: SelectedFinding[],
  normalOrgans: string[]
): string {
  if (selectedFindings.length === 0 && normalOrgans.length === 0) {
    return 'Exame ultrassonográfico mamário sem alterações significativas. BI-RADS 1.';
  }

  if (selectedFindings.length === 0) {
    return 'Exame ultrassonográfico mamário dentro dos limites da normalidade. BI-RADS 1.';
  }

  const finalBirads = determineFinalBirads(selectedFindings);
  const count = selectedFindings.length;
  const plural = count > 1 ? 's' : '';

  return `${count} achado${plural} identificado${plural}. Classificação final: BI-RADS ${finalBirads}. ${
    finalBirads >= '4A' ? 'Indicada investigação complementar.' :
    finalBirads === '3' ? 'Sugestão de controle evolutivo.' :
    'Achados benignos.'
  }`;
}
