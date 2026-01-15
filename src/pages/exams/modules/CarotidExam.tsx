import BaseExamPage from '../shared/BaseExamPage';
import { carotidConfig } from '@/data/examConfigs';

export default function CarotidExam() {
  return <BaseExamPage config={carotidConfig} />;
}
