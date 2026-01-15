export interface AbdomeModality {
  id: string;
  name: string;
  examType: string;
  allowedOrgans: string[];
  additionalOrgans?: string[];
}

export const abdomeModalities: Record<string, AbdomeModality> = {
  'abdome-total': {
    id: 'abdome-total',
    name: 'Abdome Total',
    examType: 'Ultrassonografia de Abdome Total',
    allowedOrgans: ['*']
  },
  'abdome-superior': {
    id: 'abdome-superior',
    name: 'Abdome Superior',
    examType: 'Ultrassonografia de Abdome Superior',
    allowedOrgans: ['figado', 'vesicula', 'pancreas', 'baco', 'aorta', 'observacoes-abdome']
  },
  'vias-urinarias': {
    id: 'vias-urinarias',
    name: 'Vias Urinárias',
    examType: 'Ultrassonografia de Vias Urinárias',
    allowedOrgans: ['rins', 'bexiga', 'observacoes-abdome']
  },
  'prostata': {
    id: 'prostata',
    name: 'Próstata',
    examType: 'Ultrassonografia de Próstata via Abdominal',
    allowedOrgans: ['bexiga', 'prostata', 'observacoes-abdome'],
    additionalOrgans: ['prostata']
  }
};

export const abdomeModalityOptions = Object.values(abdomeModalities);

export function getDisabledOrgans(modalityId: string, allOrganIds: string[]): string[] {
  const modality = abdomeModalities[modalityId];
  if (!modality || modality.allowedOrgans.includes('*')) {
    return [];
  }
  return allOrganIds.filter(id => !modality.allowedOrgans.includes(id));
}
