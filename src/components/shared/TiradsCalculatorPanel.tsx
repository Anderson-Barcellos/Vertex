import { useMemo } from 'react';
import { Calculator, Syringe, Eye, CheckCircle, Warning, XCircle } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { calculateTirads, getTiradsColor, getTiradsBgColor, formatTiradsBreakdown, type TiradsInput } from '@/services/tiradsCalculator';

interface TiradsCalculatorPanelProps {
  composition?: string;
  echogenicity?: string;
  shape?: string;
  margins?: string;
  echogenicFoci?: string;
  size?: string;
  className?: string;
  compact?: boolean;
}

export function TiradsCalculatorPanel({
  composition,
  echogenicity,
  shape,
  margins,
  echogenicFoci,
  size,
  className,
  compact = false
}: TiradsCalculatorPanelProps) {
  const result = useMemo(() => {
    const input: TiradsInput = { composition, echogenicity, shape, margins, echogenicFoci, size };
    return calculateTirads(input);
  }, [composition, echogenicity, shape, margins, echogenicFoci, size]);

  const hasAnyInput = composition || echogenicity || shape || margins || echogenicFoci;

  if (!hasAnyInput) {
    return (
      <div className={cn("rounded-lg border border-white/10 bg-white/5 p-3", className)}>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Calculator size={14} />
          <span>Preencha os campos para calcular TI-RADS</span>
        </div>
      </div>
    );
  }

  const ConductIcon = result.conduct === 'no_fna' 
    ? CheckCircle 
    : result.conduct === 'follow_up' 
      ? Eye 
      : result.conduct === 'fna_strongly_recommended'
        ? XCircle
        : Syringe;

  const conductIconColor = result.conduct === 'no_fna'
    ? 'text-green-400'
    : result.conduct === 'follow_up'
      ? 'text-yellow-400'
      : result.conduct === 'fna_strongly_recommended'
        ? 'text-red-400'
        : 'text-orange-400';

  if (compact) {
    return (
      <div className={cn(
        "rounded-lg border p-2 flex items-center justify-between gap-2",
        getTiradsBgColor(result.category),
        className
      )}>
        <div className="flex items-center gap-2">
          <span className={cn("font-bold text-sm", getTiradsColor(result.category))}>
            TR{result.category}
          </span>
          <span className="text-[10px] text-gray-400">
            {result.points} pts
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ConductIcon size={14} className={conductIconColor} weight="fill" />
          <span className="text-[10px] text-gray-300 max-w-[120px] truncate">
            {result.conductLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden",
      getTiradsBgColor(result.category),
      className
    )}>
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-300">TI-RADS Auto</span>
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded text-sm font-bold",
          getTiradsColor(result.category)
        )}>
          TR{result.category} ({result.points} pts)
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className={cn("text-sm font-medium", getTiradsColor(result.category))}>
          {result.categoryLabel}
        </div>

        <div className="text-[10px] text-gray-500">
          {formatTiradsBreakdown(result.breakdown)}
        </div>

        <div className="flex items-start gap-2 pt-2 border-t border-white/10">
          <ConductIcon size={18} className={conductIconColor} weight="fill" />
          <div className="flex-1">
            <div className={cn("text-xs font-medium", conductIconColor)}>
              {result.conductLabel}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
              {result.recommendation}
            </p>
          </div>
        </div>

        {result.category >= 3 && (
          <div className="text-[10px] text-gray-500 pt-1 border-t border-white/10">
            <span className="font-medium">Limiares ACR:</span> PAAF ≥{result.sizeThresholds.fnaThreshold}cm | Seguimento ≥{result.sizeThresholds.followUpThreshold}cm
          </div>
        )}
      </div>
    </div>
  );
}
