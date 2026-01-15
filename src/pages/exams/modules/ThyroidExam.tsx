import BaseExamPage from '../shared/BaseExamPage';
import { thyroidConfig } from '@/data/examConfigs';

export default function ThyroidExam() {
  return <BaseExamPage config={thyroidConfig} />;
}
