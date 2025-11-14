# Relatório de Arquivos Não Utilizados

## Arquivos para Remoção

### Páginas Não Utilizadas (não referenciadas no App.tsx)
- `src/pages/v2/AbdomeTotalExam.tsx` - Versão antiga com GridExamLayout
- `src/pages/v2/CarotidExam.tsx` - Versão antiga com GridExamLayout
- `src/pages/v2/LandingPage.tsx` - Versão antiga não utilizada

### Componentes V2 Não Utilizados (usados apenas pelas páginas v2 não utilizadas)
- `src/components/v2/ExamStatisticsPanel.tsx`
- `src/components/v2/ReportCanvas.tsx`
- `src/components/v2/SelectedFindingsPanel.tsx`
- `src/components/v2/Sidebar.tsx`
- `src/components/v2/index.ts`
- `src/components/v2/FloatingOrganPanel.tsx` - Usado apenas por AbdomeTotalExam.tsx (não usado)

### Layouts Não Utilizados
- `src/layouts/GridExamLayout.tsx` - Usado apenas pelas páginas v2 não utilizadas

### Componentes Original Não Utilizados
- `src/components/original/AbdomeTotalExam.tsx` - Versão antiga não utilizada
- `src/components/original/LandingPage.tsx` - Versão antiga não utilizada
- `src/components/original/MarkdownRenderer.tsx` - Duplicado, existe versão na raiz
- `src/components/original/FindingDetails.tsx` - Não utilizado (FindingDetailsEnhanced é usado)

### Hooks Não Utilizados
- `src/hooks/useBreakpoint.ts` - Usado apenas por GridExamLayout (não utilizado)

### Exemplo/Template (manter como referência)
- `src/pages/modern/ExamTemplateModern.example.tsx` - MANTER como referência

## Arquivos que DEVEM SER MANTIDOS

### Componentes Original Utilizados
- `src/components/original/Sidebar.tsx` ✅
- `src/components/original/ReportCanvas.tsx` ✅
- `src/components/original/SelectedFindingsPanel.tsx` ✅
- `src/components/original/ExamStatisticsPanel.tsx` ✅
- `src/components/original/OrganSection.tsx` ✅
- `src/components/original/CarotidFindingDetails.tsx` ✅
- `src/components/original/FindingDetailsEnhanced.tsx` ✅ (usado por OrganSection)

### Componentes Compartilhados
- `src/components/shared/FloatingOrganPanelModern.tsx` ✅
- `src/components/MarkdownRenderer.tsx` ✅ (usado por ReportCanvas)
- `src/components/ResolutionGuard.tsx` ✅

### Serviços Utilizados
- `src/services/reportGenerator.ts` ✅ (usado pelas páginas modernas)
- `src/services/geminiClient.ts` ✅ (usado por reportGenerator)
- `src/services/geminiStreamService.ts` ✅
- `src/services/openaiStreamService.ts` ✅
- `src/services/unifiedAIService.ts` ✅

### Layouts Utilizados
- `src/layouts/ModernExamLayout.tsx` ✅

### Dados Utilizados
- `src/data/organs.ts` ✅
- `src/data/carotidOrgans.ts` ✅
- `src/data/reportTemplates.ts` ✅ (usado por reportGenerator)

### Hooks Utilizados
- `src/hooks/useDropdownGuard.ts` ✅ (usado por FloatingOrganPanelModern)
- `src/hooks/useOutsidePointerDismiss.ts` ✅ (usado por FloatingOrganPanelModern)
