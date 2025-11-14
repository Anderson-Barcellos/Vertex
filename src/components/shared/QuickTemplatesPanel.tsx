/**
 * Vertex V2 - Quick Templates Panel
 * Painél com templates rápidos para cenários comuns de ultrassom de mamas
 *
 * @author Vertex Team
 * @date 2025-11-13
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Heart, Shield, Search, Clock, FileText } from 'lucide-react';
import type { SelectedFinding } from '@/types/report';

interface QuickTemplatesPanel {
  onApplyTemplate: (template: {
    name: string;
    normalOrgans: string[];
    findings: SelectedFinding[];
    reportText: string;
  }) => void;
  className?: string;
}

/**
 * Templates rápidos para cenários ultrassonográficos comuns
 */
const QUICK_TEMPLATES = [
  {
    id: 'normal-screening',
    name: 'Rastreamento Normal',
    description: 'Exame de rastreamento sem alterações',
    icon: <Shield size={16} className="text-green-400" />,
    badge: 'BI-RADS 1',
    badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
    normalOrgans: ['mama-direita', 'mama-esquerda', 'linfonodos-axilares-direitos', 'linfonodos-axilares-esquerdos'],
    findings: [],
    reportText: `## ULTRASSONOGRAFIA MAMÁRIA

**TÉCNICA:** Exame realizado com transdutor linear de alta frequência (7-12 MHz).

**MAMA DIREITA:** Parênquima mamário com ecotextura preservada, sem evidências de nódulos sólidos ou císticos, calcificações suspeitas, distorção arquitetural ou espessamento cutâneo. Não há alterações do complexo aréolo-papilar.

**MAMA ESQUERDA:** Parênquima mamário com ecotextura preservada, sem evidências de nódulos sólidos ou císticos, calcificações suspeitas, distorção arquitetural ou espessamento cutâneo. Não há alterações do complexo aréolo-papilar.

**LINFONODOS AXILARES:** Bilateralmente visualizados linfonodos de morfologia preservada, com hilo gorduroso evidente e espessura cortical normal (<3mm).

## CONCLUSÃO:
**BI-RADS 1** - Exame negativo.
Seguimento de rotina conforme diretrizes de rastreamento.`
  },
  {
    id: 'benign-cysts',
    name: 'Cistos Simples Bilaterais',
    description: 'Múltiplos cistos simples benignos',
    icon: <Heart size={16} className="text-blue-400" />,
    badge: 'BI-RADS 2',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    normalOrgans: ['linfonodos-axilares-direitos', 'linfonodos-axilares-esquerdos'],
    findings: [
      {
        organId: 'mama-direita',
        categoryId: 'lesoes-cisticas',
        findingId: 'cisto-simples',
        finding: {
          id: 'cisto-simples',
          name: 'Cistos Simples Múltiplos',
          description: 'Múltiplas lesões císticas benignas'
        }
      },
      {
        organId: 'mama-esquerda',
        categoryId: 'lesoes-cisticas',
        findingId: 'cisto-simples',
        finding: {
          id: 'cisto-simples',
          name: 'Cistos Simples Múltiplos',
          description: 'Múltiplas lesões císticas benignas'
        }
      }
    ],
    reportText: `## ULTRASSONOGRAFIA MAMÁRIA

**TÉCNICA:** Exame realizado com transdutor linear de alta frequência (7-12 MHz).

**MAMA DIREITA:** Múltiplas lesões císticas de contornos regulares, conteúdo anecoico e reforço acústico posterior, compatíveis com cistos simples. Ausência de nódulos sólidos, calcificações suspeitas ou distorção arquitetural.

**MAMA ESQUERDA:** Múltiplas lesões císticas de contornos regulares, conteúdo anecoico e reforço acústico posterior, compatíveis com cistos simples. Ausência de nódulos sólidos, calcificações suspeitas ou distorção arquitetural.

**LINFONODOS AXILARES:** Bilateralmente preservados.

## CONCLUSÃO:
**BI-RADS 2** - Achados benignos.
Cistos mamários bilaterais - Seguimento de rotina.`
  },
  {
    id: 'fibroadenoma',
    name: 'Fibroadenoma Típico',
    description: 'Nódulo benigno com características típicas',
    icon: <Search size={16} className="text-yellow-400" />,
    badge: 'BI-RADS 2-3',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    normalOrgans: ['mama-esquerda', 'linfonodos-axilares-direitos', 'linfonodos-axilares-esquerdos'],
    findings: [
      {
        organId: 'mama-direita',
        categoryId: 'outros-achados',
        findingId: 'fibroadenoma',
        finding: {
          id: 'fibroadenoma',
          name: 'Fibroadenoma',
          description: 'Nódulo benigno típico'
        }
      }
    ],
    reportText: `## ULTRASSONOGRAFIA MAMÁRIA

**TÉCNICA:** Exame realizado com transdutor linear de alta frequência (7-12 MHz).

**MAMA DIREITA:** Nódulo sólido hipoecóico de forma oval, margens circunscritas, orientação paralela, medindo aproximadamente X cm, localizado no [quadrante/posição horária]. Características compatíveis com fibroadenoma. Ausência de outras alterações significativas.

**MAMA ESQUERDA:** Sem alterações.

**LINFONODOS AXILARES:** Bilateralmente preservados.

## CONCLUSÃO:
**BI-RADS 2-3** - Lesão provavelmente benigna.
Nódulo com características típicas de fibroadenoma. Correlação clínica e seguimento podem ser considerados.`
  },
  {
    id: 'follow-up',
    name: 'Controle Pós-cirúrgico',
    description: 'Seguimento após procedimento',
    icon: <Clock size={16} className="text-purple-400" />,
    badge: 'Follow-up',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    normalOrgans: ['linfonodos-axilares-direitos', 'linfonodos-axilares-esquerdos'],
    findings: [
      {
        organId: 'mama-direita',
        categoryId: 'lesoes-inflamatorias',
        findingId: 'seroma-hematoma',
        finding: {
          id: 'seroma-hematoma',
          name: 'Alterações Pós-cirúrgicas',
          description: 'Mudanças esperadas após procedimento'
        }
      }
    ],
    reportText: `## ULTRASSONOGRAFIA MAMÁRIA - CONTROLE PÓS-CIRÚRGICO

**TÉCNICA:** Exame realizado com transdutor linear de alta frequência (7-12 MHz).

**MAMA DIREITA:** Alterações pós-cirúrgicas na região de [localizar], com [descrever achados específicos - seroma, hematoma, fibrose, etc.]. Evolução dentro do esperado para o período pós-operatório.

**MAMA ESQUERDA:** Sem alterações significativas.

**LINFONODOS AXILARES:** Bilateralmente preservados.

## CONCLUSÃO:
Alterações pós-cirúrgicas compatíveis com o período evolutivo.
Recomenda-se seguimento conforme protocolo médico.`
  },
  {
    id: 'suspicious-lesion',
    name: 'Lesão Suspeita',
    description: 'Nódulo com características preocupantes',
    icon: <FileText size={16} className="text-red-400" />,
    badge: 'BI-RADS 4-5',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    normalOrgans: ['mama-esquerda'],
    findings: [
      {
        organId: 'mama-direita',
        categoryId: 'nodulos',
        findingId: 'nodulo-solido',
        finding: {
          id: 'nodulo-solido',
          name: 'Nódulo Sólido Suspeito',
          description: 'Lesão sólida com características suspeitas'
        }
      }
    ],
    reportText: `## ULTRASSONOGRAFIA MAMÁRIA

**TÉCNICA:** Exame realizado com transdutor linear de alta frequência (7-12 MHz).

**MAMA DIREITA:** Nódulo sólido de [dimensões], localizado [posição/quadrante]. Características ultrassonográficas: [forma/margens/orientação/ecogenicidade/características posteriores]. Elastografia: [score]. Doppler: [vascularização].

**MAMA ESQUERDA:** Sem alterações significativas.

**LINFONODOS AXILARES:** [Descrever se alterados]

## CONCLUSÃO:
**BI-RADS [4A/4B/4C/5]** - Lesão suspeita.
⚠️ **INDICAÇÃO DE INVESTIGAÇÃO HISTOLÓGICA.**
Recomenda-se biópsia com agulha grossa para elucidação diagnóstica.`
  }
];

export default function QuickTemplatesPanel({ onApplyTemplate, className = "" }: QuickTemplatesPanel) {
  const handleApplyTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    onApplyTemplate({
      name: template.name,
      normalOrgans: template.normalOrgans,
      findings: template.findings as SelectedFinding[],
      reportText: template.reportText
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-blue-400" />
        <span className="text-sm font-medium text-blue-400">Templates Rápidos</span>
      </div>

      <div className="grid gap-2">
        {QUICK_TEMPLATES.map((template) => (
          <div key={template.id} className="glass-card hover:bg-white/5 transition-colors">
            <div className="flex items-start gap-3 p-3">
              {template.icon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-white truncate">{template.name}</h4>
                  <Badge className={`text-xs ${template.badgeColor}`}>
                    {template.badge}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 mb-3">{template.description}</p>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApplyTemplate(template)}
                  className="h-7 text-xs"
                >
                  Aplicar template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center p-2 border-t border-border">
        💡 Templates aplicam achados e geram laudo básico automaticamente
      </div>
    </div>
  );
}