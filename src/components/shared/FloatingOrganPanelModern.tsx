import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import OrganSection from '@/components/original/OrganSection';
import type { Organ, Finding } from '@/data/organs';
import type { SelectedFinding, FindingInstance } from '@/types/report';
import { useDropdownGuard } from '@/hooks/useDropdownGuard';
import { useOutsidePointerDismiss } from '@/hooks/useOutsidePointerDismiss';

type FindingDetailsComponentProps = {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
};

type FloatingOrganPanelModernProps = {
  organ: Organ;
  selectedFindings: SelectedFinding[];
  isNormal: boolean;
  isMinimized: boolean;
  onToggleMinimized: (minimized: boolean) => void;
  onFindingChange: (
    organId: string,
    categoryId: string,
    findingId: string,
    checked: boolean,
    finding: Finding,
    severity?: string,
    instances?: FindingInstance[]
  ) => void;
  onNormalChange: (organId: string, isNormal: boolean) => void;
  tempDetails?: Record<string, { severity?: string; instances?: FindingInstance[] }>;
  onTempDetailsChange?: (
    organId: string,
    findingId: string,
    details: { severity?: string; instances?: FindingInstance[] }
  ) => void;
  leftCss?: string; // ex.: 'calc(25% + 1.5rem)'
  widthExpanded?: string; // default '24rem'
  maxHeight?: string; // default 'calc(80vh)'
  FindingDetailsComponent?: React.ComponentType<FindingDetailsComponentProps>;
};

export default function FloatingOrganPanelModern({
  organ,
  selectedFindings,
  isNormal,
  isMinimized,
  onToggleMinimized,
  onFindingChange,
  onNormalChange,
  tempDetails,
  onTempDetailsChange,
  leftCss = 'calc(25% + 1.5rem)',
  widthExpanded = '24rem',
  maxHeight = '80vh',
  FindingDetailsComponent
}: FloatingOrganPanelModernProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isAnyDropdownOpen } = useDropdownGuard();

  useOutsidePointerDismiss({
    containerRef: ref,
    isDisabled: isMinimized,
    isDropdownOpen: isAnyDropdownOpen,
    onDismiss: () => onToggleMinimized(true)
  });

  const panel = (
    <div
      ref={ref}
      className={`fixed top-24 organ-section-panel bg-white shadow-2xl border border-gray-200 rounded-2xl transition-all duration-300 ${
        isMinimized ? 'w-12' : 'overflow-y-auto modern-scrollbar'
      }`}
      style={{ left: leftCss, width: isMinimized ? undefined : widthExpanded, maxHeight }}
    >
      {isMinimized ? (
        <div
          onClick={() => onToggleMinimized(false)}
          className="p-3 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition-colors h-full rounded-2xl"
          title="Expandir painel"
        >
          <div className="mb-2 p-2">
            <CaretRight size={16} className="text-gray-700" />
          </div>
          <div className="writing-mode-vertical text-xs font-medium text-gray-900">
            {organ.name}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col text-gray-900">
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => onToggleMinimized(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
              title="Minimizar painel"
              aria-label="Minimizar painel"
            >
              <CaretLeft size={16} className="text-gray-700" />
            </button>
          </div>
          <div className="flex-1">
            <OrganSection
              organ={organ}
              selectedFindings={selectedFindings}
              onFindingChange={onFindingChange}
              onNormalChange={onNormalChange}
              isNormal={isNormal}
              tempDetails={tempDetails}
              onTempDetailsChange={onTempDetailsChange}
              FindingDetailsComponent={FindingDetailsComponent}
            />
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(panel, document.body);
}
