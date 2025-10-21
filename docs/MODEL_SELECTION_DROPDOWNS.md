# 🎛️ Seleção de Modelos de IA - Dropdowns Implementados

**Data:** 2025-10-19  
**Feature:** Dropdowns para seleção de modelos específicos Gemini e OpenAI  
**Status:** ✅ Implementado

---

## 🎯 Funcionalidade Implementada

### Modelos Disponíveis:

#### **Gemini (Google)**
- ✅ **Gemini 2.0 Flash** (`gemini-2.0-flash-exp`) - Rápido e eficiente
- ✅ **Gemini 2.5 Pro** (`gemini-2.5-pro`) - Mais avançado

#### **OpenAI**
- ✅ **GPT-4o** (`gpt-4o`) - Modelo otimizado
- ✅ **GPT-5 Nano** (`gpt-5-nano`) - Último modelo

---

## 🖼️ Interface

### Antes:
```
┌─────────────────────────┐
│ [Gemini 2.5] [OpenAI]  │  ← Botões simples
└─────────────────────────┘
```

### Depois:
```
┌─────────────────────────────────┐
│ [Gemini 2.0 Flash ▼] [GPT-4o ▼]│  ← Dropdowns
└─────────────────────────────────┘
     ↓ Clique
┌───────────────────┐
│ Gemini 2.0 Flash  │ ← Selecionado
│ Rápido e eficiente│
├───────────────────┤
│ Gemini 2.5 Pro    │
│ Mais avançado     │
└───────────────────┘
```

---

## 🔧 Implementação Técnica

### 1. **SelectedFindingsPanel.tsx**

#### Modelos Configurados:
```typescript
const GEMINI_MODELS = [
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', description: 'Rápido e eficiente' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Mais avançado' }
];

const OPENAI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Modelo otimizado' },
  { id: 'gpt-5-nano', name: 'GPT-5 Nano', description: 'Último modelo' }
];
```

#### Estados:
```typescript
const [selectedGeminiModel, setSelectedGeminiModel] = useState(GEMINI_MODELS[0].id);
const [selectedOpenAIModel, setSelectedOpenAIModel] = useState(OPENAI_MODELS[0].id);
const [showGeminiDropdown, setShowGeminiDropdown] = useState(false);
const [showOpenAIDropdown, setShowOpenAIDropdown] = useState(false);
```

#### Handler:
```typescript
const handleGenerateReport = () => {
  const specificModel = selectedModel === 'gemini' 
    ? selectedGeminiModel 
    : selectedOpenAIModel;
    
  onGenerateReport(reportData, { 
    model: selectedModel,
    specificModel 
  });
};
```

---

### 2. **AbdomeTotalExam.tsx**

#### Receber modelo específico:
```typescript
const handleGenerateReport = async (
  data: ReportData,
  options: { model: AIProvider; specificModel: string }
) => {
  const specificModel = options?.specificModel ?? 'gemini-2.0-flash-exp';
  
  console.log('[AbdomeTotalExam] Gerando relatório com:', { 
    provider, 
    specificModel 
  });
  
  // Armazenar no sessionStorage
  sessionStorage.setItem('selectedAIModel', specificModel);
  
  // Toast informativo
  toast.info(`Gerando laudo com ${specificModel}...`);
  
  await geminiStreamService.generateFullReportStream(...);
};
```

---

### 3. **geminiStreamService.ts**

#### Ler modelo do sessionStorage:
```typescript
private async streamFromBackend(prompt: string, callbacks: StreamCallbacks) {
  // Obter modelo selecionado
  const selectedModel = sessionStorage.getItem('selectedAIModel') || GEMINI_MODEL;
  
  console.log('[GeminiStreamService] Usando modelo:', selectedModel);

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      text: prompt,
      model: selectedModel, // ✅ Modelo incluído no payload
      prompt: 'test'
    })
  });
  ...
}
```

---

### 4. **geminiClient.ts**

#### Payload com modelo:
```typescript
async function callGeminiEndpoint(text: string, signal?: AbortSignal, modelId?: string) {
  const model = modelId || GEMINI_MODEL;
  
  const payload = {
    text,
    prompt: 'test',
    model: model // ✅ Modelo incluído
  };
  
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: finalSignal
  });
}
```

---

## 📊 Fluxo Completo

```
User seleciona modelo no dropdown
    ↓
"Gemini 2.0 Flash" selecionado → selectedGeminiModel = 'gemini-2.0-flash-exp'
    ↓
User clica "Gerar Laudo"
    ↓
handleGenerateReport() → specificModel = 'gemini-2.0-flash-exp'
    ↓
sessionStorage.setItem('selectedAIModel', 'gemini-2.0-flash-exp')
    ↓
toast.info('Gerando laudo com gemini-2.0-flash-exp...')
    ↓
geminiStreamService.generateFullReportStream()
    ↓
streamFromBackend() → selectedModel = sessionStorage.getItem('selectedAIModel')
    ↓
fetch(url, { body: JSON.stringify({ text, model: 'gemini-2.0-flash-exp' }) })
    ↓
Backend recebe: { text: "...", model: "gemini-2.0-flash-exp", prompt: "test" }
    ↓
Backend usa modelo especificado para gerar relatório
```

---

## 🎨 Componentes de UI

### Dropdown Component:
```tsx
<div className="flex-1 relative">
  <button onClick={() => setShowGeminiDropdown(!showGeminiDropdown)}>
    <span>{GEMINI_MODELS.find(m => m.id === selectedGeminiModel)?.name}</span>
    <CaretDown className={showGeminiDropdown && "rotate-180"} />
  </button>
  
  {showGeminiDropdown && (
    <div className="dropdown-menu">
      {GEMINI_MODELS.map((model) => (
        <button onClick={() => setSelectedGeminiModel(model.id)}>
          <div>{model.name}</div>
          <div className="description">{model.description}</div>
        </button>
      ))}
    </div>
  )}
</div>
```

### Features:
- ✅ Ícone de seta rotaciona ao abrir/fechar
- ✅ Dropdown fecha ao selecionar modelo
- ✅ Dropdown fecha ao clicar em outro provider
- ✅ Modelo selecionado fica destacado
- ✅ Tooltips com descrição de cada modelo
- ✅ Transições suaves

---

## 🧪 Como Testar

### 1. Selecionar Modelo:
1. Clique no botão "Gemini 2.0 Flash" (ou qualquer modelo)
2. Dropdown abre com opções
3. Clique em "Gemini 2.5 Pro"
4. Botão atualiza para mostrar "Gemini 2.5 Pro"
5. Dropdown fecha

### 2. Gerar Laudo:
1. Selecione achados
2. Escolha modelo no dropdown
3. Clique "Gerar Laudo"
4. Toast mostra: "Gerando laudo com gemini-2.5-pro..."
5. Console log mostra modelo selecionado
6. Network tab mostra payload com campo `"model": "gemini-2.5-pro"`

### 3. Validar Payload:
Abra DevTools → Network → Clique "Gerar Laudo" → Veja Request:

```json
{
  "text": "Você é um radiologista...",
  "model": "gemini-2.5-pro",
  "prompt": "test"
}
```

---

## 📋 Checklist de Validação

- [ ] Dropdowns abrem e fecham corretamente
- [ ] Ícone de seta rotaciona ao abrir
- [ ] Modelo selecionado aparece no botão
- [ ] Dropdown fecha ao selecionar modelo
- [ ] Toast mostra modelo selecionado
- [ ] Console log mostra modelo correto
- [ ] Payload inclui campo `model` com ID correto
- [ ] Backend recebe modelo especificado
- [ ] Relatório é gerado com modelo selecionado

---

## 🎯 IDs dos Modelos

### Gemini:
- `gemini-2.0-flash-exp` - Padrão, rápido
- `gemini-2.5-pro` - Avançado

### OpenAI:
- `gpt-4o` - Otimizado
- `gpt-5-nano` - Último modelo

---

## 🚀 Melhorias Futuras

- [ ] Adicionar mais modelos conforme disponíveis
- [ ] Salvar preferência de modelo no localStorage
- [ ] Indicador visual de qual modelo está gerando
- [ ] Estatísticas de uso por modelo
- [ ] Comparação de resultados entre modelos

---

**Status:** ✅ Implementado e pronto para testes
**Payload Backend:** Inclui campo `"model": "<model-id>"`
