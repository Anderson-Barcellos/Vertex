import BaseExamPage from '../shared/BaseExamPage';
import { abdominalVesselsConfig } from '@/data/examConfigs';

export default function AbdominalVesselsExam() {
  return <BaseExamPage config={abdominalVesselsConfig} />;
}
