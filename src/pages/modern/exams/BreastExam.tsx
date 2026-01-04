import BaseExamPage from '../BaseExamPage';
import breastUltrasoundOrgans from '@/data/breastUltrasoundOrgans';
import BreastUltrasoundFindingDetails from '@/components/original/BreastUltrasoundFindingDetails';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'breast-exam',
  title: 'Ultrassom de Mamas',
  subtitle: 'BI-RADS 5ª Edição',
  examType: 'Ultrassonografia de Mamas',
  organsCatalog: breastUltrasoundOrgans,
  autoSaveKey: 'breast-exam-modern',
  excludeFromNormalAll: ['observacoes'],
  FindingDetailsComponent: BreastUltrasoundFindingDetails
};

export default function BreastExam() {
  return <BaseExamPage config={config} />;
}
