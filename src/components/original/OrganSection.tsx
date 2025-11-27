import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Organ, Finding } from '@/data/organs';
import { SelectedFinding, FindingInstance } from '@/types/report';
import FindingDetailsEnhanced from './FindingDetailsEnhanced';
import ObservationInput from './ObservationInput';

interface OrganSectionProps {
  organ: Organ;
  selectedFindings: SelectedFinding[];
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
  isNormal: boolean;
  tempDetails?: Record<string, { severity?: string; instances?: FindingInstance[] }>;
  onTempDetailsChange?: (
    organId: string,
    findingId: string,
    details: { severity?: string; instances?: FindingInstance[] }
  ) => void;
  FindingDetailsComponent?: React.ComponentType<{
    finding: Finding;
    organId: string;
    severity?: string;
    instances?: FindingInstance[];
    onSeverityChange: (severity: string) => void;
    onInstancesChange: (instances: FindingInstance[]) => void;
  }>;
  observations?: string[];
  onAddObservation?: (organId: string, text: string) => void;
  onRemoveObservation?: (organId: string, index: number) => void;
}

export default function OrganSection({
  organ,
  selectedFindings,
  onFindingChange,
  onNormalChange,
  isNormal,
  tempDetails = {},
  onTempDetailsChange,
  FindingDetailsComponent = FindingDetailsEnhanced,
  observations = [],
  onAddObservation,
  onRemoveObservation
}: OrganSectionProps) {
  // Use tempDetails from props if available, fallback to local state
  const [localFindingDetails, setLocalFindingDetails] = useState<Record<string, {
    severity?: string;
    instances?: FindingInstance[];
  }>>({});

  // Usar tempDetails das props se disponível, senão usar estado local
  const findingDetails = onTempDetailsChange ? tempDetails : localFindingDetails;

  // Estado para rastrear qual finding está sendo editado (para Ctrl+Enter)
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ctrl+Enter para adicionar o achado ativo
  const handleCtrlEnter = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      // Verificar se o foco está dentro deste componente
      if (!containerRef.current?.contains(document.activeElement)) return;

      e.preventDefault();

      // Encontrar o finding ativo baseado no elemento focado
      const activeElement = document.activeElement as HTMLElement;
      const findingContainer = activeElement?.closest('[data-finding-id]');
      const findingId = findingContainer?.getAttribute('data-finding-id');

      if (findingId) {
        // Encontrar o finding e category correspondentes
        for (const category of organ.categories) {
          const finding = category.findings.find(f => f.id === findingId);
          if (finding) {
            const isSelected = isFindingSelected(findingId);
            if (!isSelected) {
              // Adicionar o achado
              handleFindingToggle(category.id, finding, true);
              toast.success(`✓ ${finding.name} adicionado`, { duration: 2000 });
            } else {
              toast.info(`${finding.name} já está na lista`, { duration: 1500 });
            }
            break;
          }
        }
      }
    }
  }, [organ.categories]);

  useEffect(() => {
    document.addEventListener('keydown', handleCtrlEnter);
    return () => document.removeEventListener('keydown', handleCtrlEnter);
  }, [handleCtrlEnter]);

  const isFindingSelected = (findingId: string) => {
    return selectedFindings.some(sf => sf.findingId === findingId && sf.organId === organ.id);
  };

  const hasAnyFindingSelected = selectedFindings.some(sf => sf.organId === organ.id);

  const handleFindingToggle = (
    categoryId: string,
    finding: Finding,
    checked: boolean
  ) => {
    const details = findingDetails[finding.id] || {};
    onFindingChange(
      organ.id,
      categoryId,
      finding.id,
      checked,
      finding,
      details.severity || finding.severity,
      details.instances
    );

    // NÃO limpar os detalhes quando desmarcado - mantém o estado temporário
    // Isso permite que o usuário remarque o finding e mantenha os dados
  };

  const handleSeverityChange = (findingId: string, finding: Finding, categoryId: string, severity: string) => {
    const newDetails = {
      ...findingDetails[findingId],
      severity
    };
    
    if (onTempDetailsChange) {
      onTempDetailsChange(organ.id, findingId, newDetails);
    } else {
      setLocalFindingDetails(prev => ({
        ...prev,
        [findingId]: newDetails
      }));
    }

    // Update the finding if it's already selected
    if (isFindingSelected(findingId)) {
      onFindingChange(
        organ.id,
        categoryId,
        findingId,
        true,
        finding,
        severity,
        newDetails.instances
      );
    }
  };

  const handleInstancesChange = (findingId: string, finding: Finding, categoryId: string, instances: FindingInstance[]) => {
    const newDetails = {
      ...findingDetails[findingId],
      instances
    };
    
    if (onTempDetailsChange) {
      onTempDetailsChange(organ.id, findingId, newDetails);
    } else {
      setLocalFindingDetails(prev => ({
        ...prev,
        [findingId]: newDetails
      }));
    }

    // Update the finding if it's already selected
    if (isFindingSelected(findingId)) {
      onFindingChange(
        organ.id,
        categoryId,
        findingId,
        true,
        finding,
        newDetails.severity || finding.severity,
        instances
      );
    }
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col max-h-full">
      {/* Header compacto com background */}
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex-shrink-0">
        <h2 className="text-lg font-semibold">{organ.name}</h2>
        <p className="text-sm opacity-90">Achados ultrassonográficos</p>
      </div>

      {/* Conteúdo scrollável */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/30 rounded-lg">
          <Checkbox
            id={`${organ.id}-normal`}
            checked={isNormal && !hasAnyFindingSelected}
            onCheckedChange={(checked) => onNormalChange(organ.id, checked as boolean)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor={`${organ.id}-normal`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Dentro da normalidade
          </label>
        </div>

        {!isNormal && (
          <div className="space-y-4">
            {organ.categories.map((category) => (
              <div key={category.id} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-1">
                  {category.name}
                </h3>

                <div className="space-y-2">
                  {category.findings.map((finding) => {
                    const isSelected = isFindingSelected(finding.id);
                    const details = findingDetails[finding.id] || {};
                    const instanceCount = details.instances?.length || 0;

                    return (
                      <div key={finding.id} data-finding-id={finding.id}>
                        <div
                          className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/30 transition-colors"
                        >
                          <Checkbox
                            id={finding.id}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleFindingToggle(category.id, finding, checked as boolean)
                            }
                            className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor={finding.id}
                                className="text-xs font-medium leading-none cursor-pointer"
                              >
                                {finding.name}
                              </label>
                              {finding.hasSeverity && details.severity && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  {details.severity}
                                </Badge>
                              )}
                              {instanceCount > 0 && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {instanceCount} {instanceCount === 1 ? 'lesão' : 'lesões'}
                                </Badge>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground leading-tight">
                              {finding.description}
                            </p>
                          </div>
                        </div>

                        {/* Show enhanced details form when selected and has special fields */}
                        {isSelected && (finding.hasSeverity || finding.hasMeasurement || finding.hasLocation || finding.hasQuantity || (finding.extraFields && finding.extraFields.length > 0)) && (
                          <FindingDetailsComponent
                            finding={finding}
                            organId={organ.id}
                            severity={details.severity || finding.severity}
                            instances={details.instances || []}
                            onSeverityChange={(severity) => handleSeverityChange(finding.id, finding, category.id, severity)}
                            onInstancesChange={(instances) => handleInstancesChange(finding.id, finding, category.id, instances)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {onAddObservation && onRemoveObservation && (
          <ObservationInput
            organId={organ.id}
            observations={observations}
            onAddObservation={onAddObservation}
            onRemoveObservation={onRemoveObservation}
          />
        )}
      </div>
    </div>
  );
}