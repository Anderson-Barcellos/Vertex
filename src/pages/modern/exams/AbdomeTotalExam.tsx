import BaseExamPage from '../BaseExamPage';
import { organs } from '@/data/organs';
import FindingDetailsGeneric from '@/components/original/FindingDetailsGeneric';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'abdome-total',
  title: 'Abdome Total',
  subtitle: 'Ultrassonografia Abdominal',
  examType: 'Ultrassonografia Abdominal Total',
  organsCatalog: organs,
  autoSaveKey: 'abdome-total-exam-modern',
  excludeFromNormalAll: ['observacoes-abdome'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export default function AbdomeTotalExam() {
  return <BaseExamPage config={config} />;
}
