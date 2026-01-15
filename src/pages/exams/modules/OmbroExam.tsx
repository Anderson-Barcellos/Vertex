import BaseExamPage from '../shared/BaseExamPage';
import { ombroConfig } from '@/data/examConfigs';

export default function OmbroExam() {
  return <BaseExamPage config={ombroConfig} />;
}
