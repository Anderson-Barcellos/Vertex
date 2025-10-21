# Fluxo de Streaming do Laudo Médico

## Visão Geral

O sistema implementa streaming progressivo para geração de laudos médicos usando o endpoint Gemini AI.

## Endpoint

- **URL**: `https://ultrassom.ai:8117/geminiCall`
- **Método**: POST
- **Content-Type**: application/json

## Payload de Requisição

```json
{
  "text": "conteúdo do prompt com achados clínicos"
}
```

## Fluxo de Funcionamento

### 1. Usuário Clica em "Gerar Laudo"

Quando o botão "Gerar Laudo" é pressionado no componente `SelectedFindingsPanel`:

```tsx
const handleGenerateReport = () => {
  const reportData: ReportData = {
    selectedFindings,
    normalOrgans,
    additionalNotes: ''
  };
  onGenerateReport(reportData, { model: selectedModel });
};
```

### 2. Página Principal Recebe a Requisição

Em `AbdomeTotalExam.tsx` (ou outra página de exame):

```tsx
const handleGenerateReport = async (
  data: ReportData,
  options: { model: AIProvider }
) => {
  setIsGenerating(true);
  setGeneratedReport(''); // Limpa o relatório anterior
  
  try {
    if (options.model === 'gemini') {
      let fullReport = '';
      
      await geminiStreamService.generateFullReportStream(
        {
          examType: 'Ultrassonografia Abdominal Total',
          selectedFindings: data.selectedFindings,
          normalOrgans: data.normalOrgans,
          organsCatalog: organs
        },
        {
          onChunk: (text) => {
            // Chamado a cada chunk recebido
            fullReport += text;
            setGeneratedReport(fullReport);
          },
          onComplete: (finalText) => {
            // Chamado quando o streaming termina
            setGeneratedReport(finalText);
            toast.success('Relatório gerado com sucesso!');
          },
          onError: (error) => {
            // Chamado em caso de erro
            console.error('Erro:', error);
            toast.error('Erro ao gerar relatório.');
          }
        }
      );
    }
  } finally {
    setIsGenerating(false);
  }
};
```

### 3. Serviço de Streaming Processa

O `geminiStreamService.ts` faz o seguinte:

1. **Constrói o prompt** com base nos achados:
   ```typescript
   private buildPrompt(data) {
     let prompt = `Gere um laudo de ${data.examType}...\n\n`;
     // Adiciona achados patológicos
     // Adiciona órgãos normais
     return prompt;
   }
   ```

2. **Envia para o endpoint**:
   ```typescript
   const response = await fetch('https://ultrassom.ai:8117/geminiCall', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ text: prompt })
   });
   ```

3. **Processa o streaming**:
   ```typescript
   const reader = response.body.getReader();
   const decoder = new TextDecoder();
   let fullText = '';

   while (true) {
     const { done, value } = await reader.read();
     if (done) break;
     
     if (value) {
       const chunk = decoder.decode(value, { stream: true });
       fullText += chunk;
       callbacks.onChunk?.(chunk); // Atualiza UI progressivamente
     }
   }
   
   callbacks.onComplete?.(fullText); // Finaliza
   ```

### 4. ReportCanvas Renderiza Progressivamente

O componente `ReportCanvas.tsx` renderiza o conteúdo à medida que chega:

```tsx
{isGenerating ? (
  <div className="flex items-center justify-center">
    <div className="animate-spin">Gerando...</div>
  </div>
) : generatedReport ? (
  <MarkdownRenderer
    content={generatedReport}
    isStreaming={isGenerating}
    className="a4-prose"
  />
) : (
  <div>O laudo aparecerá aqui após ser gerado</div>
)}
```

## Benefícios do Streaming

1. **Feedback Imediato**: Usuário vê o conteúdo sendo gerado em tempo real
2. **Melhor UX**: Não há espera com tela em branco
3. **Cancelamento**: Possibilidade de interromper geração longa
4. **Markdown Progressivo**: Renderização incremental do conteúdo

## Estrutura de Arquivos

```
src/
├── services/
│   ├── geminiClient.ts          # Cliente básico + função de streaming
│   └── geminiStreamService.ts   # Serviço completo de streaming
├── components/
│   ├── SelectedFindingsPanel.tsx # Botão "Gerar Laudo"
│   ├── ReportCanvas.tsx          # Exibe o laudo (folha A4)
│   └── MarkdownRenderer.tsx      # Renderiza markdown
└── pages/
    ├── AbdomeTotalExam.tsx       # Lógica principal do exame
    └── BreastExam.tsx            # Outro exemplo
```

## Exemplo de Uso Direto

Para usar o streaming diretamente:

```typescript
import { callGeminiWithStreaming } from '@/services/geminiClient';

async function gerarLaudo(conteudo: string) {
  let laudoCompleto = '';
  
  await callGeminiWithStreaming(
    conteudo,
    (textoAcumulado) => {
      // Atualiza UI com texto progressivo
      laudoCompleto = textoAcumulado;
      console.log('Recebido:', textoAcumulado);
    }
  );
  
  return laudoCompleto;
}
```

## Configuração de Ambiente

No arquivo `.env`:

```env
VITE_GEMINI_API_URL=https://ultrassom.ai:8117/geminiCall
VITE_GEMINI_MODEL=gemini-2.5-pro
```

## Tratamento de Erros

O sistema lida com:
- Timeout de conexão
- Erro de servidor (4xx, 5xx)
- Streaming interrompido
- Cancelamento manual (AbortSignal)

```typescript
try {
  await callGeminiWithStreaming(text, onChunk, signal);
} catch (error) {
  if (signal?.aborted) {
    console.log('Operação cancelada');
  } else {
    console.error('Erro:', error);
  }
}
```
