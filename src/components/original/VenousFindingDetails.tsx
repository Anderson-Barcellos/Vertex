import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Finding } from '@/data/organs';
import { FindingMeasurement, FindingInstance } from '@/types/report';
import { Ruler, MapPin, Activity, Plus, X, Save, Droplet, AlertTriangle } from 'lucide-react';
import {
  COMMON_FEMORAL_LOCATIONS,
  FEMORAL_VEIN_LOCATIONS,
  POPLITEAL_LOCATIONS,
  SAPHENOUS_LOCATIONS,
  SMALL_SAPHENOUS_LOCATIONS,
  TIBIAL_LOCATIONS,
  PERFORATOR_LOCATIONS,
  THROMBUS_TYPE,
  THROMBUS_ECHOGENICITY,
  COMPRESSIBILITY,
  REFLUX_DURATION,
  CHRONIC_FINDINGS
} from '@/data/venousOrgans';

interface VenousFindingDetailsProps {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
}

const VenousFindingDetails: React.FC<VenousFindingDetailsProps> = ({
  finding,
  organId,
  severity,
  instances = [],
  onSeverityChange,
  onInstancesChange
}) => {
  const [editingInstance, setEditingInstance] = useState<FindingInstance | null>(null);
  const [showInstanceForm, setShowInstanceForm] = useState(false);

  // Determina localizações baseado no órgão
  const getLocationsForOrgan = (): string[] => {
    switch (organId) {
      case 'femoral-comum':
        return COMMON_FEMORAL_LOCATIONS;
      case 'femoral-superficial':
        return FEMORAL_VEIN_LOCATIONS;
      case 'poplitea':
        return POPLITEAL_LOCATIONS;
      case 'safena-magna':
        return SAPHENOUS_LOCATIONS;
      case 'safena-parva':
        return SMALL_SAPHENOUS_LOCATIONS;
      case 'veias-tibiais':
        return TIBIAL_LOCATIONS;
      case 'veias-perfurantes':
        return PERFORATOR_LOCATIONS;
      default:
        return finding.locations || [];
    }
  };

  const handleAddInstance = () => {
    const newInstance: FindingInstance = {
      id: crypto.randomUUID(),
      location: finding.requiresLocation ? getLocationsForOrgan()[0] : undefined,
      measurements: finding.measurements?.reduce((acc, m) => {
        acc[m.id] = '';
        return acc;
      }, {} as Record<string, string>) || {},
      customFields: finding.customFields?.reduce((acc, f) => {
        acc[f.id] = f.type === 'multiselect' ? [] : '';
        return acc;
      }, {} as Record<string, any>) || {}
    };
    setEditingInstance(newInstance);
    setShowInstanceForm(true);
  };

  const handleSaveInstance = () => {
    if (!editingInstance) return;

    const existingIndex = instances.findIndex(i => i.id === editingInstance.id);
    let updatedInstances: FindingInstance[];

    if (existingIndex >= 0) {
      updatedInstances = [...instances];
      updatedInstances[existingIndex] = editingInstance;
    } else {
      updatedInstances = [...instances, editingInstance];
    }

    onInstancesChange(updatedInstances);
    setEditingInstance(null);
    setShowInstanceForm(false);
  };

  const handleDeleteInstance = (instanceId: string) => {
    onInstancesChange(instances.filter(i => i.id !== instanceId));
  };

  const handleEditInstance = (instance: FindingInstance) => {
    setEditingInstance({ ...instance });
    setShowInstanceForm(true);
  };

  const updateEditingField = (field: string, value: any) => {
    if (!editingInstance) return;
    setEditingInstance({
      ...editingInstance,
      [field]: value
    });
  };

  const updateMeasurement = (measurementId: string, value: string) => {
    if (!editingInstance) return;
    setEditingInstance({
      ...editingInstance,
      measurements: {
        ...editingInstance.measurements,
        [measurementId]: value
      }
    });
  };

  const updateCustomField = (fieldId: string, value: any) => {
    if (!editingInstance) return;
    setEditingInstance({
      ...editingInstance,
      customFields: {
        ...editingInstance.customFields,
        [fieldId]: value
      }
    });
  };

  const getSeverityBadgeColor = (sev?: string): string => {
    if (!sev) return 'bg-gray-500';
    const lower = sev.toLowerCase();
    if (lower.includes('grave') || lower.includes('crítica') || lower.includes('aguda')) return 'bg-red-600';
    if (lower.includes('moderada') || lower.includes('subaguda')) return 'bg-orange-500';
    if (lower.includes('leve') || lower.includes('crônica')) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const formatInstanceSummary = (instance: FindingInstance): string => {
    const parts: string[] = [];

    if (instance.location) {
      parts.push(instance.location);
    }

    if (instance.measurements && Object.keys(instance.measurements).length > 0) {
      const measStr = Object.entries(instance.measurements)
        .filter(([_, val]) => val)
        .map(([key, val]) => {
          const meas = finding.measurements?.find(m => m.id === key);
          return meas ? `${meas.label}: ${val}${meas.unit}` : null;
        })
        .filter(Boolean)
        .join(', ');
      if (measStr) parts.push(measStr);
    }

    if (instance.customFields && Object.keys(instance.customFields).length > 0) {
      const customStr = Object.entries(instance.customFields)
        .filter(([_, val]) => val && (Array.isArray(val) ? val.length > 0 : true))
        .map(([key, val]) => {
          const field = finding.customFields?.find(f => f.id === key);
          if (!field) return null;
          if (Array.isArray(val)) {
            return `${field.label}: ${val.join(', ')}`;
          }
          return `${field.label}: ${val}`;
        })
        .filter(Boolean)
        .join(' | ');
      if (customStr) parts.push(customStr);
    }

    return parts.length > 0 ? parts.join(' - ') : 'Sem detalhes';
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-blue-600" />
            {finding.name}
          </h4>
          {finding.description && (
            <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
          )}
        </div>
      </div>

      {severity && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Severidade:</span>
          <Badge className={`${getSeverityBadgeColor(severity)} text-white`}>
            {severity}
          </Badge>
        </div>
      )}

      {instances.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Instâncias Registradas ({instances.length})
          </h5>
          <div className="space-y-2">
            {instances.map((instance) => (
              <div
                key={instance.id}
                className="p-3 bg-white border border-gray-200 rounded-md flex items-start justify-between hover:border-blue-400 transition-colors"
              >
                <div className="flex-1 text-sm text-gray-700">
                  {formatInstanceSummary(instance)}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditInstance(instance)}
                    className="h-7 w-7 p-0"
                  >
                    <Activity className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteInstance(instance.id)}
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showInstanceForm && (
        <Button
          onClick={handleAddInstance}
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {instances.length > 0 ? 'Adicionar Nova Instância' : 'Adicionar Detalhes'}
        </Button>
      )}

      {showInstanceForm && editingInstance && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-blue-900 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {instances.some(i => i.id === editingInstance.id) ? 'Editar' : 'Nova'} Instância
            </h5>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowInstanceForm(false);
                setEditingInstance(null);
              }}
              className="h-7 w-7 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {finding.requiresLocation && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Localização
              </label>
              <Select
                value={editingInstance.location || ''}
                onValueChange={(val) => updateEditingField('location', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a localização" />
                </SelectTrigger>
                <SelectContent>
                  {getLocationsForOrgan().map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {finding.measurements && finding.measurements.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Medidas
              </label>
              {finding.measurements.map((meas) => (
                <div key={meas.id} className="space-y-1">
                  <label className="text-xs text-gray-600">
                    {meas.label} {meas.normalRange && `(Normal: ${meas.normalRange})`}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder={`Ex: 10`}
                      value={editingInstance.measurements?.[meas.id] || ''}
                      onChange={(e) => updateMeasurement(meas.id, e.target.value)}
                      className="flex-1"
                    />
                    <span className="flex items-center px-2 text-sm text-gray-600 bg-gray-100 rounded border">
                      {meas.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {finding.customFields && finding.customFields.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Campos Adicionais</label>
              {finding.customFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="text-xs text-gray-600">{field.label}</label>
                  {field.type === 'select' && field.options && (
                    <Select
                      value={editingInstance.customFields?.[field.id] || ''}
                      onValueChange={(val) => updateCustomField(field.id, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {field.type === 'number' && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={editingInstance.customFields?.[field.id] || ''}
                        onChange={(e) => updateCustomField(field.id, e.target.value)}
                        className="flex-1"
                      />
                      {field.unit && (
                        <span className="flex items-center px-2 text-sm text-gray-600 bg-gray-100 rounded border">
                          {field.unit}
                        </span>
                      )}
                    </div>
                  )}
                  {field.type === 'multiselect' && field.options && (
                    <div className="space-y-1 p-2 bg-white rounded border">
                      {field.options.map((opt) => {
                        const currentValues = editingInstance.customFields?.[field.id] || [];
                        const isChecked = Array.isArray(currentValues) && currentValues.includes(opt);
                        return (
                          <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = Array.isArray(currentValues) ? currentValues : [];
                                const updated = e.target.checked
                                  ? [...current, opt]
                                  : current.filter(v => v !== opt);
                                updateCustomField(field.id, updated);
                              }}
                              className="rounded border-gray-300"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleSaveInstance}
            className="w-full flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Instância
          </Button>
        </div>
      )}

      {finding.id.includes('tvp') && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-800">
            <strong>Atenção:</strong> TVP requer avaliação clínica urgente. Considere Wells Score e D-dímero.
          </p>
        </div>
      )}
    </div>
  );
};

export default VenousFindingDetails;
