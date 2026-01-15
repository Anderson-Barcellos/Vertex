import { useState, useMemo } from 'react';
import BaseExamPage from '../shared/BaseExamPage';
import { abdomeConfig } from '@/data/examConfigs';
import { organs } from '@/data/organs';
import { abdomeModalities, abdomeModalityOptions, getDisabledOrgans } from '@/data/abdomeModalities';
import ModalitySelector from '@/components/shared/ModalitySelector';

export default function AbdomeTotalExam() {
  const [selectedModality, setSelectedModality] = useState('abdome-total');

  const currentModality = abdomeModalities[selectedModality];
  
  const dynamicConfig = useMemo(() => ({
    ...abdomeConfig,
    examType: currentModality.examType,
    title: currentModality.name,
    subtitle: currentModality.examType
  }), [currentModality]);

  const disabledOrgans = useMemo(() => {
    const allOrganIds = organs.map(o => o.id);
    return getDisabledOrgans(selectedModality, allOrganIds);
  }, [selectedModality]);

  const headerExtra = (
    <ModalitySelector
      options={abdomeModalityOptions}
      selected={selectedModality}
      onChange={setSelectedModality}
    />
  );

  return (
    <BaseExamPage 
      config={dynamicConfig} 
      disabledOrgans={disabledOrgans}
      headerExtra={headerExtra}
    />
  );
}
