import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { organs as defaultOrgans, type Organ } from '@/data/organs';
import { cn } from '@/lib/utils';
import { SelectedFinding } from '@/types/report';
import {
  Stethoscope,
  Drop,
  Grains,
  Heart,
  DropHalfBottom,
  Circle,
  CheckCircle,
  CaretDown,
  CaretRight
} from '@phosphor-icons/react';

export interface OrganGroup {
  id: string;
  name: string;
  organIds: string[];
}

interface SidebarProps {
  selectedOrgan: string;
  onOrganSelect: (organId: string) => void;
  onNormalChange?: (organId: string, isNormal: boolean) => void;
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsList?: Organ[];
  showSummary?: boolean;
  organGroups?: OrganGroup[];
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
  onNormalChange,
  selectedFindings,
  normalOrgans,
  organsList = defaultOrgans,
  showSummary = true,
  organGroups
}: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    if (!organGroups) return new Set();
    return new Set(organGroups.map(g => g.id));
  });

  const uniqueOrgansWithFindings = useMemo(() => {
    return new Set(selectedFindings.map(f => f.organId));
  }, [selectedFindings]);

  const uniqueNormalOrgans = useMemo(() => new Set(normalOrgans), [normalOrgans]);

  const groupedOrganIds = useMemo(() => {
    if (!organGroups) return new Set<string>();
    return new Set(organGroups.flatMap(g => g.organIds));
  }, [organGroups]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const getGroupStatus = (group: OrganGroup) => {
    const groupOrgans = organsList.filter(o => group.organIds.includes(o.id));
    const hasFindings = groupOrgans.some(o => uniqueOrgansWithFindings.has(o.id));
    const allNormal = groupOrgans.every(o => uniqueNormalOrgans.has(o.id));
    const someNormal = groupOrgans.some(o => uniqueNormalOrgans.has(o.id));
    return { hasFindings, allNormal, someNormal };
  };

  const formatOrganLabel = (organ: Organ, group: OrganGroup) => {
    const name = organ.name.toLowerCase();
    if (name.includes('direita') || name.includes('direito')) return 'Direita';
    if (name.includes('esquerda') || name.includes('esquerdo')) return 'Esquerda';
    return organ.name.replace(group.name, '').trim() || organ.name;
  };

  const totalOrgans = organsList.length;
  const coveredOrgans = uniqueOrgansWithFindings.size + uniqueNormalOrgans.size;
  const completion = totalOrgans > 0
    ? Math.min(100, Math.round((coveredOrgans / totalOrgans) * 100))
    : 0;

  return (
    <div className="flex-1 overflow-y-auto" data-sidebar>
      <nav
        className="p-4"
        role="navigation"
        aria-label="Navegação de órgãos do exame">
        {/* Examination Summary */}
        {showSummary && (
          <div className="mb-6 space-y-3">
            <div className="bg-sidebar-muted/40 rounded-lg border border-white/5 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                {/* Progress Circle */}
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-full h-full progress-circle" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      className="progress-circle-bg"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      className="progress-circle-fill stroke-current text-accent"
                      strokeWidth="3"
                      strokeDasharray="97.4"
                      strokeDashoffset={97.4 - (completion * 0.974)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn("text-xs font-bold text-accent", completion > 0 && "count-up")} key={completion}>{completion}%</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 space-y-1.5">
                  <h3
                    style={{ color: 'var(--sidebar-foreground)' }}
                    className="text-xs font-semibold uppercase tracking-wide opacity-70"
                  >
                    Progresso
                  </h3>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span style={{ color: 'var(--sidebar-foreground)' }} className="opacity-80">
                        {uniqueOrgansWithFindings.size} com achados
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span style={{ color: 'var(--sidebar-foreground)' }} className="opacity-80">
                        {uniqueNormalOrgans.size} normais
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Organs Section */}
        <h2 style={{ color: 'var(--sidebar-foreground)' }} className="text-sm font-medium mb-4 uppercase tracking-wide opacity-70">
          Órgãos
        </h2>

        <ul className="space-y-1">
          {organGroups?.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            const { hasFindings, allNormal, someNormal } = getGroupStatus(group);
            const groupOrgans = organsList.filter(o => group.organIds.includes(o.id));
            const CaretIcon = isExpanded ? CaretDown : CaretRight;

            return (
              <li key={group.id} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all",
                    "hover:bg-white/5",
                    (hasFindings || someNormal) && "bg-white/[0.02]"
                  )}
                  style={{ color: 'var(--sidebar-foreground)' }}
                >
                  <CaretIcon size={14} className="flex-shrink-0 opacity-50" />
                  <span className="font-medium flex-1 text-left">{group.name}</span>
                  {hasFindings && (
                    <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                  )}
                  {allNormal && (
                    <CheckCircle size={16} weight="fill" className="text-green-500 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <ul className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-2">
                    {groupOrgans.map((organ) => {
                      const isSelected = selectedOrgan === organ.id;
                      const organHasFindings = uniqueOrgansWithFindings.has(organ.id);
                      const isNormal = uniqueNormalOrgans.has(organ.id);
                      const label = formatOrganLabel(organ, group);

                      return (
                        <li key={organ.id}>
                          <div className="flex items-center gap-1">
                            {onNormalChange && !organ.hideNormalOption && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newState = !isNormal;
                                  onNormalChange(organ.id, newState);
                                  if (newState) {
                                    toast.success(`${organ.name} marcado como normal`, { duration: 2000 });
                                  }
                                }}
                                className={cn(
                                  "p-1 rounded-md transition-all",
                                  isNormal
                                    ? "text-green-500 hover:bg-green-500/10"
                                    : "text-sidebar-foreground/30 hover:text-green-500 hover:bg-white/5"
                                )}
                                title={isNormal ? "Remover normal" : "Marcar como normal"}
                              >
                                <CheckCircle size={16} weight={isNormal ? "fill" : "regular"} />
                              </button>
                            )}
                            <button
                              onClick={() => onOrganSelect(organ.id)}
                              className={cn(
                                "flex-1 flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-all",
                                isSelected
                                  ? "bg-accent text-accent-foreground shadow-sm"
                                  : "hover:bg-white/5"
                              )}
                              style={!isSelected ? { color: 'var(--sidebar-foreground)' } : {}}
                            >
                              <span className="flex-1 text-left">{label}</span>
                              {organHasFindings && (
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                              )}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}

          {organsList.filter(o => !groupedOrganIds.has(o.id)).map((organ) => {
            const IconComponent = iconMap[organ.icon as keyof typeof iconMap] || Stethoscope;
            const isSelected = selectedOrgan === organ.id;
            const organFindings = selectedFindings.filter(f => f.organId === organ.id);
            const hasFindings = organFindings.length > 0;
            const isNormal = normalOrgans.includes(organ.id);

            return (
              <li key={organ.id}>
                <div className="flex items-center gap-1">
                  {onNormalChange && !organ.hideNormalOption && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newState = !isNormal;
                        onNormalChange(organ.id, newState);
                        if (newState) {
                          toast.success(`${organ.name} marcado como normal`, { duration: 2000 });
                        }
                      }}
                      className={cn(
                        "p-1.5 rounded-md transition-all",
                        isNormal
                          ? "text-green-500 hover:bg-green-500/10"
                          : "text-sidebar-foreground/30 hover:text-green-500 hover:bg-white/5"
                      )}
                      title={isNormal ? "Remover normal" : "Marcar como normal"}
                      aria-label={isNormal ? `Remover ${organ.name} como normal` : `Marcar ${organ.name} como normal`}
                      aria-pressed={isNormal}
                    >
                      <CheckCircle
                        size={18}
                        weight={isNormal ? "fill" : "regular"}
                      />
                    </button>
                  )}

                  <button
                    onClick={() => onOrganSelect(organ.id)}
                    className={cn(
                      "flex-1 flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-all duration-200",
                      isSelected
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "hover:bg-white/5"
                    )}
                    style={!isSelected ? { color: 'var(--sidebar-foreground)' } : {}}
                    aria-label={`Selecionar ${organ.name} para examinação`}
                    aria-current={isSelected ? 'true' : 'false'}
                  >
                    <IconComponent
                      size={18}
                      className="flex-shrink-0"
                    />
                    <span className="font-medium flex-1 text-left">{organ.name}</span>
                    {hasFindings && (
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
