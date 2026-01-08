// ============================================================================
// SHARED FIELD CONSTANTS - Vertex V2
// Constantes reutilizáveis para extraFields em todos os exames
// ============================================================================

// === CAMPOS GERAIS (usados em múltiplos exames) ===

export const LATERALITY = ['Direito', 'Esquerdo', 'Bilateral'] as const;
export const LATERALITY_NO_BILATERAL = ['Direito', 'Esquerdo'] as const;

export const PRESENCE = ['Presente', 'Ausente'] as const;
export const PRESENCE_EXTENDED = ['Ausente', 'Presente - leve', 'Presente - moderado', 'Presente - extenso'] as const;

export const SEVERITY_GRADES = ['Leve', 'Moderado', 'Acentuado'] as const;

export const QUANTITY_GRADES = ['Ausente', 'Escassa', 'Moderada', 'Acentuada'] as const;
export const QUANTITY_SIMPLE = ['Único', 'Múltiplos'] as const;

export const ECHOGENICITY_BASIC = ['Anecóico', 'Hipoecóico', 'Isoecóico', 'Hiperecóico', 'Heterogêneo'] as const;

export const VASCULARIZATION = ['Ausente', 'Escassa', 'Moderada', 'Acentuada'] as const;
export const VASCULARIZATION_PATTERN = ['Ausente', 'Periférica', 'Central', 'Mista'] as const;

export const MARGINS = ['Bem definidas', 'Mal definidas', 'Lobuladas', 'Irregulares'] as const;

export const MOBILITY = ['Móvel', 'Pouco móvel', 'Fixo'] as const;

// === DOPPLER VASCULAR ===

export const STENOSIS_GRADE = [
  'Leve (<50%)',
  'Moderada (50-75%)',
  'Grave (>75%)'
] as const;

export const STENOSIS_PERCENT = ['<50%', '50-70%', '70-90%', '>90%'] as const;

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

export const THROMBUS_TYPE = ['Oclusivo', 'Não-oclusivo', 'Flutuante'] as const;
export const THROMBUS_ECHOGENICITY = ['Hipoecóico (agudo)', 'Isoecóico (subagudo)', 'Hiperecóico (crônico)', 'Heterogêneo'] as const;

export const RECANALIZATION = ['Ausente', 'Parcial', 'Completa'] as const;

// === ABDOME ===

export const BOSNIAK_CLASSIFICATION = [
  'I (simples)',
  'II',
  'IIF',
  'III',
  'IV'
] as const;

export const RENAL_CALCULUS_LOCATION = [
  'Cálice superior',
  'Cálice médio',
  'Cálice inferior',
  'Pelve renal',
  'JUP',
  'Ureter proximal'
] as const;

export const HYDRONEPHROSIS_CAUSE = ['Obstrutiva', 'Não obstrutiva', 'Indeterminada'] as const;

export const HEPATIC_SEGMENTS = [
  'Segmento I (caudado)',
  'Segmento II',
  'Segmento III',
  'Segmento IVa',
  'Segmento IVb',
  'Segmento V',
  'Segmento VI',
  'Segmento VII',
  'Segmento VIII'
] as const;

export const HEPATIC_LOBES = ['Lobo direito', 'Lobo esquerdo', 'Lobo caudado'] as const;

export const STEATOSIS_DISTRIBUTION = ['Difusa', 'Focal', 'Multifocal', 'Periportal'] as const;
export const STEATOSIS_ATTENUATION = ['Maior que baço', 'Igual ao baço', 'Menor que baço'] as const;

export const ASCITES_GRADE = ['Ausente', 'Mínima', 'Moderada', 'Volumosa'] as const;

export const GALLSTONE_TYPE = ['Único', 'Múltiplos', 'Microlitíase'] as const;
export const GALLSTONE_MOBILITY = ['Móvel', 'Impactado no infundíbulo', 'Impactado no colo'] as const;

export const ACOUSTIC_SHADOW = ['Presente', 'Ausente'] as const;

export const NEPHROPATHY_ECHOGENICITY = [
  'Aumentada (grau I)',
  'Aumentada (grau II)',
  'Aumentada (grau III)'
] as const;

export const CORTICOMEDULLARY_DIFF = ['Preservada', 'Reduzida', 'Ausente'] as const;

export const AORTA_ANEURYSM_MORPHOLOGY = ['Fusiforme', 'Sacular'] as const;
export const AORTA_ANEURYSM_EXTENSION = ['Infrarrenal', 'Pararrenal', 'Suprarrenal', 'Aorto-ilíaco'] as const;
export const MURAL_THROMBUS = ['Ausente', 'Parcial', 'Circunferencial'] as const;

// === PAREDE ABDOMINAL / HÉRNIAS ===

export const HERNIA_CONTENTS = [
  'Gordura pré-peritoneal',
  'Alça intestinal',
  'Epíplon',
  'Conteúdo misto'
] as const;

export const HERNIA_REDUCIBILITY = [
  'Redutível espontaneamente',
  'Redutível com manobra',
  'Irredutível'
] as const;

export const HERNIA_VISIBILITY = [
  'Visualizado em repouso',
  'Visualizado apenas com manobra',
  'Não visualizado'
] as const;

export const HERNIA_LOCATION = [
  'Inguinal D',
  'Inguinal E',
  'Umbilical',
  'Epigástrica',
  'Incisional',
  'Linha alba (diástase)'
] as const;

export const DYNAMIC_MANEUVERS = [
  'Valsalva',
  'Tosse',
  'Esforço abdominal',
  'Ortostase'
] as const;

// === TIREOIDE (constantes de score - TI-RADS está em thyroidOrgans.ts) ===

export const THYROID_LOBE_REGION = [
  'Terço superior',
  'Terço médio',
  'Terço inferior',
  'Transição com istmo'
] as const;

export const THYROID_VASCULARITY = [
  'Vascularização preservada',
  'Vascularização aumentada (hiperemia)',
  'Vascularização reduzida'
] as const;

export const THYROID_ECHOTEXTURE = [
  'Homogênea',
  'Heterogênea difusa',
  'Hipoecogênica difusa',
  'Grosseiramente heterogênea'
] as const;

export const LYMPH_NODE_LEVELS = [
  'Nível I (submandibular)',
  'Nível II (jugular superior)',
  'Nível III (jugular médio)',
  'Nível IV (jugular inferior)',
  'Nível V (triângulo posterior)',
  'Nível VI (compartimento central)',
  'Nível VII (mediastino superior)'
] as const;

// === MAMA (constantes básicas - BI-RADS detalhado está em breastUltrasoundOrgans.ts) ===

export const BREAST_LOCATION_QUADRANT = [
  'QSE (quadrante superoexterno)',
  'QSI (quadrante superointerno)',
  'QIE (quadrante inferoexterno)',
  'QII (quadrante inferointerno)',
  'Retroareolar',
  'Prolongamento axilar'
] as const;

export const BREAST_LOCATION_CLOCK = [
  '12h', '1h', '2h', '3h', '4h', '5h',
  '6h', '7h', '8h', '9h', '10h', '11h',
  'Retroareolar'
] as const;

export const AXILLARY_LEVEL = [
  'Nível I (inferior)',
  'Nível II (médio)',
  'Nível III (apical)'
] as const;

// === VENOSO (CEAP/VCSS) ===

export const CEAP_CLINICAL = [
  'C0 - Sem sinais visíveis',
  'C1 - Telangiectasias/veias reticulares',
  'C2 - Veias varicosas',
  'C3 - Edema',
  'C4a - Pigmentação/eczema',
  'C4b - Lipodermatoesclerose',
  'C5 - Úlcera cicatrizada',
  'C6 - Úlcera ativa'
] as const;

export const CEAP_ETIOLOGY = [
  'Ec - Congênita',
  'Ep - Primária',
  'Es - Secundária (pós-trombótica)',
  'En - Não identificada'
] as const;

export const CEAP_ANATOMY = [
  'As - Superficial',
  'Ap - Perfurante',
  'Ad - Profundo',
  'An - Não identificada'
] as const;

export const CEAP_PATHOPHYSIOLOGY = [
  'Pr - Refluxo',
  'Po - Obstrução',
  'Pr,o - Refluxo + Obstrução',
  'Pn - Não identificada'
] as const;

export const REFLUX_STATUS = [
  'Ausente',
  'Presente - fisiológico (<0.5s)',
  'Presente - patológico (≥0.5s)'
] as const;

export const REFLUX_DURATION = [
  '<0.5s (fisiológico)',
  '0.5-1s (leve)',
  '1-2s (moderado)',
  '>2s (grave)'
] as const;

export const PROVOCATIVE_MANEUVERS = [
  'Valsalva',
  'Compressão manual distal',
  'Compressão proximal + liberação',
  'Ortostatismo'
] as const;

export const DEEP_VEINS = [
  'Femoral Comum',
  'Femoral Superficial',
  'Femoral Profunda',
  'Poplítea',
  'Tibiais Anteriores',
  'Tibiais Posteriores',
  'Fibulares'
] as const;

export const SUPERFICIAL_VEINS = [
  'Safena Magna - junção',
  'Safena Magna - coxa',
  'Safena Magna - perna',
  'Safena Parva - junção',
  'Safena Parva - perna'
] as const;

export const COMPRESSIBILITY = [
  'Compressível',
  'Parcialmente compressível',
  'Incompressível'
] as const;

// === ARTERIAL (WIfI/Fontaine) ===

export const FONTAINE_CLASSIFICATION = [
  'I - Assintomático',
  'IIa - Claudicação >200m',
  'IIb - Claudicação <200m',
  'III - Dor em repouso',
  'IV - Lesão trófica/gangrena'
] as const;

export const CLAUDICATION_DISTANCE = [
  '>500m',
  '200-500m',
  '100-200m',
  '50-100m',
  '<50m'
] as const;

export const WIFI_WOUND = [
  '0 - Sem úlcera/gangrena',
  '1 - Úlcera pequena/superficial',
  '2 - Úlcera profunda',
  '3 - Gangrena extensa'
] as const;

export const WIFI_ISCHEMIA = [
  '0 - ITB ≥0.8',
  '1 - ITB 0.6-0.79',
  '2 - ITB 0.4-0.59',
  '3 - ITB <0.4'
] as const;

export const WIFI_FOOT_INFECTION = [
  '0 - Sem infecção',
  '1 - Infecção local leve',
  '2 - Infecção local moderada',
  '3 - Infecção sistêmica/grave'
] as const;

export const ITB_CLASSIFICATION = [
  'Normal (0.9-1.3)',
  'Leve (0.7-0.89)',
  'Moderada (0.4-0.69)',
  'Grave (<0.4)',
  'Não compressível (>1.3)'
] as const;

// === HELPERS: Field Factories ===

export const createLateralityField = (id = 'lado', withBilateral = true) => ({
  id,
  label: 'Lado',
  type: 'select' as const,
  options: withBilateral ? [...LATERALITY] : [...LATERALITY_NO_BILATERAL]
});

export const createPresenceField = (id: string, label: string) => ({
  id,
  label,
  type: 'select' as const,
  options: [...PRESENCE]
});

export const createSeverityField = (id = 'grau', label = 'Grau') => ({
  id,
  label,
  type: 'select' as const,
  options: [...SEVERITY_GRADES]
});

export const createLocationField = (id: string, label: string, options: readonly string[]) => ({
  id,
  label,
  type: 'select' as const,
  options: [...options]
});

// === TYPES ===
export type Laterality = typeof LATERALITY[number];
export type SeverityGrade = typeof SEVERITY_GRADES[number];
export type BosniakClass = typeof BOSNIAK_CLASSIFICATION[number];
export type CEAPClinical = typeof CEAP_CLINICAL[number];
export type FontaineClass = typeof FONTAINE_CLASSIFICATION[number];
