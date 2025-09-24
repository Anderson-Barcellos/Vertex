import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Organ, Finding } from '@/data/organs';
import { SelectedFinding, FindingInstance } from '@/types/report';
import FindingDetailsEnhanced from './FindingDetailsEnhanced';

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
}

export default function OrganSection({
  organ,
  selectedFindings,
  onFindingChange,
  onNormalChange,
  isNormal
}: OrganSectionProps) {
  // Local state for finding details
  const [findingDetails, setFindingDetails] = useState<Record<string, {
    severity?: string;
    instances?: FindingInstance[];
  }>>({});

  const isFindingSelected = (findingId: string) => {
    return selectedFindings.some(sf => sf.findingId === findingId);
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

    // Clear details if unchecked
    if (!checked) {
      const newDetails = { ...findingDetails };
      delete newDetails[finding.id];
      setFindingDetails(newDetails);
    }
  };

  const handleSeverityChange = (findingId: string, finding: Finding, categoryId: string, severity: string) => {
    const newDetails = {
      ...findingDetails,
      [findingId]: {
        ...findingDetails[findingId],
        severity
      }
    };
    setFindingDetails(newDetails);

    // Update the finding if it's already selected
    if (isFindingSelected(findingId)) {
      onFindingChange(
        organ.id,
        categoryId,
        findingId,
        true,
        finding,
        severity,
        newDetails[findingId].instances
      );
    }
  };

  const handleInstancesChange = (findingId: string, finding: Finding, categoryId: string, instances: FindingInstance[]) => {
    const newDetails = {
      ...findingDetails,
      [findingId]: {
        ...findingDetails[findingId],
        instances
      }
    };
    setFindingDetails(newDetails);

    // Update the finding if it's already selected
    if (isFindingSelected(findingId)) {
      onFindingChange(
        organ.id,
        categoryId,
        findingId,
        true,
        finding,
        newDetails[findingId].severity || finding.severity,
        instances
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header compacto com background */}
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">{organ.name}</h2>
        <p className="text-sm opacity-90">Achados ultrassonográficos</p>
      </div>

      {/* Conteúdo scrollável */}
      <div className="flex-1 p-4 overflow-y-auto">
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
                      <div key={finding.id}>
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
                        {isSelected && (finding.hasSeverity || finding.hasMeasurement || finding.hasLocation || finding.hasQuantity) && (
                          <FindingDetailsEnhanced
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
      </div>
    </div>
  );
}