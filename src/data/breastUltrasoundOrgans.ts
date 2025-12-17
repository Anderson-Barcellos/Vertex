import { Organ, OrganCategory } from './organs';

// ============================================================================
// LÉXICO BI-RADS 5ª EDIÇÃO - NÓDULOS SÓLIDOS
// ============================================================================

export const NODULE_SHAPE = [
  { value: 'oval', label: 'Oval', weight: 'benign' },
  { value: 'round', label: 'Redonda', weight: 'benign' },
  { value: 'irregular', label: 'Irregular', weight: 'suspicious', points: 1 }
] as const;

export const NODULE_ORIENTATION = [
  { value: 'parallel', label: 'Paralela (maior eixo horizontal)', weight: 'benign' },
  { value: 'not_parallel', label: 'Não-paralela (maior eixo vertical)', weight: 'suspicious', points: 1 }
] as const;

export const NODULE_MARGINS = [
  { value: 'circumscribed', label: 'Circunscrita', weight: 'benign' },
  { value: 'indistinct', label: 'Indistinta', weight: 'suspicious', points: 1 },
  { value: 'angular', label: 'Angular', weight: 'suspicious', points: 1 },
  { value: 'microlobulated', label: 'Microlobulada', weight: 'intermediate', points: 1 },
  { value: 'spiculated', label: 'Espiculada', weight: 'highly_suspicious', points: 3 }
] as const;

export const NODULE_ECHO_PATTERN = [
  { value: 'anechoic', label: 'Anecoico', weight: 'benign' },
  { value: 'hypoechoic_homo', label: 'Hipoecoico homogêneo', weight: 'indeterminate' },
  { value: 'hypoechoic_hetero', label: 'Hipoecoico heterogêneo', weight: 'suspicious', points: 1 },
  { value: 'isoechoic', label: 'Isoecoico', weight: 'indeterminate' },
  { value: 'hyperechoic', label: 'Hiperecoico', weight: 'benign' },
  { value: 'complex', label: 'Complexo cístico-sólido', weight: 'suspicious', points: 1 }
] as const;

export const POSTERIOR_FEATURES = [
  { value: 'no_change', label: 'Sem alteração', weight: 'neutral' },
  { value: 'enhancement', label: 'Reforço acústico posterior', weight: 'benign' },
  { value: 'shadowing', label: 'Sombra acústica', weight: 'suspicious', points: 1 },
  { value: 'combined', label: 'Padrão combinado', weight: 'suspicious', points: 1 }
] as const;

export const CALCIFICATIONS = [
  { value: 'absent', label: 'Ausentes', weight: 'neutral' },
  { value: 'popcorn', label: 'Em "pipoca" (grosseiras)', weight: 'benign' },
  { value: 'punctate', label: 'Puntiformes', weight: 'suspicious', points: 1 },
  { value: 'pleomorphic', label: 'Pleomórficas', weight: 'highly_suspicious', points: 2 }
] as const;

// ============================================================================
// VASCULARIZAÇÃO (DOPPLER)
// ============================================================================

export const DOPPLER_FLOW = [
  { value: 'avascular', label: 'Avascular', weight: 'benign' },
  { value: 'hypovascular', label: 'Hipovascular', weight: 'indeterminate' },
  { value: 'hypervascular', label: 'Hipervascular', weight: 'suspicious' }
] as const;

export const VASCULAR_PATTERN = [
  { value: 'none', label: 'Sem vascularização', weight: 'benign' },
  { value: 'peripheral_marginal', label: 'Vasos periféricos marginais', weight: 'benign' },
  { value: 'parallel_av', label: 'Vasos paralelos (artéria + veia)', weight: 'strongly_benign', note: 'VPP 99% para benignidade' },
  { value: 'tree_like', label: 'Padrão em árvore (arborizado)', weight: 'benign' },
  { value: 'central_penetrating', label: 'Vasos penetrantes centrais', weight: 'suspicious', points: 1 },
  { value: 'radial_spiculated', label: 'Vasos radiais/espiculados', weight: 'suspicious', points: 1 },
  { value: 'root_hair', label: 'Padrão em "raiz de cabelo"', weight: 'highly_suspicious', points: 2 },
  { value: 'crab_claw', label: 'Padrão em "garra de caranguejo"', weight: 'highly_suspicious', points: 2 }
] as const;

export const RESISTIVITY_INDEX = [
  { value: 'low', label: 'RI < 0.70 (favorece benignidade)', weight: 'benign' },
  { value: 'high', label: 'RI ≥ 0.70 (indeterminado/suspeito)', weight: 'suspicious' }
] as const;

// ============================================================================
// ELASTOGRAFIA SWE (SHEAR WAVE)
// ============================================================================

export const SWE_EMEAN_RANGES = [
  { value: 'low', label: '< 30 kPa (baixa rigidez)', weight: 'benign', canDowngrade: true },
  { value: 'intermediate', label: '30-45 kPa (intermediária)', weight: 'indeterminate' },
  { value: 'high', label: '> 45 kPa (alta rigidez)', weight: 'suspicious', points: 1 },
  { value: 'very_high', label: '> 80 kPa (muito alta)', weight: 'highly_suspicious', points: 2 }
] as const;

export const SWE_EMAX_RANGES = [
  { value: 'low', label: '< 36 kPa', weight: 'benign', canDowngrade: true },
  { value: 'intermediate', label: '36-55 kPa', weight: 'indeterminate' },
  { value: 'high', label: '> 55 kPa', weight: 'suspicious', points: 1 },
  { value: 'very_high', label: '> 90 kPa', weight: 'highly_suspicious', points: 2 }
] as const;

export const SWE_QUALITATIVE = [
  { value: 'soft_homo', label: 'Azul homogêneo (baixa rigidez)', weight: 'benign' },
  { value: 'intermediate', label: 'Azul/Verde heterogêneo (intermediária)', weight: 'indeterminate' },
  { value: 'stiff', label: 'Verde/Vermelho (alta rigidez)', weight: 'suspicious', points: 1 },
  { value: 'stiff_rim', label: 'Anel rígido periférico (stiff rim)', weight: 'highly_suspicious', points: 2 }
] as const;

// ============================================================================
// CATEGORIAS BI-RADS
// ============================================================================

export const BIRADS_CATEGORIES = [
  { value: '0', label: 'BI-RADS 0 - Incompleto', risk: 'incomplete', vpp: 'N/A' },
  { value: '1', label: 'BI-RADS 1 - Negativo', risk: 'benign', vpp: '0%' },
  { value: '2', label: 'BI-RADS 2 - Achado benigno', risk: 'benign', vpp: '0%' },
  { value: '3', label: 'BI-RADS 3 - Provavelmente benigno', risk: 'probably_benign', vpp: '< 2%' },
  { value: '4A', label: 'BI-RADS 4A - Baixa suspeição', risk: 'low_suspicious', vpp: '2-10%' },
  { value: '4B', label: 'BI-RADS 4B - Suspeição intermediária', risk: 'intermediate_suspicious', vpp: '10-50%' },
  { value: '4C', label: 'BI-RADS 4C - Alta suspeição', risk: 'high_suspicious', vpp: '50-95%' },
  { value: '5', label: 'BI-RADS 5 - Altamente sugestivo', risk: 'highly_suspicious', vpp: '> 95%' },
  { value: '6', label: 'BI-RADS 6 - Malignidade comprovada', risk: 'malignant', vpp: '100%' }
] as const;

// ============================================================================
// SUGESTÕES DIAGNÓSTICAS POR CATEGORIA BI-RADS
// ============================================================================

export const DIAGNOSTIC_SUGGESTIONS: Record<string, Array<{ id: string; label: string; typical: string }>> = {
  '2': [
    { id: 'simple_cyst', label: 'Cisto simples', typical: 'Anecoico, paredes finas, reforço posterior, avascular' },
    { id: 'intramammary_ln', label: 'Linfonodo intramamário', typical: 'Forma reniforme, hilo ecogênico central' },
    { id: 'lipoma', label: 'Lipoma', typical: 'Isoecoico à gordura, bem delimitado, compressível' },
    { id: 'oil_cyst', label: 'Cisto oleoso', typical: 'Oval, conteúdo ecogênico fino, pós-trauma/cirurgia' },
    { id: 'calcified_fibroadenoma', label: 'Fibroadenoma calcificado', typical: 'Calcificações grosseiras tipo "pipoca"' }
  ],
  '3': [
    { id: 'typical_fibroadenoma', label: 'Fibroadenoma típico', typical: 'Oval, circunscrito, paralelo, hipoecoico homogêneo' },
    { id: 'complicated_cyst', label: 'Cisto complicado', typical: 'Conteúdo ecogênico, sem componente sólido vascularizado' },
    { id: 'hamartoma', label: 'Hamartoma', typical: '"Mama dentro da mama", ecotextura mista' },
    { id: 'focal_adenosis', label: 'Adenose focal', typical: 'Área hipoecoica mal definida, contexto fibrocístico' }
  ],
  '4A': [
    { id: 'atypical_fibroadenoma', label: 'Fibroadenoma atípico', typical: 'Margem parcialmente indistinta, microlobulado, ou > 2.5 cm' },
    { id: 'intraductal_papilloma', label: 'Papiloma intraductal', typical: 'Nódulo intraductal, pedículo vascular, descarga papilar' },
    { id: 'benign_phyllodes', label: 'Tumor filoide benigno', typical: 'Similar a fibroadenoma grande, fendas císticas internas' },
    { id: 'fat_necrosis', label: 'Necrose gordurosa', typical: 'Nódulo heterogêneo, história de trauma/cirurgia' },
    { id: 'organized_abscess', label: 'Abscesso organizado', typical: 'Coleção complexa, contexto inflamatório' }
  ],
  '4B': [
    { id: 'complex_papilloma', label: 'Papiloma complexo', typical: 'Nódulo sólido-cístico, componente sólido vascularizado' },
    { id: 'borderline_phyllodes', label: 'Tumor filoide borderline', typical: 'Grande, crescimento rápido, vascularização aumentada' },
    { id: 'mucinous_carcinoma', label: 'Carcinoma mucinoso', typical: 'Bem delimitado, hipoecoico, pode ter reforço posterior' },
    { id: 'medullary_carcinoma', label: 'Carcinoma medular', typical: 'Oval/redondo, bem delimitado, hipoecoico, jovens' },
    { id: 'metastasis', label: 'Metástase', typical: 'Nódulo único/múltiplo, história de neoplasia conhecida' }
  ],
  '4C': [
    { id: 'invasive_ductal_4c', label: 'Carcinoma ductal invasivo', typical: 'Irregular, margens indistintas/angulares, não-paralelo, sombra' },
    { id: 'invasive_lobular', label: 'Carcinoma lobular invasivo', typical: 'Irregular, hipoecogênico, bordas mal definidas, distorção' },
    { id: 'malignant_phyllodes', label: 'Tumor filoide maligno', typical: 'Grande, heterogêneo, áreas císticas, crescimento rápido' },
    { id: 'inflammatory_carcinoma', label: 'Carcinoma inflamatório', typical: 'Massa + espessamento cutâneo + edema difuso' }
  ],
  '5': [
    { id: 'invasive_ductal_5', label: 'Carcinoma ductal invasivo', typical: 'Espiculado, irregular, sombra intensa, microcalcificações' },
    { id: 'invasive_lobular_5', label: 'Carcinoma lobular invasivo', typical: 'Distorção arquitetural, contornos espiculados' },
    { id: 'extensive_dcis', label: 'CDIS extenso', typical: 'Microcalcificações agrupadas, distorção' }
  ]
};

// ============================================================================
// CLASSIFICAÇÃO DE CISTOS
// ============================================================================

export const CYST_CLASSIFICATION = [
  { value: 'simple', label: 'Cisto simples', birads: '2', criteria: 'Anecoico, paredes finas imperceptíveis, reforço posterior, avascular' },
  { value: 'complicated', label: 'Cisto complicado', birads: '3', criteria: 'Conteúdo ecogênico homogêneo, debris móvel, sem componente sólido' },
  { value: 'complex', label: 'Cisto complexo', birads: '4A-4C', criteria: 'Septo(s) espesso(s), componente sólido mural, vascularização' }
] as const;

export const CYST_COMPLEXITY_CRITERIA = [
  { value: 'thin_septum', label: 'Septo fino (< 0.5mm) sem fluxo', classification: 'complicated', birads: '3' },
  { value: 'thick_septum', label: 'Septo espesso (≥ 0.5mm)', classification: 'complex', birads: '4A' },
  { value: 'mural_nodule', label: 'Componente sólido mural', classification: 'complex', birads: '4B-4C' },
  { value: 'vascularized_solid', label: 'Componente sólido vascularizado', classification: 'complex', birads: '4C' }
] as const;

// ============================================================================
// SEÇÕES CONDICIONAIS
// ============================================================================

export const SKIN_CHANGES = [
  { value: 'skin_thick_focal', label: 'Espessamento cutâneo focal', significance: 'Pode indicar extensão tumoral' },
  { value: 'skin_thick_diffuse', label: 'Espessamento cutâneo difuso', significance: 'Mastite/carcinoma inflamatório' },
  { value: 'skin_retraction', label: 'Retração cutânea', significance: 'Invasão desmoplásica' },
  { value: 'subcutaneous_edema', label: 'Edema subcutâneo', significance: 'Processo inflamatório/tumoral' }
] as const;

export const DUCTAL_CHANGES = [
  { value: 'duct_ectasia', label: 'Ectasia ductal simples', significance: 'Benigno' },
  { value: 'duct_content', label: 'Ducto dilatado com conteúdo', significance: 'Avaliar papiloma/CDIS' },
  { value: 'intraductal_mass', label: 'Massa intraductal', significance: 'Papiloma/carcinoma papilar' }
] as const;

export const ARCHITECTURAL_DISTORTION = [
  { value: 'focal_distortion', label: 'Distorção focal', significance: 'Cicatriz radial/carcinoma' },
  { value: 'attenuation_area', label: 'Área de atenuação', significance: 'Carcinoma lobular/fibrose' }
] as const;

export const LYMPH_NODE_FINDINGS = [
  { value: 'ln_normal', label: 'Morfologia normal', significance: 'Reniforme, hilo preservado' },
  { value: 'ln_focal_cortex', label: 'Espessamento cortical focal (≥ 3mm)', significance: 'Suspeito' },
  { value: 'ln_diffuse_cortex', label: 'Espessamento cortical difuso', significance: 'Suspeito' },
  { value: 'ln_no_hilum', label: 'Perda do hilo', significance: 'Altamente suspeito' },
  { value: 'ln_round', label: 'Formato arredondado', significance: 'Suspeito' }
] as const;

// ============================================================================
// LOCALIZAÇÃO
// ============================================================================

export const BREAST_QUADRANTS = [
  { value: 'qse', label: 'Quadrante Superior Externo (QSE)' },
  { value: 'qsi', label: 'Quadrante Superior Interno (QSI)' },
  { value: 'qie', label: 'Quadrante Inferior Externo (QIE)' },
  { value: 'qii', label: 'Quadrante Inferior Interno (QII)' },
  { value: 'retroareolar', label: 'Região Retroareolar/Central' },
  { value: 'prolongamento', label: 'Prolongamento Axilar' }
] as const;

export const BREAST_DEPTH = [
  { value: 'anterior', label: 'Terço Anterior (superficial)' },
  { value: 'medio', label: 'Terço Médio' },
  { value: 'posterior', label: 'Terço Posterior (profundo)' }
] as const;

export const CLOCK_POSITION = [
  { value: '12h', label: '12 horas (superior)' },
  { value: '1h', label: '1 hora' },
  { value: '2h', label: '2 horas' },
  { value: '3h', label: '3 horas (lateral)' },
  { value: '4h', label: '4 horas' },
  { value: '5h', label: '5 horas' },
  { value: '6h', label: '6 horas (inferior)' },
  { value: '7h', label: '7 horas' },
  { value: '8h', label: '8 horas' },
  { value: '9h', label: '9 horas (medial)' },
  { value: '10h', label: '10 horas' },
  { value: '11h', label: '11 horas' }
] as const;

// ============================================================================
// HELPER: CORES BI-RADS
// ============================================================================

export const getBiradsColor = (category: string): string => {
  if (!category) return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  
  if (category.includes('1') || category.includes('2')) {
    return 'bg-green-500/20 text-green-300 border-green-500/30';
  }
  if (category.includes('3')) {
    return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  }
  if (category.includes('4A')) {
    return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
  }
  if (category.includes('4B') || category.includes('4C')) {
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  }
  if (category.includes('5') || category.includes('6')) {
    return 'bg-red-700/20 text-red-200 border-red-700/30';
  }
  if (category.includes('0')) {
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  }
  
  return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

// ============================================================================
// CALCULADORA BI-RADS - SISTEMA DE PONTUAÇÃO
// ============================================================================

export interface BiradsCalculationInput {
  shape?: string;
  orientation?: string;
  margins?: string;
  echoPattern?: string;
  posteriorFeatures?: string;
  calcifications?: string;
  dopplerFlow?: string;
  vascularPattern?: string;
  sweEmean?: string;
  sweEmax?: string;
  sweQualitative?: string;
}

export interface BiradsCalculationResult {
  category: string;
  categoryLabel: string;
  points: number;
  vpp: string;
  reasoning: string[];
  alerts: string[];
  canDowngrade: boolean;
  downgradeReason?: string;
  suggestedDiagnoses: Array<{ id: string; label: string; typical: string }>;
}

export const calculateBiradsCategory = (input: BiradsCalculationInput): BiradsCalculationResult => {
  let points = 0;
  const reasoning: string[] = [];
  const alerts: string[] = [];
  let canDowngrade = false;
  let downgradeReason: string | undefined;

  // FORMA
  const shapeOption = NODULE_SHAPE.find(s => s.value === input.shape);
  if (shapeOption?.points) {
    points += shapeOption.points;
    reasoning.push(`Forma ${shapeOption.label.toLowerCase()} (+${shapeOption.points})`);
  } else if (shapeOption) {
    reasoning.push(`Forma ${shapeOption.label.toLowerCase()} (favorável)`);
  }

  // ORIENTAÇÃO
  const orientationOption = NODULE_ORIENTATION.find(o => o.value === input.orientation);
  if (orientationOption?.points) {
    points += orientationOption.points;
    reasoning.push(`Orientação não-paralela (+${orientationOption.points})`);
  } else if (orientationOption) {
    reasoning.push(`Orientação paralela (favorável)`);
  }

  // MARGENS (mais importante - espiculada = +3)
  const marginOption = NODULE_MARGINS.find(m => m.value === input.margins);
  if (marginOption?.points) {
    points += marginOption.points;
    reasoning.push(`Margem ${marginOption.label.toLowerCase()} (+${marginOption.points})`);
    if (input.margins === 'spiculated') {
      alerts.push('⚠️ Margens espiculadas são altamente suspeitas para malignidade');
    }
  } else if (marginOption) {
    reasoning.push(`Margem ${marginOption.label.toLowerCase()} (favorável)`);
  }

  // PADRÃO ECOGÊNICO
  const echoOption = NODULE_ECHO_PATTERN.find(e => e.value === input.echoPattern);
  if (echoOption?.points) {
    points += echoOption.points;
    reasoning.push(`Ecogenicidade ${echoOption.label.toLowerCase()} (+${echoOption.points})`);
  } else if (echoOption) {
    reasoning.push(`Ecogenicidade ${echoOption.label.toLowerCase()}`);
  }

  // CARACTERÍSTICAS POSTERIORES
  const posteriorOption = POSTERIOR_FEATURES.find(p => p.value === input.posteriorFeatures);
  if (posteriorOption?.points) {
    points += posteriorOption.points;
    reasoning.push(`${posteriorOption.label} (+${posteriorOption.points})`);
    if (input.posteriorFeatures === 'shadowing') {
      alerts.push('⚠️ Sombra acústica posterior pode indicar malignidade');
    }
  } else if (posteriorOption && posteriorOption.weight === 'benign') {
    reasoning.push(`${posteriorOption.label} (favorável)`);
  }

  // CALCIFICAÇÕES
  const calcOption = CALCIFICATIONS.find(c => c.value === input.calcifications);
  if (calcOption?.points) {
    points += calcOption.points;
    reasoning.push(`Calcificações ${calcOption.label.toLowerCase()} (+${calcOption.points})`);
    if (input.calcifications === 'pleomorphic') {
      alerts.push('⚠️ Calcificações pleomórficas são altamente suspeitas');
    }
  }

  // DOPPLER - Padrão vascular
  const vascularOption = VASCULAR_PATTERN.find(v => v.value === input.vascularPattern);
  if (vascularOption?.points) {
    points += vascularOption.points;
    reasoning.push(`Padrão vascular suspeito (+${vascularOption.points})`);
    if (['root_hair', 'crab_claw'].includes(input.vascularPattern || '')) {
      alerts.push('⚠️ Padrão vascular altamente suspeito para malignidade');
    }
  } else if (input.vascularPattern === 'parallel_av') {
    reasoning.push('Vasos paralelos A+V (VPP 99% para benignidade)');
    canDowngrade = true;
    downgradeReason = 'Sinal de artéria e veia paralelas favorece fortemente benignidade';
  }

  // ELASTOGRAFIA SWE
  const emeanOption = SWE_EMEAN_RANGES.find(e => e.value === input.sweEmean);
  const emaxOption = SWE_EMAX_RANGES.find(e => e.value === input.sweEmax);
  const sweQualOption = SWE_QUALITATIVE.find(s => s.value === input.sweQualitative);

  if (emeanOption?.points) {
    points += emeanOption.points;
    reasoning.push(`Elastografia Emean ${emeanOption.label} (+${emeanOption.points})`);
  }
  if (emaxOption?.points) {
    points += emaxOption.points;
    reasoning.push(`Elastografia Emax ${emaxOption.label} (+${emaxOption.points})`);
  }
  if (sweQualOption?.points) {
    points += sweQualOption.points;
    reasoning.push(`Elastografia qualitativa: ${sweQualOption.label} (+${sweQualOption.points})`);
    if (input.sweQualitative === 'stiff_rim') {
      alerts.push('⚠️ Anel rígido periférico (stiff rim) é altamente suspeito');
    }
  }

  // Verificar possibilidade de downgrade por SWE
  if (emeanOption?.canDowngrade && emaxOption?.canDowngrade) {
    canDowngrade = true;
    downgradeReason = 'Elastografia com baixa rigidez (Emean < 30 kPa e Emax < 36 kPa) permite considerar downgrade';
  }

  // CATEGORIZAÇÃO BASEADA EM PONTOS
  let category: string;
  let vpp: string;

  if (input.margins === 'spiculated' || points >= 5) {
    category = points >= 6 ? '5' : '4C';
    vpp = category === '5' ? '> 95%' : '50-95%';
  } else if (points >= 4) {
    category = '4C';
    vpp = '50-95%';
  } else if (points >= 2) {
    category = '4B';
    vpp = '10-50%';
  } else if (points === 1) {
    category = '4A';
    vpp = '2-10%';
  } else {
    category = '3';
    vpp = '< 2%';
  }

  // Aplicar downgrade se elegível e categoria é 4A
  if (canDowngrade && category === '4A' && downgradeReason) {
    category = '3';
    vpp = '< 2%';
    alerts.push(`✓ Downgrade aplicado: ${downgradeReason}`);
  }

  const categoryInfo = BIRADS_CATEGORIES.find(c => c.value === category);
  const suggestedDiagnoses = DIAGNOSTIC_SUGGESTIONS[category] || [];

  return {
    category,
    categoryLabel: categoryInfo?.label || `BI-RADS ${category}`,
    points,
    vpp,
    reasoning,
    alerts,
    canDowngrade,
    downgradeReason,
    suggestedDiagnoses
  };
};

// ============================================================================
// DEFINIÇÃO DOS ÓRGÃOS - ESTRUTURA SIMPLIFICADA
// ============================================================================

const mamaCategories: OrganCategory[] = [
  {
    id: 'nodulos',
    name: 'Nódulos',
    findings: [
      {
        id: 'nodulo',
        name: 'Nódulo',
        description: 'Lesão sólida ou complexa a caracterizar pelo léxico BI-RADS',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          { id: 'shape', label: 'Forma', type: 'select', options: NODULE_SHAPE.map(s => s.label) },
          { id: 'orientation', label: 'Orientação', type: 'select', options: NODULE_ORIENTATION.map(o => o.label) },
          { id: 'margins', label: 'Margens', type: 'select', options: NODULE_MARGINS.map(m => m.label) },
          { id: 'echoPattern', label: 'Padrão Ecogênico', type: 'select', options: NODULE_ECHO_PATTERN.map(e => e.label) },
          { id: 'posteriorFeatures', label: 'Características Posteriores', type: 'select', options: POSTERIOR_FEATURES.map(p => p.label) },
          { id: 'calcifications', label: 'Calcificações', type: 'select', options: CALCIFICATIONS.map(c => c.label) },
          { id: 'clockPosition', label: 'Posição (Horário)', type: 'select', options: CLOCK_POSITION.map(c => c.label) },
          { id: 'distanceFromNipple', label: 'Distância do Mamilo (cm)', type: 'text', placeholder: 'Ex: 3.5' },
          { id: 'dopplerFlow', label: 'Fluxo Doppler', type: 'select', options: DOPPLER_FLOW.map(d => d.label) },
          { id: 'vascularPattern', label: 'Padrão Vascular', type: 'select', options: VASCULAR_PATTERN.map(v => v.label) },
          { id: 'resistivityIndex', label: 'Índice de Resistividade', type: 'select', options: RESISTIVITY_INDEX.map(r => r.label) },
          { id: 'sweEmean', label: 'SWE Emean', type: 'select', options: SWE_EMEAN_RANGES.map(e => e.label) },
          { id: 'sweEmax', label: 'SWE Emax', type: 'select', options: SWE_EMAX_RANGES.map(e => e.label) },
          { id: 'sweQualitative', label: 'SWE Qualitativo', type: 'select', options: SWE_QUALITATIVE.map(s => s.label) },
          { id: 'sweEmeanValue', label: 'Emean (kPa)', type: 'text', placeholder: 'Ex: 25.3' },
          { id: 'sweEmaxValue', label: 'Emax (kPa)', type: 'text', placeholder: 'Ex: 32.1' },
          { id: 'sweEratio', label: 'Eratio (lesão/gordura)', type: 'text', placeholder: 'Ex: 2.8' }
        ]
      }
    ]
  },
  {
    id: 'cistos',
    name: 'Cistos',
    findings: [
      {
        id: 'cisto',
        name: 'Cisto',
        description: 'Lesão cística a classificar (simples, complicado ou complexo)',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          { id: 'cystType', label: 'Classificação', type: 'select', options: CYST_CLASSIFICATION.map(c => c.label) },
          { id: 'complexity', label: 'Critério de Complexidade', type: 'select', options: CYST_COMPLEXITY_CRITERIA.map(c => c.label) },
          { id: 'clockPosition', label: 'Posição (Horário)', type: 'select', options: CLOCK_POSITION.map(c => c.label) },
          { id: 'distanceFromNipple', label: 'Distância do Mamilo (cm)', type: 'text', placeholder: 'Ex: 3.5' }
        ]
      }
    ]
  },
  {
    id: 'alteracoes-cutaneas',
    name: 'Alterações Cutâneas',
    conditionalSection: true,
    findings: [
      {
        id: 'alteracao-cutanea',
        name: 'Alteração Cutânea',
        description: 'Alterações da pele e subcutâneo',
        hasDetails: true,
        hasLocation: true,
        extraFields: [
          { id: 'skinChange', label: 'Tipo de Alteração', type: 'select', options: SKIN_CHANGES.map(s => s.label) },
          { id: 'thickness', label: 'Espessura (mm)', type: 'text', placeholder: 'Normal < 2mm' }
        ]
      }
    ]
  },
  {
    id: 'alteracoes-ductais',
    name: 'Alterações Ductais',
    conditionalSection: true,
    findings: [
      {
        id: 'alteracao-ductal',
        name: 'Alteração Ductal',
        description: 'Ectasia ou massa intraductal',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        extraFields: [
          { id: 'ductalChange', label: 'Tipo de Alteração', type: 'select', options: DUCTAL_CHANGES.map(d => d.label) },
          { id: 'ductalDiameter', label: 'Diâmetro Ductal (mm)', type: 'text', placeholder: 'Normal < 2mm' }
        ]
      }
    ]
  },
  {
    id: 'distorcao-arquitetural',
    name: 'Distorção Arquitetural',
    conditionalSection: true,
    findings: [
      {
        id: 'distorcao',
        name: 'Distorção Arquitetural',
        description: 'Desestruturação da arquitetura mamária',
        hasDetails: true,
        hasLocation: true,
        hasMeasurement: true,
        extraFields: [
          { id: 'distortionType', label: 'Tipo', type: 'select', options: ARCHITECTURAL_DISTORTION.map(a => a.label) },
          { id: 'associatedMass', label: 'Massa Associada', type: 'select', options: ['Sim', 'Não'] }
        ]
      }
    ]
  }
];

const linfonodosCategories: OrganCategory[] = [
  {
    id: 'linfonodos-axilares',
    name: 'Linfonodos Axilares',
    findings: [
      {
        id: 'linfonodo-axilar',
        name: 'Linfonodo Axilar',
        description: 'Avaliação de linfonodos axilares',
        hasDetails: true,
        hasMeasurement: true,
        hasLocation: true,
        hasQuantity: true,
        extraFields: [
          { id: 'lnFinding', label: 'Achado', type: 'select', options: LYMPH_NODE_FINDINGS.map(l => l.label) },
          { id: 'corticalThickness', label: 'Espessura Cortical (mm)', type: 'text', placeholder: 'Normal < 3mm' },
          { id: 'axillaryLevel', label: 'Nível Axilar', type: 'select', options: ['Nível I (inferior)', 'Nível II (médio)', 'Nível III (apical)'] }
        ]
      }
    ]
  }
];

// ============================================================================
// EXPORTAÇÃO DOS ÓRGÃOS
// ============================================================================

export const breastUltrasoundOrgans: Organ[] = [
  {
    id: 'mama-direita',
    name: 'Mama Direita',
    icon: 'drop',
    group: 'Mamas',
    groupOrder: 1,
    normalDescription: 'apresenta parênquima mamário com ecotextura preservada, sem evidências de nódulos sólidos ou císticos, calcificações suspeitas, distorção arquitetural ou espessamento cutâneo. Ductos de calibre preservado.',
    categories: mamaCategories
  },
  {
    id: 'mama-esquerda',
    name: 'Mama Esquerda',
    icon: 'drop',
    group: 'Mamas',
    groupOrder: 2,
    normalDescription: 'apresenta parênquima mamário com ecotextura preservada, sem evidências de nódulos sólidos ou císticos, calcificações suspeitas, distorção arquitetural ou espessamento cutâneo. Ductos de calibre preservado.',
    categories: mamaCategories
  },
  {
    id: 'linfonodos-axilares-direitos',
    name: 'Linfonodos Axilares Direitos',
    icon: 'circle',
    group: 'Linfonodos Axilares',
    groupOrder: 1,
    normalDescription: 'apresentam morfologia preservada, com hilo gorduroso evidente e espessura cortical normal (< 3mm).',
    categories: linfonodosCategories
  },
  {
    id: 'linfonodos-axilares-esquerdos',
    name: 'Linfonodos Axilares Esquerdos',
    icon: 'circle',
    group: 'Linfonodos Axilares',
    groupOrder: 2,
    normalDescription: 'apresentam morfologia preservada, com hilo gorduroso evidente e espessura cortical normal (< 3mm).',
    categories: linfonodosCategories
  }
];

export default breastUltrasoundOrgans;
