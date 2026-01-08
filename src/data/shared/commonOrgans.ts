import type { Organ } from '../organs';

export const createObservacoesOrgan = (idSuffix?: string): Organ => ({
  id: idSuffix ? `observacoes-${idSuffix}` : 'observacoes',
  name: 'Observações',
  icon: 'notes',
  normalDescription: '',
  hideNormalOption: true,
  categories: [
    {
      id: 'obs-gerais',
      name: 'Observações Gerais',
      findings: [
        {
          id: 'obs-texto',
          name: 'Observação Adicional',
          description: 'Informações complementares ao exame',
          hasDetails: true,
          extraFields: [
            { 
              id: 'texto', 
              label: 'Observações', 
              type: 'textarea', 
              placeholder: 'Digite observações adicionais...' 
            }
          ]
        }
      ]
    }
  ]
});

export const observacoesOrgan = createObservacoesOrgan();
