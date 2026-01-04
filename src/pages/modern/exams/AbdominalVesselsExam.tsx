import BaseExamPage from '../BaseExamPage';
import { abdominalVesselsOrgans } from '@/data/abdominalVesselsOrgans';
import FindingDetailsGeneric from '@/components/original/FindingDetailsGeneric';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'abdominal-vessels-exam',
  title: 'Vasos Abdominais',
  subtitle: 'Doppler de Vasos Abdominais',
  examType: 'Ecodoppler de Vasos Abdominais',
  organsCatalog: abdominalVesselsOrgans,
  autoSaveKey: 'abdominal-vessels-exam-modern',
  excludeFromNormalAll: ['observacoes'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export default function AbdominalVesselsExam() {
  return <BaseExamPage config={config} />;
}
