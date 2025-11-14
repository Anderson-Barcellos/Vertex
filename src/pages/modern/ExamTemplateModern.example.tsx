/**
 * ExamTemplateModern.example
 * Exemplo de página de exame usando ModernExamLayout + FloatingOrganPanelModern
 */

import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import ModernExamLayout from '@/layouts/ModernExamLayout';
import FloatingOrganPanelModern from '@/components/shared/FloatingOrganPanelModern';
import Sidebar from '@/components/original/Sidebar';
import ReportCanvas from '@/components/original/ReportCanvas';
import SelectedFindingsPanel from '@/components/original/SelectedFindingsPanel';
import ExamStatisticsPanel from '@/components/original/ExamStatisticsPanel';

// Tipos e dados
import type { SelectedFinding, FindingInstance } from '@/types/report';
import type { Organ, Finding } from '@/data/organs';

// Trocar por seu catálogo de órgãos
import { organs as exampleOrgans } from '@/data/organs';

export default function ExamTemplateModern() {
  const navigate = useNavigate();
  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
  const [generatedReport, setGeneratedReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiImpression, setAiImpression] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'streaming' | 'completed' | 'error'>('idle');
  const [currentAiModel, setCurrentAiModel] = useState<'gemini' | 'openai'>('gemini');
  const [autoGenerateAI, setAutoGenerateAI] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);

  const getComponentFileName = (): string => {
    const fullPath = import.meta.url;
    const fileName = fullPath.split('/').pop() || '';
    return fileName;
  };

  // Uso no componente:
  const CURRENT_FILE = getComponentFileName();
  const examType = CURRENT_FILE.split('.')[0];
  console.log('[🔎]:', CURRENT_FILE); // "ExamTemplateModern.example.tsx"
  console.log('[✅]:', examType);      // "ExamTemplateModern.example"

  const handleOrganSelect = (organId: string) => {
    if (selectedOrgan === organId) setIsPanelMinimized(!isPanelMinimized);
    else { setSelectedOrgan(organId); setIsPanelMinimized(false); }
  };

  const handleFindingChange = (
    organId: string,
    categoryId: string,
    findingId: string,
    checked: boolean,
    finding: Finding,
    severity?: string,
    instances?: FindingInstance[]
  ) => {
    setSelectedFindings(list => checked
      ? (() => {
          const i = list.findIndex(f => f.findingId === findingId);
          if (i >= 0) { const up = [...list]; up[i] = { ...up[i], severity, instances }; return up; }
          return [...list, { organId, categoryId, findingId, finding, severity, instances }];
        })()
      : list.filter(f => f.findingId !== findingId)
    );
    if (checked) setNormalOrgans(ns => ns.filter(id => id !== organId));
  };

  const handleNormalChange = (organId: string, isNormal: boolean) => {
    if (isNormal) {
      setNormalOrgans(ns => ns.includes(organId) ? ns : [...ns, organId]);
      setSelectedFindings(list => list.filter(f => f.organId !== organId));
    } else {
      setNormalOrgans(ns => ns.filter(id => id !== organId));
    }
  };

  const currentOrgan = exampleOrgans.find(o => o.id === selectedOrgan);
  const currentOrganFindings = selectedFindings.filter(f => f.organId === selectedOrgan);
  const isCurrentOrganNormal = normalOrgans.includes(selectedOrgan);

  return (
    <>
      <ModernExamLayout
        header={(
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="modern-btn-glass px-4 py-2 flex items-center gap-2">
              <ArrowLeft size={18} />
              <span className="hidden md:inline">Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">US</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TÍTULO DO EXAME</h1>
                <p className="text-xs text-gray-400">Subtítulo</p>
              </div>
            </div>
          </div>
        )}
        sidebar={(
          <Sidebar
            selectedOrgan={selectedOrgan}
            onOrganSelect={handleOrganSelect}
            onNormalChange={handleNormalChange}
            selectedFindings={selectedFindings}
            normalOrgans={normalOrgans}
            organsList={exampleOrgans}
            showSummary={false}
          />
        )}
        main={(
          <div className="modern-a4" style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
            <ReportCanvas
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              generatedReport={generatedReport}
              isGenerating={isGenerating}
              aiImpression={aiImpression}
              aiError={aiError}
              isAiLoading={false}
              aiStatus={aiStatus}
              organsList={exampleOrgans}
              currentAiModel={currentAiModel}
              onGenerateAI={() => {}}
              autoGenerateAI={autoGenerateAI}
              onToggleAutoGenerate={setAutoGenerateAI}
            />
          </div>
        )}
        panels={(
          <>
            <SelectedFindingsPanel
              className="glass-panel flex-1"
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              organsList={exampleOrgans}
              onGenerateReport={() => {}}
              isGenerating={isGenerating}
              expandToContent
            />
            <ExamStatisticsPanel
              className="glass-panel"
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              organsList={exampleOrgans}
            />
          </>
        )}
        floatingPanel={(
          currentOrgan ? (
            <FloatingOrganPanelModern
              organ={currentOrgan}
              selectedFindings={currentOrganFindings}
              isNormal={isCurrentOrganNormal}
              isMinimized={isPanelMinimized}
              onToggleMinimized={setIsPanelMinimized}
              onFindingChange={handleFindingChange}
              onNormalChange={handleNormalChange}
              leftCss={'calc(25% + 1.5rem)'}
              widthExpanded={'24rem'}
              maxHeight={'80vh'}
            />
          ) : null
        )}
      />
      <Toaster position="top-right" richColors />
    </>
  );
}
