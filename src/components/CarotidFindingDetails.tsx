import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Finding } from '@/data/organs';
import { FindingMeasurement, FindingInstance } from '@/types/report';
import { Ruler, MapPin, Activity, Plus, X, Save, TrendingUp, Waves } from 'lucide-react';
import {
  COMMON_CAROTID_LOCATIONS,
  INTERNAL_CAROTID_LOCATIONS,
  EXTERNAL_CAROTID_LOCATIONS,
  VERTEBRAL_LOCATIONS,
  STENOSIS_GRADES,
  PLAQUE_SURFACE,
  FLOW_PATTERN
} from '@/data/carotidOrgans';

interface CarotidFindingDetailsProps {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
}

// ============================================================================
// CONSTANTES MOVIDAS PARA MÓDULO CENTRALIZADO
// ============================================================================
// As constantes abaixo foram movidas para evitar duplicação de código
// e melhorar a manutenibilidade. Definidas inline apenas para compatibilidade.
// TODO: Importar do arquivo centralizado após refatoração completa

// Thresholds de velocidade para classificação de estenose
const VELOCITY_THRESHOLDS = [
  { value: '<125', label: 'Normal (<125 cm/s)' },
  { value: '125-230', label: 'Moderada (125-230 cm/s)' },
  { value: '>230', label: 'Severa (>230 cm/s)' },
  { value: '>300', label: 'Crítica (>300 cm/s)' }
] as const;

// Razão VPS ACI/ACC para estenose
const STENOSIS_RATIO = [
  { value: '<2.0', label: 'Normal (<2.0)' },
  { value: '2.0-4.0', label: 'Moderada (2.0-4.0)' },
  { value: '>4.0', label: 'Severa (>4.0)' }
] as const;

// Critérios NASCET para grau de estenose
const NASCET_CRITERIA = [
  { value: '<50', label: '<50% (Leve)', risk: 'low' },
  { value: '50-69', label: '50-69% (Moderada)', risk: 'medium' },
  { value: '70-99', label: '70-99% (Severa)', risk: 'high' },
  { value: '100', label: '100% (Oclusão)', risk: 'critical' }
] as const;

// Ecogenicidade das placas
const PLAQUE_ECHOGENICITY = [
  { value: 'hipoecogenica', label: 'Hipoecogênica (lipídica)', risk: 'high' },
  { value: 'isoecogenica', label: 'Isoecogênica', risk: 'medium' },
  { value: 'hiperecogenica', label: 'Hiperecogênica (fibrosa)', risk: 'low' },
  { value: 'calcificada', label: 'Calcificada', risk: 'low' }
] as const;

// Composição das placas
const PLAQUE_COMPOSITION = [
  { value: 'homogenea', label: 'Homogênea', risk: 'low' },
  { value: 'heterogenea', label: 'Heterogênea', risk: 'high' },
  { value: 'mista', label: 'Mista (fibrocalcificada)', risk: 'medium' },
  { value: 'lipidica', label: 'Predominantemente lipídica', risk: 'high' }
] as const;

// Valores de EMI (Espessamento Médio-Intimal)
const EMI_VALUES = [
  { min: 0, max: 0.9, label: 'Normal', color: 'green' },
  { min: 0.9, max: 1.0, label: 'Limítrofe', color: 'yellow' },
  { min: 1.0, max: 1.5, label: 'Espessado', color: 'orange' },
  { min: 1.5, max: 3.0, label: 'Placa', color: 'red' }
] as const;

// Velocidades para vertebrais
const VERTEBRAL_VELOCITY = [
  { value: '30-80', label: 'Normal (30-80 cm/s)' },
  { value: '>100', label: 'Aumentada (>100 cm/s - estenose)' },
  { value: '<30', label: 'Reduzida (<30 cm/s)' },
  { value: '0', label: 'Ausente (oclusão)' }
] as const;

// Índice de Resistividade para vertebrais
const VERTEBRAL_IR = [
  { value: '0.55-0.75', label: 'Normal (0.55-0.75)' },
  { value: '<0.55', label: 'Baixo (<0.55)' },
  { value: '>0.75', label: 'Alto (>0.75)' }
] as const;

// Roubo da subclávia
const SUBCLAVIAN_STEAL = [
  { value: 'ausente', label: 'Ausente (fluxo anterógrado)' },
  { value: 'parcial', label: 'Parcial (alternante)' },
  { value: 'completo', label: 'Completo (fluxo reverso)' }
] as const;

// Helper para determinar classificação de EMI
const getEMIClassification = (value: number) => {
  const classification = EMI_VALUES.find(
    range => value >= range.min && value < range.max
  );
  return classification || EMI_VALUES[EMI_VALUES.length - 1];
};

// Helper para determinar risco de placa
const getPlaqueRisk = (echogenicity?: string, composition?: string, surface?: string) => {
  const risks = [];

  const echoRisk = PLAQUE_ECHOGENICITY.find(e => e.value === echogenicity)?.risk;
  const compRisk = PLAQUE_COMPOSITION.find(c => c.value === composition)?.risk;

  if (echoRisk) risks.push(echoRisk);
  if (compRisk) risks.push(compRisk);
  if (surface === 'ulcerada') risks.push('high');

  if (risks.includes('high')) return 'high';
  if (risks.includes('medium')) return 'medium';
  return 'low';
};

// Helper para cor do badge de risco
const getRiskBadgeColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

function CarotidFindingDetailsComponent({
  finding,
  organId,
  severity,
  instances = [],
  onSeverityChange,
  onInstancesChange
}: CarotidFindingDetailsProps) {
  // Local state for the current form
  const [currentMeasurement, setCurrentMeasurement] = useState<FindingMeasurement>({});
  const [isEditing, setIsEditing] = useState(false);

  // Detectar tipo de achado
  const isStenosis = finding.id.includes('estenose');
  const isPlaque = finding.id.includes('placa');
  const isEMI = finding.id.includes('imi') || finding.id.includes('espessamento');
  const isVertebral = organId === 'vd' || organId === 've';

  const handleAddInstance = () => {
    if (currentMeasurement.size ||
        currentMeasurement.location ||
        currentMeasurement.vps ||
        currentMeasurement.emiValue ||
        currentMeasurement.echogenicity) {
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
    if (organId === 'ccd' || organId === 'cce') return COMMON_CAROTID_LOCATIONS;
    if (organId === 'cid' || organId === 'cie') return INTERNAL_CAROTID_LOCATIONS;
    if (organId === 'ced' || organId === 'cee') return EXTERNAL_CAROTID_LOCATIONS;
    if (organId === 'vd' || organId === 've') return VERTEBRAL_LOCATIONS;
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
      {finding.hasSeverity && !isStenosis && (
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
          <p className="text-xs font-medium text-muted-foreground">Achados descritos:</p>
          {instances.map((instance, index) => (
            <div key={instance.id} className="bg-background p-2 rounded-md border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {isPlaque ? 'Placa' : 'Achado'} {index + 1}
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
                    {instance.measurements.location && (
                      <p><span className="text-muted-foreground">Localização:</span> {instance.measurements.location}</p>
                    )}
                    {instance.measurements.size && (
                      <p><span className="text-muted-foreground">Tamanho:</span> {instance.measurements.size}</p>
                    )}
                    {instance.measurements.vps && (
                      <p><span className="text-muted-foreground">VPS:</span> {instance.measurements.vps}</p>
                    )}
                    {instance.measurements.vdf && (
                      <p><span className="text-muted-foreground">VDF:</span> {instance.measurements.vdf}</p>
                    )}
                    {instance.measurements.ratio && (
                      <p><span className="text-muted-foreground">Razão ACI/ACC:</span> {instance.measurements.ratio}</p>
                    )}
                    {instance.measurements.nascet && (
                      <p><span className="text-muted-foreground">NASCET:</span> {instance.measurements.nascet}</p>
                    )}
                    {instance.measurements.echogenicity && (
                      <p><span className="text-muted-foreground">Ecogenicidade:</span> {instance.measurements.echogenicity}</p>
                    )}
                    {instance.measurements.composition && (
                      <p><span className="text-muted-foreground">Composição:</span> {instance.measurements.composition}</p>
                    )}
                    {instance.measurements.surface && (
                      <p><span className="text-muted-foreground">Superfície:</span> {instance.measurements.surface}</p>
                    )}
                    {instance.measurements.emiValue && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">EMI:</span>
                        <span>{instance.measurements.emiValue} mm</span>
                        <Badge className={`text-xs ${getRiskBadgeColor(getEMIClassification(parseFloat(instance.measurements.emiValue)).color)}`}>
                          {getEMIClassification(parseFloat(instance.measurements.emiValue)).label}
                        </Badge>
                      </div>
                    )}
                    {instance.measurements.vertebralVelocity && (
                      <p><span className="text-muted-foreground">Velocidade:</span> {instance.measurements.vertebralVelocity}</p>
                    )}
                    {instance.measurements.vertebralIR && (
                      <p><span className="text-muted-foreground">IR:</span> {instance.measurements.vertebralIR}</p>
                    )}
                    {instance.measurements.flowPattern && (
                      <p><span className="text-muted-foreground">Padrão de fluxo:</span> {instance.measurements.flowPattern}</p>
                    )}
                    {instance.measurements.subclavianSteal && (
                      <p><span className="text-muted-foreground">Roubo subclávia:</span> {instance.measurements.subclavianSteal}</p>
                    )}
                    {instance.measurements.description && (
                      <p><span className="text-muted-foreground">Obs:</span> {instance.measurements.description}</p>
                    )}
                    {/* Badge de risco para placas */}
                    {isPlaque && instance.measurements.echogenicity && (
                      <div className="mt-2">
                        <Badge className={`text-xs ${getRiskBadgeColor(getPlaqueRisk(
                          instance.measurements.echogenicity,
                          instance.measurements.composition,
                          instance.measurements.surface
                        ))}`}>
                          Risco {getPlaqueRisk(
                            instance.measurements.echogenicity,
                            instance.measurements.composition,
                            instance.measurements.surface
                          ).toUpperCase()}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              {/* Location Dropdown */}
              {finding.hasLocation && locationOptions.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                    <MapPin size={12} />
                    Localização:
                  </label>
                  <Select
                    value={currentMeasurement.location || ''}
                    onValueChange={(value) => {
                      setCurrentMeasurement({...currentMeasurement, location: value});
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs flex-1">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {locationOptions.map(option => (
                        <SelectItem key={option.value} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Size Input (para placas e outras lesões) */}
              {finding.hasMeasurement && (isPlaque || !isStenosis) && !isEMI && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                    <Ruler size={12} />
                    Tamanho:
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: 2.5 x 1.8 mm"
                    value={currentMeasurement.size || ''}
                    onChange={(e) => setCurrentMeasurement({...currentMeasurement, size: e.target.value})}
                    className="h-7 text-xs flex-1"
                  />
                </div>
              )}

              {/* Campos específicos para ESTENOSE */}
              {isStenosis && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                      <Activity size={12} />
                      VPS:
                    </label>
                    <Select
                      value={currentMeasurement.vps || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, vps: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {VELOCITY_THRESHOLDS.map(v => (
                          <SelectItem key={v.value} value={v.label}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                      <Activity size={12} />
                      VDF:
                    </label>
                    <Select
                      value={currentMeasurement.vdf || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, vdf: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {VELOCITY_THRESHOLDS.map(v => (
                          <SelectItem key={v.value} value={v.label}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                      <TrendingUp size={12} />
                      Razão ACI/ACC:
                    </label>
                    <Select
                      value={currentMeasurement.ratio || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, ratio: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {STENOSIS_RATIO.map(r => (
                          <SelectItem key={r.value} value={r.label}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      NASCET:
                    </label>
                    <Select
                      value={currentMeasurement.nascet || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, nascet: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {NASCET_CRITERIA.map(n => (
                          <SelectItem key={n.value} value={n.label}>
                            {n.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Campos específicos para PLACAS */}
              {isPlaque && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Ecogenicidade:
                    </label>
                    <Select
                      value={currentMeasurement.echogenicity || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, echogenicity: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {PLAQUE_ECHOGENICITY.map(e => (
                          <SelectItem key={e.value} value={e.label}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Composição:
                    </label>
                    <Select
                      value={currentMeasurement.composition || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, composition: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {PLAQUE_COMPOSITION.map(c => (
                          <SelectItem key={c.value} value={c.label}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Superfície:
                    </label>
                    <Select
                      value={currentMeasurement.surface || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, surface: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {PLAQUE_SURFACE.map(s => (
                          <SelectItem key={s.value} value={s.label}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Campos específicos para EMI */}
              {isEMI && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                    <Ruler size={12} />
                    EMI (mm):
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="3.0"
                    step="0.1"
                    placeholder="Ex: 0.8"
                    value={currentMeasurement.emiValue || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value >= 0 && value <= 3.0) {
                        setCurrentMeasurement({...currentMeasurement, emiValue: e.target.value});
                      }
                    }}
                    className="h-7 text-xs flex-1"
                  />
                  {currentMeasurement.emiValue && (
                    <Badge className={`text-xs ${getRiskBadgeColor(getEMIClassification(parseFloat(currentMeasurement.emiValue)).color)}`}>
                      {getEMIClassification(parseFloat(currentMeasurement.emiValue)).label}
                    </Badge>
                  )}
                </div>
              )}

              {/* Campos específicos para VERTEBRAIS */}
              {isVertebral && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                      <Activity size={12} />
                      Velocidade:
                    </label>
                    <Select
                      value={currentMeasurement.vertebralVelocity || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, vertebralVelocity: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {VERTEBRAL_VELOCITY.map(v => (
                          <SelectItem key={v.value} value={v.label}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      IR:
                    </label>
                    <Select
                      value={currentMeasurement.vertebralIR || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, vertebralIR: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {VERTEBRAL_IR.map(ir => (
                          <SelectItem key={ir.value} value={ir.label}>
                            {ir.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                      <Waves size={12} />
                      Padrão:
                    </label>
                    <Select
                      value={currentMeasurement.flowPattern || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, flowPattern: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {FLOW_PATTERN.map(f => (
                          <SelectItem key={f.value} value={f.label}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Roubo Subclávia:
                    </label>
                    <Select
                      value={currentMeasurement.subclavianSteal || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, subclavianSteal: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {SUBCLAVIAN_STEAL.map(s => (
                          <SelectItem key={s.value} value={s.label}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
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
                  disabled={
                    !currentMeasurement.location &&
                    !currentMeasurement.size &&
                    !currentMeasurement.vps &&
                    !currentMeasurement.emiValue &&
                    !currentMeasurement.echogenicity &&
                    !currentMeasurement.vertebralVelocity
                  }
                  className="h-7 text-xs"
                >
                  <Save size={12} className="mr-1" />
                  {instances.length > 0 ? 'Adicionar outro' : 'Salvar'}
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
              Adicionar outro achado
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(CarotidFindingDetailsComponent, (prevProps, nextProps) => {
  // Only re-render if these props changed
  return (
    prevProps.finding.id === nextProps.finding.id &&
    prevProps.organId === nextProps.organId &&
    prevProps.severity === nextProps.severity &&
    prevProps.instances?.length === nextProps.instances?.length
  );
});
