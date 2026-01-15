import BaseExamPage from '../shared/BaseExamPage';
import { arterialConfig } from '@/data/examConfigs';

export default function ArterialExam() {
  return <BaseExamPage config={arterialConfig} />;
}
