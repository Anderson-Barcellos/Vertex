export const LATERALITY = ['Direito', 'Esquerdo', 'Bilateral'] as const;
export const LATERALITY_NO_BILATERAL = ['Direito', 'Esquerdo'] as const;

export const SEVERITY_GRADES = ['Leve', 'Moderado', 'Acentuado'] as const;

export const STENOSIS_GRADE = [
  'Leve (<50%)',
  'Moderada (50-75%)',
  'Grave (>75%)'
] as const;

export const WAVEFORM_PATTERNS = [
  'Trifásico',
  'Bifásico',
  'Monofásico',
  'Ausente'
] as const;

export const OCCLUSION_TYPE = [
  'Aguda (<14 dias)',
  'Subaguda (14d - 3m)',
  'Crônica (>3 meses)'
] as const;

export const COLLATERAL_STATUS = [
  'Ausente',
  'Escassa',
  'Moderada',
  'Abundante'
] as const;

export const PLAQUE_TYPE = [
  'Calcificada',
  'Fibro-calcificada',
  'Fibrolipídica',
  'Lipídica'
] as const;

export const RESISTIVITY_INDEX = [
  'Normal (0.50-0.70)',
  'Elevado (>0.70)',
  'Reduzido (<0.50)'
] as const;

export const FLOW_PATTERN = [
  'Normal',
  'Tardus parvus',
  'Ausente',
  'Reverso'
] as const;
