import React, { useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, CaretRight, ArrowLeft, ArrowRight } from '@phosphor-icons/react';
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
  observations?: string[];
  onAddObservation?: (organId: string, text: string) => void;
  onRemoveObservation?: (organId: string, index: number) => void;
  // Navegação entre órgãos
  onPreviousOrgan?: () => void;
  onNextOrgan?: () => void;
  hasPreviousOrgan?: boolean;
  hasNextOrgan?: boolean;
  currentOrganIndex?: number;
  totalOrgans?: number;
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
  FindingDetailsComponent,
  observations = [],
  onAddObservation,
  onRemoveObservation,
  onPreviousOrgan,
  onNextOrgan,
  hasPreviousOrgan = false,
  hasNextOrgan = false,
  currentOrganIndex,
  totalOrgans
}: FloatingOrganPanelModernProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isAnyDropdownOpen } = useDropdownGuard([ref]);

  useOutsidePointerDismiss({
    containerRef: ref,
    isDisabled: isMinimized,
    isDropdownOpen: isAnyDropdownOpen,
    onDismiss: () => onToggleMinimized(true)
  });

  // Atalhos de teclado para navegação
  const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
    if (isMinimized) return;

    // Não interferir se estiver em input/textarea
    const activeEl = document.activeElement;
    if (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft' && hasPreviousOrgan && onPreviousOrgan) {
      e.preventDefault();
      onPreviousOrgan();
    } else if (e.key === 'ArrowRight' && hasNextOrgan && onNextOrgan) {
      e.preventDefault();
      onNextOrgan();
    }
  }, [isMinimized, hasPreviousOrgan, hasNextOrgan, onPreviousOrgan, onNextOrgan]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyNavigation);
    return () => document.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  const panel = (
    <div
      ref={ref}
      className={`fixed top-24 organ-section-panel bg-white shadow-2xl border border-gray-200 rounded-2xl ${
        isMinimized 
          ? 'w-12 animate-slide-out-left' 
          : 'overflow-y-auto modern-scrollbar panel-expand'
      }`}
      style={{ 
        left: leftCss, 
        width: isMinimized ? undefined : widthExpanded, 
        maxHeight,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
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
          {/* Header com navegação */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50/50">
            {/* Botão anterior */}
            <button
              onClick={onPreviousOrgan}
              disabled={!hasPreviousOrgan}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Órgão anterior (←)"
              aria-label="Órgão anterior"
            >
              <ArrowLeft size={16} className="text-gray-600" />
            </button>

            {/* Indicador de posição */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                {organ.name}
              </span>
              {currentOrganIndex !== undefined && totalOrgans !== undefined && (
                <span className="text-[10px] text-gray-400 font-mono">
                  {currentOrganIndex + 1}/{totalOrgans}
                </span>
              )}
            </div>

            {/* Botões direita */}
            <div className="flex items-center gap-1">
              <button
                onClick={onNextOrgan}
                disabled={!hasNextOrgan}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Próximo órgão (→)"
                aria-label="Próximo órgão"
              >
                <ArrowRight size={16} className="text-gray-600" />
              </button>
              <button
                onClick={() => onToggleMinimized(true)}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                title="Minimizar painel"
                aria-label="Minimizar painel"
              >
                <CaretLeft size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <OrganSection
              organ={organ}
              selectedFindings={selectedFindings}
              onFindingChange={onFindingChange}
              onNormalChange={onNormalChange}
              isNormal={isNormal}
              tempDetails={tempDetails}
              onTempDetailsChange={onTempDetailsChange}
              FindingDetailsComponent={FindingDetailsComponent}
              observations={observations}
              onAddObservation={onAddObservation}
              onRemoveObservation={onRemoveObservation}
            />
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(panel, document.body);
}
