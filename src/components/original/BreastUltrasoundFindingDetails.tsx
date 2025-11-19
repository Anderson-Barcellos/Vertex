/**
 * Vertex V2 - Breast Ultrasound Finding Details Component
 * Campos especializados para achados de ultrassonografia mamária com classificação BI-RADS
 *
 * @author Vertex Team
 * @date 2025-11-13
 */

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Finding } from '@/data/organs';
import { FindingMeasurement, FindingInstance } from '@/types/report';
import { Ruler, MapPin, Plus, X, Save, Activity, Calculator, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import {
  BREAST_QUADRANTS,
  BREAST_DEPTH,
  CLOCK_POSITION,
  ELASTOGRAPHY_SCORES,
  getBiradsColor,
  calculateBiradsCategory
} from '@/data/breastUltrasoundOrgans';

interface BreastUltrasoundFindingDetailsProps {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
  // Novo: rascunho de medida não salva (preserva se o painel minimizar / checkbox desmarcar)
  draftMeasurement?: FindingMeasurement;
  onDraftMeasurementChange?: (draft: FindingMeasurement) => void;
}

/**
 * Componente para detalhes especializados de achados mamários
 * Renderiza campos dinâmicos baseados no tipo de achado e diretrizes BI-RADS
 */
export default function BreastUltrasoundFindingDetails({
  finding,
  organId,
  severity,
  instances = [],
  onSeverityChange,
  onInstancesChange,
  draftMeasurement,
  onDraftMeasurementChange
}: BreastUltrasoundFindingDetailsProps) {
  const [currentMeasurement, setCurrentMeasurement] = useState<FindingMeasurement>(draftMeasurement || {});
  const [isEditing, setIsEditing] = useState(false);

  // Reabrir automaticamente se houver rascunho não salvo
  useEffect(() => {
    if (!isEditing && draftMeasurement && Object.keys(draftMeasurement).length > 0) {
      setIsEditing(true);
      setCurrentMeasurement(draftMeasurement);
    }
  }, [draftMeasurement, isEditing]);

  // Detecta tipo de órgão
  const isMamaOrgan = organId.startsWith('mama-');
  const isLymphNodeOrgan = organId.startsWith('linfonodos-');

  // Detecta tipo específico de achado
  const isNodule = finding.id.includes('nodulo');
  const isCyst = finding.id.includes('cisto');
  const isCalcification = finding.id.includes('calcificacoes');
  const isLymphNode = finding.id.includes('linfonodo');

  /**
   * Adiciona nova instância de achado
   */
  const handleAddInstance = () => {
    // Valida se há dados preenchidos
    const hasData = currentMeasurement.size ||
                    currentMeasurement.location ||
                    currentMeasurement.description ||
                    Object.keys(currentMeasurement).some(key =>
                      !['size', 'location', 'description'].includes(key) && currentMeasurement[key as keyof FindingMeasurement]
                    );

    if (hasData) {
      const newInstance: FindingInstance = {
        id: Date.now().toString(),
        measurements: { ...currentMeasurement }
      };
      onInstancesChange([...instances, newInstance]);
      setCurrentMeasurement({});
      setIsEditing(false);
      onDraftMeasurementChange?.({});
    }
  };

  /**
   * Remove instância específica
   */
  const handleRemoveInstance = (id: string) => {
    onInstancesChange(instances.filter(inst => inst.id !== id));
  };

  /**
   * Renderiza lista de instâncias existentes
   */
  const renderInstances = () => {
    if (instances.length === 0) return null;

    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {instances.length} {instances.length === 1 ? 'lesão descrita' : 'lesões descritas'}:
        </p>
        {instances.map((instance, index) => {
          const biradsCategory = instance.measurements.biradsCategory;

          return (
            <div key={instance.id} className="bg-background p-2 rounded-md border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Lesão {index + 1}
                    </Badge>
                    {biradsCategory && (
                      <Badge className={`text-xs ${getBiradsColor(biradsCategory)}`}>
                        {biradsCategory.split(' - ')[0]}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInstance(instance.id)}
                      className="h-5 w-5 p-0 ml-auto"
                    >
                      <X size={12} />
                    </Button>
                  </div>

                  <div className="text-xs space-y-0.5 text-muted-foreground">
                    {instance.measurements.size && (
                      <p><span className="font-medium">Tamanho:</span> {instance.measurements.size}</p>
                    )}
                    {instance.measurements.location && (
                      <p><span className="font-medium">Localização:</span> {instance.measurements.location}</p>
                    )}
                    {instance.measurements.depth && (
                      <p><span className="font-medium">Profundidade:</span> {instance.measurements.depth}</p>
                    )}
                    {instance.measurements.distanceFromNipple && (
                      <p><span className="font-medium">Distância mamilo:</span> {instance.measurements.distanceFromNipple}</p>
                    )}

                    {/* Campos específicos de nódulos */}
                    {instance.measurements.shape && (
                      <p><span className="font-medium">Forma:</span> {instance.measurements.shape}</p>
                    )}
                    {instance.measurements.margins && (
                      <p><span className="font-medium">Margens:</span> {instance.measurements.margins}</p>
                    )}
                    {instance.measurements.orientation && (
                      <p><span className="font-medium">Orientação:</span> {instance.measurements.orientation}</p>
                    )}
                    {instance.measurements.echogenicity && (
                      <p><span className="font-medium">Ecogenicidade:</span> {instance.measurements.echogenicity}</p>
                    )}
                    {instance.measurements.posteriorFeatures && (
                      <p><span className="font-medium">Caract. Posteriores:</span> {instance.measurements.posteriorFeatures}</p>
                    )}
                    {instance.measurements.vascularization && (
                      <p><span className="font-medium">Vascularização:</span> {instance.measurements.vascularization}</p>
                    )}
                    {instance.measurements.resistivityIndex && (
                      <p><span className="font-medium">IR:</span> {instance.measurements.resistivityIndex}</p>
                    )}

                    {/* Campos específicos de cistos */}
                    {instance.measurements.internalContent && (
                      <p><span className="font-medium">Conteúdo:</span> {instance.measurements.internalContent}</p>
                    )}

                    {/* Campos específicos de calcificações */}
                    {instance.measurements.morphology && (
                      <p><span className="font-medium">Morfologia:</span> {instance.measurements.morphology}</p>
                    )}
                    {instance.measurements.distribution && (
                      <p><span className="font-medium">Distribuição:</span> {instance.measurements.distribution}</p>
                    )}

                    {/* Campos específicos de linfonodos */}
                    {instance.measurements.corticalThickness && (
                      <p><span className="font-medium">Espessura cortical:</span> {instance.measurements.corticalThickness}</p>
                    )}
                    {instance.measurements.hilusPresence && (
                      <p><span className="font-medium">Hilo:</span> {instance.measurements.hilusPresence}</p>
                    )}

                    {instance.measurements.description && (
                      <p><span className="font-medium">Obs:</span> {instance.measurements.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * Renderiza formulário de nova instância
   */
  const renderNewInstanceForm = () => {
    if (!isEditing && instances.length > 0) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="w-full h-7 text-xs"
        >
          <Plus size={12} className="mr-1" />
          Adicionar {instances.length > 0 ? 'outra lesão' : 'detalhes'}
        </Button>
      );
    }

    if (!isEditing && instances.length === 0) {
      // Auto-expand para primeira instância
      setIsEditing(true);
      return null;
    }

    return (
      <div className="space-y-2">
        {/* Size Input */}
        {finding.hasMeasurement && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
              <Ruler size={12} />
              Tamanho:
            </label>
              <Input
              type="text"
              placeholder="Ex: 1.2 x 0.8 cm"
                value={currentMeasurement.size || ''}
                onChange={(e) => {
                  const next = { ...currentMeasurement, size: e.target.value };
                  setCurrentMeasurement(next);
                  onDraftMeasurementChange?.(next);
                }}
              className="h-7 text-xs flex-1"
            />
          </div>
        )}

        {/* Location (Quadrant) - Apenas para mama */}
        {finding.hasLocation && isMamaOrgan && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                <MapPin size={12} />
                Quadrante:
              </label>
                <Select
                value={currentMeasurement.location || ''}
                  onValueChange={(value) => {
                    const next = { ...currentMeasurement, location: value };
                    setCurrentMeasurement(next);
                    onDraftMeasurementChange?.(next);
                  }}
              >
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {BREAST_QUADRANTS.map(option => (
                    <SelectItem key={option.value} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Depth (Profundidade) */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                Profundidade:
              </label>
              <Select
                value={currentMeasurement.depth || ''}
                onValueChange={(value) => {
                  const next = { ...currentMeasurement, depth: value };
                  setCurrentMeasurement(next);
                  onDraftMeasurementChange?.(next);
                }}
              >
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {BREAST_DEPTH.map(option => (
                    <SelectItem key={option.value} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Location genérica para linfonodos */}
        {finding.hasLocation && isLymphNodeOrgan && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
              Localização:
            </label>
            <Input
              type="text"
              placeholder="Ex: Nível I axilar"
              value={currentMeasurement.location || ''}
              onChange={(e) => {
                const next = { ...currentMeasurement, location: e.target.value };
                setCurrentMeasurement(next);
                onDraftMeasurementChange?.(next);
              }}
              className="h-7 text-xs flex-1"
            />
          </div>
        )}

        {/* extraFields dinâmicos */}
        {finding.extraFields?.map((field) => {
          if (typeof field === 'string') return null;

          return (
            <div key={field.id} className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                {field.label}:
              </label>
              {field.type === 'select' ? (
                <Select
                  value={(currentMeasurement as any)[field.id] || ''}
                  onValueChange={(value) => {
                    const next = { ...currentMeasurement, [field.id]: value } as FindingMeasurement;
                    setCurrentMeasurement(next);
                    onDraftMeasurementChange?.(next);
                  }}
                >
                  <SelectTrigger className="h-7 text-xs flex-1">
                    <SelectValue placeholder={field.placeholder || "Selecione..."} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {field.options?.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type === 'number' ? 'number' : 'text'}
                  placeholder={field.placeholder}
                  value={(currentMeasurement as any)[field.id] || ''}
                  onChange={(e) => {
                    const next = { ...currentMeasurement, [field.id]: e.target.value } as FindingMeasurement;
                    setCurrentMeasurement(next);
                    onDraftMeasurementChange?.(next);
                  }}
                  className="h-7 text-xs flex-1"
                />
              )}
            </div>
          );
        })}

        {/* Description */}
        {finding.hasDetails && (
          <div className="flex items-start gap-2">
            <label className="text-xs font-medium text-muted-foreground min-w-[80px] pt-1">
              Observações:
            </label>
            <textarea
              placeholder="Observações adicionais (opcional)"
              value={currentMeasurement.description || ''}
              onChange={(e) => {
                const next = { ...currentMeasurement, description: e.target.value };
                setCurrentMeasurement(next);
                onDraftMeasurementChange?.(next);
              }}
              className="flex-1 min-h-[40px] p-1.5 text-xs bg-background border rounded-md resize-none"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          {instances.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setCurrentMeasurement({});
              }}
              className="h-7 text-xs"
            >
              Cancelar
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={handleAddInstance}
            disabled={!currentMeasurement.size && !currentMeasurement.location && !currentMeasurement.description}
            className="h-7 text-xs"
          >
            <Save size={12} className="mr-1" />
            {instances.length > 0 ? 'Adicionar outra' : 'Salvar'}
          </Button>
        </div>
      </div>
    );
  };

  /**
   * Renderiza a calculadora BI-RADS inteligente
   */
  const renderBiradsCalculator = () => {
    // Só mostra para nódulos sólidos, complexos ou agrupamentos
    if (!isNodule || !currentMeasurement || Object.keys(currentMeasurement).length === 0) {
      return null;
    }

    const characteristics = {
      shape: currentMeasurement.shape as string,
      margins: currentMeasurement.margins as string,
      echogenicity: currentMeasurement.echogenicity as string,
      posteriorFeatures: currentMeasurement.posteriorFeatures as string,
      orientation: currentMeasurement.orientation as string,
      vascularization: currentMeasurement.vascularization as string,
      elastographyScore: currentMeasurement.elastographyScore as string,
      strainRatio: currentMeasurement.strainRatio as string,
      isComplex: finding.id.includes('complexo'),
      hasCalcifications: finding.id.includes('calcificacoes')
    };

    // Só calcula se tiver pelo menos 2 características
    const filledCharacteristics = Object.values(characteristics).filter(v => v && v !== '').length;
    if (filledCharacteristics < 2) {
      return null;
    }

    const calculation = calculateBiradsCategory(characteristics);

    const getConfidenceColor = (confidence: string) => {
      switch (confidence) {
        case 'high': return 'text-green-400';
        case 'medium': return 'text-yellow-400';
        case 'low': return 'text-red-400';
        default: return 'text-gray-400';
      }
    };

    const getConfidenceIcon = (confidence: string) => {
      switch (confidence) {
        case 'high': return <CheckCircle size={12} className="text-green-400" />;
        case 'medium': return <AlertTriangle size={12} className="text-yellow-400" />;
        case 'low': return <Info size={12} className="text-red-400" />;
        default: return <Info size={12} className="text-gray-400" />;
      }
    };

    return (
      <div className="space-y-2 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <Calculator size={14} className="text-blue-400" />
          <span className="text-xs font-medium text-blue-400">Calculadora BI-RADS</span>
        </div>

        <div className="bg-background/50 rounded-md p-2 space-y-2">
          {/* Sugestão */}
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getBiradsColor(calculation.suggestedCategory)}`}>
              {calculation.suggestedCategory.split(' - ')[0]}
            </Badge>
            <div className="flex items-center gap-1">
              {getConfidenceIcon(calculation.confidence)}
              <span className={`text-xs ${getConfidenceColor(calculation.confidence)}`}>
                {calculation.confidence === 'high' ? 'Alta confiança' : 
                 calculation.confidence === 'medium' ? 'Média confiança' : 'Baixa confiança'}
              </span>
            </div>
          </div>

          {/* Alertas */}
          {calculation.alerts.length > 0 && (
            <div className="space-y-1">
              {calculation.alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-1">
                  <AlertTriangle size={10} className="text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-orange-400">{alert}</span>
                </div>
              ))}
            </div>
          )}

          {/* Raciocínio */}
          {calculation.reasoning.length > 0 && (
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-muted-foreground">Análise:</span>
              <ul className="space-y-0.5">
                {calculation.reasoning.map((reason, index) => (
                  <li key={index} className="text-xs text-muted-foreground pl-2">• {reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Botão para aplicar sugestão */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentMeasurement({
                  ...currentMeasurement,
                  biradsCategory: calculation.suggestedCategory
                });
              }}
              className="h-6 text-xs"
            >
              Aplicar sugestão
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="ml-6 mt-2 p-3 bg-muted/50 rounded-md space-y-3 border-l-2 border-accent max-h-[calc(100vh-400px)] overflow-y-auto modern-scrollbar"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {renderInstances()}

      {(finding.hasMeasurement || finding.hasLocation || finding.hasDetails) && (
        <>
          {instances.length > 0 && <div className="border-t border-border pt-2" />}
          {renderNewInstanceForm()}
          {renderBiradsCalculator()}
        </>
      )}
    </div>
  );
}
