import BaseExamPage from '../BaseExamPage';
import { arterialOrgans } from '@/data/arterialOrgans';
import FindingDetailsGeneric from '@/components/original/FindingDetailsGeneric';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'arterial-exam',
  title: 'Ecodoppler Arterial',
  subtitle: 'Membros Inferiores',
  examType: 'Ecodoppler Arterial de Membros Inferiores',
  organsCatalog: arterialOrgans,
  autoSaveKey: 'arterial-exam-modern',
  excludeFromNormalAll: ['observacoes'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export default function ArterialExam() {
  return <BaseExamPage config={config} />;
}
