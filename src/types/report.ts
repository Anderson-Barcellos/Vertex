import type { Finding, Organ } from '@/data/organs';

export interface FindingMeasurement {
  size?: string;
  location?: string;
  segment?: string; // For liver segments
  quantity?: string;
  description?: string;
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
