import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Finding } from '@/data/organs';
import { FindingInstance } from '@/types/report';
import { Save, Check } from 'lucide-react';
import { TiradsCalculatorPanel } from '@/components/shared/TiradsCalculatorPanel';

interface FindingDetailsGenericProps {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
}

export default function FindingDetailsGeneric({
  finding,
  organId,
  severity,
  instances = [],
  onSeverityChange,
  onInstancesChange
}: FindingDetailsGenericProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (instances.length > 0 && instances[0].measurements) {
      const measurements = instances[0].measurements as Record<string, string>;
      setFormData(measurements);
      setSaved(true);
    }
  }, [instances]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setSaved(false);
  };

  const handleSave = useCallback(() => {
    const hasData = Object.values(formData).some(v => v && v.trim() !== '');
    if (hasData) {
      const newInstance: FindingInstance = {
        id: instances.length > 0 ? instances[0].id : Date.now().toString(),
        measurements: { ...formData }
      };
      onInstancesChange([newInstance]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [formData, instances, onInstancesChange]);

  const extraFields = finding.extraFields || [];

  const isThyroidNodule = useMemo(() => {
    const fieldIds = extraFields.map(f => typeof f === 'string' ? f : f.id);
    return fieldIds.includes('composition') && fieldIds.includes('echogenicity') && fieldIds.includes('shape');
  }, [extraFields]);

  if (extraFields.length === 0 && !finding.hasSeverity) {
    return null;
  }

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
                value={formData[id] || ''}
                onValueChange={(value) => handleFieldChange(id, value)}
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
                value={formData[id] || ''}
                onChange={(e) => handleFieldChange(id, e.target.value)}
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
              value={formData[id] || ''}
              onChange={(e) => handleFieldChange(id, e.target.value)}
              className="h-8 text-xs flex-1"
            />
          </div>
        );
      })}

      {isThyroidNodule && (
        <TiradsCalculatorPanel
          composition={formData['composition']}
          echogenicity={formData['echogenicity']}
          shape={formData['shape']}
          margins={formData['margins']}
          echogenicFoci={formData['echogenic_foci']}
          size={formData['size']}
          className="mt-3"
        />
      )}

      {extraFields.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button
            variant={saved ? "secondary" : "default"}
            size="sm"
            onClick={handleSave}
            className={`h-8 text-xs transition-all ${saved ? 'bg-green-100 text-green-700 border-green-300' : ''}`}
          >
            {saved ? <Check size={14} className="mr-1" /> : <Save size={14} className="mr-1" />}
            {saved ? 'Salvo!' : 'Salvar'}
          </Button>
        </div>
      )}
    </div>
  );
}
