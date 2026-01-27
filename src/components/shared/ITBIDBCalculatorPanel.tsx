import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ITBIDBCalculatorPanelProps {
  data: Record<string, string>;
  onFieldChange: (fieldId: string, value: string) => void;
}

const getITBClassification = (itb: number): { label: string; color: string } => {
  if (isNaN(itb)) return { label: '', color: '' };
  
  if (itb > 1.30) {
    return { label: 'Incompressível (>1.30)', color: 'text-orange-600' };
  } else if (itb >= 0.91 && itb <= 1.30) {
    return { label: 'Normal (0.91-1.30)', color: 'text-green-600' };
  } else if (itb >= 0.70 && itb <= 0.90) {
    return { label: 'Doença leve (0.70-0.90)', color: 'text-yellow-600' };
  } else if (itb >= 0.40 && itb < 0.70) {
    return { label: 'Doença moderada (0.40-0.69)', color: 'text-orange-600' };
  } else {
    return { label: 'Doença grave (<0.40)', color: 'text-red-600' };
  }
};

const getIDBClassification = (idb: number): { label: string; color: string } => {
  if (isNaN(idb)) return { label: '', color: '' };
  
  if (idb > 0.70) {
    return { label: 'Normal (>0.70)', color: 'text-green-600' };
  } else if (idb >= 0.50 && idb <= 0.69) {
    return { label: 'Doença leve (0.50-0.69)', color: 'text-yellow-600' };
  } else if (idb >= 0.30 && idb < 0.50) {
    return { label: 'Doença moderada (0.30-0.49)', color: 'text-orange-600' };
  } else {
    return { label: 'Doença grave (<0.30)', color: 'text-red-600' };
  }
};

export function ITBIDBCalculatorPanel({ data, onFieldChange }: ITBIDBCalculatorPanelProps) {
  const [calculations, setCalculations] = useState({
    itbDireito: 0,
    itbEsquerdo: 0,
    idbDireito: 0,
    idbEsquerdo: 0
  });

  // Calcular ITB automaticamente
  useEffect(() => {
    const pasBraquial = parseFloat(data['pas-braquial'] || '0');
    
    if (pasBraquial > 0) {
      // ITB para tornozelo direito
      const pasTornozDireito = parseFloat(data['pas-tornoz-d'] || '0');
      if (pasTornozDireito > 0) {
        const itbD = pasTornozDireito / pasBraquial;
        const itbDStr = itbD.toFixed(2);
        setCalculations(prev => ({ ...prev, itbDireito: itbD }));
        if (data['itb-direito'] !== itbDStr) {
          onFieldChange('itb-direito', itbDStr);
        }
        // Atualizar classificação
        const classD = getITBClassification(itbD).label;
        if (data['classificacao-d'] !== classD) {
          onFieldChange('classificacao-d', classD);
        }
      }

      // ITB para tornozelo esquerdo
      const pasTornozEsquerdo = parseFloat(data['pas-tornoz-e'] || '0');
      if (pasTornozEsquerdo > 0) {
        const itbE = pasTornozEsquerdo / pasBraquial;
        const itbEStr = itbE.toFixed(2);
        setCalculations(prev => ({ ...prev, itbEsquerdo: itbE }));
        if (data['itb-esquerdo'] !== itbEStr) {
          onFieldChange('itb-esquerdo', itbEStr);
        }
        // Atualizar classificação
        const classE = getITBClassification(itbE).label;
        if (data['classificacao-e'] !== classE) {
          onFieldChange('classificacao-e', classE);
        }
      }

      // IDB para hálux direito
      const pressaoHaluxD = parseFloat(data['pressao-halux-d'] || '0');
      if (pressaoHaluxD > 0) {
        const idbD = pressaoHaluxD / pasBraquial;
        const idbDStr = idbD.toFixed(2);
        setCalculations(prev => ({ ...prev, idbDireito: idbD }));
        if (data['idb-direito'] !== idbDStr) {
          onFieldChange('idb-direito', idbDStr);
        }
        // Atualizar classificação
        const classIDBD = getIDBClassification(idbD).label;
        if (data['classificacao-idb-d'] !== classIDBD) {
          onFieldChange('classificacao-idb-d', classIDBD);
        }
      }

      // IDB para hálux esquerdo
      const pressaoHaluxE = parseFloat(data['pressao-halux-e'] || '0');
      if (pressaoHaluxE > 0) {
        const idbE = pressaoHaluxE / pasBraquial;
        const idbEStr = idbE.toFixed(2);
        setCalculations(prev => ({ ...prev, idbEsquerdo: idbE }));
        if (data['idb-esquerdo'] !== idbEStr) {
          onFieldChange('idb-esquerdo', idbEStr);
        }
        // Atualizar classificação
        const classIDBE = getIDBClassification(idbE).label;
        if (data['classificacao-idb-e'] !== classIDBE) {
          onFieldChange('classificacao-idb-e', classIDBE);
        }
      }
    }
  }, [data, onFieldChange]);

  const pasBraquial = parseFloat(data['pas-braquial'] || '0');
  const hasBraquial = pasBraquial > 0;

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-blue-900">Calculadora ITB/IDB</span>
      </div>

      {/* PAS Braquial - Campo base para cálculos */}
      <div className="mb-4">
        <Label htmlFor="pas-braquial" className="text-sm font-medium text-gray-700">
          PAS Braquial (mmHg) *
        </Label>
        <Input
          id="pas-braquial"
          type="number"
          value={data['pas-braquial'] || ''}
          onChange={(e) => onFieldChange('pas-braquial', e.target.value)}
          placeholder="ex: 120"
          className={cn(
            "mt-1",
            hasBraquial ? "border-green-300 bg-green-50" : ""
          )}
        />
        {!hasBraquial && (
          <p className="text-xs text-gray-500 mt-1">Insira a PAS braquial para habilitar cálculos</p>
        )}
      </div>

      {/* Seção ITB */}
      <div className={cn("space-y-3", !hasBraquial && "opacity-50 pointer-events-none")}>
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          <Activity className="w-4 h-4" />
          Índice Tornozelo-Braquial (ITB)
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {/* ITB Direito */}
          <div>
            <Label className="text-xs text-gray-600">PAS Tornozelo D (mmHg)</Label>
            <Input
              type="number"
              value={data['pas-tornoz-d'] || ''}
              onChange={(e) => onFieldChange('pas-tornoz-d', e.target.value)}
              placeholder="ex: 110"
              className="mt-1"
            />
            {data['pas-tornoz-d'] && hasBraquial && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between bg-white rounded px-2 py-1">
                  <span className="text-xs text-gray-600">ITB:</span>
                  <span className="text-sm font-semibold">{calculations.itbDireito.toFixed(2)}</span>
                </div>
                <div className={cn("text-xs font-medium", getITBClassification(calculations.itbDireito).color)}>
                  {getITBClassification(calculations.itbDireito).label}
                </div>
              </div>
            )}
          </div>

          {/* ITB Esquerdo */}
          <div>
            <Label className="text-xs text-gray-600">PAS Tornozelo E (mmHg)</Label>
            <Input
              type="number"
              value={data['pas-tornoz-e'] || ''}
              onChange={(e) => onFieldChange('pas-tornoz-e', e.target.value)}
              placeholder="ex: 115"
              className="mt-1"
            />
            {data['pas-tornoz-e'] && hasBraquial && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between bg-white rounded px-2 py-1">
                  <span className="text-xs text-gray-600">ITB:</span>
                  <span className="text-sm font-semibold">{calculations.itbEsquerdo.toFixed(2)}</span>
                </div>
                <div className={cn("text-xs font-medium", getITBClassification(calculations.itbEsquerdo).color)}>
                  {getITBClassification(calculations.itbEsquerdo).label}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção IDB */}
      <div className={cn("space-y-3 mt-6", !hasBraquial && "opacity-50 pointer-events-none")}>
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          <Activity className="w-4 h-4" />
          Índice Dedo-Braquial (IDB)
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {/* IDB Direito */}
          <div>
            <Label className="text-xs text-gray-600">Pressão Hálux D (mmHg)</Label>
            <Input
              type="number"
              value={data['pressao-halux-d'] || ''}
              onChange={(e) => onFieldChange('pressao-halux-d', e.target.value)}
              placeholder="ex: 75"
              className="mt-1"
            />
            {data['pressao-halux-d'] && hasBraquial && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between bg-white rounded px-2 py-1">
                  <span className="text-xs text-gray-600">IDB:</span>
                  <span className="text-sm font-semibold">{calculations.idbDireito.toFixed(2)}</span>
                </div>
                <div className={cn("text-xs font-medium", getIDBClassification(calculations.idbDireito).color)}>
                  {getIDBClassification(calculations.idbDireito).label}
                </div>
              </div>
            )}
          </div>

          {/* IDB Esquerdo */}
          <div>
            <Label className="text-xs text-gray-600">Pressão Hálux E (mmHg)</Label>
            <Input
              type="number"
              value={data['pressao-halux-e'] || ''}
              onChange={(e) => onFieldChange('pressao-halux-e', e.target.value)}
              placeholder="ex: 80"
              className="mt-1"
            />
            {data['pressao-halux-e'] && hasBraquial && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between bg-white rounded px-2 py-1">
                  <span className="text-xs text-gray-600">IDB:</span>
                  <span className="text-sm font-semibold">{calculations.idbEsquerdo.toFixed(2)}</span>
                </div>
                <div className={cn("text-xs font-medium", getIDBClassification(calculations.idbEsquerdo).color)}>
                  {getIDBClassification(calculations.idbEsquerdo).label}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interpretação */}
      {hasBraquial && (data['pas-tornoz-d'] || data['pas-tornoz-e'] || data['pressao-halux-d'] || data['pressao-halux-e']) && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            {(calculations.itbDireito < 0.9 || calculations.itbEsquerdo < 0.9 || 
              calculations.idbDireito < 0.7 || calculations.idbEsquerdo < 0.7) ? (
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <p className="font-medium text-gray-700">Interpretação:</p>
              {calculations.itbDireito > 0 && (
                <p>• MID: ITB {calculations.itbDireito.toFixed(2)} - {getITBClassification(calculations.itbDireito).label}</p>
              )}
              {calculations.itbEsquerdo > 0 && (
                <p>• MIE: ITB {calculations.itbEsquerdo.toFixed(2)} - {getITBClassification(calculations.itbEsquerdo).label}</p>
              )}
              {calculations.idbDireito > 0 && (
                <p>• IDB D: {calculations.idbDireito.toFixed(2)} - {getIDBClassification(calculations.idbDireito).label}</p>
              )}
              {calculations.idbEsquerdo > 0 && (
                <p>• IDB E: {calculations.idbEsquerdo.toFixed(2)} - {getIDBClassification(calculations.idbEsquerdo).label}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• ITB = Pressão Tornozelo / Pressão Braquial</p>
        <p>• IDB = Pressão Hálux / Pressão Braquial</p>
        <p>• Valores calculados automaticamente</p>
      </div>
    </Card>
  );
}