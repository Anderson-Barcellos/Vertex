/**
 * Componente de exemplo para testar o streaming do Gemini
 * 
 * Este componente demonstra como usar o serviço de streaming
 * para gerar laudos médicos progressivamente.
 */

import React, { useState } from 'react';
import { callGeminiWithStreaming } from '@/services/geminiClient';
import { geminiStreamService } from '@/services/geminiStreamService';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Lightning, Stop } from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function StreamingExample() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleStreamBasic = async () => {
    if (!input.trim()) {
      toast.error('Digite um texto para enviar');
      return;
    }

    setIsStreaming(true);
    setOutput('');

    const controller = new AbortController();
    setAbortController(controller);

    try {
      let accumulated = '';
      
      await callGeminiWithStreaming(
        input,
        (chunk) => {
          // Callback chamado a cada chunk recebido
          accumulated = chunk;
          setOutput(accumulated);
        },
        controller.signal
      );

      toast.success('Streaming concluído!');
    } catch (error: any) {
      if (error.message === 'Operação cancelada') {
        toast.info('Streaming cancelado');
      } else {
        toast.error('Erro no streaming: ' + error.message);
      }
    } finally {
      setIsStreaming(false);
      setAbortController(null);
    }
  };

  const handleStreamService = async () => {
    if (!input.trim()) {
      toast.error('Digite um texto para enviar');
      return;
    }

    setIsStreaming(true);
    setOutput('');

    try {
      let accumulated = '';

      await geminiStreamService.generateFullReportStream(
        {
          examType: 'Teste de Streaming',
          selectedFindings: [],
          normalOrgans: [],
          organsCatalog: []
        },
        {
          onChunk: (chunk) => {
            accumulated += chunk;
            setOutput(accumulated);
          },
          onComplete: (finalText) => {
            setOutput(finalText);
            toast.success('Relatório completo gerado!');
          },
          onError: (error) => {
            toast.error('Erro: ' + error.message);
          }
        }
      );
    } catch (error: any) {
      toast.error('Erro no serviço: ' + error.message);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Teste de Streaming Gemini
          </h1>
          <p className="text-muted-foreground mt-2">
            Demonstração do fluxo de streaming para geração de laudos médicos
          </p>
        </div>

        {/* Configuração */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Configuração do Endpoint</h2>
            <code className="bg-muted px-3 py-1 rounded text-sm">
              https://ultrassom.ai:8117/geminiCall
            </code>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Payload JSON</h3>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "text": "conteúdo do prompt"
}`}
            </pre>
          </div>
        </Card>

        {/* Input Area */}
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Texto de Entrada
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite o conteúdo que será enviado ao endpoint Gemini..."
              className="min-h-[150px] font-mono text-sm"
              disabled={isStreaming}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleStreamBasic}
              disabled={isStreaming || !input.trim()}
              className="flex-1"
            >
              <Lightning size={16} className="mr-2" />
              Stream Básico (callGeminiWithStreaming)
            </Button>

            <Button
              onClick={handleStreamService}
              disabled={isStreaming || !input.trim()}
              variant="secondary"
              className="flex-1"
            >
              <Lightning size={16} className="mr-2" />
              Stream com Serviço (geminiStreamService)
            </Button>

            {isStreaming && (
              <Button
                onClick={handleCancel}
                variant="destructive"
              >
                <Stop size={16} className="mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </Card>

        {/* Output Area */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Resultado do Streaming</h2>
            {isStreaming && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span>Recebendo dados...</span>
              </div>
            )}
          </div>

          <div className="min-h-[400px] bg-white border border-border rounded-lg p-6">
            {output ? (
              <div className="prose max-w-none">
                <MarkdownRenderer
                  content={output}
                  isStreaming={isStreaming}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {isStreaming ? (
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm">Aguardando resposta do servidor...</p>
                  </div>
                ) : (
                  <p>O resultado aparecerá aqui quando o streaming iniciar</p>
                )}
              </div>
            )}
          </div>

          {output && !isStreaming && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>✓ Streaming concluído - {output.length} caracteres recebidos</p>
            </div>
          )}
        </Card>

        {/* Informações Técnicas */}
        <Card className="p-6 bg-muted/30">
          <h2 className="text-lg font-semibold mb-4">Como Funciona</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-1">1. Requisição HTTP</h3>
              <p className="text-muted-foreground">
                Uma requisição POST é enviada para o endpoint com o payload JSON contendo o texto.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-1">2. Streaming Progressivo</h3>
              <p className="text-muted-foreground">
                O servidor retorna os dados em chunks via ReadableStream. Cada chunk é processado
                imediatamente usando TextDecoder.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-1">3. Atualização da UI</h3>
              <p className="text-muted-foreground">
                O callback onChunk é chamado a cada chunk recebido, permitindo atualização progressiva
                da interface sem esperar a resposta completa.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-1">4. Renderização Markdown</h3>
              <p className="text-muted-foreground">
                O componente MarkdownRenderer processa o conteúdo em tempo real, exibindo a formatação
                à medida que o texto é recebido.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
