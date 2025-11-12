/**
 * Vertex V2 - Mammography Finding Details Component
 * Campos especializados para achados mamários com classificação BI-RADS
 *
 * @author Vertex Team
 * @date 2025-11-11
 */

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Finding } from '@/data/organs';
import { FindingMeasurement, FindingInstance } from '@/types/report';
import { Ruler, MapPin, Plus, X, Save, Activity } from 'lucide-react';
import {
  BREAST_QUADRANTS,
  BREAST_DEPTH,
  getBiradsColor
} from '@/data/mammographyOrgans';

interface MammographyFindingDetailsProps {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
}

/**
 * Componente para detalhes especializados de achados mamários
 * Renderiza campos dinâmicos baseados no tipo de achado e diretrizes BI-RADS
 */
export default function MammographyFindingDetails({
  finding,
  organId,
  severity,
  instances = [],
  onSeverityChange,
  onInstancesChange
}: MammographyFindingDetailsProps) {
  const [currentMeasurement, setCurrentMeasurement] = useState<FindingMeasurement>({});
  const [isEditing, setIsEditing] = useState(false);

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
              onChange={(e) => setCurrentMeasurement({...currentMeasurement, size: e.target.value})}
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
                onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, location: value})}
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
                onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, depth: value})}
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
              onChange={(e) => setCurrentMeasurement({...currentMeasurement, location: e.target.value})}
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
                  onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, [field.id]: value})}
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
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, [field.id]: e.target.value})}
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
              onChange={(e) => setCurrentMeasurement({...currentMeasurement, description: e.target.value})}
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
        </>
      )}
    </div>
  );
}
