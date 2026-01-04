import BaseExamPage from '../BaseExamPage';
import { venousOrgans } from '@/data/venousOrgans';
import FindingDetailsGeneric from '@/components/original/FindingDetailsGeneric';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'venous-exam',
  title: 'Ecodoppler Venoso',
  subtitle: 'Membros Inferiores',
  examType: 'Ecodoppler Venoso de Membros Inferiores',
  organsCatalog: venousOrgans,
  autoSaveKey: 'venous-exam-modern',
  excludeFromNormalAll: ['observacoes'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export default function VenousExam() {
  return <BaseExamPage config={config} />;
}
