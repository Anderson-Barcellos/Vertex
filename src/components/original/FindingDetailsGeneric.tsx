import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Finding } from '@/data/organs';
import { FindingInstance } from '@/types/report';
import { Plus, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { TiradsCalculatorPanel } from '@/components/shared/TiradsCalculatorPanel';

interface FindingDetailsGenericProps {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
}

interface InstanceFormData {
  id: string;
  data: Record<string, string>;
  collapsed?: boolean;
}

export default function FindingDetailsGeneric({
  finding,
  organId,
  severity,
  instances = [],
  onSeverityChange,
  onInstancesChange
}: FindingDetailsGenericProps) {
  const [saved, setSaved] = useState(false);
  const initializedRef = React.useRef(false);

  const [instanceForms, setInstanceForms] = useState<InstanceFormData[]>(() => {
    if (instances.length > 0) {
      return instances.map(inst => ({
        id: inst.id,
        data: (inst.measurements as Record<string, string>) || {},
        collapsed: false
      }));
    }
    return [{ id: `initial-${Date.now()}`, data: {}, collapsed: false }];
  });

  useEffect(() => {
    if (initializedRef.current && instances.length > 0) {
      const forms = instances.map(inst => ({
        id: inst.id,
        data: (inst.measurements as Record<string, string>) || {},
        collapsed: false
      }));
      setInstanceForms(forms);
    }
    initializedRef.current = true;
  }, [instances]);

  const syncToParent = useCallback((forms: InstanceFormData[]) => {
    const validInstances = forms
      .filter(form => Object.values(form.data).some(v => v && v.trim() !== ''))
      .map(form => ({
        id: form.id,
        measurements: { ...form.data }
      }));
    onInstancesChange(validInstances);
  }, [onInstancesChange]);

  const handleFieldChange = (instanceId: string, fieldId: string, value: string) => {
    setSaved(false);
    setInstanceForms(prev => {
      const updated = prev.map(form =>
        form.id === instanceId
          ? { ...form, data: { ...form.data, [fieldId]: value } }
          : form
      );
      setTimeout(() => syncToParent(updated), 0);
      return updated;
    });
  };

  const handleSaveSingle = useCallback(() => {
    if (instanceForms.length > 0) {
      syncToParent(instanceForms);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [instanceForms, syncToParent]);

  const handleAddInstance = () => {
    const newInstance: InstanceFormData = {
      id: Date.now().toString(),
      data: {},
      collapsed: false
    };
    setInstanceForms(prev => {
      const updated = prev.map(f => ({ ...f, collapsed: true }));
      return [...updated, newInstance];
    });
  };

  const handleRemoveInstance = (instanceId: string) => {
    setInstanceForms(prev => {
      const updated = prev.filter(form => form.id !== instanceId);
      if (updated.length === 0) {
        const empty = [{ id: Date.now().toString(), data: {}, collapsed: false }];
        setTimeout(() => syncToParent(empty), 0);
        return empty;
      }
      setTimeout(() => syncToParent(updated), 0);
      return updated;
    });
  };

  const toggleCollapse = (instanceId: string) => {
    setInstanceForms(prev =>
      prev.map(form =>
        form.id === instanceId
          ? { ...form, collapsed: !form.collapsed }
          : form
      )
    );
  };

  const extraFields = finding.extraFields || [];

  const isThyroidNodule = useMemo(() => {
    const fieldIds = extraFields.map(f => typeof f === 'string' ? f : f.id);
    return fieldIds.includes('composition') && fieldIds.includes('echogenicity') && fieldIds.includes('shape');
  }, [extraFields]);

  const hasLateralityField = useMemo(() => {
    return extraFields.some(f => typeof f !== 'string' && f.id === 'lado');
  }, [extraFields]);

  if (extraFields.length === 0 && !finding.hasSeverity) {
    return null;
  }

  const getInstanceLabel = (form: InstanceFormData, index: number) => {
    const lado = form.data['lado'];
    const arteria = form.data['arteria'];
    const local = form.data['local'];
    
    const parts: string[] = [];
    if (lado && lado !== 'Bilateral') parts.push(lado);
    if (arteria) parts.push(arteria);
    if (local) parts.push(local);
    
    if (parts.length > 0) {
      return parts.join(' - ');
    }
    return `Lesão ${index + 1}`;
  };

  const renderFields = (form: InstanceFormData) => (
    <div className="space-y-3">
      {extraFields.map((field) => {
        if (typeof field === 'string') return null;
        
        const { id, label, type, options, placeholder } = field;

        if (type === 'select' && options) {
          return (
            <div key={id} className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground min-w-[100px]">
                {label}:
              </label>
              <Select
                value={form.data[id] || ''}
                onValueChange={(value) => handleFieldChange(form.id, id, value)}
              >
                <SelectTrigger className="h-8 text-xs flex-1">
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
              <label className="text-xs font-medium text-muted-foreground min-w-[100px] pt-2">
                {label}:
              </label>
              <Textarea
                placeholder={placeholder || ''}
                value={form.data[id] || ''}
                onChange={(e) => handleFieldChange(form.id, id, e.target.value)}
                className="flex-1 min-h-[60px] text-xs resize-none"
              />
            </div>
          );
        }

        return (
          <div key={id} className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground min-w-[100px]">
              {label}:
            </label>
            <Input
              type="text"
              placeholder={placeholder || ''}
              value={form.data[id] || ''}
              onChange={(e) => handleFieldChange(form.id, id, e.target.value)}
              className="h-8 text-xs flex-1"
            />
          </div>
        );
      })}

      {isThyroidNodule && (
        <TiradsCalculatorPanel
          composition={form.data['composition']}
          echogenicity={form.data['echogenicity']}
          shape={form.data['shape']}
          margins={form.data['margins']}
          echogenicFoci={form.data['echogenic_foci']}
          size={form.data['size']}
          className="mt-3"
        />
      )}
    </div>
  );

  const showMultipleInstances = hasLateralityField && extraFields.length > 0;

  return (
    <div
      className="ml-6 mt-2 p-3 bg-muted/50 rounded-md space-y-3 border-l-2 border-accent"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {finding.hasSeverity && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[100px]">
            Grau:
          </label>
          <Select value={severity || 'leve'} onValueChange={onSeverityChange}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leve">Leve</SelectItem>
              <SelectItem value="moderado">Moderado</SelectItem>
              <SelectItem value="acentuado">Acentuado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {showMultipleInstances ? (
        <div className="space-y-2">
          {instanceForms.map((form, index) => (
            <div
              key={form.id}
              className="border border-border/50 rounded-md bg-background/50"
            >
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted/30"
                onClick={() => toggleCollapse(form.id)}
              >
                <div className="flex items-center gap-2">
                  {form.collapsed ? (
                    <ChevronDown size={14} className="text-muted-foreground" />
                  ) : (
                    <ChevronUp size={14} className="text-muted-foreground" />
                  )}
                  <span className="text-xs font-medium">
                    {getInstanceLabel(form, index)}
                  </span>
                </div>
                {instanceForms.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveInstance(form.id);
                    }}
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
              {!form.collapsed && (
                <div className="p-3 pt-0 border-t border-border/30">
                  {renderFields(form)}
                </div>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs border-dashed"
            onClick={handleAddInstance}
          >
            <Plus size={14} className="mr-1" />
            Adicionar Lesão
          </Button>
        </div>
      ) : (
        instanceForms.length > 0 && (
          <>
            {renderFields(instanceForms[0])}
            {extraFields.length > 0 && (
              <div className="flex justify-end pt-2">
                <Button
                  variant={saved ? "secondary" : "default"}
                  size="sm"
                  onClick={handleSaveSingle}
                  className={`h-8 text-xs transition-all ${saved ? 'bg-green-100 text-green-700 border-green-300' : ''}`}
                >
                  <Check size={14} className="mr-1" />
                  {saved ? 'Salvo!' : 'Confirmar'}
                </Button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
