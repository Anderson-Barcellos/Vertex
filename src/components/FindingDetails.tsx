import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Finding } from '@/data/organs';
import { FindingMeasurement } from '@/types/report';
import { Ruler, MapPin, Hash } from 'lucide-react';

interface FindingDetailsProps {
  finding: Finding;
  severity?: string;
  measurements?: FindingMeasurement;
  onSeverityChange: (severity: string) => void;
  onMeasurementChange: (measurements: FindingMeasurement) => void;
}

export default function FindingDetails({
  finding,
  severity,
  measurements = {},
  onSeverityChange,
  onMeasurementChange
}: FindingDetailsProps) {
  const handleMeasurementUpdate = (field: keyof FindingMeasurement, value: string) => {
    onMeasurementChange({
      ...measurements,
      [field]: value
    });
  };

  return (
    <div className="ml-6 mt-2 p-3 bg-muted/50 rounded-md space-y-2 border-l-2 border-accent">

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
            <SelectContent>
              <SelectItem value="leve">Leve</SelectItem>
              <SelectItem value="moderado">Moderado</SelectItem>
              <SelectItem value="acentuado">Acentuado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Size/Measurement Input */}
      {finding.hasMeasurement && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
            <Ruler size={12} />
            Tamanho:
          </label>
          <Input
            type="text"
            placeholder="Ex: 2.5 x 1.8 cm"
            value={measurements.size || ''}
            onChange={(e) => handleMeasurementUpdate('size', e.target.value)}
            className="h-7 text-xs flex-1"
          />
        </div>
      )}

      {/* Location Input */}
      {finding.hasLocation && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
            <MapPin size={12} />
            Localização:
          </label>
          <Input
            type="text"
            placeholder="Ex: Segmento VII"
            value={measurements.location || ''}
            onChange={(e) => handleMeasurementUpdate('location', e.target.value)}
            className="h-7 text-xs flex-1"
          />
        </div>
      )}

      {/* Quantity Input */}
      {finding.hasQuantity && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
            <Hash size={12} />
            Quantidade:
          </label>
          <Select
            value={measurements.quantity || '1'}
            onValueChange={(value) => handleMeasurementUpdate('quantity', value)}
          >
            <SelectTrigger className="h-7 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Único</SelectItem>
              <SelectItem value="2">2 lesões</SelectItem>
              <SelectItem value="3">3 lesões</SelectItem>
              <SelectItem value="4">4 lesões</SelectItem>
              <SelectItem value="5">5 lesões</SelectItem>
              <SelectItem value="multiple">Múltiplas (&gt;5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Additional Description */}
      {(finding.hasMeasurement || finding.hasLocation) && (
        <div className="flex items-start gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[80px] pt-1">
            Obs:
          </label>
          <textarea
            placeholder="Observações adicionais (opcional)"
            value={measurements.description || ''}
            onChange={(e) => handleMeasurementUpdate('description', e.target.value)}
            className="flex-1 min-h-[40px] p-1.5 text-xs bg-background border rounded-md resize-none"
          />
        </div>
      )}
    </div>
  );
}