import React, { useMemo } from 'react';
import { organs as defaultOrgans, type Organ } from '@/data/organs';
import { cn } from '@/lib/utils';
import { SelectedFinding } from '@/types/report';
import {
  Stethoscope,
  Drop,
  Grains,
  Heart,
  DropHalfBottom,
  Circle
} from '@phosphor-icons/react';

interface SidebarProps {
  selectedOrgan: string;
  onOrganSelect: (organId: string) => void;
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsList?: Organ[];
}

const iconMap = {
  liver: Stethoscope,
  drop: Drop,
  grain: Grains,
  kidney: Drop,
  oval: Circle,
  'drop-half-bottom': DropHalfBottom,
  heart: Heart,
  breast: Heart,
};

export default function Sidebar({
  selectedOrgan,
  onOrganSelect,
  selectedFindings,
  normalOrgans,
  organsList = defaultOrgans
}: SidebarProps) {

  const uniqueOrgansWithFindings = useMemo(() => {
    return new Set(selectedFindings.map(f => f.organId));
  }, [selectedFindings]);

  const uniqueNormalOrgans = useMemo(() => new Set(normalOrgans), [normalOrgans]);

  const totalOrgans = organsList.length;
  const coveredOrgans = uniqueOrgansWithFindings.size + uniqueNormalOrgans.size;
  const completion = totalOrgans > 0
    ? Math.min(100, Math.round((coveredOrgans / totalOrgans) * 100))
    : 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <nav className="p-4">
        {/* Examination Summary */}
        <div className="mb-6 space-y-3">
          <div className="bg-sidebar-muted/40 rounded-lg border border-white/5 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3
                  style={{ color: 'var(--sidebar-foreground)' }}
                  className="text-xs font-semibold uppercase tracking-wide opacity-70"
                >
                  Resumo do exame
                </h3>
                <p
                  style={{ color: 'var(--sidebar-foreground)' }}
                  className="text-[11px] opacity-60"
                >
                  Acompanhe o progresso do preenchimento
                </p>
              </div>
              <span className="text-sm font-semibold text-accent">{completion}%</span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--sidebar-foreground)' }} className="opacity-70">
                  Órgãos com achados
                </span>
                <span style={{ color: 'var(--sidebar-foreground)' }} className="font-medium">
                  {uniqueOrgansWithFindings.size}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--sidebar-foreground)' }} className="opacity-70">
                  Órgãos normais
                </span>
                <span style={{ color: 'var(--sidebar-foreground)' }} className="font-medium">
                  {uniqueNormalOrgans.size}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--sidebar-foreground)' }} className="opacity-70">
                  Achados registrados
                </span>
                <span style={{ color: 'var(--sidebar-foreground)' }} className="font-medium">
                  {selectedFindings.length}
                </span>
              </div>
            </div>

            <div className="mt-3 h-1.5 bg-sidebar-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Organs Section */}
        <h2 style={{ color: 'var(--sidebar-foreground)' }} className="text-sm font-medium mb-4 uppercase tracking-wide opacity-70">
          Órgãos
        </h2>

        <ul className="space-y-1">
          {organsList.map((organ) => {
            const IconComponent = iconMap[organ.icon as keyof typeof iconMap] || Stethoscope;
            const isSelected = selectedOrgan === organ.id;
            const organFindings = selectedFindings.filter(f => f.organId === organ.id);
            const hasFindings = organFindings.length > 0;
            const isNormal = normalOrgans.includes(organ.id);

            return (
              <li key={organ.id}>
                <div>
                  <button
                    onClick={() => onOrganSelect(organ.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-all duration-200",
                      isSelected
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "hover:bg-white/5"
                    )}
                    style={!isSelected ? { color: 'var(--sidebar-foreground)' } : {}}
                  >
                    <IconComponent
                      size={18}
                      className="flex-shrink-0"
                    />
                    <span className="font-medium flex-1 text-left">{organ.name}</span>
                    {hasFindings && (
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                    )}
                    {isNormal && (
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    )}
                  </button>

                  {/* Show findings details */}
                  {hasFindings && (
                    <div className="ml-7 mt-1 space-y-1 text-[10px]" style={{ color: 'var(--sidebar-foreground)' }}>
                      {organFindings.map(finding => (
                        <div key={finding.findingId} className="opacity-60">
                          <div className="flex items-start gap-1">
                            <span className="text-accent">•</span>
                            <div className="flex-1">
                              <span className="font-medium">{finding.finding.name}</span>
                              {finding.instances && finding.instances.length > 0 && (
                                <div className="mt-0.5 ml-2">
                                  {finding.instances.map((instance, idx) => (
                                    <div key={instance.id} className="text-[9px] opacity-80">
                                      {instance.measurements.size && (
                                        <span>Tam: {instance.measurements.size}</span>
                                      )}
                                      {instance.measurements.location && (
                                        <span className="ml-1">| {instance.measurements.location}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {!finding.instances && finding.severity && (
                                <span className="ml-2 text-[9px] uppercase opacity-80">
                                  ({finding.severity})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}