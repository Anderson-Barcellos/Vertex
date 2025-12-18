import type { Organ } from '@/data/organs';
import type { SelectedFinding, FindingInstance } from '@/types/report';
import type { NormalizedFinding, ExamConfig } from '@/types/exam';

export function getOrganById(organId: string, catalog: Organ[]): Organ | undefined {
  return catalog.find(o => o.id === organId);
}

export function getOrganName(organId: string, catalog: Organ[]): string {
  return getOrganById(organId, catalog)?.name ?? organId;
}

export function getCategoryName(organId: string, categoryId: string, catalog: Organ[]): string {
  const organ = getOrganById(organId, catalog);
  if (!organ) return categoryId;
  const category = organ.categories.find(c => c.id === categoryId);
  return category?.name ?? categoryId;
}

export function normalizeFinding(
  finding: SelectedFinding,
  catalog: Organ[]
): NormalizedFinding {
  const organ = getOrganById(finding.organId, catalog);
  const organName = organ?.name ?? finding.organId;
  const categoryName = getCategoryName(finding.organId, finding.categoryId, catalog);
  
  let formattedText = `${finding.finding.name}`;
  
  if (finding.severity) {
    formattedText += ` (${finding.severity})`;
  }
  
  if (finding.instances && finding.instances.length > 0) {
    const instanceTexts = finding.instances.map((inst, idx) => {
      const measurements = Object.entries(inst.measurements)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      return measurements ? `${idx + 1}) ${measurements}` : '';
    }).filter(Boolean);
    
    if (instanceTexts.length > 0) {
      formattedText += ` - ${instanceTexts.join('; ')}`;
    }
  }
  
  return {
    id: finding.findingId,
    organId: finding.organId,
    organName,
    categoryId: finding.categoryId,
    categoryName,
    findingName: finding.finding.name,
    description: finding.finding.description,
    severity: finding.severity,
    instances: finding.instances,
    formattedText
  };
}

export function normalizeAllFindings(
  findings: SelectedFinding[],
  catalog: Organ[]
): NormalizedFinding[] {
  return findings.map(f => normalizeFinding(f, catalog));
}

export function groupFindingsByOrgan(
  findings: SelectedFinding[],
  catalog: Organ[]
): Map<string, NormalizedFinding[]> {
  const grouped = new Map<string, NormalizedFinding[]>();
  
  findings.forEach(finding => {
    const normalized = normalizeFinding(finding, catalog);
    const existing = grouped.get(finding.organId) || [];
    existing.push(normalized);
    grouped.set(finding.organId, existing);
  });
  
  return grouped;
}

export function getExcludedOrganIds(config: ExamConfig): string[] {
  return config.excludeFromNormalAll ?? [];
}

export function getMarkableOrgans(config: ExamConfig): Organ[] {
  const excluded = getExcludedOrganIds(config);
  return config.organsCatalog.filter(o => !excluded.includes(o.id));
}

export function buildFindingSummary(
  selectedFindings: SelectedFinding[],
  normalOrgans: string[],
  catalog: Organ[]
): string {
  const lines: string[] = [];
  
  if (selectedFindings.length > 0) {
    lines.push('ACHADOS:');
    const grouped = groupFindingsByOrgan(selectedFindings, catalog);
    
    grouped.forEach((findings, organId) => {
      const organName = getOrganName(organId, catalog);
      lines.push(`  ${organName}:`);
      findings.forEach(f => {
        lines.push(`    - ${f.formattedText}`);
      });
    });
  }
  
  if (normalOrgans.length > 0) {
    lines.push('');
    lines.push('NORMAIS:');
    normalOrgans.forEach(organId => {
      const organName = getOrganName(organId, catalog);
      lines.push(`  - ${organName}`);
    });
  }
  
  return lines.join('\n');
}

export function mergeTempDetailsIntoFinding(
  finding: SelectedFinding,
  tempDetails: Record<string, { severity?: string; instances?: FindingInstance[] }>
): SelectedFinding {
  const temp = tempDetails[finding.findingId];
  if (!temp) return finding;
  
  return {
    ...finding,
    severity: temp.severity ?? finding.severity,
    instances: temp.instances ?? finding.instances
  };
}

export function applyTempDetailsToFindings(
  findings: SelectedFinding[],
  organId: string,
  tempDetails: Record<string, Record<string, { severity?: string; instances?: FindingInstance[] }>>
): SelectedFinding[] {
  const organDetails = tempDetails[organId];
  if (!organDetails) return findings;
  
  return findings.map(f => {
    if (f.organId !== organId) return f;
    return mergeTempDetailsIntoFinding(f, organDetails);
  });
}
