import { useMemo } from 'react';
import { ShieldWarning, CheckCircle, Warning, XCircle, Heartbeat } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface PlaqueRiskInput {
  echogenicity?: string;
  composition?: string;
  surface?: string;
  stenosisGrade?: string;
  hasSymptoms?: boolean;
}

interface PlaqueRiskResult {
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  riskLabel: string;
  grayWealeType?: string;
  vulnerabilityScore: number;
  maxScore: number;
  factors: string[];
  recommendation: string;
}

const ECHOGENICITY_SCORES: Record<string, { score: number; grayWeale?: string }> = {
  'hipoecogênica': { score: 3, grayWeale: 'I' },
  'hipoecogênica (lipídica)': { score: 3, grayWeale: 'I' },
  'predominantemente hipoecogênica': { score: 2, grayWeale: 'II' },
  'predominantemente hipoecogênica (tipo ii)': { score: 2, grayWeale: 'II' },
  'isoecogênica': { score: 1, grayWeale: 'III' },
  'predominantemente hiperecogênica': { score: 0, grayWeale: 'IV' },
  'predominantemente hiperecogênica (tipo iv)': { score: 0, grayWeale: 'IV' },
  'hiperecogênica': { score: 0, grayWeale: 'V' },
  'hiperecogênica (fibrosa)': { score: 0, grayWeale: 'V' },
  'calcificada': { score: 0, grayWeale: 'V' },
};

const COMPOSITION_SCORES: Record<string, number> = {
  'heterogênea': 2,
  'predominantemente lipídica': 2,
  'mista (fibrocalcificada)': 1,
  'mista': 1,
  'homogênea': 0,
};

const SURFACE_SCORES: Record<string, number> = {
  'ulcerada': 3,
  'irregular': 2,
  'lisa': 0,
  'regular': 0,
};

const STENOSIS_SCORES: Record<string, number> = {
  '70-99': 2,
  '≥70%': 2,
  '70-89% (grave)': 2,
  '90-99% (crítica)': 3,
  '50-69': 1,
  '50-69%': 1,
  '50-69% (moderada)': 1,
  '<50': 0,
  '<50%': 0,
  '<50% (leve)': 0,
  'normal': 0,
  'normal (sem estenose)': 0,
};

function calculatePlaqueRisk(input: PlaqueRiskInput): PlaqueRiskResult {
  const factors: string[] = [];
  let score = 0;
  let grayWealeType: string | undefined;

  const echoLower = input.echogenicity?.toLowerCase() || '';
  const echoData = Object.entries(ECHOGENICITY_SCORES).find(([key]) => 
    echoLower.includes(key) || key.includes(echoLower)
  );
  if (echoData) {
    score += echoData[1].score;
    grayWealeType = echoData[1].grayWeale;
    if (echoData[1].score >= 2) {
      factors.push(`Ecogenicidade: ${input.echogenicity} (Gray-Weale tipo ${grayWealeType})`);
    }
  }

  const compLower = input.composition?.toLowerCase() || '';
  const compScore = Object.entries(COMPOSITION_SCORES).find(([key]) =>
    compLower.includes(key) || key.includes(compLower)
  );
  if (compScore) {
    score += compScore[1];
    if (compScore[1] >= 1) {
      factors.push(`Composição: ${input.composition}`);
    }
  }

  const surfLower = input.surface?.toLowerCase() || '';
  const surfScore = Object.entries(SURFACE_SCORES).find(([key]) =>
    surfLower.includes(key) || key.includes(surfLower)
  );
  if (surfScore) {
    score += surfScore[1];
    if (surfScore[1] >= 2) {
      factors.push(`Superfície: ${input.surface}`);
    }
  }

  const stenosisLower = input.stenosisGrade?.toLowerCase() || '';
  const stenosisScore = Object.entries(STENOSIS_SCORES).find(([key]) =>
    stenosisLower.includes(key) || key.includes(stenosisLower)
  );
  if (stenosisScore) {
    score += stenosisScore[1];
    if (stenosisScore[1] >= 1) {
      factors.push(`Estenose: ${input.stenosisGrade}`);
    }
  }

  if (input.hasSymptoms) {
    score += 2;
    factors.push('Sintomático');
  }

  const maxScore = 12;
  let riskLevel: PlaqueRiskResult['riskLevel'];
  let riskLabel: string;
  let recommendation: string;

  if (score >= 7) {
    riskLevel = 'very_high';
    riskLabel = 'Risco Muito Alto';
    recommendation = 'Placa vulnerável. Considerar avaliação vascular urgente e discussão multidisciplinar para intervenção.';
  } else if (score >= 5) {
    riskLevel = 'high';
    riskLabel = 'Risco Alto';
    recommendation = 'Placa com características de instabilidade. Indicado seguimento próximo e otimização de fatores de risco.';
  } else if (score >= 3) {
    riskLevel = 'moderate';
    riskLabel = 'Risco Moderado';
    recommendation = 'Manter controle de fatores de risco cardiovascular. Seguimento ultrassonográfico em 6-12 meses.';
  } else {
    riskLevel = 'low';
    riskLabel = 'Risco Baixo';
    recommendation = 'Placa estável. Manter prevenção secundária e seguimento anual.';
  }

  return {
    riskLevel,
    riskLabel,
    grayWealeType,
    vulnerabilityScore: score,
    maxScore,
    factors,
    recommendation
  };
}

function getRiskColor(level: PlaqueRiskResult['riskLevel']) {
  switch (level) {
    case 'low': return 'text-green-400';
    case 'moderate': return 'text-yellow-400';
    case 'high': return 'text-orange-400';
    case 'very_high': return 'text-red-400';
  }
}

function getRiskBgColor(level: PlaqueRiskResult['riskLevel']) {
  switch (level) {
    case 'low': return 'bg-green-500/10 border-green-500/30';
    case 'moderate': return 'bg-yellow-500/10 border-yellow-500/30';
    case 'high': return 'bg-orange-500/10 border-orange-500/30';
    case 'very_high': return 'bg-red-500/10 border-red-500/30';
  }
}

interface PlaqueRiskCalculatorPanelProps {
  echogenicity?: string;
  composition?: string;
  surface?: string;
  stenosisGrade?: string;
  hasSymptoms?: boolean;
  className?: string;
  compact?: boolean;
}

export function PlaqueRiskCalculatorPanel({
  echogenicity,
  composition,
  surface,
  stenosisGrade,
  hasSymptoms,
  className,
  compact = false
}: PlaqueRiskCalculatorPanelProps) {
  const result = useMemo(() => {
    return calculatePlaqueRisk({ echogenicity, composition, surface, stenosisGrade, hasSymptoms });
  }, [echogenicity, composition, surface, stenosisGrade, hasSymptoms]);

  const hasAnyInput = echogenicity || composition || surface;

  if (!hasAnyInput) {
    return (
      <div className={cn("rounded-lg border border-white/10 bg-white/5 p-3", className)}>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <ShieldWarning size={14} />
          <span>Preencha os campos para calcular risco de placa</span>
        </div>
      </div>
    );
  }

  const RiskIcon = result.riskLevel === 'low' 
    ? CheckCircle 
    : result.riskLevel === 'moderate' 
      ? Warning 
      : XCircle;

  if (compact) {
    return (
      <div className={cn(
        "rounded-lg border p-2 flex items-center justify-between gap-2",
        getRiskBgColor(result.riskLevel),
        className
      )}>
        <div className="flex items-center gap-2">
          <RiskIcon size={14} className={getRiskColor(result.riskLevel)} weight="fill" />
          <span className={cn("font-bold text-sm", getRiskColor(result.riskLevel))}>
            {result.riskLabel}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-400">
            {result.vulnerabilityScore}/{result.maxScore} pts
          </span>
          {result.grayWealeType && (
            <span className="text-[10px] text-gray-300 px-1.5 py-0.5 bg-white/10 rounded">
              GW-{result.grayWealeType}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden",
      getRiskBgColor(result.riskLevel),
      className
    )}>
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heartbeat size={16} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-300">Risco de Placa</span>
        </div>
        <div className="flex items-center gap-2">
          {result.grayWealeType && (
            <span className="text-[10px] text-gray-300 px-1.5 py-0.5 bg-white/10 rounded">
              Gray-Weale tipo {result.grayWealeType}
            </span>
          )}
          <div className={cn(
            "px-2 py-0.5 rounded text-sm font-bold",
            getRiskColor(result.riskLevel)
          )}>
            {result.vulnerabilityScore}/{result.maxScore} pts
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <RiskIcon size={18} className={getRiskColor(result.riskLevel)} weight="fill" />
          <span className={cn("text-sm font-bold", getRiskColor(result.riskLevel))}>
            {result.riskLabel}
          </span>
        </div>

        {result.factors.length > 0 && (
          <div className="text-[10px] text-gray-400 space-y-0.5">
            {result.factors.map((factor, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-gray-500" />
                {factor}
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-white/10">
          <p className="text-[11px] text-gray-300 leading-relaxed">
            {result.recommendation}
          </p>
        </div>

        <div className="text-[9px] text-gray-500 pt-1 border-t border-white/10">
          <span className="font-medium">Baseado em:</span> Gray-Weale, ACSRS, ESVS Guidelines
        </div>
      </div>
    </div>
  );
}

export { calculatePlaqueRisk };
export type { PlaqueRiskInput, PlaqueRiskResult };
