import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Finding } from '@/data/organs';
import { FindingMeasurement, FindingInstance } from '@/types/report';
import { Ruler, MapPin, Activity, Plus, X, Save, TrendingUp, Waves, ShieldAlert } from 'lucide-react';
import { PlaqueRiskCalculatorPanel } from '@/components/shared/PlaqueRiskCalculatorPanel';
import {
  COMMON_CAROTID_LOCATIONS,
  INTERNAL_CAROTID_LOCATIONS,
  EXTERNAL_CAROTID_LOCATIONS,
  VERTEBRAL_LOCATIONS,
  STENOSIS_GRADES,
  PLAQUE_RISK,
  PLAQUE_SURFACE,
  PLAQUE_ECHOGENICITY,
  PLAQUE_COMPOSITION,
  FLOW_PATTERN,
  SPECTRAL_BROADENING,
  getGrayWealeType,
  GRAY_WEALE_DESCRIPTIONS,
  calculateStenosisGrade,
  type StenosisAnalysis
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

// Gray-Weale simplificado - substitui ecogenicidade + composição
const GRAY_WEALE_OPTIONS = [
  { value: 'I', label: 'Tipo I - Uniformemente ecolucente', risk: 'high', description: 'Placa lipídica - ALTO RISCO' },
  { value: 'II', label: 'Tipo II - Predominantemente ecolucente', risk: 'high', description: 'Placa mista com predomínio lipídico - ALTO RISCO' },
  { value: 'III', label: 'Tipo III - Predominantemente ecogênica', risk: 'medium', description: 'Placa mista com predomínio fibroso - RISCO MODERADO' },
  { value: 'IV', label: 'Tipo IV - Uniformemente ecogênica', risk: 'low', description: 'Placa fibrosa/calcificada - BAIXO RISCO' }
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

const getPlaqueRisk = (echogenicity?: string, composition?: string, surface?: string): 'low' | 'medium' | 'high' => {
  const risks: ('low' | 'medium' | 'high')[] = [];

  if (echogenicity) {
    const lower = echogenicity.toLowerCase();
    if (lower.includes('tipo i)') || lower.includes('tipo ii)') || lower.includes('hipo') || lower.includes('ecolucente')) {
      risks.push('high');
    } else if (lower.includes('tipo iii)') || lower.includes('hetero')) {
      risks.push('medium');
    } else if (lower.includes('tipo iv)') || lower.includes('hiper') || lower.includes('homogên')) {
      risks.push('low');
    }
  }

  if (composition) {
    const lower = composition.toLowerCase();
    if (lower.includes('lipídica') || lower.includes('lipidica') || lower.includes('hetero')) {
      risks.push('high');
    } else if (lower.includes('mista')) {
      risks.push('medium');
    } else if (lower.includes('calcif') || lower.includes('fibrosa') || lower.includes('homogên')) {
      risks.push('low');
    }
  }

  if (surface) {
    const surfaceLower = surface.toLowerCase();
    if (surfaceLower.includes('ulcer')) {
      risks.push('high');
    } else if (surfaceLower.includes('irreg')) {
      risks.push('medium');
    }
  }

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

const getEMIRiskLevel = (label: string): 'low' | 'medium' | 'high' | 'critical' => {
  const lower = label.toLowerCase();
  if (lower.includes('normal')) return 'low';
  if (lower.includes('lim') || lower.includes('limítrofe') || lower.includes('limite')) return 'medium';
  if (lower.includes('espessado')) return 'high';
  if (lower.includes('placa')) return 'critical';
  return 'medium';
};

const mapRiskTextToLevel = (text?: string): 'low' | 'medium' | 'high' | 'critical' => {
  if (!text) return 'medium';
  const lower = text.toLowerCase();
  if (lower.includes('muito alto') || lower.includes('ulcer')) return 'critical';
  if (lower.includes('alto')) return 'high';
  if (lower.includes('baixo')) return 'low';
  if (lower.includes('moderado')) return 'medium';
  return 'medium';
};

const formatRiskLabel = (level: 'low' | 'medium' | 'high' | 'critical'): string => {
  switch (level) {
    case 'low':
      return 'Risco baixo';
    case 'medium':
      return 'Risco moderado';
    case 'high':
      return 'Risco alto';
    case 'critical':
      return 'Risco crítico';
    default:
      return 'Risco moderado';
  }
};

const normalizeMeasurements = (measurement: FindingMeasurement): FindingMeasurement => {
  const normalized: FindingMeasurement = { ...measurement };

  if (measurement.ratio && !measurement.ratioICA_CCA) {
    normalized.ratioICA_CCA = measurement.ratio;
  }
  if (measurement.ratioICA_CCA && !measurement.ratio) {
    normalized.ratio = measurement.ratioICA_CCA;
  }
  if (measurement.ratio_aci_acc) {
    if (!normalized.ratioICA_CCA) normalized.ratioICA_CCA = measurement.ratio_aci_acc;
    if (!normalized.ratio) normalized.ratio = measurement.ratio_aci_acc;
  }

  if (measurement.echogenicity && !measurement.plaqueEchogenicity) {
    normalized.plaqueEchogenicity = measurement.echogenicity;
  }
  if (measurement.plaqueEchogenicity && !measurement.echogenicity) {
    normalized.echogenicity = measurement.plaqueEchogenicity;
  }

  if (measurement.composition && !measurement.plaqueComposition) {
    normalized.plaqueComposition = measurement.composition;
  }
  if (measurement.plaqueComposition && !measurement.composition) {
    normalized.composition = measurement.plaqueComposition;
  }

  if (measurement.surface && !measurement.plaqueSurface) {
    normalized.plaqueSurface = measurement.surface;
  }
  if (measurement.plaqueSurface && !measurement.surface) {
    normalized.surface = measurement.plaqueSurface;
  }

  if (measurement.risk && !measurement.plaqueRisk) {
    normalized.plaqueRisk = measurement.risk;
  }
  if (measurement.plaqueRisk && !measurement.risk) {
    normalized.risk = measurement.plaqueRisk;
  }

  if (measurement.emiValue && !measurement.emi) {
    normalized.emi = measurement.emiValue;
  }
  if (measurement.emi && !measurement.emiValue) {
    normalized.emiValue = measurement.emi;
  }
  if (measurement.emi_classification && !measurement.emiClassification) {
    normalized.emiClassification = measurement.emi_classification;
  }
  if (measurement.emiClassification && !measurement.emi_classification) {
    normalized.emi_classification = measurement.emiClassification;
  }

  if (measurement.flowPattern && !measurement.vertebralFlowPattern) {
    normalized.vertebralFlowPattern = measurement.flowPattern;
  }
  if (measurement.vertebralFlowPattern && !measurement.flowPattern) {
    normalized.flowPattern = measurement.vertebralFlowPattern;
  }

  if (measurement.nascet && !measurement.nascetGrade) {
    normalized.nascetGrade = measurement.nascet;
  }
  if (measurement.nascetGrade && !measurement.nascet) {
    normalized.nascet = measurement.nascetGrade;
  }

  return normalized;
};

const getConfidenceBadgeColor = (confidence: 'high' | 'medium' | 'low') => {
  switch (confidence) {
    case 'high': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'low': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getConfidenceLabel = (confidence: 'high' | 'medium' | 'low') => {
  switch (confidence) {
    case 'high': return 'Alta';
    case 'medium': return 'Média';
    case 'low': return 'Baixa';
    default: return '';
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
  const [currentMeasurement, setCurrentMeasurement] = useState<FindingMeasurement>({});
  const [isEditing, setIsEditing] = useState(false);
  const [stenosisAnalysis, setStenosisAnalysis] = useState<StenosisAnalysis | null>(null);

  const isStenosis = finding.id.includes('estenose');
  const isPlaque = finding.id.includes('placa');
  const isEMI = finding.id.includes('imi') || finding.id.includes('espessamento');
  const isVertebral = organId === 'vd' || organId === 've';

  React.useEffect(() => {
    if (!isStenosis) {
      setStenosisAnalysis(null);
      return;
    }

    const hasAnyVelocity = currentMeasurement.vps || currentMeasurement.vdf || 
      currentMeasurement.ratio || currentMeasurement.ratioICA_CCA || 
      currentMeasurement.ratio_aci_acc || currentMeasurement.spectralBroadening;

    if (!hasAnyVelocity) {
      setStenosisAnalysis(null);
      return;
    }

    const analysis = calculateStenosisGrade({
      vps: currentMeasurement.vps,
      vdf: currentMeasurement.vdf,
      ratio: currentMeasurement.ratio || currentMeasurement.ratioICA_CCA || currentMeasurement.ratio_aci_acc,
      spectralBroadening: currentMeasurement.spectralBroadening
    });

    setStenosisAnalysis(analysis);

    if (analysis.nascet !== 'N/A' && analysis.confidence !== 'low') {
      const nascetLabel = NASCET_CRITERIA.find(n => 
        analysis.nascet.includes(n.value) || n.label.includes(analysis.nascet)
      )?.label || analysis.grade;
      
      setCurrentMeasurement(prev => ({
        ...prev,
        nascet: nascetLabel,
        nascetGrade: nascetLabel,
        calculatedGrade: analysis.grade,
        calculatedConfidence: analysis.confidence
      }));
    }
  }, [
    isStenosis,
    currentMeasurement.vps,
    currentMeasurement.vdf,
    currentMeasurement.ratio,
    currentMeasurement.ratioICA_CCA,
    currentMeasurement.ratio_aci_acc,
    currentMeasurement.spectralBroadening
  ]);

  const handleAddInstance = () => {
    if (currentMeasurement.size ||
        currentMeasurement.location ||
        currentMeasurement.extension ||
        currentMeasurement.stenosis_percent ||
        currentMeasurement.diameter ||
        currentMeasurement.vps ||
        currentMeasurement.vdf ||
        currentMeasurement.ratio ||
        currentMeasurement.ratioICA_CCA ||
        currentMeasurement.nascet ||
        currentMeasurement.nascetGrade ||
        currentMeasurement.emiValue ||
        currentMeasurement.emi ||
        currentMeasurement.grayWeale ||
        currentMeasurement.echogenicity ||
        currentMeasurement.plaqueEchogenicity ||
        currentMeasurement.surface ||
        currentMeasurement.plaqueSurface ||
        currentMeasurement.risk ||
        currentMeasurement.plaqueRisk ||
        currentMeasurement.vertebralVelocity ||
        currentMeasurement.vertebralIR ||
        currentMeasurement.flowPattern ||
        currentMeasurement.vertebralFlowPattern ||
        currentMeasurement.subclavianSteal ||
        currentMeasurement.spectralBroadening ||
        currentMeasurement.description) {
      const normalizedMeasurements = normalizeMeasurements(currentMeasurement);
      const newInstance: FindingInstance = {
        id: Date.now().toString(),
        measurements: normalizedMeasurements
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
          {instances.map((instance, index) => {
            const inferredEmiClassification =
              instance.measurements.emiClassification ||
              (instance.measurements.emiValue
                ? getEMIClassification(parseFloat(instance.measurements.emiValue)).label
                : undefined);
            const emiRiskLevel = inferredEmiClassification
              ? getEMIRiskLevel(inferredEmiClassification)
              : undefined;
            const plaqueRiskValue =
              instance.measurements.plaqueRisk || instance.measurements.risk;
            const computedPlaqueRiskLevel = getPlaqueRisk(
              instance.measurements.echogenicity,
              instance.measurements.composition,
              instance.measurements.surface
            );
            const plaqueBadgeLevel = plaqueRiskValue
              ? mapRiskTextToLevel(plaqueRiskValue)
              : computedPlaqueRiskLevel;
            const shouldShowPlaqueBadge = Boolean(
              plaqueRiskValue ||
              instance.measurements.echogenicity ||
              instance.measurements.composition ||
              instance.measurements.surface
            );
            const plaqueBadgeLabel = plaqueRiskValue || formatRiskLabel(computedPlaqueRiskLevel);
            const ratioValue =
              instance.measurements.ratio ||
              instance.measurements.ratioICA_CCA ||
              instance.measurements.ratio_aci_acc;
            const nascetValue =
              instance.measurements.nascet || instance.measurements.nascetGrade;

            return (
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
                      {instance.measurements.extension && (
                        <p><span className="text-muted-foreground">Extensão:</span> {instance.measurements.extension}</p>
                      )}
                      {instance.measurements.stenosis_percent && (
                        <p><span className="text-muted-foreground">Estenose:</span> {instance.measurements.stenosis_percent}</p>
                      )}
                      {instance.measurements.diameter && (
                        <p><span className="text-muted-foreground">Diâmetro:</span> {instance.measurements.diameter}</p>
                      )}
                      {instance.measurements.vps && (
                        <p><span className="text-muted-foreground">VPS:</span> {instance.measurements.vps}</p>
                      )}
                      {instance.measurements.vdf && (
                        <p><span className="text-muted-foreground">VDF:</span> {instance.measurements.vdf}</p>
                      )}
                      {ratioValue && (
                        <p><span className="text-muted-foreground">Razão ACI/ACC:</span> {ratioValue}</p>
                      )}
                      {nascetValue && (
                        <p><span className="text-muted-foreground">NASCET:</span> {nascetValue}</p>
                      )}
                      {instance.measurements.spectralBroadening && (
                        <p><span className="text-muted-foreground">Borramento:</span> {instance.measurements.spectralBroadening}</p>
                      )}
                      {instance.measurements.calculatedGrade && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Classificação:</span>
                          <span className="font-medium">{instance.measurements.calculatedGrade}</span>
                          {instance.measurements.calculatedConfidence && (
                            <Badge className={`text-[10px] ${getConfidenceBadgeColor(instance.measurements.calculatedConfidence as 'high' | 'medium' | 'low')}`}>
                              {getConfidenceLabel(instance.measurements.calculatedConfidence as 'high' | 'medium' | 'low')}
                            </Badge>
                          )}
                        </div>
                      )}
                      {(instance.measurements.grayWeale || instance.measurements.echogenicity) && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Gray-Weale:</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              instance.measurements.grayWeale === 'I' || instance.measurements.grayWeale === 'II'
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : instance.measurements.grayWeale === 'III'
                                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                  : 'bg-green-500/20 text-green-300 border-green-500/30'
                            }`}
                          >
                            Tipo {instance.measurements.grayWeale || getGrayWealeType(instance.measurements.echogenicity || '', instance.measurements.composition)}
                          </Badge>
                          <span className="text-[10px] text-slate-400">
                            {instance.measurements.echogenicity}
                          </span>
                        </div>
                      )}
                      {instance.measurements.surface && (
                        <p><span className="text-muted-foreground">Superfície:</span> {instance.measurements.surface}</p>
                      )}
                      {plaqueRiskValue && (
                        <p><span className="text-muted-foreground">Risco:</span> {plaqueRiskValue}</p>
                      )}
                      {instance.measurements.emiValue && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">EMI:</span>
                          <span>{instance.measurements.emiValue} mm</span>
                          {inferredEmiClassification && (
                            <Badge className={`text-xs ${getRiskBadgeColor(emiRiskLevel || 'medium')}`}>
                              {inferredEmiClassification}
                            </Badge>
                          )}
                        </div>
                      )}
                      {instance.measurements.vertebralVelocity && (
                        <p><span className="text-muted-foreground">Velocidade:</span> {instance.measurements.vertebralVelocity}</p>
                      )}
                      {instance.measurements.vertebralIR && (
                        <p><span className="text-muted-foreground">IR:</span> {instance.measurements.vertebralIR}</p>
                      )}
                      {(instance.measurements.flowPattern || instance.measurements.vertebralFlowPattern) && (
                        <p><span className="text-muted-foreground">Padrão de fluxo:</span> {instance.measurements.flowPattern || instance.measurements.vertebralFlowPattern}</p>
                      )}
                      {instance.measurements.subclavianSteal && (
                        <p><span className="text-muted-foreground">Roubo subclávia:</span> {instance.measurements.subclavianSteal}</p>
                      )}
                      {instance.measurements.description && (
                        <p><span className="text-muted-foreground">Obs:</span> {instance.measurements.description}</p>
                      )}
                      {/* Badge de risco para placas */}
                      {isPlaque && shouldShowPlaqueBadge && (
                        <div className="mt-2">
                          <Badge className={`text-xs ${getRiskBadgeColor(plaqueBadgeLevel)}`}>
                            {plaqueBadgeLabel}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Estenose (%):
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 65%"
                      value={currentMeasurement.stenosis_percent || ''}
                      onChange={(e) => setCurrentMeasurement({...currentMeasurement, stenosis_percent: e.target.value})}
                      className="h-7 text-xs flex-1"
                    />
                  </div>

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
                      value={currentMeasurement.ratio || currentMeasurement.ratioICA_CCA || currentMeasurement.ratio_aci_acc || ''}
                      onValueChange={(value) =>
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          ratio: value,
                          ratioICA_CCA: value,
                          ratio_aci_acc: value
                        })
                      }
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
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                      <Waves size={12} />
                      Borramento:
                    </label>
                    <Select
                      value={currentMeasurement.spectralBroadening || ''}
                      onValueChange={(value) =>
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          spectralBroadening: value
                        })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {SPECTRAL_BROADENING.map(s => (
                          <SelectItem key={s} value={s}>
                            {s}
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
                      value={currentMeasurement.nascet || currentMeasurement.nascetGrade || ''}
                      onValueChange={(value) =>
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          nascet: value,
                          nascetGrade: value
                        })
                      }
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

                  {stenosisAnalysis && stenosisAnalysis.nascet !== 'N/A' && (
                    <div className="mt-2 p-3 bg-slate-800/90 rounded-lg border border-slate-600/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-sky-400" />
                          <span className="text-xs font-semibold text-slate-100">
                            Classificação Automática (IAC/NASCET)
                          </span>
                        </div>
                        <Badge className={`text-[10px] px-1.5 py-0.5 ${getConfidenceBadgeColor(stenosisAnalysis.confidence)}`}>
                          Confiança: {getConfidenceLabel(stenosisAnalysis.confidence)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Grau estimado:</span>
                          <span className="text-sm font-bold text-emerald-400">
                            {stenosisAnalysis.grade} ({stenosisAnalysis.nascet})
                          </span>
                        </div>
                        
                        <div className="text-[10px] text-slate-400">
                          <span className="font-medium text-slate-300">Critérios usados ({stenosisAnalysis.criteriaCount}):</span>
                          <ul className="mt-0.5 space-y-0.5">
                            {stenosisAnalysis.criteriaUsed.map((c, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-sky-400" />
                                <span className="text-slate-300">{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {stenosisAnalysis.alerts.length > 0 && (
                          <div className="mt-2 p-2 bg-amber-900/40 rounded border border-amber-600/50">
                            <div className="flex items-center gap-1 mb-1">
                              <ShieldAlert size={12} className="text-amber-400" />
                              <span className="text-[10px] font-semibold text-amber-400">Alertas</span>
                            </div>
                            <ul className="space-y-0.5">
                              {stenosisAnalysis.alerts.map((alert, i) => (
                                <li key={i} className="text-[10px] text-amber-200">
                                  • {alert}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-slate-600/50">
                          <span className="text-[10px] text-slate-400">Recomendação ESVS:</span>
                          <p className="text-[11px] text-slate-200 mt-0.5">
                            {stenosisAnalysis.interventionRecommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Campos específicos para PLACAS */}
              {isPlaque && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Extensão:
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 12 mm"
                      value={currentMeasurement.extension || ''}
                      onChange={(e) => setCurrentMeasurement({...currentMeasurement, extension: e.target.value})}
                      className="h-7 text-xs flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Gray-Weale:
                    </label>
                    <Select
                      value={currentMeasurement.grayWeale || ''}
                      onValueChange={(value) => {
                        const selected = GRAY_WEALE_OPTIONS.find(g => g.value === value);
                        const riskLabel = selected?.risk === 'high' ? 'Alto risco' : selected?.risk === 'medium' ? 'Risco moderado' : 'Baixo risco';
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          grayWeale: value,
                          echogenicity: selected?.label,
                          plaqueEchogenicity: selected?.label,
                          risk: riskLabel,
                          plaqueRisk: riskLabel
                        });
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione o tipo..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {GRAY_WEALE_OPTIONS.map(g => (
                          <SelectItem key={g.value} value={g.value}>
                            {g.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {currentMeasurement.grayWeale && (
                    <div className="p-2 rounded-md bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            GRAY_WEALE_OPTIONS.find(g => g.value === currentMeasurement.grayWeale)?.risk === 'high' 
                              ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                              : GRAY_WEALE_OPTIONS.find(g => g.value === currentMeasurement.grayWeale)?.risk === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                : 'bg-green-500/20 text-green-300 border-green-500/30'
                          }`}
                        >
                          Gray-Weale {currentMeasurement.grayWeale}
                        </Badge>
                        <span className="text-[10px] text-slate-400">
                          {GRAY_WEALE_OPTIONS.find(g => g.value === currentMeasurement.grayWeale)?.description}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Superfície:
                    </label>
                    <Select
                      value={currentMeasurement.surface || currentMeasurement.plaqueSurface || ''}
                      onValueChange={(value) =>
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          surface: value,
                          plaqueSurface: value
                        })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {PLAQUE_SURFACE.map(s => (
                          <SelectItem key={s} value={s}>
                            {s}
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
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 0.8"
                    value={currentMeasurement.emi ?? currentMeasurement.emiValue ?? ''}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      if (rawValue === '') {
                        setCurrentMeasurement({
                          ...currentMeasurement,
                          emi: undefined,
                          emiValue: undefined,
                          emiClassification: undefined
                        });
                        return;
                      }

                      const normalized = rawValue.trim();
                      const numeric = parseFloat(normalized.replace(',', '.'));

                      setCurrentMeasurement({
                        ...currentMeasurement,
                        emi: normalized,
                        emiValue: normalized,
                        emiClassification: undefined
                      });
                    }}
                    className="h-7 text-xs flex-1"
                  />
                </div>
              )}

              {/* Campos específicos para VERTEBRAIS */}
              {isVertebral && (
                <>
                  {(finding.id.includes('hipoplasia') || finding.id.includes('aplasia')) && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                        <Ruler size={12} />
                        Diâmetro:
                      </label>
                      <Input
                        type="text"
                        placeholder="Ex: 1.5 mm"
                        value={currentMeasurement.diameter || ''}
                        onChange={(e) => setCurrentMeasurement({...currentMeasurement, diameter: e.target.value})}
                        className="h-7 text-xs flex-1"
                      />
                    </div>
                  )}

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
                    onValueChange={(value) => setCurrentMeasurement({
                      ...currentMeasurement,
                      flowPattern: value,
                      vertebralFlowPattern: value
                    })}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {FLOW_PATTERN.map(f => (
                          <SelectItem key={f} value={f}>
                            {f}
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
                    !currentMeasurement.extension &&
                    !currentMeasurement.stenosis_percent &&
                    !currentMeasurement.diameter &&
                    !currentMeasurement.vps &&
                    !currentMeasurement.vdf &&
                    !currentMeasurement.ratio &&
                    !currentMeasurement.ratioICA_CCA &&
                    !currentMeasurement.ratio_aci_acc &&
                    !currentMeasurement.nascet &&
                    !currentMeasurement.nascetGrade &&
                    !currentMeasurement.emiValue &&
                    !currentMeasurement.emi &&
                    !currentMeasurement.grayWeale &&
                    !currentMeasurement.echogenicity &&
                    !currentMeasurement.plaqueEchogenicity &&
                    !currentMeasurement.surface &&
                    !currentMeasurement.plaqueSurface &&
                    !currentMeasurement.risk &&
                    !currentMeasurement.plaqueRisk &&
                    !currentMeasurement.vertebralVelocity &&
                    !currentMeasurement.vertebralIR &&
                    !currentMeasurement.flowPattern &&
                    !currentMeasurement.vertebralFlowPattern &&
                    !currentMeasurement.subclavianSteal &&
                    !currentMeasurement.spectralBroadening &&
                    !currentMeasurement.description
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
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="w-full h-9 text-xs border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/10 font-medium"
            >
              <Plus size={14} className="mr-2" />
              Adicionar outra lesão
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
