import BaseExamPage from '../BaseExamPage';
import { abdominalWallOrgans } from '@/data/abdominalWallOrgans';
import FindingDetailsGeneric from '@/components/original/FindingDetailsGeneric';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'abdominal-wall-exam',
  title: 'Parede Abdominal',
  subtitle: 'Ultrassonografia de Parede',
  examType: 'Ultrassonografia de Parede Abdominal',
  organsCatalog: abdominalWallOrgans,
  autoSaveKey: 'abdominal-wall-exam-modern',
  excludeFromNormalAll: ['observacoes'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export default function AbdominalWallExam() {
  return <BaseExamPage config={config} />;
}
