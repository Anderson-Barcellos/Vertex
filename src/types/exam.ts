import type { ComponentType } from 'react';
import type { Organ, Finding } from '@/data/organs';
import type { SelectedFinding, FindingInstance } from './report';

export interface OrganGroup {
  id: string;
  name: string;
  organIds: string[];
}

export interface NormalizedFinding {
  id: string;
  organId: string;
  organName: string;
  categoryId: string;
  categoryName: string;
  findingName: string;
  description: string;
  severity?: string;
  instances?: FindingInstance[];
  formattedText: string;
}

export interface FindingDetailsProps {
  organId: string;
  categoryId: string;
  finding: Finding;
  isChecked: boolean;
  severity?: string;
  instances?: FindingInstance[];
  onDetailsChange: (details: { severity?: string; instances?: FindingInstance[] }) => void;
}

export interface ExamConfig {
  id: string;
  title: string;
  subtitle: string;
  examType: string;
  organsCatalog: Organ[];
  autoSaveKey: string;
  excludeFromNormalAll?: string[];
  organGroups?: OrganGroup[];
  FindingDetailsComponent?: ComponentType<FindingDetailsProps>;
  findingFormatter?: (finding: SelectedFinding, organ: Organ) => string;
  promptCustomizer?: (basePrompt: string, findings: SelectedFinding[]) => string;
}

export interface ExamState {
  selectedOrgan: string;
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  generatedReport: string;
  isGenerating: boolean;
  isPanelMinimized: boolean;
  tempFindingDetails: Record<string, Record<string, { severity?: string; instances?: FindingInstance[] }>>;
}
