import React, { useMemo } from 'react';
import { SelectedFinding } from '@/types/report';
import { organs as defaultOrgans, type Organ } from '@/data/organs';
import { ChartBar, Pulse } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ExamStatisticsPanelProps {
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsList?: Organ[];
  className?: string;
}

export default function ExamStatisticsPanel({
  selectedFindings,
  normalOrgans,
  organsList = defaultOrgans,
  className
}: ExamStatisticsPanelProps) {

  const uniqueOrgansWithFindings = useMemo(
    () => new Set(selectedFindings.map(finding => finding.organId)),
    [selectedFindings]
  );

  const uniqueNormalOrgans = useMemo(() => new Set(normalOrgans), [normalOrgans]);

  const coverage = organsList.length > 0
    ? Math.min(
        100,
        Math.round(
          ((uniqueOrgansWithFindings.size + uniqueNormalOrgans.size) / organsList.length) * 100
        )
      )
    : 0;

  const statistics = [
    {
      label: 'Achados registrados',
      value: selectedFindings.length,
      color: 'text-sidebar-accent',
      isNew: selectedFindings.length > 0
    },
    {
      label: 'Órgãos com achados',
      value: uniqueOrgansWithFindings.size,
      color: 'text-orange-500',
      isNew: uniqueOrgansWithFindings.size > 0
    },
    {
      label: 'Órgãos normais',
      value: uniqueNormalOrgans.size,
      color: 'text-green-500',
      isNew: uniqueNormalOrgans.size > 0
    }
  ];

  return (
    <section
      aria-labelledby="estatisticas-titulo"
      className={cn(
        "w-56 md:w-64 lg:w-72 xl:w-80 bg-sidebar-background/95 backdrop-blur-sm rounded-xl shadow-xl border border-border/20 overflow-hidden transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/20 bg-sidebar-background">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ChartBar size={18} className="text-sidebar-foreground" />
            <h2 id="estatisticas-titulo" className="text-sm font-semibold text-sidebar-foreground">
              Estatísticas do Exame
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <Pulse size={14} className="text-sidebar-accent" />
            <span className="text-xs font-bold text-sidebar-accent">{coverage}%</span>
          </div>
        </div>
      </div>

      {/* Statistics Content */}
      <div className="p-4 space-y-3">
        {statistics.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "statistic-item",
              stat.isNew && "statistic-item-new"
            )}
          >
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-sidebar-foreground opacity-80">
                {stat.label}
              </span>
              <span className={cn(
                "text-lg font-bold transition-all duration-300",
                stat.color
              )}>
                {stat.value}
              </span>
            </div>
            {index < statistics.length - 1 && (
              <div className="h-px bg-sidebar-muted/30 mt-1" />
            )}
          </div>
        ))}

        {/* Coverage Bar */}
        <div className="mt-4 pt-3 border-t border-sidebar-muted/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-sidebar-foreground opacity-70">
              Cobertura do exame
            </span>
            <span className="text-xs font-medium text-sidebar-foreground">
              {uniqueOrgansWithFindings.size + uniqueNormalOrgans.size}/{organsList.length} órgãos
            </span>
          </div>
          <div className="h-2 bg-sidebar-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sidebar-accent to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${coverage}%` }}
            />
          </div>
          <p className="text-[10px] text-sidebar-foreground opacity-60 mt-1.5">
            Proporção das estruturas avaliadas neste exame
          </p>
        </div>
      </div>
    </section>
  );
}