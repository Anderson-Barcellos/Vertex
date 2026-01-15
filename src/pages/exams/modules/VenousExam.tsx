import BaseExamPage from '../shared/BaseExamPage';
import { venousConfig } from '@/data/examConfigs';

export default function VenousExam() {
  return <BaseExamPage config={venousConfig} />;
}
