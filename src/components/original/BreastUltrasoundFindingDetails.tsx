import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Finding } from '@/data/organs';
import { FindingMeasurement, FindingInstance } from '@/types/report';
import { Ruler, MapPin, Plus, X, Save, Calculator, AlertTriangle, CheckCircle, Info, Stethoscope, ChevronDown, ChevronUp } from 'lucide-react';
import {
  BREAST_QUADRANTS,
  BREAST_DEPTH,
  NODULE_SHAPE,
  NODULE_ORIENTATION,
  NODULE_MARGINS,
  NODULE_ECHO_PATTERN,
  POSTERIOR_FEATURES,
  CALCIFICATIONS,
  DOPPLER_FLOW,
  VASCULAR_PATTERN,
  RESISTIVITY_INDEX,
  SWE_EMEAN_RANGES,
  SWE_EMAX_RANGES,
  SWE_QUALITATIVE,
  CYST_CLASSIFICATION,
  CYST_COMPLEXITY_CRITERIA,
  CLOCK_POSITION,
  getBiradsColor,
  calculateBiradsCategory,
  BiradsCalculationInput
} from '@/data/breastUltrasoundOrgans';

interface BreastUltrasoundFindingDetailsProps {
  finding: Finding;
  organId: string;
  severity?: string;
  instances?: FindingInstance[];
  onSeverityChange: (severity: string) => void;
  onInstancesChange: (instances: FindingInstance[]) => void;
}

const getLabelValue = (options: readonly { value: string; label: string }[], label: string): string | undefined => {
  return options.find(o => o.label === label)?.value;
};

export default function BreastUltrasoundFindingDetails({
  finding,
  organId,
  instances = [],
  onInstancesChange
}: BreastUltrasoundFindingDetailsProps) {
  const [currentMeasurement, setCurrentMeasurement] = useState<FindingMeasurement>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [showDoppler, setShowDoppler] = useState(false);
  const [showElastography, setShowElastography] = useState(false);

  const isNodule = finding.id === 'nodulo';
  const isCyst = finding.id === 'cisto';

  const biradsCalculation = useMemo(() => {
    if (!isNodule) return null;
    
    const input: BiradsCalculationInput = {
      shape: getLabelValue(NODULE_SHAPE, currentMeasurement.shape as string),
      orientation: getLabelValue(NODULE_ORIENTATION, currentMeasurement.orientation as string),
      margins: getLabelValue(NODULE_MARGINS, currentMeasurement.margins as string),
      echoPattern: getLabelValue(NODULE_ECHO_PATTERN, currentMeasurement.echoPattern as string),
      posteriorFeatures: getLabelValue(POSTERIOR_FEATURES, currentMeasurement.posteriorFeatures as string),
      calcifications: getLabelValue(CALCIFICATIONS, currentMeasurement.calcifications as string),
      vascularPattern: getLabelValue(VASCULAR_PATTERN, currentMeasurement.vascularPattern as string),
      sweEmean: getLabelValue(SWE_EMEAN_RANGES, currentMeasurement.sweEmean as string),
      sweEmax: getLabelValue(SWE_EMAX_RANGES, currentMeasurement.sweEmax as string),
      sweQualitative: getLabelValue(SWE_QUALITATIVE, currentMeasurement.sweQualitative as string)
    };

    const hasMinimumData = Object.values(input).filter(v => v).length >= 2;
    if (!hasMinimumData) return null;

    return calculateBiradsCategory(input);
  }, [currentMeasurement, isNodule]);

  const handleAddInstance = () => {
    const hasData = currentMeasurement.size || currentMeasurement.location || 
                    Object.keys(currentMeasurement).some(key => 
                      !['size', 'location'].includes(key) && currentMeasurement[key as keyof FindingMeasurement]
                    );

    if (hasData) {
      const newInstance: FindingInstance = {
        id: Date.now().toString(),
        measurements: { 
          ...currentMeasurement,
          ...(biradsCalculation ? {
            biradsCategory: biradsCalculation.categoryLabel,
            biradsPoints: biradsCalculation.points,
            biradsVpp: biradsCalculation.vpp
          } : {}),
          selectedDiagnoses: selectedDiagnoses.length > 0 ? selectedDiagnoses : undefined
        }
      };
      onInstancesChange([...instances, newInstance]);
      setCurrentMeasurement({});
      setSelectedDiagnoses([]);
      setIsEditing(false);
      setShowDoppler(false);
      setShowElastography(false);
    }
  };

  const handleRemoveInstance = (id: string) => {
    onInstancesChange(instances.filter(inst => inst.id !== id));
  };

  const handleDiagnosisToggle = (diagnosisId: string) => {
    setSelectedDiagnoses(prev => 
      prev.includes(diagnosisId) 
        ? prev.filter(d => d !== diagnosisId)
        : [...prev, diagnosisId]
    );
  };

  const renderInstances = () => {
    if (instances.length === 0) return null;

    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {instances.length} {instances.length === 1 ? 'lesão descrita' : 'lesões descritas'}:
        </p>
        {instances.map((instance, index) => {
          const birads = instance.measurements.biradsCategory as string;
          const diagnoses = instance.measurements.selectedDiagnoses as string[] | undefined;

          return (
            <div key={instance.id} className="bg-background p-2 rounded-md border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      Lesão {index + 1}
                    </Badge>
                    {birads && (
                      <Badge className={`text-xs ${getBiradsColor(birads)}`}>
                        {birads.split(' - ')[0]}
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
                    {instance.measurements.clockPosition && (
                      <p><span className="font-medium">Posição:</span> {instance.measurements.clockPosition}</p>
                    )}
                    {instance.measurements.shape && (
                      <p><span className="font-medium">Forma:</span> {instance.measurements.shape}</p>
                    )}
                    {instance.measurements.margins && (
                      <p><span className="font-medium">Margens:</span> {instance.measurements.margins}</p>
                    )}
                    {instance.measurements.orientation && (
                      <p><span className="font-medium">Orientação:</span> {instance.measurements.orientation}</p>
                    )}
                    {instance.measurements.echoPattern && (
                      <p><span className="font-medium">Ecogenicidade:</span> {instance.measurements.echoPattern}</p>
                    )}
                    {instance.measurements.vascularPattern && (
                      <p><span className="font-medium">Doppler:</span> {instance.measurements.vascularPattern}</p>
                    )}
                    {instance.measurements.sweEmean && (
                      <p><span className="font-medium">SWE:</span> {instance.measurements.sweEmean}</p>
                    )}
                    {diagnoses && diagnoses.length > 0 && (
                      <p className="text-blue-400">
                        <span className="font-medium">Diagnóstico sugerido:</span> {diagnoses.join(', ')}
                      </p>
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

  const renderNoduleForm = () => (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[70px] flex items-center gap-1">
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

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[70px] flex items-center gap-1">
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
            <SelectContent>
              {BREAST_QUADRANTS.map(q => (
                <SelectItem key={q.value} value={q.label}>{q.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-border pt-2">
        <p className="text-xs font-semibold text-blue-400 mb-2">Léxico BI-RADS</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground min-w-[70px]">Forma:</label>
            <Select
              value={currentMeasurement.shape || ''}
              onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, shape: value})}
            >
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {NODULE_SHAPE.map(s => (
                  <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground min-w-[70px]">Orientação:</label>
            <Select
              value={currentMeasurement.orientation || ''}
              onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, orientation: value})}
            >
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {NODULE_ORIENTATION.map(o => (
                  <SelectItem key={o.value} value={o.label}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground min-w-[70px]">Margens:</label>
            <Select
              value={currentMeasurement.margins || ''}
              onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, margins: value})}
            >
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {NODULE_MARGINS.map(m => (
                  <SelectItem key={m.value} value={m.label}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground min-w-[70px]">Ecogenicidade:</label>
            <Select
              value={currentMeasurement.echoPattern || ''}
              onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, echoPattern: value})}
            >
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {NODULE_ECHO_PATTERN.map(e => (
                  <SelectItem key={e.value} value={e.label}>{e.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground min-w-[70px]">Posterior:</label>
            <Select
              value={currentMeasurement.posteriorFeatures || ''}
              onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, posteriorFeatures: value})}
            >
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {POSTERIOR_FEATURES.map(p => (
                  <SelectItem key={p.value} value={p.label}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground min-w-[70px]">Calcificações:</label>
            <Select
              value={currentMeasurement.calcifications || ''}
              onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, calcifications: value})}
            >
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {CALCIFICATIONS.map(c => (
                  <SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-2">
        <button
          type="button"
          onClick={() => setShowDoppler(!showDoppler)}
          className="flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showDoppler ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Vascularização (Doppler)
        </button>
        
        {showDoppler && (
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground min-w-[70px]">Fluxo:</label>
              <Select
                value={currentMeasurement.dopplerFlow || ''}
                onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, dopplerFlow: value})}
              >
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {DOPPLER_FLOW.map(d => (
                    <SelectItem key={d.value} value={d.label}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground min-w-[70px]">Padrão:</label>
              <Select
                value={currentMeasurement.vascularPattern || ''}
                onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, vascularPattern: value})}
              >
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {VASCULAR_PATTERN.map(v => (
                    <SelectItem key={v.value} value={v.label}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground min-w-[70px]">IR:</label>
              <Select
                value={currentMeasurement.resistivityIndex || ''}
                onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, resistivityIndex: value})}
              >
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Índice de Resistividade (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {RESISTIVITY_INDEX.map(r => (
                    <SelectItem key={r.value} value={r.label}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-2">
        <button
          type="button"
          onClick={() => setShowElastography(!showElastography)}
          className="flex items-center gap-2 text-xs font-semibold text-green-400 hover:text-green-300 transition-colors"
        >
          {showElastography ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Elastografia (SWE)
        </button>
        
        {showElastography && (
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground min-w-[70px]">Emean:</label>
              <Select
                value={currentMeasurement.sweEmean || ''}
                onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, sweEmean: value})}
              >
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {SWE_EMEAN_RANGES.map(e => (
                    <SelectItem key={e.value} value={e.label}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground min-w-[70px]">Emax:</label>
              <Select
                value={currentMeasurement.sweEmax || ''}
                onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, sweEmax: value})}
              >
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {SWE_EMAX_RANGES.map(e => (
                    <SelectItem key={e.value} value={e.label}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground min-w-[70px]">Qualitativo:</label>
              <Select
                value={currentMeasurement.sweQualitative || ''}
                onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, sweQualitative: value})}
              >
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Padrão de cor" />
                </SelectTrigger>
                <SelectContent>
                  {SWE_QUALITATIVE.map(s => (
                    <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground min-w-[70px]">Emean (kPa):</label>
              <Input
                type="text"
                placeholder="Ex: 25.3"
                value={currentMeasurement.sweEmeanValue || ''}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, sweEmeanValue: e.target.value})}
                className="h-7 text-xs flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground min-w-[70px]">Emax (kPa):</label>
              <Input
                type="text"
                placeholder="Ex: 32.1"
                value={currentMeasurement.sweEmaxValue || ''}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, sweEmaxValue: e.target.value})}
                className="h-7 text-xs flex-1"
              />
            </div>
          </div>
        )}
      </div>

      {biradsCalculation && (
        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Calculator size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-blue-400">Calculadora BI-RADS</span>
          </div>

          <div className="bg-background/50 rounded-md p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Badge className={`text-sm px-3 py-1 ${getBiradsColor(biradsCalculation.categoryLabel)}`}>
                BI-RADS {biradsCalculation.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                VPP: {biradsCalculation.vpp} | Pontos: {biradsCalculation.points}
              </span>
            </div>

            {biradsCalculation.alerts.length > 0 && (
              <div className="space-y-1">
                {biradsCalculation.alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-1 text-xs">
                    {alert.startsWith('✓') ? (
                      <CheckCircle size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                    ) : alert.startsWith('⚠️') ? (
                      <AlertTriangle size={12} className="text-orange-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={alert.startsWith('✓') ? 'text-green-400' : alert.startsWith('⚠️') ? 'text-orange-400' : 'text-blue-400'}>
                      {alert.replace(/^[✓⚠️ℹ️🚨]\s*/, '')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {biradsCalculation.reasoning.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Análise:</span>
                <ul className="mt-1 space-y-0.5 pl-2">
                  {biradsCalculation.reasoning.slice(0, 4).map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                  {biradsCalculation.reasoning.length > 4 && (
                    <li className="text-muted-foreground/60">+ {biradsCalculation.reasoning.length - 4} mais...</li>
                  )}
                </ul>
              </div>
            )}

            {biradsCalculation.suggestedDiagnoses.length > 0 && (
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope size={12} className="text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-400">Sugestões Diagnósticas</span>
                </div>
                <div className="space-y-1.5">
                  {biradsCalculation.suggestedDiagnoses.map(diag => (
                    <div
                      key={diag.id}
                      className="flex items-start gap-2 p-1.5 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleDiagnosisToggle(diag.label)}
                    >
                      <Checkbox
                        checked={selectedDiagnoses.includes(diag.label)}
                        onCheckedChange={() => handleDiagnosisToggle(diag.label)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-medium">{diag.label}</span>
                        <p className="text-xs text-muted-foreground">{diag.typical}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderCystForm = () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground min-w-[70px] flex items-center gap-1">
          <Ruler size={12} />
          Tamanho:
        </label>
        <Input
          type="text"
          placeholder="Ex: 0.8 cm"
          value={currentMeasurement.size || ''}
          onChange={(e) => setCurrentMeasurement({...currentMeasurement, size: e.target.value})}
          className="h-7 text-xs flex-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground min-w-[70px] flex items-center gap-1">
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
          <SelectContent>
            {BREAST_QUADRANTS.map(q => (
              <SelectItem key={q.value} value={q.label}>{q.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground min-w-[70px]">Classificação:</label>
        <Select
          value={currentMeasurement.cystType || ''}
          onValueChange={(value) => {
            const cyst = CYST_CLASSIFICATION.find(c => c.label === value);
            setCurrentMeasurement({
              ...currentMeasurement, 
              cystType: value,
              biradsCategory: cyst ? `BI-RADS ${cyst.birads}` : undefined
            });
          }}
        >
          <SelectTrigger className="h-7 text-xs flex-1">
            <SelectValue placeholder="Tipo de cisto..." />
          </SelectTrigger>
          <SelectContent>
            {CYST_CLASSIFICATION.map(c => (
              <SelectItem key={c.value} value={c.label}>
                {c.label} (BI-RADS {c.birads})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentMeasurement.cystType === 'Cisto complexo' && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[70px]">Critério:</label>
          <Select
            value={currentMeasurement.complexity || ''}
            onValueChange={(value) => {
              const criteria = CYST_COMPLEXITY_CRITERIA.find(c => c.label === value);
              setCurrentMeasurement({
                ...currentMeasurement, 
                complexity: value,
                biradsCategory: criteria ? `BI-RADS ${criteria.birads}` : undefined
              });
            }}
          >
            <SelectTrigger className="h-7 text-xs flex-1">
              <SelectValue placeholder="Critério de complexidade..." />
            </SelectTrigger>
            <SelectContent>
              {CYST_COMPLEXITY_CRITERIA.map(c => (
                <SelectItem key={c.value} value={c.label}>
                  {c.label} → BI-RADS {c.birads}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {currentMeasurement.biradsCategory && (
        <div className="flex items-center gap-2 pt-2">
          <Badge className={`text-xs ${getBiradsColor(currentMeasurement.biradsCategory as string)}`}>
            {currentMeasurement.biradsCategory}
          </Badge>
        </div>
      )}
    </div>
  );

  const renderGenericForm = () => (
    <div className="space-y-2">
      {finding.hasMeasurement && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[70px] flex items-center gap-1">
            <Ruler size={12} />
            Tamanho:
          </label>
          <Input
            type="text"
            placeholder="Ex: 1.0 cm"
            value={currentMeasurement.size || ''}
            onChange={(e) => setCurrentMeasurement({...currentMeasurement, size: e.target.value})}
            className="h-7 text-xs flex-1"
          />
        </div>
      )}

      {finding.hasLocation && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[70px] flex items-center gap-1">
            <MapPin size={12} />
            Localização:
          </label>
          <Input
            type="text"
            placeholder="Descreva a localização..."
            value={currentMeasurement.location || ''}
            onChange={(e) => setCurrentMeasurement({...currentMeasurement, location: e.target.value})}
            className="h-7 text-xs flex-1"
          />
        </div>
      )}

      {finding.extraFields?.map((field) => {
        if (typeof field === 'string') return null;
        return (
          <div key={field.id} className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground min-w-[70px]">
              {field.label}:
            </label>
            {field.type === 'select' ? (
              <Select
                value={(currentMeasurement as Record<string, string>)[field.id] || ''}
                onValueChange={(value) => setCurrentMeasurement({...currentMeasurement, [field.id]: value})}
              >
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder={field.placeholder || "Selecione..."} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={field.type === 'number' ? 'number' : 'text'}
                placeholder={field.placeholder}
                value={(currentMeasurement as Record<string, string>)[field.id] || ''}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, [field.id]: e.target.value})}
                className="h-7 text-xs flex-1"
              />
            )}
          </div>
        );
      })}

      {finding.hasDetails && (
        <div className="flex items-start gap-2">
          <label className="text-xs font-medium text-muted-foreground min-w-[70px] pt-1">
            Observações:
          </label>
          <textarea
            placeholder="Observações adicionais..."
            value={currentMeasurement.description || ''}
            onChange={(e) => setCurrentMeasurement({...currentMeasurement, description: e.target.value})}
            className="flex-1 min-h-[40px] p-1.5 text-xs bg-background border rounded-md resize-none"
          />
        </div>
      )}
    </div>
  );

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
          Adicionar outra lesão
        </Button>
      );
    }

    if (!isEditing && instances.length === 0) {
      setIsEditing(true);
      return null;
    }

    return (
      <div className="space-y-3">
        {isNodule && renderNoduleForm()}
        {isCyst && renderCystForm()}
        {!isNodule && !isCyst && renderGenericForm()}

        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          {instances.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setCurrentMeasurement({});
                setSelectedDiagnoses([]);
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
            disabled={!currentMeasurement.size && !currentMeasurement.location && !currentMeasurement.cystType}
            className="h-7 text-xs"
          >
            <Save size={12} className="mr-1" />
            {instances.length > 0 ? 'Adicionar' : 'Salvar'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="ml-6 mt-2 p-3 bg-muted/50 rounded-md space-y-3 border-l-2 border-accent max-h-[calc(100vh-300px)] overflow-y-auto modern-scrollbar"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {renderInstances()}

      {(finding.hasMeasurement || finding.hasLocation || finding.hasDetails || finding.extraFields) && (
        <>
          {instances.length > 0 && <div className="border-t border-border pt-2" />}
          {renderNewInstanceForm()}
        </>
      )}
    </div>
  );
}
