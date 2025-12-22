import BaseExamPage from '../BaseExamPage';
import { thyroidOrgans } from '@/data/thyroidOrgans';
import ThyroidFindingDetails from '@/components/original/ThyroidFindingDetails';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'thyroid',
  title: 'Tireoide',
  subtitle: 'Ultrassonografia com Doppler',
  examType: 'Ultrassonografia da Tireoide com Doppler',
  organsCatalog: thyroidOrgans,
  autoSaveKey: 'thyroid-exam-modern',
  excludeFromNormalAll: ['observacoes-tireoide'],
  FindingDetailsComponent: ThyroidFindingDetails
};

export default function ThyroidExam() {
  return <BaseExamPage config={config} />;
}
