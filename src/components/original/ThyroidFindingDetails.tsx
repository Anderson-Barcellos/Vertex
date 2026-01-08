import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Finding } from '@/data/organs';
import { FindingMeasurement, FindingInstance } from '@/types/report';
import { Ruler, MapPin, Activity, Plus, X, Save, ShieldAlert, Sparkles } from 'lucide-react';
import {
  THYROID_LOBE_LOCATION,
  NODULE_COMPOSITION,
  NODULE_ECHOGENICITY,
  NODULE_SHAPE,
  NODULE_MARGINS,
  ECHOGENIC_FOCI,
  VASCULARITY_PATTERN,
  ELASTOGRAPHY_SCORE,
  PARENCHYMA_ECHOTEXTURE,
  PARENCHYMA_VASCULARITY,
  LYMPH_NODE_SUSPICIOUS_CRITERIA,
  TIRADS_CATEGORIES,
  classifyLobeVolume,
  THYROID_VOLUME_REFERENCE
} from '@/data/thyroidOrgans';

interface ThyroidFindingDetailsProps {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
}

// Função para calcular pontuação TI-RADS baseada nas características
const calculateTIRADSScore = (measurements: FindingMeasurement): number => {
  let totalPoints = 0;

  // Composição (0-2 pontos)
  const composition = NODULE_COMPOSITION.find(
    c => c.label === measurements.composition || c.value === measurements.composition
  );
  if (composition) totalPoints += composition.points;

  // Ecogenicidade (0-3 pontos)
  const echogenicity = NODULE_ECHOGENICITY.find(
    e => e.label === measurements.echogenicity || e.value === measurements.echogenicity
  );
  if (echogenicity) totalPoints += echogenicity.points;

  // Forma (0-3 pontos)
  const shape = NODULE_SHAPE.find(
    s => s.label === measurements.shape || s.value === measurements.shape
  );
  if (shape) totalPoints += shape.points;

  // Margens (0-3 pontos)
  const margins = NODULE_MARGINS.find(
    m => m.label === measurements.margins || m.value === measurements.margins
  );
  if (margins) totalPoints += margins.points;

  // Focos ecogênicos (0-3 pontos)
  const foci = ECHOGENIC_FOCI.find(
    f => f.label === measurements.echogenicFoci || f.value === measurements.echogenicFoci
  );
  if (foci) totalPoints += foci.points;

  return totalPoints;
};

// Função para determinar categoria TI-RADS baseada na pontuação
const getTIRADSCategory = (score: number) => {
  if (score === 0) return TIRADS_CATEGORIES[0]; // TR1
  if (score === 2) return TIRADS_CATEGORIES[1]; // TR2
  if (score === 3) return TIRADS_CATEGORIES[2]; // TR3
  if (score >= 4 && score <= 6) return TIRADS_CATEGORIES[3]; // TR4
  if (score >= 7) return TIRADS_CATEGORIES[4]; // TR5
  return TIRADS_CATEGORIES[2]; // Default TR3
};

// Helper para cor do badge de risco TI-RADS
const getTIRADSBadgeColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

function ThyroidFindingDetailsComponent({
  finding,
  organId,
  severity,
  instances = [],
  onSeverityChange,
  onInstancesChange
}: ThyroidFindingDetailsProps) {
  const [currentMeasurement, setCurrentMeasurement] = useState<FindingMeasurement>({});
  const [isEditing, setIsEditing] = useState(false);

  // Detectar tipo de achado
  const isNodule = finding.id.includes('nodulo') && !finding.id.includes('linfonodo');
  const isEchotexture = finding.id.includes('ecotextura') || finding.id.includes('tireopatia');
  const isIsthmusThickening = finding.id.includes('espessamento-istmo');
  const isLymphNode = finding.id.includes('linfonodo');
  const isVolume = finding.id.includes('volume-lt');
  const isCyst = finding.id.includes('cisto');

  const directVolumeClassification = useMemo(() => {
    if (!isVolume) return null;
    const vol = parseFloat(currentMeasurement.volumeDirect || '0');
    if (vol > 0) {
      return classifyLobeVolume(vol);
    }
    return null;
  }, [isVolume, currentMeasurement.volumeDirect]);

  // Calcular TI-RADS em tempo real para o formulário atual
  const currentTIRADSScore = useMemo(() => {
    if (!isNodule || isCyst) return null;
    return calculateTIRADSScore(currentMeasurement);
  }, [currentMeasurement, isNodule, isCyst]);

  const currentTIRADSCategory = useMemo(() => {
    if (currentTIRADSScore === null) return null;
    return getTIRADSCategory(currentTIRADSScore);
  }, [currentTIRADSScore]);

  const handleAddInstance = () => {
    const hasExtraFieldData = finding.extraFields?.some(field => {
      if (typeof field === 'string') return false;
      return !!(currentMeasurement as Record<string, string>)[field.id];
    });
    
    if (currentMeasurement.size ||
        currentMeasurement.location ||
        currentMeasurement.composition ||
        currentMeasurement.echogenicity ||
        currentMeasurement.shape ||
        currentMeasurement.margins ||
        currentMeasurement.echogenicFoci ||
        currentMeasurement.vascularityPattern ||
        currentMeasurement.elastography ||
        currentMeasurement.echotexturePattern ||
        currentMeasurement.vascularity ||
        currentMeasurement.thickness ||
        currentMeasurement.volumeDirect ||
        currentMeasurement.suspiciousFeatures ||
        currentMeasurement.level ||
        currentMeasurement.description ||
        hasExtraFieldData) {

      let enrichedMeasurement = { ...currentMeasurement };
      
      if (isNodule && !isCyst) {
        const score = calculateTIRADSScore(currentMeasurement);
        const category = getTIRADSCategory(score);
        enrichedMeasurement.tiradsScore = score;
        enrichedMeasurement.tiradsCategory = category.label;
        enrichedMeasurement.tiradsRecommendation = category.recommendation;
      }
      
      if (isVolume && currentMeasurement.volumeDirect) {
        enrichedMeasurement.volumeCalculated = currentMeasurement.volumeDirect;
        enrichedMeasurement.volumeStatus = directVolumeClassification?.status;
        enrichedMeasurement.volumeLabel = directVolumeClassification?.label;
      }

      const newInstance: FindingInstance = {
        id: Date.now().toString(),
        measurements: enrichedMeasurement
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
    if (organId === 'ltd' || organId === 'lte') {
      return THYROID_LOBE_LOCATION;
    }
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
          <p className="text-xs font-medium text-muted-foreground">Achados descritos:</p>
          {instances.map((instance, index) => {
            const tiradsCategory = instance.measurements.tiradsCategory;
            const tiradsScore = instance.measurements.tiradsScore;
            const tiradsRecommendation = instance.measurements.tiradsRecommendation;
            const tiradsRisk = tiradsCategory ?
              TIRADS_CATEGORIES.find(c => c.label === tiradsCategory)?.risk || 'medium' : 'medium';

            return (
              <div key={instance.id} className="bg-background p-2 rounded-md border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {isNodule ? 'Nódulo' : isLymphNode ? 'Linfonodo' : 'Achado'} {index + 1}
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
                        <p><span className="text-muted-foreground">Dimensões:</span> {instance.measurements.size}</p>
                      )}
                      {instance.measurements.composition && (
                        <p><span className="text-muted-foreground">Composição:</span> {instance.measurements.composition}</p>
                      )}
                      {instance.measurements.echogenicity && (
                        <p><span className="text-muted-foreground">Ecogenicidade:</span> {instance.measurements.echogenicity}</p>
                      )}
                      {instance.measurements.shape && (
                        <p><span className="text-muted-foreground">Forma:</span> {instance.measurements.shape}</p>
                      )}
                      {instance.measurements.margins && (
                        <p><span className="text-muted-foreground">Margens:</span> {instance.measurements.margins}</p>
                      )}
                      {instance.measurements.echogenicFoci && (
                        <p><span className="text-muted-foreground">Focos ecogênicos:</span> {instance.measurements.echogenicFoci}</p>
                      )}
                      {instance.measurements.vascularityPattern && (
                        <p><span className="text-muted-foreground">Vascularização:</span> {instance.measurements.vascularityPattern}</p>
                      )}
                      {instance.measurements.elastography && (
                        <p><span className="text-muted-foreground">Elastografia:</span> {instance.measurements.elastography}</p>
                      )}
                      {instance.measurements.echotexturePattern && (
                        <p><span className="text-muted-foreground">Padrão:</span> {instance.measurements.echotexturePattern}</p>
                      )}
                      {instance.measurements.vascularity && (
                        <p><span className="text-muted-foreground">Vascularização:</span> {instance.measurements.vascularity}</p>
                      )}
                      {instance.measurements.thickness && (
                        <p><span className="text-muted-foreground">Espessura:</span> {instance.measurements.thickness} mm</p>
                      )}
                      {(instance.measurements.comprimento || instance.measurements.ap || instance.measurements.transverso) && (
                        <p><span className="text-muted-foreground">Dimensões:</span> {instance.measurements.comprimento} × {instance.measurements.ap} × {instance.measurements.transverso} mm</p>
                      )}
                      {instance.measurements.volumeCalculated && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-muted-foreground">Volume:</span>
                          <span className="font-medium">{instance.measurements.volumeCalculated} mL</span>
                          <Badge className={`text-xs ${
                            instance.measurements.volumeStatus === 'normal' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                            instance.measurements.volumeStatus === 'increased' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                            'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          }`}>
                            {instance.measurements.volumeLabel}
                          </Badge>
                        </div>
                      )}
                      {instance.measurements.level && (
                        <p><span className="text-muted-foreground">Nível:</span> {instance.measurements.level}</p>
                      )}
                      {instance.measurements.suspiciousFeatures && (
                        <p><span className="text-muted-foreground">Características:</span> {instance.measurements.suspiciousFeatures}</p>
                      )}
                      {instance.measurements.description && (
                        <p><span className="text-muted-foreground">Obs:</span> {instance.measurements.description}</p>
                      )}

                      {/* Badge TI-RADS para nódulos */}
                      {isNodule && !isCyst && tiradsCategory && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getTIRADSBadgeColor(tiradsRisk)}`}>
                              <Sparkles size={10} className="mr-1" />
                              {tiradsCategory} ({tiradsScore} pontos)
                            </Badge>
                          </div>
                          {tiradsRecommendation && (
                            <p className="text-xs text-muted-foreground italic">
                              → {tiradsRecommendation}
                            </p>
                          )}
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
      {(finding.hasMeasurement || finding.hasLocation || (finding.extraFields && finding.extraFields.length > 0)) && (
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

              {/* Size Input */}
              {finding.hasMeasurement && (isNodule || isCyst) && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                    <Ruler size={12} />
                    Dimensões:
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: 15 x 12 x 10 mm"
                    value={currentMeasurement.size || ''}
                    onChange={(e) => setCurrentMeasurement({...currentMeasurement, size: e.target.value})}
                    className="h-7 text-xs flex-1"
                  />
                </div>
              )}

              {/* Campos específicos para NÓDULOS TIREOIDIANOS */}
              {isNodule && !isCyst && (
                <>
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
                        {NODULE_COMPOSITION.map(c => (
                          <SelectItem key={c.value} value={c.label}>
                            {c.label} ({c.points}pt)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                        {NODULE_ECHOGENICITY.map(e => (
                          <SelectItem key={e.value} value={e.label}>
                            {e.label} ({e.points}pt)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Forma:
                    </label>
                    <Select
                      value={currentMeasurement.shape || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, shape: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {NODULE_SHAPE.map(s => (
                          <SelectItem key={s.value} value={s.label}>
                            {s.label} ({s.points}pt)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Margens:
                    </label>
                    <Select
                      value={currentMeasurement.margins || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, margins: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {NODULE_MARGINS.map(m => (
                          <SelectItem key={m.value} value={m.label}>
                            {m.label} ({m.points}pt)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Focos ecogênicos:
                    </label>
                    <Select
                      value={currentMeasurement.echogenicFoci || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, echogenicFoci: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {ECHOGENIC_FOCI.map(f => (
                          <SelectItem key={f.value} value={f.label}>
                            {f.label} ({f.points}pt)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                      <Activity size={12} />
                      Doppler:
                    </label>
                    <Select
                      value={currentMeasurement.vascularityPattern || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, vascularityPattern: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {VASCULARITY_PATTERN.map(v => (
                          <SelectItem key={v.value} value={v.label}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Elastografia:
                    </label>
                    <Select
                      value={currentMeasurement.elastography || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, elastography: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Opcional..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {ELASTOGRAPHY_SCORE.map(e => (
                          <SelectItem key={e.value} value={e.label}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* TI-RADS Preview em tempo real */}
                  {currentTIRADSScore !== null && currentTIRADSCategory && (
                    <div className="p-2 bg-background/50 rounded-md border border-accent/30">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-accent" />
                        <span className="text-xs font-medium text-muted-foreground">Classificação TI-RADS:</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className={`text-xs ${getTIRADSBadgeColor(currentTIRADSCategory.risk)}`}>
                          {currentTIRADSCategory.label} ({currentTIRADSScore} pontos)
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        → {currentTIRADSCategory.recommendation}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Campos específicos para ALTERAÇÃO DE ECOTEXTURA */}
              {isEchotexture && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Padrão:
                    </label>
                    <Select
                      value={currentMeasurement.echotexturePattern || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, echotexturePattern: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {PARENCHYMA_ECHOTEXTURE.map(p => (
                          <SelectItem key={p.value} value={p.label}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Vascularização:
                    </label>
                    <Select
                      value={currentMeasurement.vascularity || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, vascularity: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {PARENCHYMA_VASCULARITY.map(v => (
                          <SelectItem key={v.value} value={v.label}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Campos específicos para ESPESSAMENTO DO ISTMO */}
              {isIsthmusThickening && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                    <Ruler size={12} />
                    Espessura:
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: 8 mm"
                    value={currentMeasurement.thickness || ''}
                    onChange={(e) => setCurrentMeasurement({...currentMeasurement, thickness: e.target.value})}
                    className="h-7 text-xs flex-1"
                  />
                </div>
              )}

              {/* Campos específicos para VOLUME DO LOBO */}
              {isVolume && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px] flex items-center gap-1">
                      <Activity size={12} />
                      Volume:
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 6.5"
                      value={currentMeasurement.volumeDirect || ''}
                      onChange={(e) => setCurrentMeasurement({...currentMeasurement, volumeDirect: e.target.value})}
                      className="h-7 text-xs flex-1"
                    />
                    <span className="text-xs text-muted-foreground">mL</span>
                  </div>

                  {/* Classificação em tempo real */}
                  {directVolumeClassification && (
                    <div className="p-2 bg-background/50 rounded-md border border-accent/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Classificação:</span>
                        <Badge className={`text-xs ${
                          directVolumeClassification.color === 'green' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                          directVolumeClassification.color === 'red' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                          'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }`}>
                          {directVolumeClassification.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ref: Normal ≤ {THYROID_VOLUME_REFERENCE.lobe.normal} mL por lobo
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Campos específicos para LINFONODOS */}
              {isLymphNode && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground min-w-[80px]">
                      Nível:
                    </label>
                    <Select
                      value={currentMeasurement.level || ''}
                      onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, level: value})}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        <SelectItem value="Nível I (submandibular)">Nível I (submandibular)</SelectItem>
                        <SelectItem value="Nível II (jugular superior)">Nível II (jugular superior)</SelectItem>
                        <SelectItem value="Nível III (jugular médio)">Nível III (jugular médio)</SelectItem>
                        <SelectItem value="Nível IV (jugular inferior)">Nível IV (jugular inferior)</SelectItem>
                        <SelectItem value="Nível V (triângulo posterior)">Nível V (triângulo posterior)</SelectItem>
                        <SelectItem value="Nível VI (compartimento central)">Nível VI (compartimento central)</SelectItem>
                        <SelectItem value="Nível VII (mediastino superior)">Nível VII (mediastino superior)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {finding.id.includes('suspeito') && (
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-medium text-muted-foreground min-w-[80px] pt-1 flex items-center gap-1">
                        <ShieldAlert size={12} />
                        Características:
                      </label>
                      <textarea
                        placeholder="Ex: Perda do hilo, forma arredondada..."
                        value={currentMeasurement.suspiciousFeatures || ''}
                        onChange={(e) => setCurrentMeasurement({...currentMeasurement, suspiciousFeatures: e.target.value})}
                        className="flex-1 min-h-[40px] p-1.5 text-xs bg-background border rounded-md resize-none"
                      />
                    </div>
                  )}
                </>
              )}

              {/* ExtraFields genéricos (para Paratireoides e outros) */}
              {finding.extraFields && finding.extraFields.length > 0 && !isNodule && !isEchotexture && !isLymphNode && !isIsthmusThickening && !isVolume && !isCyst && (
                <>
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
                            value={(currentMeasurement as Record<string, string>)[id] || ''}
                            onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, [id]: value})}
                          >
                            <SelectTrigger className="h-7 text-xs flex-1">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px] overflow-y-auto">
                              {options.map((opt: string) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
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
                          <textarea
                            placeholder={placeholder || ''}
                            value={(currentMeasurement as Record<string, string>)[id] || ''}
                            onChange={(e) => setCurrentMeasurement({...currentMeasurement, [id]: e.target.value})}
                            className="flex-1 min-h-[40px] p-1.5 text-xs bg-background border rounded-md resize-none"
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
                          value={(currentMeasurement as Record<string, string>)[id] || ''}
                          onChange={(e) => setCurrentMeasurement({...currentMeasurement, [id]: e.target.value})}
                          className="h-7 text-xs flex-1"
                        />
                      </div>
                    );
                  })}
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
                    !currentMeasurement.size &&
                    !currentMeasurement.location &&
                    !currentMeasurement.composition &&
                    !currentMeasurement.echogenicity &&
                    !currentMeasurement.shape &&
                    !currentMeasurement.margins &&
                    !currentMeasurement.echogenicFoci &&
                    !currentMeasurement.vascularityPattern &&
                    !currentMeasurement.elastography &&
                    !currentMeasurement.echotexturePattern &&
                    !currentMeasurement.vascularity &&
                    !currentMeasurement.thickness &&
                    !currentMeasurement.volumeDirect &&
                    !currentMeasurement.level &&
                    !currentMeasurement.suspiciousFeatures &&
                    !currentMeasurement.description &&
                    !finding.extraFields?.some(field => {
                      if (typeof field === 'string') return false;
                      return !!(currentMeasurement as Record<string, string>)[field.id];
                    })
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

export default React.memo(ThyroidFindingDetailsComponent, (prevProps, nextProps) => {
  return (
    prevProps.finding.id === nextProps.finding.id &&
    prevProps.organId === nextProps.organId &&
    prevProps.severity === nextProps.severity &&
    prevProps.instances?.length === nextProps.instances?.length
  );
});
