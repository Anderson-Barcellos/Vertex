import React, { useState } from 'react';
import { MamaPanel } from '@/components/breast/MamaPanel';
import { LinfonodosSection } from '@/components/breast';
import { useMamaState } from '@/hooks/useMamaState';
import { gerarLaudoCompleto } from '@/services/biradsReportGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, Trash2, Sparkles } from 'lucide-react';

/**
 * Página simplificada de exame de mama com sistema de léxicos BI-RADS
 *
 * Layout:
 * - Coluna esquerda: Formulários de entrada (MamaPanel direita, esquerda, LinfonodosSection)
 * - Coluna direita: Canvas do laudo em tempo real (fixo/sticky)
 *
 * @version 1.0.0
 * @date 2025-11-15
 */
export default function BreastExamSimplified() {
  const {
    mamaDireita,
    mamaEsquerda,
    linfonodoDireito,
    linfonodoEsquerdo,
    updateMamaDireita,
    updateMamaEsquerda,
    setLinfonodoDireito,
    setLinfonodoEsquerdo,
    resetState
  } = useMamaState();

  const [laudoGerado, setLaudoGerado] = useState<string>('');

  /**
   * Gera o laudo completo usando os dados das mamas e linfonodos
   */
  const handleGerarLaudo = () => {
    const laudo = gerarLaudoCompleto(
      mamaDireita,
      mamaEsquerda,
      { direito: linfonodoDireito, esquerdo: linfonodoEsquerdo }
    );
    setLaudoGerado(laudo);
  };

  /**
   * Limpa todos os dados do formulário e o laudo gerado
   */
  const handleLimparTudo = () => {
    resetState();
    setLaudoGerado('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Ultrassom de Mama
                </h1>
                <p className="text-sm text-gray-600">
                  Sistema de Léxicos BI-RADS 5ª Edição
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleLimparTudo}
                variant="outline"
                size="default"
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Tudo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Formulários de Entrada */}
          <div className="space-y-6">
            {/* Mama Direita */}
            <MamaPanel
              lado="direita"
              lesao={mamaDireita}
              onChange={updateMamaDireita}
            />

            {/* Mama Esquerda */}
            <MamaPanel
              lado="esquerda"
              lesao={mamaEsquerda}
              onChange={updateMamaEsquerda}
            />

            {/* Linfonodos Axilares */}
            <LinfonodosSection
              linfonodoDireito={linfonodoDireito}
              linfonodoEsquerdo={linfonodoEsquerdo}
              onChangeDireito={setLinfonodoDireito}
              onChangeEsquerdo={setLinfonodoEsquerdo}
            />

            {/* Botão Gerar Laudo */}
            <Button
              onClick={handleGerarLaudo}
              size="lg"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 py-6 text-lg"
            >
              <Sparkles className="w-5 h-5" />
              Gerar Laudo Completo
            </Button>
          </div>

          {/* Coluna Direita - Canvas do Laudo (Fixo) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="bg-white shadow-xl border-gray-200 overflow-hidden">
              {/* Header do Canvas */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Laudo Ultrassonográfico
                </h2>
              </div>

              {/* Conteúdo do Laudo */}
              <div
                className="p-8 bg-white min-h-[600px] max-h-[800px] overflow-y-auto"
                style={{
                  width: 'clamp(600px, 75vw, 850px)',
                  aspectRatio: '210 / 297' // A4 aspect ratio
                }}
              >
                {laudoGerado ? (
                  <article className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {laudoGerado}
                    </ReactMarkdown>
                  </article>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-6">
                      <FileText className="w-16 h-16 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Laudo não gerado
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      Preencha os dados das mamas e linfonodos, depois clique em
                      <span className="font-semibold text-purple-600"> "Gerar Laudo Completo" </span>
                      para visualizar o relatório médico formatado.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">Vertex US V2</span> - Sistema de Laudos Ultrassonográficos
            </p>
            <p className="mt-1">
              Baseado nos critérios ACR BI-RADS 5ª Edição | ultrassom.ai
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
