import BaseExamPage from '../shared/BaseExamPage';
import { breastConfig } from '@/data/examConfigs';

export default function BreastExam() {
  return <BaseExamPage config={breastConfig} />;
}
