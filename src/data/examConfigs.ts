import type { ExamConfig } from '@/types/exam';

import { organs } from './organs';
import { carotidOrgans, carotidOrganGroups } from './carotidOrgans';
import { thyroidOrgans } from './thyroidOrgans';
import { breastUltrasoundOrgans } from './breastUltrasoundOrgans';
import { arterialOrgans } from './arterialOrgans';
import { venousOrgans } from './venousOrgans';
import { abdominalVesselsOrgans } from './abdominalVesselsOrgans';
import { abdominalWallOrgans } from './abdominalWallOrgans';
import { ombroOrgans } from './ombroOrgans';

import FindingDetailsGeneric from '@/components/original/FindingDetailsGeneric';
import CarotidFindingDetails from '@/components/original/CarotidFindingDetails';
import ThyroidFindingDetails from '@/components/original/ThyroidFindingDetails';
import BreastUltrasoundFindingDetails from '@/components/original/BreastUltrasoundFindingDetails';

export const abdomeConfig: ExamConfig = {
  id: 'abdome-total',
  title: 'Abdome Total',
  subtitle: 'Ultrassonografia Abdominal',
  examType: 'Ultrassonografia de Abdome Total',
  organsCatalog: organs,
  autoSaveKey: 'abdome-total-exam-modern',
  excludeFromNormalAll: ['observacoes-abdome'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export const carotidConfig: ExamConfig = {
  id: 'carotid-exam',
  title: 'Ecodoppler de Carótidas',
  subtitle: 'Avaliação das Artérias Carótidas e Vertebrais',
  examType: 'Ecodoppler de Carótidas e Vertebrais',
  organsCatalog: carotidOrgans,
  autoSaveKey: 'carotid-exam-modern',
  excludeFromNormalAll: ['observacoes-carotidas'],
  organGroups: carotidOrganGroups,
  FindingDetailsComponent: CarotidFindingDetails
};

export const thyroidConfig: ExamConfig = {
  id: 'thyroid-exam',
  title: 'Tireoide',
  subtitle: 'Ultrassonografia de Tireoide',
  examType: 'Ultrassonografia de Tireoide',
  organsCatalog: thyroidOrgans,
  autoSaveKey: 'thyroid-exam-modern',
  excludeFromNormalAll: ['observacoes-tireoide'],
  FindingDetailsComponent: ThyroidFindingDetails
};

export const breastConfig: ExamConfig = {
  id: 'breast-exam',
  title: 'Mama',
  subtitle: 'Ultrassonografia Mamária Bilateral',
  examType: 'Ultrassonografia Mamária Bilateral',
  organsCatalog: breastUltrasoundOrgans,
  autoSaveKey: 'breast-exam-modern',
  excludeFromNormalAll: ['observacoes'],
  FindingDetailsComponent: BreastUltrasoundFindingDetails
};

export const arterialConfig: ExamConfig = {
  id: 'arterial-exam',
  title: 'Ecodoppler Arterial',
  subtitle: 'Membros Inferiores',
  examType: 'Ecodoppler Arterial de Membros Inferiores',
  organsCatalog: arterialOrgans,
  autoSaveKey: 'arterial-exam-modern',
  excludeFromNormalAll: ['observacoes-arterial'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export const venousConfig: ExamConfig = {
  id: 'venous-exam',
  title: 'Ecodoppler Venoso',
  subtitle: 'Membros Inferiores',
  examType: 'Ecodoppler Venoso de Membros Inferiores',
  organsCatalog: venousOrgans,
  autoSaveKey: 'venous-exam-modern',
  excludeFromNormalAll: ['observacoes-venoso'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export const abdominalVesselsConfig: ExamConfig = {
  id: 'abdominal-vessels-exam',
  title: 'Vasos Abdominais',
  subtitle: 'Ecodoppler de Vasos Abdominais',
  examType: 'Ecodoppler de Vasos Abdominais',
  organsCatalog: abdominalVesselsOrgans,
  autoSaveKey: 'abdominal-vessels-exam-modern',
  excludeFromNormalAll: ['observacoes'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export const abdominalWallConfig: ExamConfig = {
  id: 'abdominal-wall-exam',
  title: 'Parede Abdominal',
  subtitle: 'Ultrassonografia de Parede Abdominal',
  examType: 'Ultrassonografia de Parede Abdominal',
  organsCatalog: abdominalWallOrgans,
  autoSaveKey: 'abdominal-wall-exam-modern',
  excludeFromNormalAll: ['observacoes'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export const ombroConfig: ExamConfig = {
  id: 'ombro-exam',
  title: 'Ombro',
  subtitle: 'Ultrassonografia de Ombro',
  examType: 'Ultrassonografia de Ombro',
  organsCatalog: ombroOrgans,
  autoSaveKey: 'ombro-exam-modern',
  excludeFromNormalAll: ['observacoes-ombro'],
  FindingDetailsComponent: FindingDetailsGeneric
};

export const examConfigs = {
  abdome: abdomeConfig,
  carotid: carotidConfig,
  thyroid: thyroidConfig,
  breast: breastConfig,
  arterial: arterialConfig,
  venous: venousConfig,
  abdominalVessels: abdominalVesselsConfig,
  abdominalWall: abdominalWallConfig,
  ombro: ombroConfig
} as const;

export type ExamType = keyof typeof examConfigs;
