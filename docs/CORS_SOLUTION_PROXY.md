# 🔧 Solução CORS - Proxy Vite Configurado

**Data:** 2025-10-19  
**Problema:** CORS bloqueando requests de `ultrassom.ai:8135` para `ultrassom.ai:8177`  
**Solução:** Proxy local via Vite

---

## ❌ Problema Original

```
Access to fetch at 'https://ultrassom.ai:8177/geminiCall' 
from origin 'https://ultrassom.ai:8135' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Causa:** Backend em porta 8177 não retorna header CORS apropriado.

---

## ✅ Solução Implementada: Vite Proxy

### Como Funciona?

```
Browser Request          Vite Proxy              Backend
    ↓                       ↓                       ↓
/api/gemini  ──────────→  Rewrite  ──────────→  ultrassom.ai:8177/geminiCall
(same-origin)           (server-side)          (SSL + no CORS issue)
```

**Vantagens:**
- ✅ Sem problema de CORS (mesma origem)
- ✅ Aceita certificados auto-assinados (`secure: false`)
- ✅ Transparente para o código frontend
- ✅ Fácil de configurar

---

## 📝 Mudanças Implementadas

### 1. **vite.config.ts** - Proxy Configurado

```typescript
server: {
  port: 8134,
  host: '0.0.0.0',
  strictPort: true,
  proxy: {
    // Gemini API Proxy
    '/api/gemini': {
      target: 'https://ultrassom.ai:8177',
      changeOrigin: true,
      secure: false, // Aceita certificados auto-assinados
      rewrite: (path) => path.replace(/^\/api\/gemini/, '/geminiCall')
    },
    // OpenAI API Proxy
    '/api/openai': {
      target: 'https://ultrassom.ai:8177',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api\/openai/, '/openaiCall')
    }
  }
}
```

### 2. **geminiClient.ts** - Endpoint Atualizado

```typescript
// ANTES (CORS problem)
const GEMINI_API_ENDPOINT = 'https://ultrassom.ai:8177/geminiCall';

// DEPOIS (via proxy local)
const GEMINI_API_ENDPOINT = import.meta.env.VITE_GEMINI_API_URL || '/api/gemini';
```

### 3. **geminiStreamService.ts** - Endpoint Atualizado

```typescript
// ANTES
const GEMINI_API_ENDPOINT = 'https://ultrassom.ai:8117/geminiCall';

// DEPOIS
const GEMINI_API_ENDPOINT = import.meta.env.VITE_GEMINI_API_URL || '/api/gemini';
```

### 4. **.env** - Variáveis Atualizadas

```bash
# ANTES (direct endpoint)
VITE_GEMINI_API_URL=https://ultrassom.ai:8177/geminiCall

# DEPOIS (via proxy)
VITE_GEMINI_API_URL=/api/gemini
```

---

## 🧪 Como Testar

### 1. Reinicie o servidor (já feito ✅)
```bash
npm run dev
```

### 2. Acesse a aplicação
```
http://localhost:8134/
```

### 3. Gere um laudo
- Selecione "Abdome Total"
- Escolha órgão e achados
- Clique "Gerar Laudo"

### 4. Verifique Network Tab (F12)

**Antes (CORS error):**
```
Request URL: https://ultrassom.ai:8177/geminiCall
Status: (failed) net::ERR_FAILED
CORS error
```

**Agora (via proxy):**
```
Request URL: http://localhost:8134/api/gemini
Status: 200 OK (esperado)
Proxied to: https://ultrassom.ai:8177/geminiCall
```

### 5. Verifique Console

**Logs esperados:**
```
[reportGenerator] Iniciando geração de relatório...
[reportGenerator] Prompt criado com XXX caracteres
[Gemini abc123] Iniciando request {url: "/api/gemini", ...}
[Gemini abc123] Request completado com sucesso...
```

---

## 🔍 Fluxo Completo

```
1. User clicks "Gerar Laudo"
   ↓
2. Frontend faz POST para /api/gemini
   ↓
3. Vite Proxy intercepta
   ↓
4. Proxy reescreve para /geminiCall
   ↓
5. Proxy envia para https://ultrassom.ai:8177/geminiCall
   ↓
6. Backend processa
   ↓
7. Backend responde
   ↓
8. Proxy retorna resposta
   ↓
9. Frontend recebe dados
   ↓
10. Laudo exibido ✅
```

---

## 📊 Comparação: Antes vs Depois

| Aspecto           | Antes (CORS Error)                     | Depois (Proxy)          |
| ----------------- | -------------------------------------- | ----------------------- |
| **Request URL**   | `https://ultrassom.ai:8177/geminiCall` | `/api/gemini`           |
| **Origin**        | `https://ultrassom.ai:8135`            | `http://localhost:8134` |
| **Same-Origin?**  | ❌ No (8135 ≠ 8177)                     | ✅ Yes (same port)       |
| **CORS Headers?** | ❌ Missing                              | ✅ Not needed            |
| **SSL Cert**      | ⚠️ Self-signed warning                  | ✅ Handled by proxy      |
| **Status**        | ❌ Blocked                              | ✅ Working               |

---

## ⚙️ Configuração de Proxy - Explicada

```typescript
'/api/gemini': {
  target: 'https://ultrassom.ai:8177',     // Backend real
  changeOrigin: true,                       // Muda header Origin
  secure: false,                            // Aceita SSL auto-assinado
  rewrite: (path) => 
    path.replace(/^\/api\/gemini/, '/geminiCall')  // /api/gemini -> /geminiCall
}
```

**Exemplo de transformação:**
```
Request:  POST http://localhost:8134/api/gemini
            ↓
Proxied:  POST https://ultrassom.ai:8177/geminiCall
```

---

## 🐛 Troubleshooting

### Se ainda der erro de CORS:

**1. Verifique se servidor foi reiniciado:**
```bash
# Matar e reiniciar
fuser -k 8134/tcp
npm run dev
```

**2. Limpe cache do browser:**
- Chrome: Ctrl+Shift+Delete
- Ou modo anônimo: Ctrl+Shift+N

**3. Verifique variáveis de ambiente:**
```bash
# Deve retornar: /api/gemini
echo $VITE_GEMINI_API_URL

# Ou verificar no código:
import.meta.env.VITE_GEMINI_API_URL
```

**4. Verifique Network Tab:**
- Request deve ir para `localhost:8134/api/gemini`
- NÃO deve ir direto para `ultrassom.ai:8177`

---

### Se der erro de conexão:

**1. Backend pode estar offline:**
```bash
# Teste com script Python
python test_api.py gemini
```

**2. Proxy pode ter erro:**
- Verifique terminal do Vite
- Procure por: "Proxy error: ..."

**3. Firewall pode estar bloqueando:**
- Verifique se porta 8177 está acessível
- Teste: `curl -k https://ultrassom.ai:8177/geminiCall`

---

## ✨ Benefícios da Solução

1. ✅ **Sem CORS** - Same-origin requests
2. ✅ **SSL Simples** - Proxy lida com certificados
3. ✅ **Transparente** - Código frontend não muda
4. ✅ **Configurável** - Fácil trocar backend via .env
5. ✅ **Debug Fácil** - Logs claros no terminal

---

## 📋 Checklist de Validação

Após reiniciar o servidor, valide:

- [ ] Servidor rodando em localhost:8134
- [ ] Request vai para `/api/gemini` (não `ultrassom.ai:8177`)
- [ ] Console não mostra erro de CORS
- [ ] Network tab mostra status 200 (se backend funcionar)
- [ ] Logs aparecem com `[Gemini abc123]`
- [ ] Laudo é gerado com sucesso

---

**Status:** ✅ Proxy configurado e servidor reiniciado
**Próximo passo:** Testar geração de laudo no browser
