# 🔧 Ajustes de Configuração - Endpoint Gemini

**Data:** 2025-10-19  
**Baseado em:** Script Python funcional `test_api.py`

---

## 📝 Mudanças Implementadas

### 1. ✅ Porta do Endpoint Corrigida

**Antes:**
```typescript
const GEMINI_API_ENDPOINT = 'https://ultrassom.ai:8117/geminiCall';
```

**Depois:**
```typescript
const GEMINI_API_ENDPOINT = 'https://ultrassom.ai:8177/geminiCall';
```

**Motivo:** O script Python funcional usa porta **8177**, não 8117.

---

### 2. ✅ Payload Compatível com Backend

**Antes:**
```typescript
body: JSON.stringify({ text })
```

**Depois:**
```typescript
const payload = {
  text,
  prompt: 'test' // Campo adicional para compatibilidade
};
body: JSON.stringify(payload)
```

**Motivo:** O script Python envia `{ "prompt": "test", "text": "..." }` e funciona.

---

### 3. ✅ Variáveis de Ambiente Atualizadas

Criado `.env.example` e atualizado `.env`:

```bash
# Gemini API Configuration
VITE_GEMINI_API_URL=https://ultrassom.ai:8177/geminiCall
VITE_GEMINI_MODEL=gemini-2.5-pro

# OpenAI API Configuration
VITE_OPENAI_API_URL=https://ultrassom.ai:8177/openaiCall
VITE_OPENAI_MODEL=gpt-4
```

---

## 🧪 Como Testar Agora

### Opção 1: Teste via Browser

1. **Reiniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acessar:** http://127.0.0.1:8134

3. **Workflow de teste:**
   - Selecione "Abdome Total"
   - Clique em "Fígado"
   - Selecione um achado (ex: Hepatomegalia)
   - Adicione detalhes (tamanho, localização)
   - Clique "Gerar Laudo"

4. **Monitorar logs no console (F12):**
   ```
   [reportGenerator] Iniciando geração de relatório...
   [Gemini abc123] Iniciando request...
   [Gemini abc123] Request completado com sucesso...
   ```

---

### Opção 2: Teste via Script Python

Use o script Python fornecido:

```bash
# Testar Gemini
python test_api.py gemini

# Testar OpenAI
python test_api.py openai

# Testar todos
python test_api.py all
```

---

## 🔍 Comparação: Script Python vs JavaScript

| Aspecto        | Python (Funcional)                     | JavaScript (Atualizado)                     |
| -------------- | -------------------------------------- | ------------------------------------------- |
| **URL**        | `https://ultrassom.ai:8177/geminiCall` | ✅ `https://ultrassom.ai:8177/geminiCall`    |
| **Payload**    | `{ "prompt": "test", "text": "..." }`  | ✅ `{ "prompt": "test", "text": "..." }`     |
| **SSL Verify** | `verify=False`                         | Browser padrão (pode mostrar aviso)         |
| **Streaming**  | `stream=True`                          | ✅ Suportado via `response.body.getReader()` |
| **Timeout**    | 30s                                    | ✅ 30s (com AbortController)                 |

---

## ⚠️ Notas Importantes

### SSL/Certificados Auto-Assinados

O endpoint usa certificado SSL auto-assinado. Isso pode causar:

1. **No Python:** Resolvido com `verify=False`
2. **No Browser:** 
   - Chrome/Edge: Mostra aviso de segurança
   - **Solução:** Aceite o certificado manualmente
   - Acesse diretamente `https://ultrassom.ai:8177/` e aceite o aviso

### CORS

Se houver erro de CORS, verifique:
- Headers `Access-Control-Allow-Origin` no servidor backend
- Nossa configuração em `vite.config.ts` tem `allowedHosts` configurado

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"

**Possíveis causas:**
1. Certificado SSL não aceito
2. Porta incorreta
3. Servidor backend offline

**Soluções:**
1. Aceite certificado SSL no browser
2. Verifique URL em `.env`
3. Teste com script Python primeiro

---

### Erro: "CORS policy"

**Solução:**
Verifique se o backend permite origem:
- `http://localhost:8134`
- `http://127.0.0.1:8134`
- `https://ultrassom.ai`

---

### Erro: "Network timeout"

**Possíveis causas:**
1. Backend demorou mais de 30s
2. Conexão de rede instável

**Soluções:**
1. Aumentar timeout se necessário
2. Verificar conectividade com backend

---

## 📊 Arquivos Modificados

- ✅ `src/services/geminiClient.ts` - Porta e payload atualizados
- ✅ `.env` - URLs dos endpoints configuradas
- ✅ `.env.example` - Documentação das variáveis

---

## ✨ Próximos Passos

1. **Reinicie o dev server** para aplicar mudanças:
   ```bash
   fuser -k 8134/tcp 2>/dev/null || true
   npm run dev
   ```

2. **Teste no browser** seguindo o workflow acima

3. **Reporte qualquer erro** que encontrar nos logs

4. **Se funcionar:** Marcar como production-ready ✅

---

**Status:** ✅ Configuração atualizada e pronta para testes
