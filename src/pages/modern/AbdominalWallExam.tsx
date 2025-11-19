import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { abdominalWallStructures } from '@/data/abdominalWallOrgans';
import { unifiedAIService } from '@/services/unifiedAIService';
import { ArrowLeft, Sparkles, FileText, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface SelectedFinding {
  structureId: string;
  structureName: string;
  findingId: string;
  findingLabel: string;
  details: Record<string, string>;
}

export default function AbdominalWallExam() {
  const navigate = useNavigate();
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [expandedStructure, setExpandedStructure] = useState<string | null>(null);
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    indication: ''
  });
  const [generatedReport, setGeneratedReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFindingToggle = useCallback((
    structureId: string,
    structureName: string,
    findingId: string,
    findingLabel: string
  ) => {
    const existingIndex = selectedFindings.findIndex(
      f => f.structureId === structureId && f.findingId === findingId
    );

    if (existingIndex >= 0) {
      // Remove finding
      setSelectedFindings(prev => prev.filter((_, i) => i !== existingIndex));
      setExpandedFinding(null);
    } else {
      // Add finding
      const newFinding: SelectedFinding = {
        structureId,
        structureName,
        findingId,
        findingLabel,
        details: {}
      };
      setSelectedFindings(prev => [...prev, newFinding]);
      setExpandedFinding(`${structureId}-${findingId}`);
    }
  }, [selectedFindings]);

  const handleDetailChange = useCallback((
    structureId: string,
    findingId: string,
    detailKey: string,
    value: string
  ) => {
    setSelectedFindings(prev => prev.map(finding => {
      if (finding.structureId === structureId && finding.findingId === findingId) {
        return {
          ...finding,
          details: { ...finding.details, [detailKey]: value }
        };
      }
      return finding;
    }));
  }, []);

  const isFindingSelected = useCallback((structureId: string, findingId: string) => {
    return selectedFindings.some(
      f => f.structureId === structureId && f.findingId === findingId
    );
  }, [selectedFindings]);

  const getFindingDetails = useCallback((structureId: string, findingId: string) => {
    return selectedFindings.find(
      f => f.structureId === structureId && f.findingId === findingId
    )?.details || {};
  }, [selectedFindings]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setGeneratedReport('');

    const promptData = {
      patientName: patientData.name,
      patientAge: patientData.age,
      indication: patientData.indication,
      findings: selectedFindings.map(f => ({
        structure: f.structureName,
        finding: f.findingLabel,
        details: f.details
      }))
    };

    try {
      await unifiedAIService.generateReport(promptData, {
        model: 'gemini',
        examType: 'abdominal-wall',
        onChunk: (chunk) => {
          setGeneratedReport(prev => prev + chunk);
        },
        onComplete: () => {
          setIsGenerating(false);
        },
        onError: (error) => {
          console.error('Error generating report:', error);
          setGeneratedReport('Erro ao gerar laudo. Por favor, tente novamente.');
          setIsGenerating(false);
        }
      });
    } catch (error) {
      console.error('Error:', error);
      setIsGenerating(false);
    }
  };

  const handleClearAll = () => {
    setSelectedFindings([]);
    setGeneratedReport('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Ultrassom de Parede Abdominal
                </h1>
                <p className="text-sm text-slate-500">Layout Experimental • Vertex V2</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || selectedFindings.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Gerando...' : 'Gerar Laudo'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Panel - Patient Data & Findings */}
          <div className="space-y-6">

            {/* Patient Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Dados do Paciente
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nome do Paciente
                  </label>
                  <input
                    type="text"
                    value={patientData.name}
                    onChange={(e) => setPatientData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Idade
                    </label>
                    <input
                      type="text"
                      value={patientData.age}
                      onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: 45 anos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Indicação
                    </label>
                    <input
                      type="text"
                      value={patientData.indication}
                      onChange={(e) => setPatientData(prev => ({ ...prev, indication: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: Dor abdominal"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Findings Summary */}
            {selectedFindings.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">
                  Achados Selecionados ({selectedFindings.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedFindings.map((finding, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-white rounded-lg text-sm border border-blue-200 shadow-sm"
                    >
                      <span className="font-medium text-blue-700">{finding.structureName}</span>
                      <span className="text-slate-500 mx-1">•</span>
                      <span className="text-slate-700">{finding.findingLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Structures Cards */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Selecione os Achados
              </h2>

              {abdominalWallStructures.map((structure) => (
                <div
                  key={structure.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all hover:shadow-xl"
                >
                  {/* Structure Header */}
                  <button
                    onClick={() => setExpandedStructure(
                      expandedStructure === structure.id ? null : structure.id
                    )}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{structure.icon}</span>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-800">{structure.name}</h3>
                        <p className="text-xs text-slate-500">{structure.category}</p>
                      </div>
                    </div>
                    {expandedStructure === structure.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {/* Findings List */}
                  {expandedStructure === structure.id && (
                    <div className="px-6 pb-4 space-y-2">
                      {structure.findings.map((finding) => {
                        const isSelected = isFindingSelected(structure.id, finding.id);
                        const isExpanded = expandedFinding === `${structure.id}-${finding.id}`;
                        const details = getFindingDetails(structure.id, finding.id);

                        return (
                          <div
                            key={finding.id}
                            className={`rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            {/* Finding Header */}
                            <button
                              onClick={() => handleFindingToggle(
                                structure.id,
                                structure.name,
                                finding.id,
                                finding.label
                              )}
                              className="w-full px-4 py-3 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-600'
                                    : 'border-slate-300 bg-white'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`font-medium ${
                                  isSelected ? 'text-blue-900' : 'text-slate-700'
                                }`}>
                                  {finding.label}
                                </span>
                              </div>
                              {isSelected && finding.details && finding.details.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedFinding(isExpanded ? null : `${structure.id}-${finding.id}`);
                                  }}
                                  className="p-1 hover:bg-blue-100 rounded transition-colors"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-blue-600" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-blue-600" />
                                  )}
                                </button>
                              )}
                            </button>

                            {/* Finding Details */}
                            {isSelected && isExpanded && finding.details && (
                              <div className="px-4 pb-4 pt-2 space-y-3 border-t border-blue-200">
                                {finding.details.map((detail) => (
                                  <div key={detail.label}>
                                    <label className="block text-xs font-medium text-blue-900 mb-1.5">
                                      {detail.label}
                                    </label>
                                    {detail.type === 'text' || detail.type === 'measurement' ? (
                                      <input
                                        type="text"
                                        value={details[detail.label] || ''}
                                        onChange={(e) => handleDetailChange(
                                          structure.id,
                                          finding.id,
                                          detail.label,
                                          e.target.value
                                        )}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder={detail.unit ? `Ex: 2.5 ${detail.unit}` : 'Digite aqui'}
                                      />
                                    ) : detail.type === 'select' ? (
                                      <select
                                        value={details[detail.label] || ''}
                                        onChange={(e) => handleDetailChange(
                                          structure.id,
                                          finding.id,
                                          detail.label,
                                          e.target.value
                                        )}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      >
                                        <option value="">Selecione...</option>
                                        {detail.options?.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </select>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Laudo Gerado
                </h2>
              </div>
              <div className="p-6">
                {!generatedReport && !isGenerating && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-slate-500">
                      Selecione os achados e clique em "Gerar Laudo"
                    </p>
                  </div>
                )}
                {isGenerating && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                )}
                {generatedReport && (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {generatedReport}
                    </div>
                  </div>
                )}
              </div>
              {generatedReport && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedReport)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Copiar
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Imprimir
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
