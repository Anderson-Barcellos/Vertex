import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Finding } from '@/data/organs';
import { FindingMeasurement, FindingInstance } from '@/types/report';
import { Ruler, MapPin, Hash, Plus, X, Save } from 'lucide-react';

interface FindingDetailsEnhancedProps {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
}

const LIVER_SEGMENTS = [
  { value: 'I', label: 'Segmento I (Caudado)' },
  { value: 'II', label: 'Segmento II' },
  { value: 'III', label: 'Segmento III' },
  { value: 'IV', label: 'Segmento IV' },
  { value: 'IVa', label: 'Segmento IVa' },
  { value: 'IVb', label: 'Segmento IVb' },
  { value: 'V', label: 'Segmento V' },
  { value: 'VI', label: 'Segmento VI' },
  { value: 'VII', label: 'Segmento VII' },
  { value: 'VIII', label: 'Segmento VIII' },
];

const KIDNEY_LOCATIONS = [
  { value: 'superior', label: 'Polo Superior' },
  { value: 'medio', label: 'Terço Médio' },
  { value: 'inferior', label: 'Polo Inferior' },
  { value: 'cortical', label: 'Cortical' },
  { value: 'medular', label: 'Medular' },
  { value: 'calice', label: 'Cálice' },
  { value: 'pelve', label: 'Pelve Renal' },
];

const PANCREAS_LOCATIONS = [
  { value: 'cabeca', label: 'Cabeça' },
  { value: 'processo-uncinado', label: 'Processo Uncinado' },
  { value: 'colo', label: 'Colo' },
  { value: 'corpo', label: 'Corpo' },
  { value: 'cauda', label: 'Cauda' },
];

const BLADDER_LOCATIONS = [
  { value: 'cupula', label: 'Cúpula Vesical' },
  { value: 'parede-lateral', label: 'Parede Lateral' },
  { value: 'parede-posterior', label: 'Parede Posterior' },
  { value: 'trigono', label: 'Trígono' },
  { value: 'colo', label: 'Colo Vesical' },
];

const AORTA_LOCATIONS = [
  { value: 'suprarrenal', label: 'Porção Suprarrenal' },
  { value: 'justarrenal', label: 'Porção Justarrenal' },
  { value: 'infrarrenal', label: 'Porção Infrarrenal' },
  { value: 'bifurcacao', label: 'Bifurcação' },
  { value: 'iliaca', label: 'Ilíaca' },
];

export default function FindingDetailsEnhanced({
  finding,
  organId,
  severity,
  instances = [],
  onSeverityChange,
  onInstancesChange
}: FindingDetailsEnhancedProps) {
  // Local state for the current form
  const [currentMeasurement, setCurrentMeasurement] = useState<FindingMeasurement>({});
  const [isEditing, setIsEditing] = useState(false);
  const [extraFieldValues, setExtraFieldValues] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (instances.length > 0 && instances[0].measurements) {
      const measurements = instances[0].measurements as Record<string, string>;
      const extraKeys = (finding.extraFields || []).map(f => typeof f === 'string' ? f : f.id);
      const extraData: Record<string, string> = {};
      extraKeys.forEach(key => {
        if (measurements[key]) extraData[key] = measurements[key];
      });
      if (Object.keys(extraData).length > 0) {
        setExtraFieldValues(extraData);
      }
    }
  }, [instances, finding.extraFields]);

  const handleAddInstance = () => {
    if (currentMeasurement.size || currentMeasurement.segment || currentMeasurement.location) {
      const newInstance: FindingInstance = {
        id: Date.now().toString(),
        measurements: { ...currentMeasurement }
      };
      onInstancesChange([...instances, newInstance]);
      setCurrentMeasurement({});
      setIsEditing(false);
    }
  };

  const handleRemoveInstance = (id: string) => {
    onInstancesChange(instances.filter(inst => inst.id !== id));
  };

  const getLocationOptions = () => {
    if (organId === 'figado') return LIVER_SEGMENTS;
    if (organId === 'rins' || organId === 'rim-direito' || organId === 'rim-esquerdo') return KIDNEY_LOCATIONS;
    if (organId === 'pancreas') return PANCREAS_LOCATIONS;
    if (organId === 'bexiga') return BLADDER_LOCATIONS;
    if (organId === 'aorta') return AORTA_LOCATIONS;
    return [];
  };

  const locationOptions = getLocationOptions();

  return (
    <div
      className="ml-6 mt-2 p-3 bg-muted/50 rounded-md space-y-3 border-l-2 border-accent max-h-[calc(100vh-400px)] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Severity Dropdown */}
      {finding.hasSeverity && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
            Grau:
          </label>
          <Select
            value={severity || 'leve'}
            onValueChange={onSeverityChange}
          >
            <SelectTrigger className="h-7 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              <SelectItem value="leve">Leve</SelectItem>
              <SelectItem value="moderado">Moderado</SelectItem>
              <SelectItem value="acentuado">Acentuado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Existing Instances */}
      {instances.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Lesões descritas:</p>
          {instances.map((instance, index) => (
            <div key={instance.id} className="bg-background p-2 rounded-md border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Lesão {index + 1}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInstance(instance.id)}
                      className="h-5 w-5 p-0"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                  <div className="text-xs space-y-0.5">
                    {instance.measurements.size && (
                      <p><span className="text-muted-foreground">Tamanho:</span> {instance.measurements.size}</p>
                    )}
                    {instance.measurements.segment && (
                      <p><span className="text-muted-foreground">Segmento:</span> {instance.measurements.segment}</p>
                    )}
                    {instance.measurements.location && (
                      <p><span className="text-muted-foreground">Localização:</span> {instance.measurements.location}</p>
                    )}
                    {instance.measurements.description && (
                      <p><span className="text-muted-foreground">Obs:</span> {instance.measurements.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {finding.extraFields && finding.extraFields.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/30">
          {finding.extraFields.map((field) => {
            if (typeof field === 'string') return null;
            const { id, label, type, options, placeholder } = field;

            if (type === 'select' && options) {
              return (
                <div key={id} className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                    {label}:
                  </label>
                  <Select
                    value={extraFieldValues[id] || ''}
                    onValueChange={(value) => {
                      const newValues = { ...extraFieldValues, [id]: value };
                      setExtraFieldValues(newValues);
                      const newInstance: FindingInstance = {
                        id: instances.length > 0 ? instances[0].id : Date.now().toString(),
                        measurements: { ...newValues }
                      };
                      onInstancesChange([newInstance]);
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs flex-1">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {options.map((opt: string) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }

            if (type === 'textarea') {
              return (
                <div key={id} className="flex items-start gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px] pt-1">
                    {label}:
                  </label>
                  <Textarea
                    placeholder={placeholder || ''}
                    value={extraFieldValues[id] || ''}
                    onChange={(e) => {
                      const newValues = { ...extraFieldValues, [id]: e.target.value };
                      setExtraFieldValues(newValues);
                    }}
                    onBlur={() => {
                      const hasData = Object.values(extraFieldValues).some(v => v && v.trim() !== '');
                      if (hasData) {
                        const newInstance: FindingInstance = {
                          id: instances.length > 0 ? instances[0].id : Date.now().toString(),
                          measurements: { ...extraFieldValues }
                        };
                        onInstancesChange([newInstance]);
                      }
                    }}
                    className="flex-1 min-h-[60px] text-xs resize-none"
                  />
                </div>
              );
            }

            return (
              <div key={id} className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                  {label}:
                </label>
                <Input
                  type="text"
                  placeholder={placeholder || ''}
                  value={extraFieldValues[id] || ''}
                  onChange={(e) => {
                    const newValues = { ...extraFieldValues, [id]: e.target.value };
                    setExtraFieldValues(newValues);
                  }}
                  onBlur={() => {
                    const hasData = Object.values(extraFieldValues).some(v => v && v.trim() !== '');
                    if (hasData) {
                      const newInstance: FindingInstance = {
                        id: instances.length > 0 ? instances[0].id : Date.now().toString(),
                        measurements: { ...extraFieldValues }
                      };
                      onInstancesChange([newInstance]);
                    }
                  }}
                  className="h-7 text-xs flex-1"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* New Instance Form */}
      {(finding.hasMeasurement || finding.hasLocation) && (
        <div className="space-y-2">
          {!isEditing && instances.length === 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="w-full h-7 text-xs"
            >
              <Plus size={12} className="mr-1" />
              Adicionar detalhes
            </Button>
          ) : isEditing || instances.length === 0 ? (
            <>
              {/* Size Input */}
              {finding.hasMeasurement && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                    <Ruler size={12} />
                    Tamanho:
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: 2.5 x 1.8 cm"
                    value={currentMeasurement.size || ''}
                    onChange={(e) => setCurrentMeasurement({...currentMeasurement, size: e.target.value})}
                    className="h-7 text-xs flex-1"
                  />
                </div>
              )}

              {/* Location/Segment Dropdown */}
              {finding.hasLocation && locationOptions.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                    <MapPin size={12} />
                    {organId === 'figado' ? 'Segmento:' : 'Localização:'}
                  </label>
                  <Select
                    value={currentMeasurement.segment || currentMeasurement.location || ''}
                    onValueChange={(value) => {
                      if (organId === 'figado') {
                        setCurrentMeasurement({...currentMeasurement, segment: value});
                      } else {
                        setCurrentMeasurement({...currentMeasurement, location: value});
                      }
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs flex-1">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {locationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Custom Location Input (fallback) */}
              {finding.hasLocation && locationOptions.length === 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                    <MapPin size={12} />
                    Localização:
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: Região central"
                    value={currentMeasurement.location || ''}
                    onChange={(e) => setCurrentMeasurement({...currentMeasurement, location: e.target.value})}
                    className="h-7 text-xs flex-1"
                  />
                </div>
              )}

              {/* Description */}
              <div className="flex items-start gap-2">
                <label className="text-xs font-medium text-muted-foreground min-w-[80px] pt-1">
                  Obs:
                </label>
                <textarea
                  placeholder="Observações adicionais (opcional)"
                  value={currentMeasurement.description || ''}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, description: e.target.value})}
                  className="flex-1 min-h-[40px] p-1.5 text-xs bg-background border rounded-md resize-none"
                />
              </div>

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
                  disabled={!currentMeasurement.size && !currentMeasurement.segment && !currentMeasurement.location}
                  className="h-7 text-xs"
                >
                  <Save size={12} className="mr-1" />
                  {instances.length > 0 ? 'Adicionar outra' : 'Salvar'}
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="w-full h-7 text-xs"
            >
              <Plus size={12} className="mr-1" />
              Adicionar outra lesão
            </Button>
          )}
        </div>
      )}
    </div>
  );
}