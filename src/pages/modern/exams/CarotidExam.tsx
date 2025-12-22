import BaseExamPage from '../BaseExamPage';
import { carotidOrgans } from '@/data/carotidOrgans';
import CarotidFindingDetails from '@/components/original/CarotidFindingDetails';
import type { ExamConfig } from '@/types/exam';

const config: ExamConfig = {
  id: 'carotid',
  title: 'Carótidas e Vertebrais',
  subtitle: 'Ecodoppler vascular',
  examType: 'Ecodoppler de Carótidas e Vertebrais',
  organsCatalog: carotidOrgans,
  autoSaveKey: 'carotid-exam-modern',
  excludeFromNormalAll: ['observacoes-carotidas'],
  FindingDetailsComponent: CarotidFindingDetails
};

export default function CarotidExam() {
  return <BaseExamPage config={config} />;
}
