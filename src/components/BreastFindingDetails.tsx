import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, Trash2, Save, Edit } from 'lucide-react';
import { Finding } from '../data/organs';
import { FindingInstance } from '../types/report';
import {
  BREAST_LOCATIONS,
  CLOCK_POSITIONS,
  NIPPLE_DISTANCES,
  BIRADS_CATEGORIES,
  NODULE_SHAPES,
  NODULE_MARGINS,
  NODULE_ORIENTATION,
  ECHOGENICITY,
  POSTERIOR_FEATURES,
  VASCULARIZATION,
  CALCIFICATION_DISTRIBUTION,
  CYST_CONTENT
} from '../data/breastOrgans';

interface BreastFindingDetailsProps {
  finding: Finding;
  organId: string;
  instances: FindingInstance[];
  onInstancesChange: (instances: FindingInstance[]) => void;
}

interface BreastMeasurement {
  size?: string;
  location?: string;
  clockPosition?: string;
  nippleDistance?: string;
  shape?: string;
  margins?: string;
  orientation?: string;
  echogenicity?: string;
  posteriorFeatures?: string;
  vascularization?: string;
  birads?: string;
  distribution?: string;
  internalContent?: string;
  corticalThickness?: string;
  description?: string;
}

export function BreastFindingDetails({
  finding,
  organId,
  instances,
  onInstancesChange
}: BreastFindingDetailsProps) {
  const [currentMeasurement, setCurrentMeasurement] = useState<BreastMeasurement>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddInstance = () => {
    if (Object.values(currentMeasurement).some(v => v && v.trim() !== '')) {
      const newInstance: FindingInstance = {
        id: Date.now().toString(),
        measurements: currentMeasurement as any
      };
      onInstancesChange([...instances, newInstance]);
      setCurrentMeasurement({});
      setIsEditing(false);
    }
  };

  const handleUpdateInstance = (id: string) => {
    onInstancesChange(
      instances.map(inst =>
        inst.id === id
          ? { ...inst, measurements: currentMeasurement as any }
          : inst
      )
    );
    setCurrentMeasurement({});
    setEditingId(null);
    setIsEditing(false);
  };

  const handleEditInstance = (instance: FindingInstance) => {
    setCurrentMeasurement(instance.measurements as BreastMeasurement);
    setEditingId(instance.id);
    setIsEditing(true);
  };

  const handleDeleteInstance = (id: string) => {
    onInstancesChange(instances.filter(inst => inst.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      handleUpdateInstance(editingId);
    } else {
      handleAddInstance();
    }
  };

  return (
    <div
      className="space-y-4"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Existing instances */}
      {instances.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Lesões adicionadas:</Label>
          {instances.map((instance, index) => (
            <div
              key={instance.id}
              className="p-3 bg-muted/50 rounded-lg text-sm space-y-1"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">Lesão {index + 1}</div>
                  {instance.measurements.size && (
                    <div className="text-xs">Tamanho: {instance.measurements.size}</div>
                  )}
                  {instance.measurements.location && (
                    <div className="text-xs">
                      Localização: {
                        BREAST_LOCATIONS.find(l => l.value === instance.measurements.location)?.label ||
                        instance.measurements.location
                      }
                    </div>
                  )}
                  {(instance.measurements as BreastMeasurement).clockPosition && (
                    <div className="text-xs">
                      Posição: {
                        CLOCK_POSITIONS.find(c => c.value === (instance.measurements as BreastMeasurement).clockPosition)?.label
                      }
                    </div>
                  )}
                  {(instance.measurements as BreastMeasurement).nippleDistance && (
                    <div className="text-xs">
                      Distância: {
                        NIPPLE_DISTANCES.find(d => d.value === (instance.measurements as BreastMeasurement).nippleDistance)?.label
                      }
                    </div>
                  )}
                  {(instance.measurements as BreastMeasurement).birads && (
                    <div className="text-xs font-medium text-primary">
                      {BIRADS_CATEGORIES.find(b => b.value === (instance.measurements as BreastMeasurement).birads)?.label}
                    </div>
                  )}
                  {instance.measurements.description && (
                    <div className="text-xs mt-1 italic">{instance.measurements.description}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => handleEditInstance(instance)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => handleDeleteInstance(instance.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      {(isEditing || instances.length === 0) && (
        <div className="space-y-3 p-3 border border-border rounded-lg bg-background">
          {/* Size */}
          {finding.hasMeasurement && (
            <div>
              <Label htmlFor="size" className="text-xs">Medidas (cm)</Label>
              <Input
                id="size"
                type="text"
                placeholder="Ex: 1.2 x 0.8 x 1.0"
                value={currentMeasurement.size || ''}
                onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, size: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          )}

          {/* Location - Quadrant */}
          {finding.hasLocation && (
            <>
              <div>
                <Label htmlFor="location" className="text-xs">Quadrante/Região</Label>
                <Select
                  value={currentMeasurement.location || ''}
                  onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, location: value })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Selecione o quadrante" />
                  </SelectTrigger>
                  <SelectContent>
                    {BREAST_LOCATIONS.map(loc => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clock position */}
              <div>
                <Label htmlFor="clock" className="text-xs">Posição horária</Label>
                <Select
                  value={currentMeasurement.clockPosition || ''}
                  onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, clockPosition: value })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLOCK_POSITIONS.map(pos => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Distance from nipple */}
              <div>
                <Label htmlFor="distance" className="text-xs">Distância da papila</Label>
                <Select
                  value={currentMeasurement.nippleDistance || ''}
                  onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, nippleDistance: value })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Selecione a distância" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIPPLE_DISTANCES.map(dist => (
                      <SelectItem key={dist.value} value={dist.value}>
                        {dist.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Shape */}
          {finding.hasShape && (
            <div>
              <Label htmlFor="shape" className="text-xs">Forma</Label>
              <Select
                value={currentMeasurement.shape || ''}
                onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, shape: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione a forma" />
                </SelectTrigger>
                <SelectContent>
                  {NODULE_SHAPES.map(shape => (
                    <SelectItem key={shape.value} value={shape.value}>
                      {shape.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Margins */}
          {finding.hasMargins && (
            <div>
              <Label htmlFor="margins" className="text-xs">Margens</Label>
              <Select
                value={currentMeasurement.margins || ''}
                onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, margins: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione as margens" />
                </SelectTrigger>
                <SelectContent>
                  {NODULE_MARGINS.map(margin => (
                    <SelectItem key={margin.value} value={margin.value}>
                      {margin.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Orientation */}
          {finding.hasOrientation && (
            <div>
              <Label htmlFor="orientation" className="text-xs">Orientação</Label>
              <Select
                value={currentMeasurement.orientation || ''}
                onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, orientation: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione a orientação" />
                </SelectTrigger>
                <SelectContent>
                  {NODULE_ORIENTATION.map(orient => (
                    <SelectItem key={orient.value} value={orient.value}>
                      {orient.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Echogenicity */}
          {finding.hasEchogenicity && (
            <div>
              <Label htmlFor="echogenicity" className="text-xs">Ecogenicidade</Label>
              <Select
                value={currentMeasurement.echogenicity || ''}
                onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, echogenicity: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione a ecogenicidade" />
                </SelectTrigger>
                <SelectContent>
                  {ECHOGENICITY.map(echo => (
                    <SelectItem key={echo.value} value={echo.value}>
                      {echo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Posterior Features */}
          {finding.hasPosteriorFeatures && (
            <div>
              <Label htmlFor="posterior" className="text-xs">Características posteriores</Label>
              <Select
                value={currentMeasurement.posteriorFeatures || ''}
                onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, posteriorFeatures: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione as características" />
                </SelectTrigger>
                <SelectContent>
                  {POSTERIOR_FEATURES.map(feat => (
                    <SelectItem key={feat.value} value={feat.value}>
                      {feat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Vascularization */}
          {finding.hasVascularization && (
            <div>
              <Label htmlFor="vascularization" className="text-xs">Vascularização</Label>
              <Select
                value={currentMeasurement.vascularization || ''}
                onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, vascularization: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione a vascularização" />
                </SelectTrigger>
                <SelectContent>
                  {VASCULARIZATION.map(vasc => (
                    <SelectItem key={vasc.value} value={vasc.value}>
                      {vasc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Distribution (for calcifications) */}
          {finding.hasDistribution && (
            <div>
              <Label htmlFor="distribution" className="text-xs">Distribuição</Label>
              <Select
                value={currentMeasurement.distribution || ''}
                onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, distribution: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione a distribuição" />
                </SelectTrigger>
                <SelectContent>
                  {CALCIFICATION_DISTRIBUTION.map(dist => (
                    <SelectItem key={dist.value} value={dist.value}>
                      {dist.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Internal Content (for cysts) */}
          {finding.hasInternalContent && (
            <div>
              <Label htmlFor="content" className="text-xs">Conteúdo interno</Label>
              <Select
                value={currentMeasurement.internalContent || ''}
                onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, internalContent: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione o conteúdo" />
                </SelectTrigger>
                <SelectContent>
                  {CYST_CONTENT.map(content => (
                    <SelectItem key={content.value} value={content.value}>
                      {content.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Cortical Thickness (for lymph nodes) */}
          {finding.hasCorticalThickness && (
            <div>
              <Label htmlFor="cortical" className="text-xs">Espessura cortical (mm)</Label>
              <Input
                id="cortical"
                type="text"
                placeholder="Ex: 3.5"
                value={currentMeasurement.corticalThickness || ''}
                onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, corticalThickness: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          )}

          {/* BI-RADS Classification */}
          {finding.hasBirads && (
            <div>
              <Label htmlFor="birads" className="text-xs font-medium text-primary">Classificação BI-RADS</Label>
              <Select
                value={currentMeasurement.birads || ''}
                onValueChange={(value) => setCurrentMeasurement({ ...currentMeasurement, birads: value })}
              >
                <SelectTrigger className="h-8 text-sm border-primary/50">
                  <SelectValue placeholder="Selecione BI-RADS" />
                </SelectTrigger>
                <SelectContent>
                  {BIRADS_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Additional description */}
          <div>
            <Label htmlFor="description" className="text-xs">Observações adicionais</Label>
            <Input
              id="description"
              type="text"
              placeholder="Detalhes adicionais..."
              value={currentMeasurement.description || ''}
              onChange={(e) => setCurrentMeasurement({ ...currentMeasurement, description: e.target.value })}
              className="h-8 text-sm"
            />
          </div>

          {/* Save button */}
          <Button
            onClick={handleSave}
            size="sm"
            className="w-full"
            disabled={!Object.values(currentMeasurement).some(v => v && v.trim() !== '')}
          >
            <Save className="h-3 w-3 mr-1" />
            {editingId ? 'Atualizar' : 'Salvar Lesão'}
          </Button>
        </div>
      )}

      {/* Add new button */}
      {!isEditing && instances.length > 0 && (
        <Button
          onClick={() => setIsEditing(true)}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <Plus className="h-3 w-3 mr-1" />
          Adicionar Nova Lesão
        </Button>
      )}
    </div>
  );
}