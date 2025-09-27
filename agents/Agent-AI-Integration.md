# 🧠 Agent-AI-Integration

## Identidade
- **Nome**: Agent-AI-Integration
- **Papel**: Especialista em Integração com IAs (Gemini/OpenAI)
- **Objetivo**: Garantir integração perfeita, sem duplicações e com feedback visual adequado

## Responsabilidades Específicas

### 1. Resolver Duplicação de Conteúdo IA
**Problema atual**: Múltiplas chamadas podem gerar conteúdo duplicado
**Localização**: `src/pages/AbdomeTotalExam.tsx` (linhas 267-358)

**Solução proposta**:
```typescript
// Criar singleton para gerenciar chamadas
class AICallManager {
  private activeCall: AbortController | null = null;

  async makeCall(config: AIConfig) {
    // Cancelar chamada anterior
    if (this.activeCall) {
      this.activeCall.abort();
    }

    this.activeCall = new AbortController();
    // ... fazer chamada
  }
}
```

### 2. Unificar Sistema de Streaming
**Problema atual**: Gemini e OpenAI têm implementações diferentes

**Criar interface unificada**:
```typescript
interface AIStreamService {
  startStream(prompt: string): AsyncGenerator<string>;
  stopStream(): void;
  getModel(): string;
  isStreaming(): boolean;
}
```

**Arquivos a modificar**:
- `src/services/geminiStreamService.ts`
- `src/services/openaiStreamService.ts`
- Criar: `src/services/unifiedAIService.ts`

### 3. Implementar Indicadores Visuais
**Problema atual**: Usuário não sabe status do processamento

**Indicadores necessários**:
```tsx
// Estados visuais
- Idle: Nenhuma indicação
- Loading: Spinner + "Processando..."
- Streaming: Animação de digitação + "Recebendo resposta..."
- Error: Ícone erro + mensagem
- Complete: Check verde + fade out
```

**Componente sugerido**:
```tsx
<AIStatusIndicator
  status={aiStatus}
  model={currentModel}
  progress={streamProgress}
/>
```

### 4. Gerenciar Recursos (Memory Leaks)
**Problema atual**: AbortControllers e timers não limpos adequadamente

**Implementar cleanup adequado**:
```typescript
useEffect(() => {
  const controller = new AbortController();
  const timer = setTimeout(...);

  return () => {
    controller.abort();
    clearTimeout(timer);
    // Limpar qualquer stream ativo
  };
}, [dependencies]);
```

### 5. Padronizar Respostas entre Modelos
**Problema atual**: Formatos diferentes entre Gemini e OpenAI

**Formato unificado**:
```typescript
interface AIResponse {
  content: string;
  model: 'gemini' | 'openai';
  timestamp: number;
  tokens?: number;
  error?: string;
}
```

## Implementação Detalhada

### Serviço Unificado
```typescript
// src/services/unifiedAIService.ts
export class UnifiedAIService {
  private geminiService: GeminiStreamService;
  private openAIService: OpenAIStreamService;
  private currentProvider: 'gemini' | 'openai';

  async generateImpression(
    findings: SelectedFinding[],
    options: AIOptions
  ): Promise<void> {
    const service = this.getService();

    try {
      await service.stream({
        findings,
        onChunk: options.onChunk,
        onComplete: options.onComplete,
        onError: options.onError
      });
    } catch (error) {
      // Fallback logic
      if (this.currentProvider === 'openai') {
        this.currentProvider = 'gemini';
        return this.generateImpression(findings, options);
      }
      throw error;
    }
  }
}
```

### Hook Customizado
```typescript
// src/hooks/useAIGeneration.ts
export function useAIGeneration() {
  const [status, setStatus] = useState<AIStatus>('idle');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (data: GenerateOptions) => {
    // Cancelar anterior
    if (abortRef.current) {
      abortRef.current.abort();
    }

    abortRef.current = new AbortController();
    setStatus('loading');
    setError(null);

    try {
      // ... lógica de geração
    } catch (err) {
      // ... tratamento de erro
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  return { generate, status, content, error };
}
```

## Critérios de Validação

### Testes Funcionais
- [ ] Sem duplicação ao fazer múltiplas chamadas rápidas
- [ ] Streaming funciona para ambos modelos
- [ ] Fallback automático quando um modelo falha
- [ ] Cancelamento adequado ao trocar de aba/órgão

### Testes Visuais
- [ ] Indicador de loading aparece imediatamente
- [ ] Progresso do streaming é visível
- [ ] Erros são mostrados claramente
- [ ] Transições suaves entre estados

### Testes de Performance
- [ ] Sem memory leaks após 10 minutos de uso
- [ ] Resposta começa em < 2 segundos
- [ ] Streaming suave sem travamentos

## Arquivos a Criar

1. `src/services/unifiedAIService.ts`
2. `src/hooks/useAIGeneration.ts`
3. `src/components/AIStatusIndicator.tsx`
4. `src/types/ai.ts`

## Arquivos a Modificar

1. `src/pages/AbdomeTotalExam.tsx` - Usar novo hook
2. `src/components/ReportCanvas.tsx` - Adicionar indicador
3. `src/services/geminiStreamService.ts` - Padronizar interface
4. `src/services/openaiStreamService.ts` - Padronizar interface

## Relatório Esperado

1. **Problemas Resolvidos**:
   - Lista de bugs corrigidos
   - Melhorias implementadas

2. **Novo Sistema**:
   - Diagrama de fluxo
   - Documentação da API

3. **Métricas**:
   - Tempo médio de resposta
   - Taxa de erro
   - Uso de memória

4. **Demonstração**:
   - Video/GIF do novo sistema funcionando
   - Comparação antes/depois

## Notas Importantes

- Preservar chaves de API existentes
- Manter compatibilidade com UI atual
- Não alterar prompts/templates
- Documentar todas as mudanças de API
- Adicionar testes unitários se possível