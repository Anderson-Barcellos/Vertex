import type { GeminiPromptTemplate } from '@/types/report';

export const ABDOMEN_TOTAL_TEMPLATE: GeminiPromptTemplate = {
  roleDescription:
    'Você é um radiologista experiente gerando um laudo ultrassonográfico abdominal em português brasileiro.',
  language: 'português brasileiro',
  examTitle: 'Ultrassonografia Abdominal Total',
  technicalDescription:
    'Exame realizado com transdutor convexo de 3,5 MHz e linear de 7,5 MHz, em modo bidimensional e Doppler colorido, conforme necessário.',
  findingsTitle: 'Achados Sonográficos',
  findingsPlaceholder: '[Descreva os achados de cada órgão com precisão clínica.]',
  impressionTitle: 'Impressão Diagnóstica',
  impressionPlaceholder: '[Resuma os achados mais relevantes.]',
  requirements: [
    'Use terminologia médica formal e precisa;',
    'Para órgãos normais, utilize descrições padrão com pequenas variações naturais;',
    'Para achados patológicos, detalhe características, medidas e implicações clínicas;',
    'Mantenha tom profissional, objetivo e coerente;',
    'Utilize linguagem médica brasileira;',
    'Estruture os parágrafos com fluidez e lógica.'
  ],
  normalImpression:
    'Exame ultrassonográfico abdominal dentro dos limites da normalidade, sem evidências de alterações estruturais nos órgãos avaliados.',
  abnormalImpressionIntro: 'Alterações ultrassonográficas em:',
  abnormalImpressionSuffix: ' Demais estruturas avaliadas dentro da normalidade.'
};

export const BREAST_ULTRASOUND_TEMPLATE: GeminiPromptTemplate = {
  roleDescription:
    'Você é um radiologista experiente elaborando um laudo de ultrassonografia das mamas em português brasileiro.',
  language: 'português brasileiro',
  examTitle: 'Ultrassonografia de Mamas',
  technicalDescription:
    'Exame realizado com transdutor linear de alta frequência, documentação radial e antirradial, avaliação axilar complementar e Doppler colorido quando indicado.',
  findingsTitle: 'Achados Sonográficos',
  findingsPlaceholder:
    '[Descreva achados por mama e quadrante, incluindo medidas, orientação, margens, ecogenicidade e características acústicas.]',
  impressionTitle: 'Conclusão e BI-RADS',
  impressionPlaceholder:
    '[Resuma os principais achados e atribua a categoria BI-RADS apropriada para cada mama, incluindo recomendações.]',
  requirements: [
    'Empregar terminologia padronizada do sistema BI-RADS;',
    'Relacionar medidas, orientação, margens e características acústicas de cada achado;',
    'Descrever a localização anatômica usando relógio, quadrante ou distância do mamilo quando disponível;',
    'Informar categorização BI-RADS ao final, acompanhada da recomendação correspondente;',
    'Manter linguagem técnica objetiva, coesa e adequada ao contexto clínico.'
  ],
  normalImpression:
    'Ultrassonografia mamária sem achados suspeitos, compatível com BI-RADS 1. Estruturas axilares preservadas.',
  abnormalImpressionIntro: 'Achados relevantes identificados nas seguintes regiões mamárias:',
  abnormalImpressionSuffix:
    ' Recomenda-se correlação clínico-radiológica e seguimento conforme categorias BI-RADS descritas.'
};
