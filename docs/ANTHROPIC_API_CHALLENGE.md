# Desafio: Implementar Endpoint Anthropic Claude API

**Objetivo:** Criar um endpoint Python que faça proxy para a API da Anthropic, similar aos endpoints existentes de Gemini e OpenAI.

---

## Referências Oficiais

- **SDK Python:** https://github.com/anthropics/anthropic-sdk-python
- **Docs Messages API:** https://platform.claude.com/docs/en/api/messages
- **Docs Streaming:** https://platform.claude.com/docs/en/build-with-claude/streaming

---

## Estrutura da API

### Endpoint
```
POST https://api.anthropic.com/v1/messages
```

### Headers Obrigatórios
| Header | Valor |
|--------|-------|
| `Content-Type` | `application/json` |
| `X-Api-Key` | `$ANTHROPIC_API_KEY` |
| `anthropic-version` | `2023-06-01` |

---

## Request Body

### Campos Obrigatórios

```python
{
    "model": str,        # ID do modelo
    "max_tokens": int,   # Limite de tokens de saída
    "messages": [...]    # Array de mensagens
}
```

### Campos Opcionais Importantes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `system` | `str` ou `list` | System prompt (NÃO vai em messages!) |
| `stream` | `bool` | Habilita streaming SSE |
| `temperature` | `float` | 0.0 a 1.0 |
| `stop_sequences` | `list[str]` | Strings que param a geração |

### Estrutura de Messages

```python
messages = [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."},  # Alternado
    {"role": "user", "content": "..."}
]
```

**Atenção:** `system` prompt vai separado, não como role!

---

## Response (Não-Streaming)

```python
{
    "id": "msg_...",
    "type": "message",
    "role": "assistant",
    "model": "claude-sonnet-4-5-20250929",
    "content": [
        {"type": "text", "text": "..."}
    ],
    "stop_reason": "end_turn",  # ou "max_tokens", "stop_sequence"
    "usage": {
        "input_tokens": 100,
        "output_tokens": 50
    }
}
```

---

## Streaming (SSE)

### Habilitar
```python
{"stream": True}
```

### Fluxo de Eventos

```
1. message_start     → Message inicial (content vazio)
2. content_block_start → Início de bloco
3. content_block_delta → Chunks de texto (MÚLTIPLOS)
4. content_block_stop  → Fim de bloco
5. message_delta     → Dados finais (stop_reason, usage)
6. message_stop      → Fim do stream
```

### Estrutura dos Eventos SSE

```
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "chunk"}}
```

**Dica:** O texto vem em `delta.text` dentro de eventos `content_block_delta` com `delta.type == "text_delta"`

---

## Modelos Disponíveis

### Usar no Vertex
| Model ID | Nome | Uso |
|----------|------|-----|
| `claude-sonnet-4-5-20250929` | Claude Sonnet 4.5 | Balanceado |
| `claude-opus-4-5-20251101` | Claude Opus 4.5 | Mais capaz |
| `claude-haiku-4-5` | Claude Haiku 4.5 | Ultra rápido |

---

## Instalação do SDK

```bash
pip install anthropic
```

---

## Dicas (Sem Spoiler!)

1. **SDK vs Raw HTTP:** O SDK simplifica MUITO o streaming. Pesquise `client.messages.stream()`

2. **Context Manager:** O SDK usa `with ... as stream:` para streaming

3. **Iterator de Texto:** Existe um helper `stream.text_stream` que já extrai só o texto

4. **Async:** O SDK tem versão async com `AsyncAnthropic`

5. **Acumulação:** O SDK pode acumular a mensagem completa automaticamente

6. **Timeout:** Streaming pode demorar - configure timeouts adequados

---

## Checklist de Implementação

- [ ] Criar endpoint `/api/anthropic` ou `/api/claude`
- [ ] Receber payload do frontend (messages, model, system)
- [ ] Autenticar com `ANTHROPIC_API_KEY`
- [ ] Implementar modo não-streaming (mais fácil, começa por aqui!)
- [ ] Implementar streaming SSE
- [ ] Retornar chunks progressivos pro frontend
- [ ] Tratar erros (rate limit, auth, etc.)
- [ ] Testar com modelos diferentes

---

## Exemplo de Curl (Pra Testar)

```bash
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 1024,
    "system": "Você é um radiologista especialista.",
    "messages": [
      {"role": "user", "content": "Olá Claude!"}
    ]
  }'
```

---

## Quando Terminar

Depois de implementar o backend, volte no Vertex e:

1. Adicione `anthropic` no tipo `AIProvider` em `src/types/report.ts`
2. Adicione os modelos Claude no `AIModelSelector.tsx`
3. Crie `anthropicStreamService.ts` similar ao OpenAI
4. Integre no `unifiedAIService.ts`

---

**Boa sorte, Anders! Qualquer dúvida, me chama!** 🧉💪
