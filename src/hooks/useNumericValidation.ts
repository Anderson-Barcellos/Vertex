import { useState, useEffect, useCallback, useRef } from 'react';

export interface NumericRange {
  min: number;
  max: number;
  unit?: string;
  warningMin?: number;
  warningMax?: number;
  criticalMin?: number;
  criticalMax?: number;
}

export interface ValidationResult {
  isValid: boolean;
  value: number | null;
  message?: string;
  severity?: 'normal' | 'warning' | 'error';
}

// Ranges médicos baseados em diretrizes internacionais
const MEDICAL_RANGES: Record<string, NumericRange> = {
  // Doppler Carótidas
  vps: { min: 0, max: 500, unit: 'cm/s', warningMin: 125, warningMax: 230, criticalMax: 400 },
  vdf: { min: 0, max: 200, unit: 'cm/s', warningMin: 40, warningMax: 100, criticalMax: 150 },
  ratio: { min: 0, max: 10, warningMin: 2, warningMax: 4, criticalMax: 6 },
  
  // Espessura Médio-Intimal
  emi: { min: 0, max: 3, unit: 'mm', warningMin: 0.9, warningMax: 1.5, criticalMax: 2.0 },
  emiValue: { min: 0, max: 3, unit: 'mm', warningMin: 0.9, warningMax: 1.5, criticalMax: 2.0 },
  
  // Medidas gerais
  thickness: { min: 0, max: 50, unit: 'mm' },
  diameter: { min: 0, max: 200, unit: 'mm' },
  length: { min: 0, max: 500, unit: 'mm' },
  width: { min: 0, max: 200, unit: 'mm' },
  height: { min: 0, max: 200, unit: 'mm' },
  
  // Volume tireoidiano
  volume: { min: 0, max: 100, unit: 'ml', warningMax: 25 },
  thyroidVolume: { min: 0, max: 50, unit: 'ml', warningMax: 18 },
  
  // ITB/IDB
  pressure: { min: 0, max: 300, unit: 'mmHg', warningMin: 90, warningMax: 180 },
  itb: { min: 0, max: 2.0, warningMin: 0.9, criticalMin: 0.4 },
  idb: { min: 0, max: 2.0, warningMin: 0.6, criticalMin: 0.3 },
  
  // Porcentagem de estenose
  stenosis: { min: 0, max: 100, unit: '%', warningMin: 50, criticalMin: 70 },
  nascet: { min: 0, max: 100, unit: '%', warningMin: 50, criticalMin: 70 },
  
  // Fluxo
  flow: { min: 0, max: 2000, unit: 'ml/min' },
  resistance: { min: 0, max: 2.0 },
  pulsatility: { min: 0, max: 5.0 },
  
  // Nódulos/Lesões
  noduleSize: { min: 0, max: 100, unit: 'mm', warningMax: 10, criticalMax: 20 },
  lesionSize: { min: 0, max: 200, unit: 'mm', warningMax: 20, criticalMax: 50 }
};

// Função para identificar o tipo de campo baseado no nome
const identifyFieldType = (fieldName: string): string => {
  const normalized = fieldName.toLowerCase();
  
  // Matches exatos primeiro
  if (MEDICAL_RANGES[normalized]) return normalized;
  
  // Padrões comuns
  if (normalized.includes('vps') || normalized.includes('velocidade') || normalized.includes('sistol')) return 'vps';
  if (normalized.includes('vdf') || normalized.includes('diast')) return 'vdf';
  if (normalized.includes('emi') || normalized.includes('intima')) return 'emi';
  if (normalized.includes('ratio') || normalized.includes('razao')) return 'ratio';
  if (normalized.includes('volume')) return 'volume';
  if (normalized.includes('espess') || normalized.includes('thick')) return 'thickness';
  if (normalized.includes('diametro') || normalized.includes('diameter')) return 'diameter';
  if (normalized.includes('comprim') || normalized.includes('length')) return 'length';
  if (normalized.includes('largura') || normalized.includes('width')) return 'width';
  if (normalized.includes('altura') || normalized.includes('height')) return 'height';
  if (normalized.includes('pressao') || normalized.includes('pressure')) return 'pressure';
  if (normalized.includes('estenose') || normalized.includes('stenosis')) return 'stenosis';
  if (normalized.includes('nascet')) return 'nascet';
  if (normalized.includes('itb')) return 'itb';
  if (normalized.includes('idb')) return 'idb';
  if (normalized.includes('nodulo') || normalized.includes('nodule')) return 'noduleSize';
  if (normalized.includes('lesao') || normalized.includes('lesion')) return 'lesionSize';
  if (normalized.includes('fluxo') || normalized.includes('flow')) return 'flow';
  if (normalized.includes('resist')) return 'resistance';
  if (normalized.includes('pulsat')) return 'pulsatility';
  
  // Default para medida genérica
  return 'diameter';
};

export const useNumericValidation = (
  fieldName: string,
  customRange?: NumericRange
) => {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    value: null
  });
  
  const debounceRef = useRef<NodeJS.Timeout>();
  
  const fieldType = identifyFieldType(fieldName);
  const range = customRange || MEDICAL_RANGES[fieldType] || MEDICAL_RANGES.diameter;
  
  const validate = useCallback((inputValue: string): ValidationResult => {
    // Remove espaços e virgulas (aceita vírgula como decimal)
    const cleanValue = inputValue.trim().replace(',', '.');
    
    // Se vazio, é válido mas sem valor
    if (!cleanValue) {
      return { isValid: true, value: null };
    }
    
    // Verifica se é número válido
    const numValue = parseFloat(cleanValue);
    if (isNaN(numValue)) {
      return {
        isValid: false,
        value: null,
        message: 'Valor deve ser numérico',
        severity: 'error'
      };
    }
    
    // Verifica ranges
    if (numValue < range.min || numValue > range.max) {
      return {
        isValid: false,
        value: numValue,
        message: `Valor deve estar entre ${range.min} e ${range.max}${range.unit ? ' ' + range.unit : ''}`,
        severity: 'error'
      };
    }
    
    // Verifica valores críticos
    if (range.criticalMin !== undefined && numValue < range.criticalMin) {
      return {
        isValid: true,
        value: numValue,
        message: `Valor criticamente baixo (< ${range.criticalMin}${range.unit ? ' ' + range.unit : ''})`,
        severity: 'error'
      };
    }
    
    if (range.criticalMax !== undefined && numValue > range.criticalMax) {
      return {
        isValid: true,
        value: numValue,
        message: `Valor criticamente alto (> ${range.criticalMax}${range.unit ? ' ' + range.unit : ''})`,
        severity: 'error'
      };
    }
    
    // Verifica valores de aviso
    if (range.warningMin !== undefined && numValue < range.warningMin) {
      return {
        isValid: true,
        value: numValue,
        message: `Valor abaixo do esperado (< ${range.warningMin}${range.unit ? ' ' + range.unit : ''})`,
        severity: 'warning'
      };
    }
    
    if (range.warningMax !== undefined && numValue > range.warningMax) {
      return {
        isValid: true,
        value: numValue,
        message: `Valor acima do esperado (> ${range.warningMax}${range.unit ? ' ' + range.unit : ''})`,
        severity: 'warning'
      };
    }
    
    // Valor normal
    return {
      isValid: true,
      value: numValue,
      severity: 'normal'
    };
  }, [range]);
  
  const validateWithDebounce = useCallback((value: string) => {
    // Validação imediata para erros graves
    const immediateResult = validate(value);
    if (!immediateResult.isValid) {
      setValidation(immediateResult);
      return;
    }
    
    // Debounce para validações de warning
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setValidation(validate(value));
    }, 500);
  }, [validate]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  return {
    validation,
    validate: validateWithDebounce,
    range,
    fieldType
  };
};

// Hook para validar múltiplos campos
export const useMultipleNumericValidation = () => {
  const [validations, setValidations] = useState<Record<string, ValidationResult>>({});
  
  const validateField = useCallback((fieldName: string, value: string) => {
    const fieldType = identifyFieldType(fieldName);
    const range = MEDICAL_RANGES[fieldType] || MEDICAL_RANGES.diameter;
    
    const cleanValue = value.trim().replace(',', '.');
    
    if (!cleanValue) {
      setValidations(prev => ({
        ...prev,
        [fieldName]: { isValid: true, value: null }
      }));
      return;
    }
    
    const numValue = parseFloat(cleanValue);
    
    if (isNaN(numValue)) {
      setValidations(prev => ({
        ...prev,
        [fieldName]: {
          isValid: false,
          value: null,
          message: 'Valor deve ser numérico',
          severity: 'error'
        }
      }));
      return;
    }
    
    let result: ValidationResult = { isValid: true, value: numValue, severity: 'normal' };
    
    if (numValue < range.min || numValue > range.max) {
      result = {
        isValid: false,
        value: numValue,
        message: `Valor deve estar entre ${range.min} e ${range.max}${range.unit ? ' ' + range.unit : ''}`,
        severity: 'error'
      };
    } else if (range.warningMax && numValue > range.warningMax) {
      result.severity = 'warning';
      result.message = `Valor acima do esperado`;
    } else if (range.warningMin && numValue < range.warningMin) {
      result.severity = 'warning';
      result.message = `Valor abaixo do esperado`;
    }
    
    setValidations(prev => ({
      ...prev,
      [fieldName]: result
    }));
  }, []);
  
  const isAllValid = useCallback(() => {
    return Object.values(validations).every(v => v.isValid);
  }, [validations]);
  
  return {
    validations,
    validateField,
    isAllValid
  };
};