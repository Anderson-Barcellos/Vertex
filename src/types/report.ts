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

export type AIProvider = 'gemini' | 'openai';

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
