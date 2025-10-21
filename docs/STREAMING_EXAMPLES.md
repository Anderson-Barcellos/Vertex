# Exemplos Práticos de Uso do Streaming

## Exemplo 1: Uso Básico Simples

```typescript
import { callGeminiWithStreaming } from '@/services/geminiClient';

async function exemploBasico() {
  const conteudo = "Gere um laudo de ultrassonografia abdominal";
  let resultado = '';
  
  await callGeminiWithStreaming(
    conteudo,
    (textoAcumulado) => {
      resultado = textoAcumulado;
      console.log('Recebido:', textoAcumulado);
    }
  );
  
  console.log('Completo:', resultado);
}
```

## Exemplo 2: Com Atualização de Estado React

```typescript
import React, { useState } from 'react';
import { callGeminiWithStreaming } from '@/services/geminiClient';

function ComponenteExemplo() {
  const [laudo, setLaudo] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerarLaudo = async () => {
    setCarregando(true);
    setLaudo('');

    try {
      await callGeminiWithStreaming(
        'Conteúdo do exame aqui',
        (textoAcumulado) => {
          // Atualiza UI progressivamente
          setLaudo(textoAcumulado);
        }
      );
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <button onClick={gerarLaudo} disabled={carregando}>
        {carregando ? 'Gerando...' : 'Gerar Laudo'}
      </button>
      
      <div className="laudo">
        {laudo || 'Aguardando geração...'}
      </div>
    </div>
  );
}
```

## Exemplo 3: Com Cancelamento

```typescript
import React, { useState, useRef } from 'react';
import { callGeminiWithStreaming } from '@/services/geminiClient';

function ComponenteComCancelamento() {
  const [laudo, setLaudo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const gerarLaudo = async () => {
    setCarregando(true);
    setLaudo('');

    // Criar novo AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await callGeminiWithStreaming(
        'Conteúdo do exame',
        (textoAcumulado) => setLaudo(textoAcumulado),
        controller.signal // Passar signal para permitir cancelamento
      );
    } catch (error: any) {
      if (error.message === 'Operação cancelada') {
        console.log('Usuário cancelou a geração');
      } else {
        console.error('Erro:', error);
      }
    } finally {
      setCarregando(false);
      abortControllerRef.current = null;
    }
  };

  const cancelar = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div>
      <button onClick={gerarLaudo} disabled={carregando}>
        Gerar Laudo
      </button>
      
      {carregando && (
        <button onClick={cancelar}>
          Cancelar
        </button>
      )}
      
      <div className="laudo">{laudo}</div>
    </div>
  );
}
```

## Exemplo 4: Com Serviço Completo (Recomendado)

```typescript
import React, { useState } from 'react';
import { geminiStreamService } from '@/services/geminiStreamService';
import { SelectedFinding } from '@/types/report';

interface Props {
  achados: SelectedFinding[];
  orgaosNormais: string[];
}

function ComponenteLaudo({ achados, orgaosNormais }: Props) {
  const [laudo, setLaudo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const gerarLaudo = async () => {
    setCarregando(true);
    setLaudo('');
    setErro(null);

    await geminiStreamService.generateFullReportStream(
      {
        examType: 'Ultrassonografia Abdominal Total',
        selectedFindings: achados,
        normalOrgans: orgaosNormais,
        organsCatalog: [] // Passar catálogo de órgãos aqui
      },
      {
        onChunk: (texto) => {
          // Atualização progressiva
          setLaudo(texto);
        },
        onComplete: (textoFinal) => {
          // Finalização
          setLaudo(textoFinal);
          setCarregando(false);
          console.log('Laudo completo gerado!');
        },
        onError: (error) => {
          // Tratamento de erro
          setErro(error.message);
          setCarregando(false);
        }
      }
    );
  };

  return (
    <div>
      <button onClick={gerarLaudo} disabled={carregando}>
        {carregando ? 'Gerando...' : 'Gerar Laudo'}
      </button>

      {erro && (
        <div className="erro">
          Erro: {erro}
        </div>
      )}

      <div className="laudo">
        {laudo ? (
          <MarkdownRenderer content={laudo} />
        ) : (
          'Clique em gerar para criar o laudo'
        )}
      </div>
    </div>
  );
}
```

## Exemplo 5: Com Feedback Visual de Streaming

```typescript
import React, { useState } from 'react';
import { callGeminiWithStreaming } from '@/services/geminiClient';

function ComponenteComFeedback() {
  const [laudo, setLaudo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const gerarLaudo = async () => {
    setCarregando(true);
    setLaudo('');
    setProgresso(0);

    let caracteresRecebidos = 0;
    const tamanhoEstimado = 2000; // Estimativa de caracteres

    try {
      await callGeminiWithStreaming(
        'Conteúdo do exame',
        (textoAcumulado) => {
          caracteresRecebidos = textoAcumulado.length;
          setLaudo(textoAcumulado);
          
          // Atualizar barra de progresso
          const percentual = Math.min(
            100,
            (caracteresRecebidos / tamanhoEstimado) * 100
          );
          setProgresso(percentual);
        }
      );
    } finally {
      setCarregando(false);
      setProgresso(100);
    }
  };

  return (
    <div>
      <button onClick={gerarLaudo} disabled={carregando}>
        Gerar Laudo
      </button>

      {carregando && (
        <div className="progresso">
          <div 
            className="barra" 
            style={{ width: `${progresso}%` }}
          />
          <span>{Math.round(progresso)}%</span>
        </div>
      )}

      <div className="laudo">
        {laudo}
        {carregando && <span className="cursor">|</span>}
      </div>
    </div>
  );
}
```

## Exemplo 6: Integrado com Toast Notifications

```typescript
import React, { useState } from 'react';
import { callGeminiWithStreaming } from '@/services/geminiClient';
import { toast } from 'sonner';

function ComponenteComNotificacoes() {
  const [laudo, setLaudo] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerarLaudo = async () => {
    setCarregando(true);
    setLaudo('');

    // Toast de início
    const toastId = toast.loading('Gerando laudo...');

    try {
      await callGeminiWithStreaming(
        'Conteúdo do exame',
        (textoAcumulado) => {
          setLaudo(textoAcumulado);
          
          // Atualizar toast com progresso
          toast.loading(
            `Gerando laudo... (${textoAcumulado.length} caracteres)`,
            { id: toastId }
          );
        }
      );

      // Toast de sucesso
      toast.success('Laudo gerado com sucesso!', { id: toastId });
    } catch (error: any) {
      // Toast de erro
      toast.error('Erro ao gerar laudo: ' + error.message, { id: toastId });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div>
      <button onClick={gerarLaudo} disabled={carregando}>
        Gerar Laudo
      </button>
      
      <div className="laudo">{laudo}</div>
    </div>
  );
}
```

## Exemplo 7: Teste de Conectividade

```typescript
import { geminiStreamService } from '@/services/geminiStreamService';

async function testarConexao() {
  console.log('Testando conexão com Gemini API...');
  
  const conectado = await geminiStreamService.testConnection();
  
  if (conectado) {
    console.log('✓ Conexão estabelecida com sucesso!');
  } else {
    console.log('✗ Falha ao conectar com a API');
  }
  
  return conectado;
}

// Usar em useEffect
useEffect(() => {
  testarConexao();
}, []);
```

## Exemplo 8: Construindo Payload Customizado

```typescript
import { callGeminiWithStreaming } from '@/services/geminiClient';

async function gerarComPromptCustomizado() {
  // Construir prompt manualmente
  const prompt = `
Você é um radiologista especializado em ultrassonografia.

Paciente: João Silva
Idade: 45 anos
Data: 16/10/2025

ACHADOS:
- Fígado: Esteatose hepática grau moderado
- Vesícula biliar: Cálculo de 8mm
- Pâncreas: Normal
- Baço: Normal
- Rins: Normais

Gere um laudo completo em português brasileiro com:
1. Técnica do exame
2. Descrição detalhada dos achados
3. Impressão diagnóstica
`.trim();

  let laudo = '';
  
  await callGeminiWithStreaming(
    prompt,
    (texto) => {
      laudo = texto;
      console.log('Progresso:', texto.length, 'caracteres');
    }
  );
  
  return laudo;
}
```

## Comparação: Stream vs Non-Stream

### Sem Streaming (Antigo)
```typescript
// Usuário aguarda resposta completa
const resultado = await fetch(url, {
  method: 'POST',
  body: JSON.stringify({ text: conteudo })
});

const laudoCompleto = await resultado.text();
setLaudo(laudoCompleto); // Atualiza tudo de uma vez
```

### Com Streaming (Novo)
```typescript
// Usuário vê conteúdo sendo gerado
await callGeminiWithStreaming(
  conteudo,
  (textoAcumulado) => {
    setLaudo(textoAcumulado); // Atualiza progressivamente
  }
);
```

## Benefícios Visualizados

| Aspecto | Sem Stream | Com Stream |
|---------|-----------|------------|
| **Feedback** | ❌ Nenhum até completar | ✅ Imediato |
| **UX** | ❌ Espera em branco | ✅ Vê conteúdo aparecer |
| **Percepção** | ❌ Parece lento | ✅ Parece rápido |
| **Cancelamento** | ❌ Difícil | ✅ Fácil |
| **Depuração** | ❌ Sem visibilidade | ✅ Ver chunks |

## Dicas de Implementação

1. **Sempre limpe o estado anterior** antes de iniciar novo streaming
2. **Use AbortController** para permitir cancelamento
3. **Implemente tratamento de erro** robusto
4. **Dê feedback visual** durante o processo
5. **Teste com conteúdos de tamanhos variados**
6. **Considere debounce** se houver múltiplas chamadas rápidas

## Troubleshooting Comum

### Problema: Conteúdo não aparece
```typescript
// ❌ Errado
onChunk: (chunk) => {
  texto += chunk; // Não atualiza estado React!
}

// ✅ Correto
onChunk: (chunk) => {
  setTexto(prev => prev + chunk); // Ou melhor:
  // Service já acumula, então:
  setTexto(chunk); // chunk já é o texto completo acumulado
}
```

### Problema: Performance ruim com muitas atualizações
```typescript
// Use throttle ou debounce para limitar atualizações
import { throttle } from 'lodash';

const atualizarThrottled = throttle(setLaudo, 100); // Máximo 10 FPS

onChunk: (texto) => {
  atualizarThrottled(texto);
}
```

### Problema: Múltiplas chamadas simultâneas
```typescript
// Cancele requisição anterior antes de nova
if (abortControllerRef.current) {
  abortControllerRef.current.abort();
}
const novoController = new AbortController();
abortControllerRef.current = novoController;
```
