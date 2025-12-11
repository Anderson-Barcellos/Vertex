import {
  NODULE_COMPOSITION,
  NODULE_ECHOGENICITY,
  NODULE_SHAPE,
  NODULE_MARGINS,
  ECHOGENIC_FOCI
} from '@/data/thyroidOrgans';

export interface TiradsInput {
  composition?: string;
  echogenicity?: string;
  shape?: string;
  margins?: string;
  echogenicFoci?: string;
  size?: string;
}

export interface TiradsResult {
  points: number;
  category: number;
  categoryLabel: string;
  risk: 'benign' | 'not_suspicious' | 'mildly_suspicious' | 'moderately_suspicious' | 'highly_suspicious';
  recommendation: string;
  conduct: 'no_fna' | 'follow_up' | 'fna_recommended' | 'fna_strongly_recommended';
  conductLabel: string;
  breakdown: {
    composition: number;
    echogenicity: number;
    shape: number;
    margins: number;
    echogenicFoci: number;
  };
  sizeThresholds: {
    fnaThreshold: number;
    followUpThreshold: number;
  };
}

const findPoints = (
  list: Array<{ value: string; label: string; points: number }>,
  value?: string
): number => {
  if (!value) return 0;
  const match = list.find(item => item.value === value || item.label === value);
  return match?.points ?? 0;
};

const parseSizeInCm = (size?: string): number | null => {
  if (!size) return null;
  const cleaned = size.replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return null;
  if (num > 10) return num / 10;
  return num;
};

export function calculateTirads(input: TiradsInput): TiradsResult {
  const breakdown = {
    composition: findPoints(NODULE_COMPOSITION, input.composition),
    echogenicity: findPoints(NODULE_ECHOGENICITY, input.echogenicity),
    shape: findPoints(NODULE_SHAPE, input.shape),
    margins: findPoints(NODULE_MARGINS, input.margins),
    echogenicFoci: findPoints(ECHOGENIC_FOCI, input.echogenicFoci)
  };

  const points = Object.values(breakdown).reduce((sum, p) => sum + p, 0);
  
  let category: number;
  let categoryLabel: string;
  let risk: TiradsResult['risk'];
  let fnaThreshold: number;
  let followUpThreshold: number;

  if (points === 0) {
    category = 1;
    categoryLabel = 'TI-RADS 1 - Benigno';
    risk = 'benign';
    fnaThreshold = Infinity;
    followUpThreshold = Infinity;
  } else if (points <= 2) {
    category = 2;
    categoryLabel = 'TI-RADS 2 - Não suspeito';
    risk = 'not_suspicious';
    fnaThreshold = Infinity;
    followUpThreshold = Infinity;
  } else if (points === 3) {
    category = 3;
    categoryLabel = 'TI-RADS 3 - Levemente suspeito';
    risk = 'mildly_suspicious';
    fnaThreshold = 2.5;
    followUpThreshold = 1.5;
  } else if (points >= 4 && points <= 6) {
    category = 4;
    categoryLabel = 'TI-RADS 4 - Moderadamente suspeito';
    risk = 'moderately_suspicious';
    fnaThreshold = 1.5;
    followUpThreshold = 1.0;
  } else {
    category = 5;
    categoryLabel = 'TI-RADS 5 - Altamente suspeito';
    risk = 'highly_suspicious';
    fnaThreshold = 1.0;
    followUpThreshold = 0.5;
  }

  const sizeInCm = parseSizeInCm(input.size);
  let conduct: TiradsResult['conduct'];
  let conductLabel: string;
  let recommendation: string;

  if (category <= 2) {
    conduct = 'no_fna';
    conductLabel = 'Sem indicação de PAAF ou seguimento';
    recommendation = 'Nódulo benigno. Não há necessidade de punção ou seguimento específico.';
  } else if (sizeInCm === null) {
    conduct = 'follow_up';
    conductLabel = 'Informar tamanho para conduta';
    recommendation = `${categoryLabel} (${points} pts). Informe o tamanho do nódulo para determinar a conduta.`;
  } else if (sizeInCm >= fnaThreshold) {
    conduct = category === 5 ? 'fna_strongly_recommended' : 'fna_recommended';
    conductLabel = category === 5 
      ? `PAAF fortemente recomendada (≥${fnaThreshold}cm)`
      : `PAAF recomendada (≥${fnaThreshold}cm)`;
    recommendation = `${categoryLabel} (${points} pts). Nódulo de ${sizeInCm.toFixed(1)}cm. PAAF recomendada conforme ACR TI-RADS.`;
  } else if (sizeInCm >= followUpThreshold) {
    conduct = 'follow_up';
    conductLabel = `Seguimento recomendado (≥${followUpThreshold}cm)`;
    recommendation = `${categoryLabel} (${points} pts). Nódulo de ${sizeInCm.toFixed(1)}cm. Seguimento ultrassonográfico em 1-2 anos.`;
  } else {
    conduct = 'no_fna';
    conductLabel = `Sem indicação (<${followUpThreshold}cm)`;
    recommendation = `${categoryLabel} (${points} pts). Nódulo de ${sizeInCm.toFixed(1)}cm. Abaixo do limiar para PAAF/seguimento. Considerar controle conforme contexto clínico.`;
  }

  return {
    points,
    category,
    categoryLabel,
    risk,
    recommendation,
    conduct,
    conductLabel,
    breakdown,
    sizeThresholds: { fnaThreshold, followUpThreshold }
  };
}

export function getTiradsColor(category: number): string {
  switch (category) {
    case 1: return 'text-green-500';
    case 2: return 'text-green-400';
    case 3: return 'text-yellow-500';
    case 4: return 'text-orange-500';
    case 5: return 'text-red-500';
    default: return 'text-gray-400';
  }
}

export function getTiradsBgColor(category: number): string {
  switch (category) {
    case 1: return 'bg-green-500/20 border-green-500/30';
    case 2: return 'bg-green-400/20 border-green-400/30';
    case 3: return 'bg-yellow-500/20 border-yellow-500/30';
    case 4: return 'bg-orange-500/20 border-orange-500/30';
    case 5: return 'bg-red-500/20 border-red-500/30';
    default: return 'bg-gray-500/20 border-gray-500/30';
  }
}

export function formatTiradsBreakdown(breakdown: TiradsResult['breakdown']): string {
  const parts = [];
  if (breakdown.composition > 0) parts.push(`Composição: +${breakdown.composition}`);
  if (breakdown.echogenicity > 0) parts.push(`Ecogenicidade: +${breakdown.echogenicity}`);
  if (breakdown.shape > 0) parts.push(`Forma: +${breakdown.shape}`);
  if (breakdown.margins > 0) parts.push(`Margens: +${breakdown.margins}`);
  if (breakdown.echogenicFoci > 0) parts.push(`Focos: +${breakdown.echogenicFoci}`);
  return parts.length > 0 ? parts.join(' | ') : 'Nenhum ponto';
}
