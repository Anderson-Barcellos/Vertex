import type { Finding, Organ } from '@/data/organs';

export interface FindingMeasurement {
  size?: string;
  location?: string;
  segment?: string; // For liver segments
  quantity?: string;
  description?: string;

  // Carotid Doppler specific fields - Velocimetria
  vps?: string; // Velocidade de Pico Sistólico (cm/s)
  vdf?: string; // Velocidade Diastólica Final (cm/s)
  ratioICA_CCA?: string; // Razão VPS ICA/CCA
  ratioICA_ICA?: string; // Razão VPS ICA/ICA contralateral
  nascetGrade?: string; // Grau NASCET
  stenosis_percent?: string; // Percentual de estenose estimado visualmente
  extension?: string; // Extensão longitudinal da placa em mm
  diameter?: string; // Diâmetro do vaso (para vertebrais/hipoplasia) em mm

  // Carotid Doppler - Características de Placas
  plaqueEchogenicity?: string; // Ecogenicidade da placa (Gray-Weale)
  plaqueComposition?: string; // Composição da placa
  plaqueSurface?: string; // Superfície da placa
  plaqueRisk?: string; // Estratificação de risco da placa

  // Carotid Doppler - EMI e Vertebrais
  emi?: string; // Espessamento Médio-Intimal em mm
  emiClassification?: string; // Classificação EMI (normal, limítrofe, etc)
  vertebralFlowPattern?: string; // Padrão de fluxo vertebral
  subclavianSteal?: string; // Roubo da subclávia (Sim/Não)

  // Carotid Doppler - Auto-cálculo NASCET (IAC/ESVS)
  spectralBroadening?: string; // Borramento espectral
  calculatedGrade?: string; // Grau calculado automaticamente
  calculatedConfidence?: string; // Confiança do cálculo (high/medium/low)

  // Breast Ultrasound specific fields
  biradsCategory?: string; // BI-RADS categorization (1-6)
  depth?: string; // Profundidade da lesão (superficial, intermediária, profunda)
  distanceFromNipple?: string; // Distância do mamilo em cm
  clockPosition?: string; // Posição em horas do relógio (1-12)
  quadrant?: string; // Quadrante mamário (QSE, QSI, QIE, QII, retroareolar)

  // Nodule/Mass characteristics
  shape?: string; // Forma da lesão (oval, redonda, irregular)
  margins?: string; // Margens (circunscritas, indistintas, microlobuladas, espiculadas)
  orientation?: string; // Orientação (paralela, não paralela)
  posteriorFeatures?: string; // Características acústicas posteriores (sombra, reforço, sem alterações)

  // Doppler/Vascular
  vascularization?: string; // Vascularização (ausente, periférica, central, mista)
  vascularPattern?: string; // Padrão vascular (penetrante, radiado, arboriforme)
  peakVelocity?: string; // Velocidade de pico em cm/s
  pulsatilityIndex?: string; // Índice de pulsatilidade
  resistivityIndex?: string; // Índice de resistividade

  // Physical properties
  mobility?: string; // Mobilidade da lesão
  elastographyScore?: string; // Score elastográfico (1-5)
  strainRatio?: string; // Razão de strain

  // Calcifications
  calcificationMorphology?: string; // Morfologia das calcificações
  calcificationDistribution?: string; // Distribuição das calcificações
  distribution?: string; // Distribuição genérica (calcificações, cistos, etc)

  // Cyst characteristics
  internalContent?: string; // Conteúdo interno (anecoico, debris, septos)
  wallThickness?: string; // Espessura de parede
  surroundingEdema?: string; // Edema circundante

  // Implant specific
  implantType?: string; // Tipo de implante (silicone, salina, etc)
  ruptureType?: string; // Tipo de ruptura (intracapsular, extracapsular)
  bakerGrade?: string; // Grau de contratura capsular (Baker I-IV)

  // Lymph node characteristics
  corticalThickness?: string; // Espessura cortical do linfonodo em mm
  hilusPresence?: string; // Presença de hilo (presente, ausente)
  morphology?: string; // Morfologia do linfonodo
  axillaryLevel?: string; // Nível axilar (I, II, III)

  // Thyroid TI-RADS fields (ACR 2017)
  thyroidComposition?: string; // Composição do nódulo (cístico, espongiforme, misto, sólido)
  thyroidEchogenicity?: string; // Ecogenicidade (anecóico, hiper/iso, hipo, muito hipo)
  thyroidShape?: string; // Forma (mais largo que alto, mais alto que largo)
  thyroidMargins?: string; // Margens (lisas, mal definidas, lobuladas, extensão extratiroidea)
  echogenicFoci?: string; // Focos ecogênicos (ausentes, macro, periféricos, micro)
  vascularityPattern?: string; // Padrão vascular Doppler
  elastography?: string; // Score elastográfico (1-5)
  tiradsScore?: number; // Pontuação TI-RADS calculada
  tiradsCategory?: string; // Categoria TI-RADS (TR1-TR5)
  tiradsRecommendation?: string; // Recomendação (PAAF, seguimento, etc)

  // Thyroid Volume fields (Gutekunst reference)
  volumeDirect?: string; // Volume inserido diretamente pelo usuário em mL
  volumeCalculated?: string; // Volume (direto ou calculado) em mL
  volumeStatus?: string; // Status do volume (normal, increased, reduced)
  volumeLabel?: string; // Label descritivo do status
  thickness?: string; // Espessura (istmo) em mm

  // Thyroid Parenchyma fields
  echotexturePattern?: string; // Padrão de ecotextura do parênquima
  vascularity?: string; // Vascularização do parênquima

  // Legacy fields (manter compatibilidade)
  ratio?: string; // Razão VPS ACI/ACC (deprecated, usar ratioICA_CCA)
  nascet?: string; // Grau NASCET de estenose (deprecated)
  echogenicity?: string; // Ecogenicidade da placa (deprecated, usar plaqueEchogenicity)
  composition?: string; // Composição da placa (deprecated, usar plaqueComposition)
  surface?: string; // Superfície da placa (deprecated, usar plaqueSurface)
  risk?: string; // Estratificação de risco (deprecated, usar plaqueRisk)
  emiValue?: string; // Espessamento Médio-Intimal (deprecated, usar emi)
  vertebralVelocity?: string; // Velocidade em vertebrais (deprecated)
  vertebralIR?: string; // Índice de Resistividade (deprecated)
  flowPattern?: string; // Padrão de fluxo (deprecated, usar vertebralFlowPattern)
  emi_classification?: string; // Legacy compatibility para classificações EMI
  ratio_aci_acc?: string; // Legacy compatibility para ratio ICA/ACC
}

export interface FindingInstance {
  id: string; // Unique ID for each instance
  measurements: FindingMeasurement;
}

export interface SelectedFinding {
  organId: string;
  categoryId: string;
  findingId: string;
  finding: Finding;
  severity?: string;
  details?: string;
  measurements?: FindingMeasurement;
  instances?: FindingInstance[]; // For multiple lesions
  isNormal?: boolean;
}

export interface ReportData {
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  additionalNotes?: string;
}

export type AIProvider = 'gemini' | 'openai' | 'claude';

export interface AIGenerationStats {
  provider: AIProvider;
  model?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  estimatedCostUsd?: number;
  durationMs?: number;
  startedAt?: number;
  finishedAt?: number;
  chunkCount?: number;
  inputChars?: number;
  outputChars?: number;
  errorMessage?: string;
}

export interface GeminiPromptTemplate {
  roleDescription: string;
  language: string;
  examTitle: string;
  technicalDescription: string;
  findingsTitle: string;
  findingsPlaceholder: string;
  impressionTitle: string;
  impressionPlaceholder: string;
  requirements: string[];
  normalImpression: string;
  abnormalImpressionIntro: string;
  abnormalImpressionSuffix?: string;
}

export interface ReportGenerationOptions {
  model?: string;
  organsList?: Organ[];
  promptTemplate?: GeminiPromptTemplate;
  provider?: AIProvider;
}
