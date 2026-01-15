import BaseExamPage from '../shared/BaseExamPage';
import { abdominalWallConfig } from '@/data/examConfigs';

export default function AbdominalWallExam() {
  return <BaseExamPage config={abdominalWallConfig} />;
}
